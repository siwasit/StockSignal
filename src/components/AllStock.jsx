import React, { useState, useRef, useEffect } from 'react'
import StockDetail from './StockDetail';
import { FunnelIcon } from '@heroicons/react/24/solid';
import CandlestickIcon from './../assets/CandlestickIcon'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, SortAsc, SortDesc } from 'lucide-react';
import StockBullet from './StockBullet';

function AllStock({ stock, onSwitchChange, stockList, onFavoriteChange }) {
    const stockOptions = [
        { id: 1, name: 'หุ้นทั้งหมด' },
        { id: 2, name: 'หุ้นยอดนิยม' },
    ];

    const sortOptions = [
        { id: 1, name: 'Symbol' },
        { id: 2, name: 'ราคาหุ้น' },
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
            fontWeight: 600,
            fontSize: '1.5rem',
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
    const [selected, setSelected] = useState(stockOptions[0]);
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

    useEffect(() => {
        if (selected.id === 2 && popularStocks.length === 0) {
            const shuffled = [...stocks].sort(() => 0.5 - Math.random());
            setPopularStocks(shuffled.slice(0, 15));
        }
    }, [selected, stocks]);

    useEffect(() => {
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
            if (sortSelected.id === 4) {
                return (b.isFavorite === true) - (a.isFavorite === true);
            }
            return 0;
        });

        setAllStocks(sortedStocks);
        setStocks(sortedStocks);

        const updatedFavorites = updatedStocks.filter(s => s.isFavorite);
        onFavoriteChange(updatedFavorites);
    };

    useEffect(() => {
        const favoriteOnly = allStocks.filter(s => s.isFavorite);
        localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));
        localStorage.setItem('AllStock', JSON.stringify(allStocks));
    }, [allStocks]);

    const stocksPerPage = 50;
    const totalPages = Math.ceil(stocks.length / stocksPerPage);

    const filteredStocks = (() => {
        let result = selected.id === 2 ?
            stocks.filter(stock => popularStocks.some(p => p.stockSymbol === stock.stockSymbol))
            : stocks;

        const start = (currentPage - 1) * stocksPerPage;
        const end = start + stocksPerPage;
        return result.slice(start, end);
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



    return (
        <div className='p-4 text-[1.1rem]'>
            {switchState ? (
                <div className='flex relative flex-col min-h-screen'>
                    <div className='flex items-center gap-2 mb-5'>
                        <div className='text-4xl text-white font-bold'>หุ้น</div>
                        <CandlestickIcon />
                    </div>

                    <div className='flex gap-3 mb-10'>
                        {['หุ้นทั้งหมด', 'หุ้นไทย', 'หุ้นสหรัฐ', 'หุ้นจีน'].map((name, idx) => (
                            <button
                                key={idx}
                                className={`px-10 py-2 rounded font-medium transition-all text-xl ${selected.name === name
                                    ? 'bg-[#6870fa] text-white'
                                    : 'bg-[#282b35] text-[#bfc3d5] hover:bg-[#393d47]'
                                    }`}
                                onClick={() => setSelected({ id: idx + 1, name })}
                            >
                                {name}
                            </button>
                        ))}
                    </div>

                    <div
                        className={`grid grid-cols-5 items-center py-2 px-4 rounded-t bg-[#65687a] border-b-2 border-b-[#2096F3] text-white text-2xl font-semibold`}
                    >
                        {sortOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`col-span-1 flex items-center cursor-pointer ${option.id === 1 ? 'justify-start pl-2' : 'justify-center'
                                    }`}
                                onClick={() => {
                                    if (sortSelected.id === option.id) toggleSort()
                                    else {
                                        setSortSelected(option)
                                        setSortDirection('asc')
                                    }
                                }}
                            >
                                {option.name}
                                <span className='ml-2'>{getSortSymbol(option.id)}</span>
                            </div>
                        ))}
                    </div>

                    <div className='divide-y divide-[#282b35] bg-[#23263b] rounded-b'>
                        {filteredStocks.map((stock, index) => (
                            <div
                                key={index}
                                className='grid grid-cols-5 items-center px-4 py-4 hover:bg-[#282b35] transition-colors cursor-pointer text-lg'
                                onClick={() => {
                                    setStockDetail(stock)
                                    setSwitchState(false)
                                }}
                            >
                                <div className='col-span-1 flex items-start gap-2 font-semibold' style={{ minHeight: '56px' }}>
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
                                        <span className='font-bold'>{stock.stockSymbol}</span>
                                        <span className='text-[0.85rem] font-normal text-gray-300'>
                                            {stock.companyName}
                                        </span>
                                    </div>
                                </div>
                                <div className='col-span-1 font-medium text-white text-center'>
                                    {stock.stockPrice}  {stock.currency}
                                </div>
                                <div className='col-span-1 flex items-center justify-center'>
                                    {renderStatus(stock.status)}
                                </div>
                                <div className='col-span-1 text-white text-center'>{stock.reason}</div>
                                <div className='col-span-1 flex items-center justify-center text-white relative'>
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
                        ))}
                    </div>

                    {selected.id !== 2 && (
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
                    )}
                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )}
        </div>
    )
}

export default AllStock
