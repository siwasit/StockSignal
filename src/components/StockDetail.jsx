import React, { useState, useEffect, useRef } from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { calculateEMA, calculateRSI, calculateMACD, calculateVolume, calculateOBV } from './../assets/indicators'; // ด้านล่างจะเขียนให้
import { ExternalLink, ChevronRight, LineChart, Inbox } from 'lucide-react';
import NewsCard from './NewsCard';
import { motion } from 'framer-motion';
import Databox from './Databox';

function ChartLegend({ showEMA }) {
    if (!(showEMA)) {
        return null; // ไม่แสดงอะไรถ้าไม่มีตัวไหนเปิด
    }

    return (
        <div
            className="absolute top-2 left-2 bg-black bg-opacity-60 rounded-md px-3 py-1 flex space-x-4 text-white text-sm select-none z-10"
            style={{ backdropFilter: 'blur(4px)' }} // ใส่เบลอพื้นหลังสวยๆ (optional)
        >
            {showEMA && (
                <div className="flex items-center space-x-1">
                    <div className="w-4 h-2 rounded" style={{ backgroundColor: 'orange' }} />
                    <span>EMA</span>
                </div>
            )}
        </div>
    );
}


function StockDetail({ stock }) {

    // console.log("StockDetail component rendered with stock:", stock);
    const [stockDetail, setStockDetail] = useState(stock);
    const [scaleActive, setScaleActive] = useState('1D');
    const options = ['1D', '1W', '1M', '1Y'];
    // const [sampleData, setSampleData] = useState(generateCandlestickData('2023-01-01', 540));
    const [sampleData, setSampleData] = useState();
    const [showNoData, setShowNoData] = useState(false);
    const [showMACDNoData, setShowMACDNoData] = useState(false);
    const [indicators, setIndicators] = useState({
        rsi: false,
        volume: false,
        ema: false,
        macd: false,
        obv: false,
    });

    const chartContainerRef = useRef();
    const rsiRef = useRef();
    const macdRef = useRef();
    const obvRef = useRef();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const toggleFavorite = () => {
        setStockDetail(prev => ({
            ...prev,
            isFavorite: !prev.isFavorite,
        }));
    };

    const handleCheckboxChange = (name) => {
        setIndicators((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    function generateCandlestickData(startDateStr, days) {
        const data = [];
        let currentDate = new Date(startDateStr);
        let previousClose = 10000; // เริ่มต้นสมมติ portfolio balance ที่ 10,000

        for (let i = 0; i < days; i++) {
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            const open = previousClose;
            const changePercent = (Math.random() * 4 - 2) / 100; // -2% ถึง +2%
            const close = open * (1 + changePercent);
            const high = Math.max(open, close) * (1 + Math.random() * 0.015);
            const low = Math.min(open, close) * (1 - Math.random() * 0.015);

            const volume = Math.floor(Math.random() * 9000 + 1000); // 1,000 ถึง 10,000

            data.push({
                time: currentDate.toISOString().slice(0, 10),
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume,  // เพิ่ม volume ลงในแท่งเทียน
            });

            previousClose = close;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    }

    const filterDataByPeriod = (data, period) => {
        if (!data || data.length === 0) return [];

        const lastTime = data[data.length - 1].time;
        const now = typeof lastTime === 'number'
            ? new Date(lastTime * 1000)
            : new Date(lastTime);

        let fromDate;
        switch (period) {
            case '1D':
                fromDate = new Date(now);
                fromDate.setDate(now.getDate() - 1);
                break;
            case '1W':
                fromDate = new Date(now);
                fromDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                fromDate = new Date(now);
                fromDate.setMonth(now.getMonth() - 1);
                break;
            case '1Y':
                fromDate = new Date(now);
                fromDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'YTD':
            default:
                fromDate = new Date(now.getFullYear(), 0, 1);
                break;
        }

        return data.filter(datum => {
            const t = typeof datum.time === 'number'
                ? new Date(datum.time * 1000)
                : new Date(datum.time);

            return t >= fromDate && t <= now;
        });
    };



    // useEffect(() => {
    //     const data = generateCandlestickData('2023-01-01', 540);
    //     // const endpoint = `http://127.0.0.1:3007/getHistData/${encodeURIComponent(stock.stockSymbol)}`;
    //     // const data = await fetchCandlestickDataFromAPI(endpoint);
    //     setSampleData(data);
    //     console.log(data)
    // }, []);
    const didFetch = useRef(false);
    const [priceNow, setPriceNow] = useState(0);
    const [priceChangePercent, setPriceChangePercent] = useState('0.00');
    const [priceColor, setPriceColor] = useState('text-[#41DC8E]');
    const [pricePrefix, setPricePrefix] = useState('+');
    const [companyData, setCompanyData] = useState(null);
    const [widthState, setWidth] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isNewsLoading, setIsNewsLoading] = useState(false);
    const [stockNews, setStockNews] = useState([]);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;
        async function loadCompanyData() {
            setIsLoading(true);
            setCompanyData(null); // เคลียร์ค่าก่อน

            try {
                const response = await fetch(`http://127.0.0.1:3007/CompanyProfile/${encodeURIComponent(stock.stockSymbol)}`);
                if (!response.ok) throw new Error('Failed to fetch company data');

                const data = await response.json();
                // console.log(data)
                setCompanyData(data);

                // console.log('โหลดข้อมูลสำเร็จ', data);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดระหว่างโหลดข้อมูล:', error);
            } finally {
                setIsLoading(false);
            }
        }

        async function loadStockNews() {
            setIsNewsLoading(true);
            setStockNews([]); // เคลียร์ค่าก่อน

            try {
                const response = await fetch(`http://127.0.0.1:3007/news/${encodeURIComponent(stock.stockSymbol)}/${encodeURIComponent(stock.stockMarket)}/${encodeURIComponent(stock.ThaiCompanyName)}/${encodeURIComponent(stock.companyName)}`);
                if (!response.ok) throw new Error('Failed to fetch company data');

                const data = await response.json();
                const sortedData = data.sort((a, b) => {
                    return new Date(b.published).getTime() - new Date(a.published).getTime();
                });
                setStockNews(sortedData);

                // console.log('โหลดข้อมูลสำเร็จ', data);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดระหว่างโหลดข้อมูล:', error);
            } finally {
                setIsNewsLoading(false);
            }
        }

        async function fetchData() {
            try {
                const endpoint = `http://127.0.0.1:3007/getHistData/${encodeURIComponent(stock.stockSymbol)}`;
                const response = await fetch(endpoint);
                if (!response.ok) throw new Error('Failed to fetch data');
                const rawData = await response.json();

                const transformedData = rawData.map(item => ({
                    time: Math.floor(new Date(item.datetime).getTime() / 1000),
                    open: item.open,
                    high: item.high,
                    low: item.low,
                    close: item.close,
                    volume: item.volume,
                }));

                setSampleData(transformedData);

                // คำนวณราคาล่าสุดและเปลี่ยนแปลง
                const latest = transformedData[transformedData.length - 1];
                const previous = transformedData[transformedData.length - 2];

                const nowClose = latest?.close || 0;
                const prevClose = previous?.close || 0;

                const changePercent = prevClose
                    ? (((nowClose - prevClose) / prevClose) * 100).toFixed(2)
                    : '0.00';

                setPriceNow(nowClose);
                setPriceChangePercent(changePercent);

                if (parseFloat(changePercent) >= 0) {
                    setPriceColor('text-[#41DC8E]');
                    setPricePrefix('+');
                } else {
                    setPriceColor('text-[#EF5350]');
                    setPricePrefix('');
                }
            } catch (error) {
                console.error('Error fetching candlestick data:', error);
                setSampleData([]);
                setPriceNow(0);
                setPriceChangePercent('0.00');
                setPriceColor('text-[#41DC8E]');
                setPricePrefix('+');
            }
        }

        fetchData();
        loadStockNews();
        loadCompanyData();
    }, []);  // dependency array ว่าง ทำให้รันแค่ครั้งเดียว

    useEffect(() => {
        const currentLocale = navigator.language || 'en-US';
        const filtered = filterDataByPeriod(sampleData, scaleActive);

        let syncInProgress = false;
        function syncCharts(sourceChart, charts) {
            if (syncInProgress) return;
            syncInProgress = true;

            const sourceRange = sourceChart.timeScale().getVisibleLogicalRange();
            if (!sourceRange) {
                syncInProgress = false;
                return;
            }

            // เพิ่มการตรวจสอบช่วงเวลาสำหรับ 1M โดยเฉพาะ
            if (scaleActive === '1M') {
                sourceChart.timeScale().fitContent();
            }

            for (const chart of charts) {
                if (chart !== sourceChart && chart && chart.timeScale) {
                    try {
                        chart.timeScale().setVisibleLogicalRange(sourceRange);
                        if (scaleActive === '1M') {
                            chart.timeScale().fitContent();
                        }
                    } catch (e) {
                        console.warn('syncCharts error', e);
                    }
                }
            }
            syncInProgress = false;
        }

        // --- Main Chart ---
        const mainChart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 300,
            layout: {
                attributionLogo: false,
                background: { color: '#202431' },
                textColor: '#FFFFFF',
            },
            grid: {
                vertLines: { color: '#3A3F55' },
                horzLines: { color: '#3A3F55' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#3A3F55',
            },
            rightPriceScale: {
                borderColor: '#3A3F55',
            },
        });

        const myPriceFormatter = Intl.NumberFormat(currentLocale, {
            style: "currency",
            currency: "THB",
        }).format;

        mainChart.applyOptions({
            rightPriceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                borderVisible: false,
            },
            timeScale: {
                handleScroll: false,
                handleScale: false,
            },
            handleScroll: false,
            handleScale: false,
        });

        // CANDLESTICK SERIES
        const currencySymbols = {
            USD: '$',
            THB: '฿',
            CNY: '¥'
        };

        const currencyCode = stock.fullCurrency ?? 'THB';  // รหัส เช่น 'USD'
        const currencySymbol = currencySymbols[currencyCode] ?? '฿'; // แปลงเป็นสัญลักษณ์

        const candleSeries = mainChart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            priceFormat: {
                type: 'custom',
                formatter: (price) => `${currencySymbol}${price.toLocaleString('en-US')}`,
            }
        });
        candleSeries.setData(filtered);

        // EMA
        const emaSeries = mainChart.addSeries(LineSeries, {
            color: 'orange',
            lineWidth: 2,
        });
        if (indicators.ema) {
            emaSeries.setData(calculateEMA(filtered, 10));
        } else {
            emaSeries.setData([]); // ซ่อน EMA line
        }

        // Volume
        const volumeSeries = mainChart.addSeries(HistogramSeries, {
            // color: '#8884d8',
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });

        mainChart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
            borderVisible: false,
        });

        if (indicators.volume) {
            volumeSeries.setData(calculateVolume(filtered));
        } else {
            volumeSeries.setData([]); // ซ่อน Volume histogram
        }
        // OBV Line Series บน Main Chart
        // const obvSeries = mainChart.addSeries(LineSeries, {
        //     color: '#A084DC',
        //     lineWidth: 2,
        //     priceScaleId: 'obv',  // ใช้ Price Scale แยก
        // });

        // // ปรับ obv priceScale options (ลบ timeScale ออก)
        // mainChart.priceScale('obv').applyOptions({
        //     scaleMargins: {
        //         top: 0.85,
        //         bottom: 0,
        //     },
        //     borderVisible: false,
        // });

        // // ตั้งค่า OBV data
        // if (indicators.obv) {
        //     obvSeries.setData(calculateOBV(filtered));
        // } else {
        //     obvSeries.setData([]);  // ซ่อนถ้าไม่เลือก
        // }
        let obvChart;
        if (obvRef.current) {
            obvChart = createChart(obvRef.current, {
                width: obvRef.current.clientWidth,
                height: 100,
                layout: {
                    attributionLogo: false,
                    background: { color: '#202431' },
                    textColor: '#FFFFFF',
                },
                timeScale: {
                    visible: true,
                    borderColor: '#3A3F55',
                    handleScroll: false,
                    handleScale: false,
                },
                grid: {
                    vertLines: { color: '#3A3F55' },
                    horzLines: { color: '#3A3F55' },
                },
                rightPriceScale: {
                    borderVisible: false,
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.1,
                    },
                    autoScale: true,
                },
                handleScroll: false,
                handleScale: false,
            });

            const obvSeries = obvChart.addSeries(LineSeries, {
                color: '#A084DC',
                lineWidth: 2,
                priceFormat: {
                    type: 'custom',
                    formatter: (price) => {
                        if (Math.abs(price) >= 1_000_000) {
                            return (price / 1_000_000).toFixed(2) + 'M';
                        } else if (Math.abs(price) >= 1_000) {
                            return (price / 1_000).toFixed(1) + 'K';
                        }
                        return price.toFixed(0);
                    },
                },
            });

            if (indicators.obv && filtered.length > 0) {
                obvSeries.setData(calculateOBV(filtered));
                obvChart.timeScale().fitContent();
            } else {
                obvSeries.setData([]);
            }
        }


        // --- RSI Chart ---
        let rsiChart;
        if (rsiRef.current) {
            rsiChart = createChart(rsiRef.current, {
                width: rsiRef.current.clientWidth,
                height: 100,
                layout: { attributionLogo: false, background: { color: '#202431' }, textColor: '#FFFFFF' },
                timeScale: { visible: false, handleScroll: false, handleScale: false },
                grid: {
                    vertLines: { color: '#3A3F55' },
                    horzLines: { color: '#3A3F55' },
                },
                rightPriceScale: {
                    borderVisible: false,
                    scaleMargins: {
                        top: 0,
                        bottom: 0,
                    },
                    autoScale: true, // ให้ autoscale เต็มกราฟ
                },
                handleScroll: false,
                handleScale: false,
            });

            const rsiSeries = rsiChart.addSeries(LineSeries, { color: '#00BCD4' });

            if (indicators.rsi && filtered.length > 14) {
                setShowNoData(false);

                const rsiData = calculateRSI(filtered);

                rsiSeries.setData(rsiData);

                rsiChart.priceScale('right').applyOptions({
                    autoScale: false,
                    minValue: 0,
                    maxValue: 100,
                });

            } else {
                setShowNoData(true);
                rsiSeries.setData([]);
            }

        }

        // --- MACD Chart ---
        let macdChart;
        if (macdRef.current) {
            macdChart = createChart(macdRef.current, {
                width: macdRef.current.clientWidth,
                height: 120,
                layout: { attributionLogo: false, background: { color: '#202431' }, textColor: '#fff' },
                grid: {
                    vertLines: { color: '#3A3F55' },
                    horzLines: { color: '#3A3F55' },
                },
                timeScale: {
                    handleScroll: false,
                    handleScale: false,
                },
                handleScroll: false, // ถ้ารองรับ (ดู docs)
                handleScale: false,
            });

            const macdLineSeries = macdChart.addSeries(LineSeries, { color: '#00BCD4', lineWidth: 1 });
            const signalLineSeries = macdChart.addSeries(LineSeries, { color: '#FFA726', lineWidth: 1 });
            const histogramSeries = macdChart.addSeries(HistogramSeries, {
                priceFormat: { type: 'volume' },
                priceScaleId: '',
                scaleMargins: { top: 0.8, bottom: 0 },
            });

            if (indicators.macd && filtered.length > 35) {
                setShowMACDNoData(false);
                const { macd, signal, histogram } = calculateMACD(filtered);
                macdLineSeries.setData(macd);
                signalLineSeries.setData(signal);
                histogramSeries.setData(histogram);
            } else {
                setShowMACDNoData(true);
                macdLineSeries.setData([]);
                signalLineSeries.setData([]);
                histogramSeries.setData([]);
            }
        }

        const macdLineSeries = macdChart.addSeries(LineSeries, { color: '#00BCD4', lineWidth: 1 });
        const signalLineSeries = macdChart.addSeries(LineSeries, { color: '#FFA726', lineWidth: 1 });
        const histogramSeries = macdChart.addSeries(HistogramSeries, {
            priceFormat: { type: 'volume' },
            priceScaleId: '',
            scaleMargins: { top: 0.8, bottom: 0 },
        });

        if (indicators.macd && filtered.length > 35) {
            setShowMACDNoData(false);
            const { macd, signal, histogram } = calculateMACD(filtered);
            macdLineSeries.setData(macd);
            signalLineSeries.setData(signal);
            histogramSeries.setData(histogram);
        } else {
            setShowMACDNoData(true);
            macdLineSeries.setData([]);
            signalLineSeries.setData([]);
            histogramSeries.setData([]);
        }


        const syncTargets = [mainChart];
        if (rsiChart) syncTargets.push(rsiChart);
        if (macdChart) syncTargets.push(macdChart);

        for (let i = 0; i < syncTargets.length; i++) {
            const source = syncTargets[i];
            const targets = syncTargets.filter((_, j) => j !== i);
            syncCharts(source, targets);
        }

        // ย้ายการเรียก fitContent ไปหลังจากการตั้งค่าข้อมูลทั้งหมด
        mainChart.timeScale().fitContent();
        if (rsiChart) rsiChart.timeScale().fitContent();
        if (macdChart) macdChart.timeScale().fitContent();
        if (obvChart) obvChart.timeScale().fitContent();

        // เพิ่มการตรวจสอบเฉพาะสำหรับ 1M
        if (scaleActive === '1M') {
            mainChart.timeScale().fitContent();
            if (rsiChart) rsiChart.timeScale().fitContent();
            if (macdChart) macdChart.timeScale().fitContent();
            if (obvChart) obvChart.timeScale().fitContent();
        }

        // const resizeObserver = new ResizeObserver(entries => {
        //     for (let entry of entries) {
        //         const newWidth = entry.contentRect.width;
        //         setWidth(newWidth);
        //         chartContainerRef.current.resize(newWidth, 100);
        //     }
        // });

        // resizeObserver.observe(chartContainerRef.current);

        // Cleanup
        return () => {
            // resizeObserver.disconnect();
            mainChart.remove();
            rsiChart?.remove();
            macdChart.remove();
            obvChart.remove();
        };
    }, [scaleActive, sampleData, indicators]);

    return (
        <motion.div
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className='flex flex-col mt-4'>
                <div className="flex items-center space-x-4 w-full">
                    <img
                        src={stock.logo}
                        alt={stock.stockSymbol}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                            // ถ้าโหลดโลโก้ไม่สำเร็จ ให้ใช้โลโก้ fallback ที่เก็บไว้ใน assets
                            e.currentTarget.onerror = null; // ป้องกัน loop ซ้ำ
                            e.currentTarget.src = `/src/assets/us_logo/${stock.stockSymbol}.png`;
                        }}
                    />

                    <div className="flex-1 pr-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-white text-3xl font-semibold">{stockDetail.stockSymbol}</div>
                            <div className='flex gap-4 items-center'>
                                <div onClick={toggleFavorite} className="cursor-pointer">
                                    {stockDetail.isFavorite ? (
                                        <StarSolid className="w-8 h-8 text-yellow-300" />
                                    ) : (
                                        <StarOutline className="w-8 h-8 text-yellow-300" />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-[#8C8F99] flex justify-between gap-4 text-xl">
                            {stockDetail.companyName}
                            <div className="text-sm text-gray-400">
                                อัพเดทล่าสุด :&nbsp;
                                {new Date(stockDetail.timeStamp).toLocaleString('th-TH', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        </div>

                    </div>
                </div>

                <div className='flex w-full h-full mb-4'>
                    <div className='flex flex-col w-[75%] h-full pr-4'>
                        <div className="flex-col space-y-2 my-3 text-gray-100">
                            <div className="flex space-x-4 items-center font-semibold text-xl">
                                <div>{priceNow.toFixed(2)} {stockDetail.currency}</div>
                                <div className={priceColor}>
                                    {pricePrefix}{priceChangePercent}%
                                </div>
                            </div>

                            <div className='flex justify-between items-center'>
                                <div className="flex items-center flex-wrap gap-2 px-2 py-1 text-white bg-[#2E3343] rounded-xl">
                                    <LineChart size={24} className="mr-2" />
                                    {['rsi', 'volume', 'ema', 'macd', 'obv'].map((name) => {
                                        const isChecked = indicators[name];
                                        return (
                                            <div
                                                key={name}
                                                onClick={() => handleCheckboxChange(name)}
                                                className={`
                                                px-2 py-1 rounded-lg flex items-center cursor-pointer text-sm uppercase select-none transition-all
                                                ${isChecked ? 'bg-[#6870FA] text-white' : 'text-[#868686] hover:bg-[#6870FA]/50 hover:text-white'}
                                            `}
                                            >
                                                {name}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className='flex items-center'>
                                    {/* <div className="text-sm text-gray-400">{stockDetail.timeStamp}</div> */}
                                    <div className='flex items-center bg-[#2E3343] rounded-xl px-2 py-1 gap-2'>
                                        {options.map(option => (
                                            <div
                                                key={option}
                                                onClick={() => setScaleActive(option)}
                                                className={`px-3 text-sm py-1 rounded-lg cursor-pointer transition-all 
                                    ${scaleActive === option
                                                        ? 'bg-[#6870FA] text-white'
                                                        : 'text-[#868686] hover:bg-[#6870FA]/50 hover:text-white'}`}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full flex justify-center h-3/5">
                            <ChartLegend
                                showEMA={indicators.ema}
                            />
                            <div ref={chartContainerRef} className="w-full" />
                        </div>
                        <div className={`relative w-full h-1/5 ${!indicators.rsi ? 'hidden' : ''}`}>
                            <div className="absolute top-1 left-2 text-white text-xs font-semibold select-none z-20">
                                Relative Strength Index (RSI)
                            </div>
                            <div ref={rsiRef} className="w-full flex justify-center h-full" />
                            {showNoData && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202431]/80 text-white text-sm opacity-50 z-10">
                                    ข้อมูลไม่เพียงพอสำหรับคำนวณ RSI
                                </div>
                            )}
                        </div>

                        <div className={`relative w-full h-1/5 ${!indicators.obv ? 'hidden' : ''}`}>
                            <div className="absolute top-1 left-2 text-white text-xs font-semibold select-none z-20">
                                On-Balance Volume (OBV)
                            </div>
                            <div ref={obvRef} className="w-full flex justify-center h-full" />
                            {!(indicators.obv) && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202431]/80 text-white text-sm opacity-50 z-10">
                                    ข้อมูลไม่เพียงพอสำหรับคำนวณ OBV
                                </div>
                            )}
                        </div>

                        <div className={`relative w-full h-1/5 ${!indicators.macd ? 'hidden' : ''}`}>
                            <div className="absolute top-1 left-2 text-white text-xs font-semibold select-none z-20">
                                Moving Average Convergence Divergence (MACD)
                            </div>
                            <div ref={macdRef} className="w-full flex justify-center h-full" />
                            {showMACDNoData && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202431]/80 text-white text-sm opacity-50 z-10">
                                    ข้อมูลไม่เพียงพอสำหรับคำนวณ MACD
                                </div>
                            )}
                        </div>

                        {/* <div className='text-end px-3 text-[#868686]'>ตัวชี้วัด: RSI 68 | MACD +1.2 | EMA20</div> */}
                        <div className='flex flex-col'>
                            <div className='text-2xl text-white font-bold my-4'>ข้อมูล {stockDetail.ThaiCompanyName} ({stockDetail.stockSymbol})</div>

                            {isLoading ? (
                                <div className=" my-4 flex flex-col items-center justify-center text-gray-100">
                                    <img
                                        src="/icons/OliveSpinner.svg"
                                        alt="Loading..."
                                        className="w-15 h-15 animate-spin mb-2"
                                    />
                                    <div className="text-lg font-semibold text-gray-300">
                                        กำลังโหลดข้อมูล&nbsp;{stock.stockSymbol}
                                    </div>
                                    {/* <div className="mt-1 text-xl font-bold text-green-400">
                                    Loaded: {AllStock.length} / {SET50.length}
                                </div> */}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">

                                    {/* มูลค่าตามราคาตลาด */}
                                    <Databox
                                        label="มูลค่าตามราคาตลาด"
                                        value={
                                            companyData?.["Market capitalization"]?.value !== undefined
                                                ? `${companyData["Market capitalization"].value.toFixed(2)}${companyData["Market capitalization"].prefix ?? ''}${companyData["Market capitalization"].currency ? ' ' + stock.currency : ''}`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="อัตราผลตอบแทนจากเงินปันผล"
                                        value={
                                            companyData?.["Dividend yield (indicated)"]?.value !== undefined
                                                ? `${companyData["Dividend yield (indicated)"].value.toFixed(2)} %`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="อัตราส่วนราคาต่อกำไรสุทธิ"
                                        value={
                                            companyData?.["Price to earnings Ratio (TTM)"]?.value !== undefined
                                                ? companyData["Price to earnings Ratio (TTM)"].value.toFixed(2)
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="กำไรพื้นฐานต่อหุ้น (Basic EPS)"
                                        value={
                                            companyData?.["Basic EPS (TTM)"]?.value !== undefined
                                                ? `${companyData["Basic EPS (TTM)"].value.toFixed(2)}${companyData["Basic EPS (TTM)"].currency ? ' ' + stock.currency : ''}`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="กำไรสุทธิ (ปีล่าสุด)"
                                        value={
                                            companyData?.["Net income (FY)"]?.value !== undefined
                                                ? `${companyData["Net income (FY)"].value.toFixed(2)}${companyData["Net income (FY)"].prefix ?? ''}${companyData["Net income (FY)"].currency ? ' ' + stock.currency : ''}`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="รายได้ (ปีล่าสุด)"
                                        value={
                                            companyData?.["Revenue (FY)"]?.value !== undefined
                                                ? `${companyData["Revenue (FY)"].value.toFixed(2)}${companyData["Revenue (FY)"].prefix ?? ''}${companyData["Revenue (FY)"].currency ? ' ' + stock.currency : ''}`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="จำนวนหุ้นลอยตัว"
                                        value={
                                            companyData?.["Shares float"]?.value !== undefined
                                                ? `${companyData["Shares float"].value.toFixed(2)}${companyData["Shares float"].prefix ?? ''} ตัว`
                                                : "-"
                                        }
                                    />

                                    <Databox
                                        label="กลุ่มธุรกิจ (Sector)"
                                        value={companyData?.Sector ?? '-'}
                                    />

                                    <Databox
                                        label="ประธานเจ้าหน้าที่บริหาร"
                                        value={companyData?.CEO ?? '-'}
                                    />

                                    <Databox
                                        label="อุตสาหกรรม (Industry)"
                                        value={companyData?.Industry ?? '-'}
                                    />

                                    <Databox
                                        label="ก่อตั้ง"
                                        value={companyData?.Founded ?? '-'}
                                    />

                                    <Databox
                                        label="เว็บไซต์"
                                        value={
                                            companyData?.Website ? (
                                                <a
                                                    href={`https://${companyData.Website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 group cursor-pointer text-md font-thin text-white group-hover:text-[#6870FA] transition-colors duration-200"
                                                >
                                                    {companyData.Website}
                                                    <ExternalLink className="w-4 h-4 text-white opacity-60 group-hover:text-[#6870FA] transition-colors duration-200" />
                                                </a>
                                            ) : (
                                                "-"
                                            )
                                        }
                                    />

                                </div>
                            )}
                        </div>
                    </div>
                    <div className='pl-4 w-[25%] flex flex-col border-l-2 border-[#868686]'>
                        <div className='text-2xl text-white font-bold my-4'>สัญญาณล่าสุด</div>
                        <div className='w-full flex items-center justify-between rounded-lg py-2 px-4 bg-[#41DC8E] flex'>
                            <div className='text-white font-bold text-xl'>BUY</div>
                            <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-white"></div>
                        </div>
                        <div className='flex flex-col my-2'>
                            <div className='text-[#868686] text-lg font-medium'>คำอธิบาย Signal</div>
                            <div className="text-white flex items-center gap-2">
                                {/* <p className="text-[#F6B73C] m-0">ยังไม่ทำครับ</p> */}
                                <p className="text-[#FF6B6B] m-0">ยังไม่ทำครับ</p>
                                {/* <span>+ Volume เพิ่ม</span> */}
                            </div>
                        </div>
                        <hr className="my-2 border-t border-[#868686]" />
                        <div className='text-2xl text-white font-semibold my-2'>ประวัติสัญญาณย้อนหลัง</div>
                        <div className='flex flex-col w-full'>

                            {/* Buy */}
                            <div className='flex items-center w-full justify-between border-b border-[#3A3F55]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-[#41DC8E] font-medium text-lg'>Buy</div>
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-[#41DC8E]"></div>
                                </div>
                                <p className='text-sm text-gray-400'>5 นาทีผ่านมา</p>
                            </div>

                            {/* Hold */}
                            <div className='flex items-center w-full justify-between border-b border-[#3A3F55]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-yellow-400 font-medium text-lg'>Hold</div>
                                    <div className='w-3 h-3 bg-yellow-400 rounded-full' />
                                </div>
                                <p className='text-sm text-gray-400'>1 วันที่ผ่านมา</p>
                            </div>

                            {/* Sell */}
                            <div className='flex items-center w-full justify-between border-b border-[#3A3F55]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-[#FF8282] font-medium text-lg'>Sell</div>
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-transparent border-t-[#FF8282]"></div>
                                </div>
                                <p className='text-sm text-gray-400'>2 กรกฎาคม 2568</p>
                            </div>

                        </div>


                        <div className='text-2xl text-white font-semibold my-2'>ข่าว {stock.stockSymbol} ล่าสุด</div>
                        {isNewsLoading ? (
                            <div className="my-4 flex flex-col items-center justify-center text-gray-100">
                                <img
                                    src="/icons/OliveSpinner.svg"
                                    alt="Loading..."
                                    className="w-15 h-15 animate-spin mb-2"
                                />
                                <div className="text-lg font-semibold text-gray-300">
                                    กำลังโหลดข่าวล่าสุดของ&nbsp;{stock.stockSymbol}
                                </div>
                                {/* <div className="mt-1 text-xl font-bold text-green-400">
                                    Loaded: {AllStock.length} / {SET50.length}
                                </div> */}
                            </div>
                        ) : stockNews.length === 0 ? (
                            <div className="my-4 flex flex-col items-center justify-center text-gray-400">
                                <Inbox className="w-14 h-14 mb-2 opacity-70" />
                                <div className="text-lg font-medium">ไม่พบข้อมูลข่าวล่าสุด</div>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full space-y-2">
                                {stockNews.map((news, index) => (
                                    <NewsCard
                                        key={index}
                                        timestamp={new Date(news.published).toLocaleDateString('th-TH', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                        source={news.source}
                                        title={news.title}
                                        link={news.link}
                                        favicon={news.favicons?.[0]} // ถ้ามี
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>

    )
}

export default StockDetail
