import React, { useState, useRef, useEffect } from 'react'
import StockDetail from './StockDetail';
import { FunnelIcon } from '@heroicons/react/24/solid';
import CandlestickIcon from './../assets/CandlestickIcon'
import StockCard from './StockCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, SortAsc, SortDesc } from 'lucide-react';


function AllStock({ stock, onSwitchChange, stockList, onFavoriteChange }) {
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
        { id: 1, name: 'Symbol' },
        { id: 2, name: 'Status' },
        { id: 3, name: 'อัพเดทล่าสุด' },
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
        const stockPrice = Math.floor(Math.random() * (100 - 20 + 1)) + 20; // สุ่มระหว่าง 20 ถึง 100

        return {
            stockSymbol: generateRandomSymbol(),
            companyName,
            status: ['Buy', 'Sell', 'Hold'][index % 3],
            reason: ['Break EMA', 'Volume Surge', 'MACD Signal'][index % 3],
            timeStamp: randomDate.toISOString(),
            isFavorite: false,
            stockPrice, // เพิ่มตรงนี้
        };
    });




    const [switchState, setSwitchState] = useState(onSwitchChange);
    const [stockDetail, setStockDetail] = useState(stock);
    const [open, setOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [selected, setSelected] = useState(stockOptions[0]);

    // const [stocks, setStocks] = useState(mockStockData);stockList
    // const [stocks, setStocks] = useState(stockList);
    const [stocks, setStocks] = useState(() => {
        // โหลดจาก localStorage ถ้ามี ไม่งั้นเป็น array ว่าง
        const saved = localStorage.getItem('SET50Stocks');
        return saved ? JSON.parse(saved) : [];
    });

    const [sortSelected, setSortSelected] = useState(sortOptions[0]);
    const [sortDirection, setSortDirection] = useState('asc');
    const ref = useRef();
    const sortRef = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;
    const totalPages = Math.ceil(stocks.length / itemsPerPage);
    const [popularStocks, setPopularStocks] = useState([]);

    const toggleSort = () => {
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    };

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
        const sorted = [...stocks].sort((a, b) => {
            let compareValue = 0;

            switch (sortSelected.id) {
                case 1:
                    compareValue = (a.stockSymbol ?? '').localeCompare(b.stockSymbol ?? '');
                    break;
                case 2:
                    compareValue = (a.status ?? '').localeCompare(b.status ?? '');
                    break;
                case 3:
                    compareValue = new Date(a.timeStamp ?? 0) - new Date(b.timeStamp ?? 0);
                    break;
                case 4:
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
    //     // โหลด stocks จาก localStorage
    //     const storedStocks = JSON.parse(localStorage.getItem('SET50Stocks')) || [];

    //     const sorted = [...storedStocks].sort((a, b) => {
    //         let compareValue = 0;

    //         switch (sortSelected.id) {
    //             case 1:
    //                 compareValue = (a.stockSymbol ?? '').localeCompare(b.stockSymbol ?? '');
    //                 break;
    //             case 2:
    //                 compareValue = (a.status ?? '').localeCompare(b.status ?? '');
    //                 break;
    //             case 3:
    //                 compareValue = new Date(a.timeStamp ?? 0) - new Date(b.timeStamp ?? 0);
    //                 break;
    //             case 4:
    //                 // favorite: ให้ตัวที่ isFavorite=true อยู่ข้างบน
    //                 compareValue = (b.isFavorite === true) - (a.isFavorite === true);
    //                 break;
    //             default:
    //                 compareValue = 0;
    //         }

    //         return sortDirection === 'asc' ? compareValue : -compareValue;
    //     });

    //     setStocks(sorted);
    //     setCurrentPage(1);
    // }, [sortSelected, sortDirection]);

    useEffect(() => {
        if (selected.id === 2 && popularStocks.length === 0) {
            const shuffled = [...stocks].sort(() => 0.5 - Math.random());
            setPopularStocks(shuffled.slice(0, 15));
        }
    }, [selected, stocks]);

    // toggle favorite state ใน stocks
    // const handleToggleFavorite = (symbol) => {
    //     setStocks(prevStocks =>
    //         prevStocks.map(s => {
    //             if (s.stockSymbol === symbol) {
    //                 const newIsFavorite = !s.isFavorite;
    //                 // console.log(`[Toggle Favorite] ${symbol}: ${s.isFavorite} → ${newIsFavorite}`);

    //                 return {
    //                     ...s,
    //                     isFavorite: newIsFavorite,
    //                     favoriteAt: newIsFavorite ? Date.now() : null
    //                 };
    //             }
    //             return s;
    //         })
    //     );
    // };
    const handleToggleFavorite = (symbol) => {
        const updatedStocks = stocks.map(s => {
            if (s.stockSymbol === symbol) {
                const newIsFavorite = !s.isFavorite;

                return {
                    ...s,
                    isFavorite: newIsFavorite,
                    favoriteAt: newIsFavorite ? Date.now() : null
                };
            }
            return s;
        });

        setStocks(updatedStocks);

        // ✅ ส่งเฉพาะหุ้นที่ favorite อยู่ไปให้ parent
        const updatedFavorites = updatedStocks.filter(s => s.isFavorite);
        onFavoriteChange(updatedFavorites);
    };


    // useEffect ซิงก์ FavoriteStocks ใน localStorage ทุกครั้งที่ stocks เปลี่ยน
    useEffect(() => {
        const favoriteOnly = stocks.filter(s => s.isFavorite);

        localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));
        localStorage.setItem('SET50Stocks', JSON.stringify(stocks));
    }, [stocks]);


    const stocksPerPage = 15;

    const filteredStocks = (() => {
        let result = [];

        if (selected.id === 2) {
            if (popularStocks.length === 0) return [];
            result = stocks.filter(stock =>
                popularStocks.some(p => p.stockSymbol === stock.stockSymbol)
            );
            return result;
        }

        if (sortSelected.id === 4) {
            result = [...stocks].sort((a, b) => {
                if (a.isFavorite === b.isFavorite) return 0;
                return a.isFavorite ? -1 : 1;
            });
        } else {
            result = stocks;
        }

        const start = (currentPage - 1) * stocksPerPage;
        const end = start + stocksPerPage;
        return result.slice(start, end);
    })();

    // const filteredStocks = (() => {
    //     // โหลด stocks จาก localStorage (ถ้าไม่มี ให้เป็น array ว่าง)
    //     const storedStocks = JSON.parse(localStorage.getItem('SET50Stocks')) || [];

    //     let result = [];

    //     if (selected.id === 2) {
    //         if (popularStocks.length === 0) return [];
    //         result = storedStocks.filter(stock =>
    //             popularStocks.some(p => p.stockSymbol === stock.stockSymbol)
    //         );
    //         return result;
    //     }

    //     if (sortSelected.id === 4) {
    //         result = [...storedStocks].sort((a, b) => {
    //             if (a.isFavorite === b.isFavorite) return 0;
    //             return a.isFavorite ? -1 : 1;
    //         });
    //     } else {
    //         result = storedStocks;
    //     }

    //     const start = (currentPage - 1) * stocksPerPage;
    //     const end = start + stocksPerPage;
    //     return result.slice(start, end);
    // })();


    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentStocks = filteredStocks.slice(startIndex, endIndex);

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

    return (
        <div className='p-4'>
            {switchState ? (
                <div className='flex relative flex-col min-h-screen'>
                    <div className="flex items-center gap-2">
                        <div className="text-3xl text-white pb-2 font-bold">หุ้น</div>
                        <CandlestickIcon />
                    </div>
                    <div className="flex items-center self-end gap-4 ">
                        {/* <div className="relative w-60" ref={ref}>
                            <div
                                className="bg-[#5D6275] text-white rounded px-4 py-2 cursor-pointer flex justify-between items-center"
                                onClick={() => setOpen(!open)}
                            >
                                <span>{selected.name}</span>
                                <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                            <div className={`absolute z-10 mt-1 w-full bg-[#5D6275] rounded shadow-lg max-h-60 overflow-auto transition-all duration-200 origin-top ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {stockOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`px-4 py-2 cursor-pointer text-white hover:bg-[#8C8F99]/50 ${selected.id === option.id ? 'bg-[#8C8F99] font-semibold' : ''}`}
                                        onClick={() => { setSelected(option); setOpen(false); }}
                                    >{option.name}</div>
                                ))}
                            </div>
                        </div> */}

                        <div className="relative w-60" ref={sortRef}>
                            <div
                                className="bg-[#5D6275] text-white rounded px-4 py-2 cursor-pointer flex justify-between items-center"
                                onClick={() => setSortOpen(!sortOpen)}
                            >
                                <span>{sortSelected.name}</span>
                                <svg
                                    className={`w-5 h-5 ml-2 transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}
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
                                className={`absolute z-10  mt-1 w-full bg-[#5D6275] rounded shadow-lg max-h-60 overflow-auto transition-all duration-200 origin-top ${sortOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                            >
                                {sortOptions.map((option) => (
                                    <div
                                        key={option.id}
                                        className={`px-4 py-2 cursor-pointer text-white hover:bg-[#8C8F99]/50 ${sortSelected.id === option.id ? 'bg-[#8C8F99] font-semibold' : ''}`}
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

                        <div
                            onClick={toggleSort}
                            className="p-2 bg-[#5D6275] rounded hover:bg-[#6B708A] transition-colors cursor-pointer flex items-center justify-center h-10 w-10"
                        >
                            <div
                                key={sortDirection}
                                className="transition-all duration-300 ease-in-out opacity-0 animate-fadeIn"
                            >
                                {sortDirection === 'asc' ? (
                                    <SortAsc className="w-6 h-6 text-white" />
                                ) : (
                                    <SortDesc className="w-6 h-6 text-white" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
                        {filteredStocks.map((stock, index) => (
                            // animate__animated animate__fadeInUp
                            <div key={index} className="">
                                <StockCard
                                    stockSymbol={stock.stockSymbol}
                                    price={stock.stockPrice}
                                    status={stock.status}
                                    reason={stock.reason}
                                    timeStamp={`อัปเดตล่าสุด: ${new Date(stock.timeStamp).toLocaleString('en-US', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true,
                                    })}`}
                                    isFavorite={stock.isFavorite}
                                    onToggleFavorite={() => handleToggleFavorite(stock.stockSymbol)}
                                    onClick={() => {
                                        setSwitchState(!switchState);
                                        setStockDetail(stock);
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {selected.id !== 2 && (
                        <div className="flex justify-center items-center space-x-2 my-4">
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
                    )}
                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )}
        </div>
    );
}

export default AllStock;
