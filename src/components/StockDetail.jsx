import React, { useState, useEffect, useRef } from 'react'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { createChart, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { calculateEMA, calculateRSI, calculateMACD, calculateVolume } from './../assets/indicators'; // ด้านล่างจะเขียนให้
import { ExternalLink, ChevronRight } from 'lucide-react';
import NewsCard from './NewsCard';
import { motion } from 'framer-motion';

function StockDetail({ stock }) {

    console.log("StockDetail component rendered with stock:", stock);
    const [stockDetail, setStockDetail] = useState(stock);
    const [scaleActive, setScaleActive] = useState('1D');
    const options = ['1D', '1W', '1M', '1Y'];
    const [sampleData, setSampleData] = useState(generateCandlestickData('2023-01-01', 540));
    const [showNoData, setShowNoData] = useState(false);
    const [showMACDNoData, setShowMACDNoData] = useState(false);
    const [indicators, setIndicators] = useState({
        rsi: false,
        volume: false,
        ema: false,
        macd: false,
    });

    const chartContainerRef = useRef();
    const rsiRef = useRef();
    const macdRef = useRef();

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
            // skip weekends (Saturday=6, Sunday=0)
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            // สุ่มความผันผวนราคา (±2%)
            const open = previousClose;
            const changePercent = (Math.random() * 4 - 2) / 100; // -2% ถึง +2%
            const close = open * (1 + changePercent);

            // high และ low อยู่ในช่วง ±1.5% จาก open และ close
            const high = Math.max(open, close) * (1 + Math.random() * 0.015);
            const low = Math.min(open, close) * (1 - Math.random() * 0.015);

            data.push({
                time: currentDate.toISOString().slice(0, 10), // YYYY-MM-DD
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
            });

            previousClose = close;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return data;
    }

    const filterDataByPeriod = (data, period) => {
        if (!data || data.length === 0) return [];

        // สมมติ data เป็น array ของ { time: string|number, ... }
        // แปลงข้อมูล time สุดท้ายเป็น Date object
        const lastTime = data[data.length - 1].time;
        const now = new Date(lastTime);

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
            const t = new Date(datum.time);
            return t >= fromDate && t <= now;
        });
    };


    useEffect(() => {
        const data = generateCandlestickData('2023-01-01', 540);
        setSampleData(data);
    }, []);

    useEffect(() => {
        const currentLocale = navigator.language || 'en-US';
        const filtered = filterDataByPeriod(sampleData, scaleActive);

        let syncInProgress = false;
        function syncCharts(sourceChart, charts) {
            // console.log("Sync from", sourceChart, "to", charts);
            if (syncInProgress) return;
            // console.log("Sync from", sourceChart, "to", charts, 'pass');
            syncInProgress = true;

            const sourceRange = sourceChart.timeScale().getVisibleLogicalRange();
            if (!sourceRange) {
                syncInProgress = false;
                return; // ถ้าไม่มี range ไม่ต้อง sync
            }

            for (const chart of charts) {
                if (chart !== sourceChart) {
                    // ตรวจสอบว่าชาร์ตยังไม่ถูกลบหรือ null
                    if (chart && chart.timeScale) {
                        try {
                            chart.timeScale().setVisibleLogicalRange(sourceRange);
                        } catch (e) {
                            // กัน error กรณีกราฟยังไม่พร้อม
                            console.warn('syncCharts: setVisibleLogicalRange error', e);
                        }
                    }
                }
            }
            syncInProgress = false;
        }


        // --- Main Chart ---
        const mainChart = createChart(chartContainerRef.current, {
            width: 900,
            height: 300,
            layout: {
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
            localization: {
                priceFormatter: myPriceFormatter,
            },
            rightPriceScale: {
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                borderVisible: false,
            },
        });

        const candleSeries = mainChart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
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
            color: '#8884d8',
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

        // --- RSI Chart ---
        let rsiChart;
        if (rsiRef.current) {
            rsiChart = createChart(rsiRef.current, {
                width: 900,
                height: 100,
                layout: { background: { color: '#202431' }, textColor: '#FFFFFF' },
                timeScale: { visible: false },
                grid: {
                    vertLines: { color: '#3A3F55' },
                    horzLines: { color: '#3A3F55' },
                },
            });

            const rsiSeries = rsiChart.addSeries(LineSeries, { color: '#00BCD4' });
            if (indicators.rsi && filtered.length > 14) {
                setShowNoData(false);
                rsiSeries.setData(calculateRSI(filtered));
            } else {
                setShowNoData(true);
                rsiSeries.setData([]);
            }
        }

        // --- MACD Chart ---
        let macdChart;
        if (macdRef.current) {
            macdChart = createChart(macdRef.current, {
                width: 900,
                height: 120,
                layout: { background: { color: '#202431' }, textColor: '#fff' },
                grid: {
                    vertLines: { color: '#3A3F55' },
                    horzLines: { color: '#3A3F55' },
                },
                timeScale: { visible: false },
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

        mainChart.timeScale().fitContent();
        rsiChart?.timeScale().fitContent();
        macdChart?.timeScale().fitContent();

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

        // Cleanup
        return () => {
            mainChart.remove();
            rsiChart?.remove();
            macdChart.remove();
        };
    }, [scaleActive, sampleData, indicators]);


    return (
        <motion.div
            className="flex flex-col"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className='flex flex-col'>
                <div className='flex flex-col'>
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
                    <div className="text-[#8C8F99] flex justify-between  gap-4 text-xl">{stockDetail.companyName} <div className="text-sm text-gray-400">{stockDetail.timeStamp}</div></div>
                </div>

                <div className='flex w-full h-full mb-4'>
                    <div className='flex flex-col w-[75%] h-full pr-4 border-r-2 border-[#868686]'>
                        <div className="flex space-y-1 justify-between my-3 text-gray-100">
                            <div className="flex space-x-4 items-center font-semibold text-xl">
                                <div>100.00฿</div>
                                <div className="text-[#41DC8E]">+1.11%</div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-white">
                                {['rsi', 'volume', 'ema', 'macd'].map((name) => (
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
                        <div ref={chartContainerRef} className="w-full flex justify-center  h-3/5" />
                        <div className={`relative w-full h-1/5 ${!indicators.rsi ? 'hidden' : ''}`}>
                            <div ref={rsiRef} className="w-full flex justify-center h-full" />
                            {showNoData && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202431]/80 text-white text-sm opacity-50 z-10">
                                    ข้อมูลไม่เพียงพอสำหรับคำนวณ RSI
                                </div>
                            )}
                        </div>


                        <div className={`relative w-full h-1/5 ${!indicators.macd ? 'hidden' : ''}`}>
                            <div ref={macdRef} className="w-full flex justify-center h-full" />
                            {showMACDNoData && (
                                <div className="absolute inset-0 flex items-center justify-center bg-[#202431]/80 text-white text-sm opacity-50 z-10">
                                    ข้อมูลไม่เพียงพอสำหรับคำนวณ MACD
                                </div>
                            )}
                        </div>

                        <div className='text-end px-3 text-[#868686]'>ตัวชี้วัด: RSI 68 | MACD +1.2 | EMA20</div>
                        <div className='flex flex-col'>
                            <div className='text-2xl text-white font-bold my-4'>ข้อมูลบริษัท</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>มูลค่าตามราคาตลาด</div>
                                    <div className='text-md font-thin'>605.06 B THB</div>
                                </div>
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>อัตราผลตอบแทนจากเงินปันผล</div>
                                    <div className='text-md font-thin'>-</div>
                                </div>
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>อัตราส่วนราคาต่อกำไรสุทธิ (12 เดือนล่าสุด)</div>
                                    <div className='text-md font-thin'>-</div>
                                </div>
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>ผู้บริหารสูงสุด</div>
                                    <div className='text-md font-thin'>Sarath Ratanavadi</div>
                                </div>
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>ถูกก่อตั้ง</div>
                                    <div className='text-md font-thin'>-</div>
                                </div>
                                <div className="flex bg-[#2E3343] rounded-lg flex-col gap-2 px-4 py-2">
                                    <div className='text-lg font-medium'>เว็บไซต์</div>
                                    <div className='flex items-center gap-2 group cursor-pointer'>
                                        <div className='text-md font-thin text-white group-hover:text-[#6870FA] transition-colors duration-200'>
                                            gulf.co.th
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-white opacity-60 group-hover:text-[#6870FA] transition-colors duration-200" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pl-4 w-[25%] flex flex-col'>
                        <div className='text-2xl text-white font-bold my-4'>สัญญาณล่าสุด</div>
                        <div className='w-full flex items-center justify-between rounded-lg py-2 px-4 bg-[#41DC8E] flex'>
                            <div className='text-white font-bold text-xl'>BUY</div>
                            <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-white"></div>
                        </div>
                        <div className='flex flex-col my-2'>
                            <div className='text-[#868686] text-lg font-medium'>เหตุผล</div>
                            <div className="text-white flex items-center gap-2">
                                <p className="text-[#F6B73C] m-0">Break EMA20</p>
                                <span>+ Volume เพิ่ม</span>
                            </div>
                        </div>
                        <hr className="my-2 border-t border-[#868686]" />
                        <div className='text-2xl text-white font-semibold my-2'>ประวัติสัญญาณย้อนหลัง</div>
                        <div className='flex flex-col w-full'>
                            <div className='flex items-center w-full justify-between border-b-1 border-[#868686]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-[#868686] text-lg'>Buy</div>
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-[#868686]"></div>
                                </div>
                                <p className='text-[#868686] text-md'>5 นาทีผ่านมา</p>
                            </div>
                            <div className='flex items-center w-full justify-between border-b-1 border-[#868686]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-[#868686] text-lg'>Hold</div>
                                    <div className='w-3 h-3 bg-[#868686] rounded-full' />
                                </div>
                                <p className='text-[#868686] text-md'>1 วันที่ผ่านมา</p>
                            </div>
                            <div className='flex items-center w-full justify-between border-b-1 border-[#868686]'>
                                <div className='flex gap-4 items-center py-2'>
                                    <div className='text-[#868686] text-lg'>Sell</div>
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-transparent border-t-[#868686]"></div>
                                </div>
                                <p className='text-[#868686] text-md'>2 กรกฎาคม 2568</p>
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
