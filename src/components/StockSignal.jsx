import React, { useState, useEffect, useRef } from 'react'
import { TrendingUp, ChevronUp, Triangle, ChevronDown, Equal, SortAsc, SortDesc } from 'lucide-react'; // หรือไอคอนอื่นตามต้องการ
import StockCard from './StockCard';
import StockDetail from './StockDetail';
import 'animate.css';

function StockSignal({ onSwitchChange, stock, stockList, onFavoriteChange }) {
    // console.log("StockSignal component rendered with stock:", stock);

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
        { id: 1, name: 'Symbol' },
        { id: 2, name: 'Signal' },
        { id: 3, name: 'อัพเดทล่าสุด' },
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

    // const [sortedStock, setSortedStock] = useState(stockList);
    const [sortedStock, setSortedStock] = useState(() => {
        // โหลดจาก localStorage ถ้ามี ไม่งั้นเป็น array ว่าง
        const saved = localStorage.getItem('FavoriteStocks');
        return saved ? JSON.parse(saved) : [];
    });

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
        const sorted = [...sortedStock].sort((a, b) => {
            let compareValue = 0;

            switch (sortSelected.id) {
                case 1: // companyName
                    compareValue = a.stockSymbol.localeCompare(b.stockSymbol);
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

    const handleToggleFavorite = (symbol) => {
        setSortedStock(prevStocks => {
            // ลบหุ้นที่ติ๊กดาวออกจาก favorite
            const updatedFavoriteStocks = prevStocks.filter(s => s.stockSymbol !== symbol);

            // อัปเดต localStorage ของ FavoriteStocks
            localStorage.setItem('FavoriteStocks', JSON.stringify(updatedFavoriteStocks));

            // อัปเดต localStorage ของ SET50Stocks
            const set50StocksRaw = localStorage.getItem('SET50Stocks');
            if (set50StocksRaw) {
                try {
                    const set50Stocks = JSON.parse(set50StocksRaw);

                    // อัปเดต isFavorite ของ SET50Stocks ให้ตรงกับ favorite จริงๆ
                    const updatedSet50Stocks = set50Stocks.map(stock => ({
                        ...stock,
                        isFavorite: updatedFavoriteStocks.some(fav => fav.stockSymbol === stock.stockSymbol),
                        favoriteAt: updatedFavoriteStocks.find(fav => fav.stockSymbol === stock.stockSymbol)?.favoriteAt || null
                    }));

                    localStorage.setItem('SET50Stocks', JSON.stringify(updatedSet50Stocks));
                } catch (e) {
                    console.error('Failed to parse SET50Stocks from localStorage', e);
                }
            }

            // ✅ แจ้ง parent ว่า favorite stocks ถูกอัปเดตแล้ว
            onFavoriteChange(updatedFavoriteStocks);

            // ✅ return ค่าใหม่ให้ state (React UI จะ render ใหม่)
            return updatedFavoriteStocks;
        });
    };



    // useEffect ซิงก์ FavoriteStocks ใน localStorage ทุกครั้งที่ stocks เปลี่ยน
    // useEffect(() => {
    //     // 1️⃣ ดึง SET50Stocks เดิมออกมา
    //     const storedStocks = JSON.parse(localStorage.getItem('SET50Stocks')) || [];

    //     // 2️⃣ อัปเดตหุ้นตามสถานะใน sortedStock
    //     const updatedStocks = storedStocks.map(existingStock => {
    //         const updated = sortedStock.find(s => s.stockSymbol === existingStock.stockSymbol);

    //         if (updated) {
    //             // เปรียบเทียบเฉพาะ isFavorite (หรือ field อื่น ๆ ตามต้องการ)
    //             if (existingStock.isFavorite !== updated.isFavorite) {
    //                 return {
    //                     ...existingStock,
    //                     isFavorite: updated.isFavorite,
    //                     favoriteAt: updated.favoriteAt  // ถ้ามี
    //                 };
    //             }
    //         }

    //         return existingStock;
    //     });

    //     // 3️⃣ บันทึก stocks ที่อัปเดตแล้วกลับเข้า localStorage
    //     localStorage.setItem('SET50Stocks', JSON.stringify(updatedStocks));

    //     // 4️⃣ สร้าง FavoriteStocks ใหม่จาก updatedStocks
    //     // const favoriteOnly = updatedStocks.filter(s => s.isFavorite);
    //     // localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));

    // }, [sortedStock]);


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
                                {/* <div className="relative w-60" ref={ref}>
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
                                </div> */}

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
                                    <div key={index} className="">
                                        <StockCard
                                            // stockSymbol={stock.stockSymbol}
                                            // price={stock.stockPrice}
                                            // status={stock.status}
                                            // reason={stock.reason}
                                            // timeStamp={`อัปเดตล่าสุด: ${new Date(stock.timeStamp).toLocaleString('en-US', {
                                            //     day: '2-digit',
                                            //     month: '2-digit',
                                            //     year: 'numeric',
                                            //     hour: '2-digit',
                                            //     minute: '2-digit',
                                            //     hour12: true,
                                            // })}`}
                                            // isFavorite={stock.isFavorite}
                                            stock={stock}
                                            onToggleFavorite={() => handleToggleFavorite(stock.stockSymbol)}
                                            onClick={() => {
                                                setSwitchState(!switchState);
                                                setStockDetail(stock);
                                            }}
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
