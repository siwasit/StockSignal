import React, { useState, useEffect, useRef } from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { calculateEMA, calculateRSI, calculateMACD, calculateVolume, calculateOBV } from './../assets/indicators'; // ด้านล่างจะเขียนให้
import { ExternalLink, ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { motion } from 'framer-motion';

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

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        async function loadCompanyData(retryCount = 3) {
            setIsLoading(true);
            setCompanyData(null); // เคลียร์ค่าเดิมก่อนเริ่มดึงใหม่

            for (let attempt = 1; attempt <= retryCount; attempt++) {
                try {
                    const response = await fetch(`http://127.0.0.1:3007/CompanyData/${encodeURIComponent(stock.stockSymbol)}`);
                    if (!response.ok) throw new Error('Failed to fetch company data');

                    const data = await response.json();
                    setCompanyData(data);

                    if (data) {
                        setIsLoading(false);
                        console.log('สำเร็จรอบที่', attempt, data);
                        return; // มีข้อมูลแล้ว ไม่ต้อง retry
                    }

                } catch (error) {
                    console.error(`Attempt ${attempt} failed:`, error);
                }

                // รอ 1 วินาทีก่อนลองใหม่
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // ถ้าไม่มีข้อมูลแม้จะลองครบแล้ว
            setIsLoading(false);
            console.warn('โหลดข้อมูลไม่สำเร็จหลังจากลองครบทุกครั้ง');
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
        const candleSeries = mainChart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            priceFormat: {
                type: 'custom',
                formatter: (price) => Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(price),
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

    const formatEstablishedDate = (dateStr) => {
        if (!dateStr) return "-";

        const [day, month, year] = dateStr.split("/");

        const dateObj = new Date(`${year}-${month}-${day}`);  // yyyy-mm-dd

        return dateObj.toLocaleDateString('th-TH', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            calendar: 'gregory',    // ใช้ปฏิทินสากล (ค.ศ.)
        });
    };

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
                        src={stock.logo}            // ลิงก์โลโก้หุ้นจากข้อมูล stock
                        alt={stock.stockSymbol}     // ใส่ชื่อหุ้นใน alt เพื่อ SEO / Accessibility
                        className="w-15 h-15 rounded-full object-cover"
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
                    <div className='flex flex-col w-[75%] h-full pr-4 border-r-2 border-[#868686]'>
                        <div className="flex space-y-1 justify-between my-3 text-gray-100">
                            <div className="flex space-x-4 items-center font-semibold text-xl">
                                <div>{priceNow.toFixed(2)}฿</div>
                                <div className={priceColor}>
                                    {pricePrefix}{priceChangePercent}%
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-white">
                                {['rsi', 'volume', 'ema', 'macd', 'obv'].map((name) => (
                                    <label key={name} className="flex items-center gap-1 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={indicators[name]}
                                            onChange={() => handleCheckboxChange(name)}
                                            className="
                                            w-5 h-5
                                            rounded
                                            border border-gray-600
                                            bg-[#1F2230]
                                            checked:bg-gray-900
                                            checked:border-gray-900
                                            checked:text-white
                                            appearance-none
                                            cursor-pointer
                                            relative
                                            before:absolute before:inset-0 before:flex before:items-center before:justify-center before:text-white before:content-['✔']
                                            before:opacity-0
                                            checked:before:opacity-100
                                            transition-all
                                            "
                                        />
                                        <span className="uppercase">{name}</span>
                                    </label>
                                ))}
                            </div>


                            <div className='flex items-center'>
                                {/* <div className="text-sm text-gray-400">{stockDetail.timeStamp}</div> */}
                                <div className='flex items-center bg-[#2E3343] rounded-xl p-2 gap-2'>
                                    {options.map(option => (
                                        <div
                                            key={option}
                                            onClick={() => setScaleActive(option)}
                                            className={`px-4 rounded-lg cursor-pointer transition-all 
                                    ${scaleActive === option
                                                    ? 'bg-[#CDCDCD] text-black'
                                                    : 'text-[#868686] hover:bg-gray-300 hover:text-black'}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
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
                            <div className='text-2xl text-white font-bold my-4'>ข้อมูล{stockDetail.ThaiCompanyName} ({stockDetail.stockSymbol})</div>

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
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium border-b pb-1 border-gray-500">มูลค่าตามราคาตลาด</div>
                                        <div className="text-md ">
                                            {companyData?.highlight_data?.marketCap
                                                ? (companyData.highlight_data.marketCap / 1e9).toFixed(2) + " B THB"
                                                : "-"}
                                        </div>
                                    </div>

                                    {/* อัตราผลตอบแทนจากเงินปันผล */}
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium pb-1 border-b pb-1 border-gray-500">อัตราผลตอบแทนจากเงินปันผล</div>
                                        <div className="text-md ">
                                            {companyData?.highlight_data?.dividendYield12M
                                                ? companyData.highlight_data.dividendYield12M.toFixed(2) + " %"
                                                : "-"}
                                        </div>
                                    </div>

                                    {/* อัตราส่วนราคาต่อกำไรสุทธิ (12 เดือนล่าสุด) */}
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium pb-1 border-b pb-1 border-gray-500">อัตราส่วนราคาต่อกำไรสุทธิ</div>
                                        <div className="text-md ">
                                            {companyData?.highlight_data?.peRatio
                                                ? companyData.highlight_data.peRatio.toFixed(2)
                                                : "-"}
                                        </div>
                                    </div>

                                    {/* ผู้บริหารสูงสุด */}
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium pb-1 border-b pb-1 border-gray-500">ผู้บริหาร</div>
                                        <div className="text-md font-thin flex flex-col gap-1">
                                            {companyData?.board_of_director
                                                ? companyData.board_of_director
                                                    .filter(member =>
                                                        member.positions.some(position =>
                                                            position.includes("ประธาน")
                                                        )
                                                    )
                                                    .map((member, index) => (
                                                        <div key={index} className="flex flex-col">
                                                            <span className="font-semibold text-white">{member.name}</span>
                                                            <span className="text-[#C0C0C0] text-sm">
                                                                {member.positions
                                                                    .filter(position => position.includes("ประธาน"))
                                                                    .join(", ")}
                                                            </span>
                                                        </div>
                                                    ))
                                                : <div>-</div>}
                                        </div>
                                    </div>

                                    {/* ถูกก่อตั้ง */}
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium pb-1 border-b pb-1 border-gray-500">ถูกก่อตั้ง</div>
                                        <div className="text-md font-thin">
                                            {formatEstablishedDate(companyData?.profile_data?.establishedDate)}
                                        </div>
                                    </div>

                                    {/* เว็บไซต์ */}
                                    <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                        <div className="text-lg font-medium pb-1 border-b pb-1 border-gray-500">เว็บไซต์</div>
                                        <div>
                                            <a
                                                href={companyData?.profile_data?.url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 group cursor-pointer text-md font-thin text-white group-hover:text-[#6870FA] transition-colors duration-200"
                                            >
                                                {companyData?.profile_data?.url
                                                    ? companyData.profile_data.url.replace(/^https?:\/\//, "")
                                                    : "-"}
                                                <ExternalLink className="w-4 h-4 text-white opacity-60 group-hover:text-[#6870FA] transition-colors duration-200" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='pl-4 w-[25%] flex flex-col'>
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
                        <div className='flex flex-col w-full space-y-2'>
                            <NewsCard
                                timestamp="7 วันที่ผ่านมา"
                                source="สำนักข่าวอินโฟเควสท์"
                                title="GULF และ PTT Tank เซ็นสัญญา EPCC ร่วมกับ POSCO E&C และ CAZ พัฒนาท่าเรือก๊าซมาบตาพุด"
                            />
                            <NewsCard
                                timestamp="7 วันที่ผ่านมา"
                                source="สำนักข่าวอินโฟเควสท์"
                                title="GULF และ PTT Tank เซ็นสัญญา EPCC ร่วมกับ POSCO E&C และ CAZ พัฒนาท่าเรือก๊าซมาบตาพุด"
                            />
                            <NewsCard
                                timestamp="7 วันที่ผ่านมา"
                                source="สำนักข่าวอินโฟเควสท์"
                                title="GULF และ PTT Tank เซ็นสัญญา EPCC ร่วมกับ POSCO E&C และ CAZ พัฒนาท่าเรือก๊าซมาบตาพุด"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

    )
}

export default StockDetail
