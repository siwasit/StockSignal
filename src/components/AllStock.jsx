import React, { useState, useRef, useEffect } from 'react'
import StockDetail from './StockDetail';
import { FunnelIcon } from '@heroicons/react/24/solid';
import CandlestickIcon from './../assets/CandlestickIcon'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, SortAsc, SortDesc, Search, X } from 'lucide-react';
import StockBullet from './StockBullet';

function AllStock({ stock, onSwitchChange, stockList, onFavoriteChange }) {
    const stockOptions = [
        { id: 1, name: 'หุ้นทั้งหมด' },
        { id: 2, name: 'หุ้นยอดนิยม' },
    ];

    const stockRegion = [
        { id: 1, name: 'หุ้นทั้งหมด' },
        { id: 2, name: 'Thailand', flag: 'https://s3-symbol-logo.tradingview.com/country/TH.svg' },
        { id: 3, name: 'USA', flag: 'https://s3-symbol-logo.tradingview.com/country/US.svg' },
        { id: 4, name: 'Mainland China', flag: 'https://s3-symbol-logo.tradingview.com/country/CN.svg' },
    ];

    const sortOptions = [
        { id: 1, name: 'Symbol' },
        { id: 2, name: 'ราคา' },
        { id: 3, name: 'สถานะ' },
        { id: 4, name: 'คำอธิบายสัญญาณ' },
        { id: 5, name: 'เวลาสัญญาณ' },
    ];

    function getSortSymbol(optionId) {
        if (sortSelected.id !== optionId) return '⇅';
        return sortDirection === 'asc' ? '↑' : '↓';
    }

    function timeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return `${diff} วินาทีที่แล้ว`;
        else if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
        else if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
        else return `${Math.floor(diff / 86400)} วันที่แล้ว`;
    }

    function renderStatus(status) {
        const statusUpper = status.toUpperCase();
        const baseStyle = {
            // fontWeight: 600,
            // fontSize: '1.5rem',
            letterSpacing: '1px',
            display: 'inline-block',
            width: '100%',
            textAlign: 'center'
        };

        if (statusUpper === 'BUY') {
            return <span style={{ ...baseStyle, color: '#33EBAA' }}>BUY</span>;
        }
        if (statusUpper === 'SELL') {
            return <span style={{ ...baseStyle, color: '#F37A87' }}>SELL</span>;
        }
        return <span style={{ ...baseStyle, color: '#F9D96C' }}>HOLD</span>;
    }

    const [switchState, setSwitchState] = useState(onSwitchChange);
    const [stockDetail, setStockDetail] = useState(stock);
    const [regionSelected, setSelected] = useState(stockRegion[0]);
    const [sortSelected, setSortSelected] = useState(sortOptions[0]);
    const [sortDirection, setSortDirection] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [popularStocks, setPopularStocks] = useState([]);

    const [allStocks, setAllStocks] = useState(() => {
        const saved = localStorage.getItem('AllStock');
        return saved ? JSON.parse(saved) : [];
    });

    const [stocks, setStocks] = useState(allStocks);

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

    // useEffect(() => {
    //     if (selected.id === 2 && popularStocks.length === 0) {
    //         const shuffled = [...stocks].sort(() => 0.5 - Math.random());
    //         setPopularStocks(shuffled.slice(0, 15));
    //     }
    // }, [selected, stocks]);

    useEffect(() => {
        const exchangeRates = {
            THB: 1,
            USD: 0.031,
            CNY: 0.22,
        };

        const sorted = [...stocks].sort((a, b) => {
            let compareValue = 0;
            switch (sortSelected.id) {
                case 1:
                    compareValue = (a.stockSymbol ?? '').localeCompare(b.stockSymbol ?? '');
                    break;
                case 2:
                    compareValue = (
                        (a.stockPrice ?? 0) * (exchangeRates[a.fullCurrency] ?? 1)
                    ) - (
                            (b.stockPrice ?? 0) * (exchangeRates[b.fullCurrency] ?? 1)
                        );
                    break;
                case 3:
                    compareValue = (a.status ?? '').localeCompare(b.status ?? '');
                    break;
                case 4:
                    compareValue = (b.isFavorite === true) - (a.isFavorite === true);
                    break;
                case 5:
                    compareValue = new Date(a.timeStamp ?? 0) - new Date(b.timeStamp ?? 0);
                    break;
                default:
                    compareValue = 0;
            }
            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        // console.log(sorted)
        setStocks(sorted);
        setCurrentPage(1);
    }, [sortSelected, sortDirection]);

    const handleToggleFavorite = (symbol) => {
        const updatedStocks = allStocks.map(s => {
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

        const sortedStocks = [...updatedStocks].sort((a, b) => {
            let compareValue = 0;
            switch (sortSelected.id) {
                case 1:
                    compareValue = (a.stockSymbol ?? '').localeCompare(b.stockSymbol ?? '');
                    break;
                case 2:
                    compareValue = (a.stockPrice ?? 0) - (b.stockPrice ?? 0);
                    break;
                case 3:
                    compareValue = (a.status ?? '').localeCompare(b.status ?? '');
                    break;
                case 4:
                    compareValue = (b.isFavorite === true) - (a.isFavorite === true);
                    break;
                case 5:
                    compareValue = new Date(a.timeStamp ?? 0).getTime() - new Date(b.timeStamp ?? 0).getTime();
                    break;
                default:
                    compareValue = 0;
            }
            return sortDirection === 'asc' ? compareValue : -compareValue;
        });
        const regionMarket = {
            1: ["CBOE", "NASDAQ", "NYSE", "AMEX", "SET", "SSE", "SZSE"],
            2: ["SET"],
            3: ["CBOE", "NASDAQ", "NYSE", "AMEX"],
            4: ["SSE", "SZSE"],
        };

        // const AllStock = localStorage.getItem('AllStock');

        if (AllStock) {
            // const allStocks = JSON.parse(AllStock); // แปลงเป็น array
            const targetMarkets = regionMarket[regionSelected.id] || [];

            const filteredStocks = sortedStocks.filter(stock =>
                targetMarkets.includes(stock.stockMarket)
            );

            // console.log(filteredStocks)
            setStocks(filteredStocks)
        }

        // const sortedStocks = [...updatedStocks].sort((a, b) => {
        //     if (sortSelected.id === 4) {
        //         return (b.isFavorite === true) - (a.isFavorite === true);
        //     }
        //     return 0;
        // });

        // const AllStockRaw = localStorage.getItem('AllStock');

        // if (AllStockRaw) {
        //     const allStocks = JSON.parse(AllStockRaw); // แปลงเป็น array
        //     const sorted = allStocks.sort((a, b) => {
        //         const symbolA = a.stockSymbol ?? '';
        //         const symbolB = b.stockSymbol ?? '';
        //         return symbolA.localeCompare(symbolB);
        //     });

        //     console.log(sorted); // แสดงผลลัพธ์หลังเรียงแล้ว
        //     setAllStocks(sortedStocks);
        // }


        // console.log(sorted)

        setAllStocks(sortedStocks);
        // setStocks(sortedStocks);
        // const sorted = [...stocks].sort((a, b) => {
        //     const symbolA = a.stockSymbol ?? '';
        //     const symbolB = b.stockSymbol ?? '';
        //     return symbolA.localeCompare(symbolB);
        // });

        const updatedFavorites = updatedStocks.filter(s => s.isFavorite);
        onFavoriteChange(updatedFavorites);
    };

    useEffect(() => {
        const regionMarket = {
            1: ["CBOE", "NASDAQ", "NYSE", "AMEX", "SET", "SSE", "SZSE"],
            2: ["SET"],
            3: ["CBOE", "NASDAQ", "NYSE", "AMEX"],
            4: ["SSE", "SZSE"],
        };

        const AllStock = localStorage.getItem('AllStock');

        if (AllStock) {
            const allStocks = JSON.parse(AllStock); // แปลงเป็น array
            const targetMarkets = regionMarket[regionSelected.id] || [];

            const filteredStocks = allStocks.filter(stock =>
                targetMarkets.includes(stock.stockMarket)
            );

            if (!query.trim()) {
                setStocks(filteredStocks); // reset เมื่อ query ว่าง
            } else {
                const lower = query.toLowerCase();
                const filtered = filteredStocks.filter( // ✅ ต้องใช้ allStocks
                    (s) => s.stockSymbol.toLowerCase().includes(lower)
                );
                setStocks(filtered);
            }
            // console.log(filteredStocks)
            // setStocks(filteredStocks)
        }
    }, [regionSelected]);

    useEffect(() => {
        const favoriteOnly = allStocks.filter(s => s.isFavorite);
        localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));
        localStorage.setItem('AllStock', JSON.stringify(allStocks));
    }, [allStocks]);


    const stocksPerPage = 50;
    const totalPages = Math.ceil(stocks.length / stocksPerPage);

    const filteredStocks = (() => {
        const sorted = [...stocks].sort((a, b) => {
            let compareValue = 0;
            switch (sortSelected.id) {
                case 1:
                    compareValue = (a.stockSymbol ?? '').localeCompare(b.stockSymbol ?? '');
                    break;
                case 2:
                    compareValue = (a.stockPrice ?? 0) - (b.stockPrice ?? 0);
                    break;
                case 3:
                    compareValue = (a.status ?? '').localeCompare(b.status ?? '');
                    break;
                case 4:
                    compareValue = (b.isFavorite === true) - (a.isFavorite === true);
                    break;
                case 5:
                    compareValue = new Date(a.timeStamp ?? 0) - new Date(b.timeStamp ?? 0);
                    break;
                default:
                    compareValue = 0;
            }
            return sortDirection === 'asc' ? compareValue : -compareValue;
        });

        const start = (currentPage - 1) * stocksPerPage;
        const end = start + stocksPerPage;

        return sorted.slice(start, end);
    })();


    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    function getPageNumbers(currentPage, totalPages) {
        const pages = [];
        if (totalPages <= 15) return Array.from({ length: totalPages }, (_, i) => i + 1);
        pages.push(1);
        if (currentPage > 5) pages.push('...');
        const startPage = Math.max(2, currentPage - 2);
        const endPage = Math.min(totalPages - 1, currentPage + 2);
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        if (currentPage < totalPages - 4) pages.push('...');
        pages.push(totalPages);
        return pages;
    }

    const ref = useRef();
    const sortRef = useRef();

    const [query, setQuery] = useState("");

    const handleSearch = (text) => {
        setQuery(text);
        const regionMarket = {
            1: ["CBOE", "NASDAQ", "NYSE", "AMEX", "SET", "SSE", "SZSE"],
            2: ["SET"],
            3: ["CBOE", "NASDAQ", "NYSE", "AMEX"],
            4: ["SSE", "SZSE"],
        };

        const AllStock = localStorage.getItem('AllStock');

        const allStocks = JSON.parse(AllStock); // แปลงเป็น array
        const targetMarkets = regionMarket[regionSelected.id] || [];

        const filteredStocks = allStocks.filter(stock =>
            targetMarkets.includes(stock.stockMarket)
        );
        // setSelected(stockRegion[0])
        if (!text.trim()) {
            setStocks(filteredStocks); // reset เมื่อ query ว่าง
        } else {
            const lower = text.toLowerCase();
            const filtered = filteredStocks.filter( // ✅ ต้องใช้ allStocks
                (s) => s.stockSymbol.toLowerCase().includes(lower) || s.companyName.toLowerCase().includes(lower)
            );
            setStocks(filtered);
        }
        
    };


    return (
        <div className='p-4 text-[1.1rem]'>
            {switchState ? (
                <div className='flex relative flex-col min-h-screen'>
                    <div className='flex items-center gap-2'>
                        <div className='text-4xl text-white font-bold'>หุ้น</div>
                        <CandlestickIcon />
                    </div>

                    <div className="relative w-full max-w-md mt-5">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        {query && (
                            <button
                                onClick={() => handleSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                            >
                                <X size={20} />
                            </button>
                        )}
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="ค้นหา..."
                            className="w-full pl-10 pr-10 py-2 rounded-xl bg-[#2E3241] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className='flex gap-3 my-5'>
                        {stockRegion.map((region) => (
                            <button
                                key={region.id}
                                className={`py-2 px-4 rounded-xl font-medium transition-all text-xl flex items-center gap-2 ${regionSelected.name === region.name
                                    ? 'bg-[#6870fa] text-white'
                                    : 'bg-[#282b35] text-[#bfc3d5] hover:bg-[#393d47]'
                                    }`}
                                onClick={() => setSelected(region)}
                            >
                                {region.flag && (
                                    <img
                                        src={region.flag}
                                        alt={`${region.name} flag`}
                                        className='w-6 h-6 rounded-full object-cover'
                                    />
                                )}
                                {region.name}
                            </button>
                        ))}
                    </div>

                    <div
                        className={`grid grid-cols-5 items-center py-3 px-4 rounded bg-[#65687a] text-white text-lg`}
                    >
                        {sortOptions.map((option) => {
                            const isDisabled = option.id === 4;

                            return (
                                <div
                                    key={option.id}
                                    className={`col-span-1 flex items-center ${option.id === 1 ? 'justify-start pl-10' : 'justify-center'} ${isDisabled ? 'cursor-default text-gray-400' : 'cursor-pointer'}`}
                                    onClick={() => {
                                        if (isDisabled) return;
                                        if (sortSelected.id === option.id) toggleSort();
                                        else {
                                            setSortSelected(option);
                                            setSortDirection('asc');
                                        }
                                    }}
                                >
                                    <div className='text-white'>{option.name}</div>
                                    {!isDisabled && <span className='ml-2'>{getSortSymbol(option.id)}</span>}
                                </div>
                            );
                        })}

                    </div>

                    <div className='divide-y divide-[#282b35] bg-[#23263b]'>
                        {filteredStocks.length === 0 ? (
                            <div className="text-white text-center py-6">ไม่พบข้อมูล</div>
                        ) : (
                            filteredStocks.map((stock, index) => (
                                <div
                                    key={index}
                                    className='grid grid-cols-5 border-b border-[#868686] items-center px-4 hover:bg-slate-700/50 transition-colors cursor-pointer text-lg'
                                    onClick={() => {
                                        setStockDetail(stock)
                                        setSwitchState(false)
                                    }}
                                >
                                    <div className='col-span-1 flex items-center gap-2 font-semibold' style={{ minHeight: '56px' }}>
                                        {stock.logo && (
                                            <img
                                                src={stock.logo}
                                                alt={stock.stockSymbol}
                                                className="w-9 h-9 rounded-full object-cover bg-white border border-[#393d47]"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = `/src/assets/us_logo/${stock.stockSymbol}.png`;
                                                }}
                                            />
                                        )}
                                        <div className='flex flex-col leading-snug text-white'>
                                            <div className="flex gap-1 font-bold text-white">
                                                <div className="text-[#9CA3AF]">{stock.stockMarket}:</div>
                                                {stock.stockSymbol}
                                            </div>
                                            <span className='text-[0.85rem] font-normal text-gray-300'>
                                                {stock.companyName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='col-span-1 font-regular text-white text-center'>
                                        {new Intl.NumberFormat().format(stock.stockPrice)} {stock.currency}
                                    </div>
                                    <div className='col-span-1 flex items-center justify-center'>
                                        {renderStatus(stock.status)}
                                    </div>
                                    <div className='col-span-1 text-white text-center'>{stock.reason}</div>
                                    <div className='col-span-1 flex items-center justify-center text-[#868686] relative'>
                                        <span>{timeAgo(stock.timeStamp)}</span>
                                        <span
                                            className={`absolute right-[18px] top-1/2 -translate-y-1/2 text-4xl cursor-pointer transition ${stock.isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'
                                                }`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleToggleFavorite(stock.stockSymbol)
                                            }}
                                            title={stock.isFavorite ? 'เลิกติดดาว' : 'ติดดาว'}
                                        >
                                            ★
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                    <div className='flex justify-center items-center space-x-2 my-4'>
                        <div
                            onClick={handlePrev}
                            className={`flex items-center gap-1 justify-center px-3 py-1 rounded text-white w-24 ${currentPage === 1
                                ? 'bg-gray-500 text-gray-500 cursor-not-allowed'
                                : 'hover:bg-[#6870FA] cursor-pointer'
                                }`}
                        >
                            <ChevronLeft className='w-4 h-4' />
                            <span>กลับ</span>
                        </div>
                        {getPageNumbers(currentPage, totalPages).map((page, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    if (page !== '...') handlePageClick(page)
                                }}
                                className={`px-2 py-1 rounded text-white cursor-pointer ${page === currentPage
                                    ? 'bg-[#6870FA]'
                                    : page === '...'
                                        ? 'text-gray-400 cursor-default'
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
                            <ChevronRight className='w-4 h-4' />
                        </div>
                    </div>
                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )}
        </div>
    )
}

export default AllStock
