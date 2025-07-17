import React, { useState, useEffect, useRef } from 'react'
import { TrendingUp, ChevronUp, Triangle, ChevronDown, Equal, SortAsc, SortDesc } from 'lucide-react'; // หรือไอคอนอื่นตามต้องการ
import StockCard from './StockCard';
import StockDetail from './StockDetail';
import 'animate.css';

function StockSignal({ onSwitchChange, stock }) {
    // console.log("StockSignal component rendered with stock:", stock);

    const stockList = [
        {
            stockSymbol: 'PTT',
            companyName: 'PTT Public Company Limited',
            status: 'Buy',
            reason: 'ราคา Break EMA20 + ปริมาณซื้อเพิ่มสูง',
            timeStamp: "2025-07-05T15:24:44.540Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'CPALL',
            companyName: 'CP All Public Company Limited',
            status: 'Hold',
            reason: 'ราคาแกว่งตัวในกรอบ ยังไม่ชัดเจน',
            timeStamp: "2025-07-01T06:27:46.180Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'AOT',
            companyName: 'Airports of Thailand Public Company Limited',
            status: 'Sell',
            reason: 'มีแรงขายต่อเนื่องและต่ำกว่า EMA20',
            timeStamp: "2025-07-10T22:39:12.318Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'SCB',
            companyName: 'The Siam Commercial Bank Public Company Limited',
            status: 'Buy',
            reason: 'สัญญาณ MACD ตัดขึ้นเหนือเส้นศูนย์',
            timeStamp: "2025-07-07T08:09:20.069Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'ADVANC',
            companyName: 'Advanced Info Service Public Company Limited',
            status: 'Hold',
            reason: 'ยังไม่มีแนวโน้มที่ชัดเจนจาก RSI',
            timeStamp: "2025-07-13T14:19:51.526Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'GULF',
            companyName: 'Gulf Energy Development Public Company Limited',
            status: 'Sell',
            reason: 'ราคาลงต่อเนื่องหลายวันติดต่อกัน',
            timeStamp: "2025-07-03T23:02:54.200Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'BBL',
            companyName: 'Bangkok Bank Public Company Limited',
            status: 'Buy',
            reason: 'เกิด Golden Cross บนกราฟรายวัน',
            timeStamp: "2025-07-12T05:54:52.304Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'DELTA',
            companyName: 'Delta Electronics (Thailand) Public Company Limited',
            status: 'Hold',
            reason: 'Sideway แคบ รอเบรกแนวต้าน',
            timeStamp: "2025-07-10T09:48:46.328Z",
            isFavorite: true,
        },
        {
            stockSymbol: 'TRUE',
            companyName: 'True Corporation Public Company Limited',
            status: 'Sell',
            reason: 'มีแรงขายสูง RSI ต่ำกว่า 30',
            timeStamp: "2025-07-07T18:12:12.399Z",
            isFavorite: true,
        },
    ]

    const statusCounts = stockList.reduce(
        (acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
        },
        { Buy: 0, Hold: 0, Sell: 0 }
    );

    const stockOptions = [
        { id: 1, name: 'หุ้นทั้งหมด' },
        { id: 2, name: 'หุ้นยอดนิยม' },
    ];

    const sortOptions = [
        { id: 1, name: 'ชื่อ' },
        { id: 2, name: 'สถานะ' },
        { id: 3, name: 'ล่าสุด' },
    ];

    const [open, setOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const [switchState, setSwitchState] = useState(onSwitchChange);
    const [stockDetail, setStockDetail] = useState(stock);
    const [selected, setSelected] = useState(stockOptions[0]);
    const [sortSelected, setSortSelected] = useState(sortOptions[0]);
    const [sortDirection, setSortDirection] = useState('asc'); // เริ่มจาก ascending
    const toggleSort = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const [sortedStock, setSortedStock] = useState(stockList);

    const ref = useRef();
    const sortRef = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setSortOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const sorted = [...stockList].sort((a, b) => {
            let compareValue = 0;

            switch (sortSelected.id) {
                case 1: // companyName
                    compareValue = a.companyName.localeCompare(b.companyName);
                    break;
                case 2: // status
                    compareValue = a.status.localeCompare(b.status);
                    break;
                case 3: // timeStamp
                    compareValue = new Date(a.timeStamp) - new Date(b.timeStamp);
                    break;
                default:
                    compareValue = 0;
            }

            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        setSortedStock(sorted);
    }, [sortSelected, sortDirection]);

    return (
        <div className=' px-4'>
            {switchState ? (
                <div className='flex flex-col'>
                    <div className="flex items-center gap-6">
                        <div className="text-white text-3xl font-semibold">ภาพรวมสัญญาณล่าสุด</div>
                        <TrendingUp className="w-10 h-10 text-white" />
                        <div className="text-[#8C8F99] text-md self-end ml-[-1rem]">(อัปเดตล่าสุด: 14:25)</div>
                    </div>

                    <div className="flex gap-4 text-white my-3">
                        <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-[#41DC8E]"></div>
                            <div className="font-bold">{statusCounts.Buy}</div>
                            <div className="text-md">Buy</div>
                        </div>

                        {/* Hold */}
                        <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                            <Equal className="w-6 h-6 text-yellow-400" />
                            <div className="font-bold">{statusCounts.Hold}</div>
                            <div className="text-md">Hold</div>
                        </div>

                        {/* Sell */}
                        <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-transparent border-t-[#FF8282]"></div>
                            <div className="font-bold">{statusCounts.Sell}</div>
                            <div className="text-md">Sell</div>
                        </div>
                    </div>

                    <div className='flex flex-col mt-6 mb-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <div className="text-white text-3xl font-semibold pb-1">หุ้นที่ติดตาม</div>
                                <img src="/icons/watchlist.svg" alt="Watchlist" className="w-8 h-8" />
                            </div>
                            <div className="flex items-center self-end gap-4 ">
                                {/* หุ้นยอดนิยม */}
                                <div className="relative w-60" ref={ref}>
                                    <div
                                        className="bg-[#5D6275] text-white rounded px-4 py-2 cursor-pointer flex justify-between items-center"
                                        onClick={() => setOpen(!open)}
                                    >
                                        <span>{selected.name}</span>
                                        <svg
                                            className={`w-5 h-5 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    <div
                                        className={`absolute z-10  mt-1 w-full bg-[#5D6275] rounded shadow-lg max-h-60 overflow-auto transition-all duration-200 origin-top ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                            }`}
                                    >
                                        {stockOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`px-4 py-2 cursor-pointer text-white hover:bg-[#8C8F99]/50 ${selected.id === option.id ? 'bg-[#8C8F99] font-semibold' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSelected(option);
                                                    setOpen(false);
                                                }}
                                            >
                                                {option.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative w-60" ref={sortRef}>
                                    <div
                                        className="bg-[#5D6275] text-white rounded px-4 py-2 cursor-pointer flex justify-between items-center"
                                        onClick={() => setSortOpen(!sortOpen)}
                                    >
                                        <span>{sortSelected.name}</span>
                                        <svg
                                            className={`w-5 h-5 ml-2 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            viewBox="0 0 24 24"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    <div
                                        className={`absolute z-10  mt-1 w-full bg-[#5D6275] rounded shadow-lg max-h-60 overflow-auto transition-all duration-200 origin-top ${sortOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                            }`}
                                    >
                                        {sortOptions.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`px-4 py-2 cursor-pointer text-white hover:bg-[#8C8F99]/50 ${sortSelected.id === option.id ? 'bg-[#8C8F99] font-semibold' : ''
                                                    }`}
                                                onClick={() => {
                                                    setSortSelected(option);
                                                    setSortOpen(false);
                                                }}
                                            >
                                                {option.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ไอคอนกรอง */}
                                <div
                                    onClick={toggleSort}
                                    className="p-2 bg-[#5D6275] rounded hover:bg-[#6B708A] transition-colors cursor-pointer flex items-center justify-center h-10 w-10"
                                >
                                    <div
                                        key={sortDirection} // force re-render
                                        className="transition-all duration-300 ease-in-out opacity-0 animate-fadeIn"
                                    >
                                        {sortDirection === 'asc' ? (
                                            <SortAsc className="w-6 h-6 text-white" />
                                        ) : (
                                            <SortDesc className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </div>

                                {/* <div className="flex gap-4 text-[#6870FA]">
                                    <ArrowUp className="w-6 h-6" />
                                    <ArrowDown className="w-6 h-6" />
                                    <ChevronsUp className="w-6 h-6" />
                                    <ChevronsDown className="w-6 h-6" />
                                    <SortAsc className="w-6 h-6" />
                                    <SortDesc className="w-6 h-6" />
                                </div> */}

                            </div>
                        </div>
                        {/* <div
                            className={`overflow-x-auto mt-2 px-4`}
                            style={{ scrollbarWidth: 'thin' }}
                        >


                        </div> */}

                        <div className="mt-4">
                            <div className="grid grid-cols-1 my-1 md:grid-cols-3 gap-4 mt-2">
                                {sortedStock.map((stock, index) => (
                                    <div key={index} onClick={() => {
                                        setSwitchState(!switchState);
                                        setStockDetail(stock);
                                    }}
                                        className='cursor-pointer animate__animated animate__fadeInUp'>
                                        <StockCard
                                            stockSymbol={stock.stockSymbol}
                                            status={stock.status}
                                            reason={stock.reason}
                                            isFavorite={stock.isFavorite}
                                            timeStamp={`อัปเดตล่าสุด: ${new Date(stock.timeStamp).toLocaleString('en-US', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )
            }



        </div>
    )
}

export default StockSignal
