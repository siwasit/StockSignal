import React, { useState, useRef, useEffect } from 'react'
import StockDetail from './StockDetail';
import { FunnelIcon } from '@heroicons/react/24/solid';
import CandlestickIcon from './../assets/CandlestickIcon'
import StockCard from './StockCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, SortAsc, SortDesc } from 'lucide-react';


function AllStock({ stock, onSwitchChange }) {
    const stockOptions = [
        { id: 1, name: 'หุ้นทั้งหมด' },
        { id: 2, name: 'หุ้นยอดนิยม' },
    ];

    const companyNames = [
        'TechNova',
        'GreenLeaf',
        'Skyline Corp',
        'Quantum Solutions',
        'BlueWave',
        'Solaris Ltd',
        'NextGen Tech',
        'Apex Industries',
        'Everest Systems',
        'FusionWorks',
        'Nimbus',
        'Luna Innovations',
        'Atlas Group',
        'Vertex Inc',
        'Pinnacle',
        'Echo Enterprises',
        'Zenith',
        'NovaCore',
        'Horizon Dynamics',
        'PulseTech',
    ];

    const sortOptions = [
        { id: 1, name: 'ชื่อ' },
        { id: 2, name: 'สถานะ' },
        { id: 3, name: 'ล่าสุด' },
        { id: 4, name: 'watchlist' },
    ];

    function getRandomDate(start, end) {
        const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(timestamp);
    }

    const generateRandomSymbol = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        const length = Math.floor(Math.random() * 2) + 2; // 2-3 ตัว

        let symbol = '';
        for (let i = 0; i < length; i++) {
            symbol += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // สุ่ม 50% ว่าจะต่อท้ายด้วยตัวเลขหรือไม่
        if (Math.random() < 0.5) {
            symbol += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return symbol;
    };


    const mockStockData = Array.from({ length: 90 }, (_, index) => {
        const randomDate = getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59));
        const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];

        return {
            stockSymbol: generateRandomSymbol(),
            companyName, // เพิ่ม companyName เข้าไป
            status: ['Buy', 'Sell', 'Hold'][index % 3],
            reason: ['Break EMA', 'Volume Surge', 'MACD Signal'][index % 3],
            timeStamp: randomDate.toISOString(),
            isFavorite: index % 4 === 0,
        };
    });

    const [switchState, setSwitchState] = useState(onSwitchChange);
    const [stockDetail, setStockDetail] = useState(stock);

    const [open, setOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const [selected, setSelected] = useState(stockOptions[0]);
    const [stocks, setStocks] = useState(mockStockData);
    const [sortSelected, setSortSelected] = useState(sortOptions[0]);
    const [sortDirection, setSortDirection] = useState('asc'); // เริ่มจาก ascending
    const toggleSort = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };
    const ref = useRef();
    const sortRef = useRef();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;
    const totalPages = Math.ceil(stocks.length / itemsPerPage);
    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStocks = stocks.slice(startIndex, endIndex);

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

        console.log(mockStockData)
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const sorted = [...stocks].sort((a, b) => {
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
                case 4: // isFavorite (true มาข้างบน)
                    compareValue = (b.isFavorite === true) - (a.isFavorite === true);
                    break;
                default:
                    compareValue = 0;
            }

            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        setStocks(sorted);
        setCurrentPage(1);
    }, [sortSelected, sortDirection]);

    // useEffect(() => {
    //     const sorted = [...stocks].sort((a, b) => {
    //         if (sortDirection === 'asc') {
    //             return a.companyName.localeCompare(b.companyName);
    //         } else {
    //             return b.companyName.localeCompare(a.companyName);
    //         }
    //     });
    //     setStocks(sorted);
    //     setCurrentPage(1);
    // }, [sortDirection]);


    return (
        <div className='p-4'>
            {switchState ? (
                <div className='flex relative flex-col min-h-screen'>
                    <div className="flex items-center gap-2">
                        <div className="text-3xl text-white pb-2 font-bold">หุ้น</div>
                        <CandlestickIcon />
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                        {currentStocks.map((stock, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => {
                                        setSwitchState(!switchState);
                                        setStockDetail(stock);
                                    }}
                                    className="cursor-pointer animate__animated animate__fadeInUp"
                                >
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
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center items-center space-x-2 my-4">

                        {/* Prev Button */}
                        <div
                            onClick={handlePrev}
                            className={`flex items-center gap-1 justify-center px-3 py-1 rounded text-white w-24 ${currentPage === 1
                                ? 'bg-gray-500 text-gray-500 cursor-not-allowed'
                                : 'hover:bg-[#6870FA] cursor-pointer'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>กลับ</span>
                        </div>

                        {/* Page Buttons */}
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <div
                                key={page}
                                onClick={() => handlePageClick(page)}
                                className={`px-3 py-1 rounded text-white cursor-pointer ${currentPage === page
                                    ? 'bg-[#6870FA]'
                                    : 'hover:bg-[#6870FA]/50'
                                    }`}
                            >
                                {page}
                            </div>
                        ))}

                        {/* Next Button */}
                        <div
                            onClick={handleNext}
                            className={`flex items-center justify-center gap-1 px-3 py-1 rounded text-white w-24 ${currentPage === totalPages
                                ? 'bg-gray-500 text-gray-500 cursor-not-allowed'
                                : 'hover:bg-[#6870FA] cursor-pointer'
                                }`}
                        >
                            <span>ต่อไป</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>

                    </div>
                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )
            }
        </div >
    )
}

export default AllStock
