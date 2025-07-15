import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronUpIcon, ChevronDownIcon, History, Search, LineChart } from 'lucide-react'; // optional icon set
import { HomeIcon, BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import StockSignal from '../components/StockSignal';
import AllStock from '../components/AllStock';
import StockDetail from '../components/StockDetail';
import Setting from '../components/Setting';

function Dashboard() {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef(null);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [switchState, setSwitchState] = useState(true);
    const [stockDetail, setStockDetail] = useState('null');
    const [detailKey, setDetailKey] = useState(0);

    const [expanded, setExpanded] = useState(false);

    const stockList = [
        {
            stockSymbol: 'PTT',
            companyName: 'PTT Public Company Limited',
            status: 'Buy',
            reason: 'ราคา Break EMA20 + ปริมาณซื้อเพิ่มสูง',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:30',
            isFavorite: true,
            changePct: 1.5, // Example percentage change
        },
        {
            stockSymbol: 'CPALL',
            companyName: 'CP All Public Company Limited',
            status: 'Hold',
            reason: 'ราคาแกว่งตัวในกรอบ ยังไม่ชัดเจน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:15',
            isFavorite: true,
            changePct: 0.3, // Example percentage change
        },
        {
            stockSymbol: 'AOT',
            companyName: 'Airports of Thailand Public Company Limited',
            status: 'Sell',
            reason: 'มีแรงขายต่อเนื่องและต่ำกว่า EMA20',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:45',
            isFavorite: true,
            changePct: -0.5, // Example percentage change
        },
        {
            stockSymbol: 'SCB',
            companyName: 'The Siam Commercial Bank Public Company Limited',
            status: 'Buy',
            reason: 'สัญญาณ MACD ตัดขึ้นเหนือเส้นศูนย์',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 13:50',
            isFavorite: true,
            changePct: 1.2, // Example percentage change
        },
        {
            stockSymbol: 'ADVANC',
            companyName: 'Advanced Info Service Public Company Limited',
            status: 'Hold',
            reason: 'ยังไม่มีแนวโน้มที่ชัดเจนจาก RSI',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:20',
            isFavorite: true,
            changePct: 0.8, // Example percentage change
        },
        {
            stockSymbol: 'GULF',
            companyName: 'Gulf Energy Development Public Company Limited',
            status: 'Sell',
            reason: 'ราคาลงต่อเนื่องหลายวันติดต่อกัน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:10',
            isFavorite: true,
            changePct: -1.5, // Example percentage change
        },
        {
            stockSymbol: 'BBL',
            companyName: 'Bangkok Bank Public Company Limited',
            status: 'Buy',
            reason: 'เกิด Golden Cross บนกราฟรายวัน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:40',
            isFavorite: true,
            changePct: 0.5, // Example percentage change
        },
        {
            stockSymbol: 'DELTA',
            companyName: 'Delta Electronics (Thailand) Public Company Limited',
            status: 'Hold',
            reason: 'Sideway แคบ รอเบรกแนวต้าน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:35',
            isFavorite: true,
            changePct: 1.2, // Example percentage change
        },
        {
            stockSymbol: 'TRUE',
            companyName: 'True Corporation Public Company Limited',
            status: 'Sell',
            reason: 'มีแรงขายสูง RSI ต่ำกว่า 30',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:00',
            isFavorite: true,
            changePct: -2.5, // Example percentage change
        },
    ]

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredStocks = stockList.filter((stock) =>
        stock.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (stock) => {
        setStockDetail(stock);
        setSwitchState(false);           // <- ส่ง false
        setSignalKey(prev => (prev === 0 ? 1 : 0));
        setShowDropdown(false);
    };

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                const contentHeight = containerRef.current.scrollHeight;
                const screenHeight = window.innerHeight;
                const overflowing = contentHeight > screenHeight;

                setIsOverflowing(overflowing);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [activeMenu]);


    const [signalKey, setSignalKey] = useState(0);

    return (
        <div
            ref={containerRef}
            className={`bg-[#202431] min-h-screen ${isOverflowing ? 'min-w-[99vw]' : 'w-[100vw]'
                }`}
        >
            {/* Sidebar */}
            <div
                className={`fixed top-4 left-4 bg-[#2E3343] min-h-[96vh] rounded-xl text-white
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-20' : 'w-64'}
                `}
            >
                <div className={`flex items-start ${collapsed ? 'justify-center' : 'justify-between'} p-4`}>
                    <span className={`${collapsed && 'hidden'}`}>
                        <img src="/images/logo.png" alt="Logo" className="h-20" />
                    </span>
                    <div onClick={() => setCollapsed(!collapsed)} className="cursor-pointer hover:bg-gray-700 rounded-full transition-colors">
                        {collapsed ? (
                            <ChevronRight size={30} className="text-white" />
                        ) : (
                            <ChevronLeft size={30} className="text-white" />
                        )}
                    </div>

                </div>

                {/* <hr className={`border-[#868686] ${collapsed ? 'hidden' : 'block'} w-3/4 mx-auto`} /> */}

                {!collapsed && <div className='px-4 mt-4 mb-1 text-sm text-[#868686]'>MAIN MENU</div>}
                <nav className={`space-y-3 px-4 text-white ${collapsed ? 'mt-4' : ''}`}>
                    <div
                        onClick={() => {
                            setActiveMenu('dashboard');
                            setSwitchState(true);
                            setSignalKey(prev => (prev === 0 ? 1 : 0));
                        }}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'dashboard' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <HomeIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">My Watchlist</span>}
                    </div>
                    <div
                        onClick={() => {
                            setActiveMenu('stock');
                            setSwitchState(true);
                            setSignalKey(prev => (prev === 0 ? 1 : 0));
                        }}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'stock' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <LineChart size={25} />
                        {!collapsed && <span className="text-lg text-white">หุ้น</span>}
                    </div>
                    {/* <div
                        onClick={() => setActiveMenu('history')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'history' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <History size={25} className="text-white" />
                        {!collapsed && <span className="text-lg text-white">ประวัติสัญญาณ</span>}
                    </div> */}
                </nav>



                {!collapsed && <div className='px-4 mt-8 mb-1 text-sm text-[#868686]'>PREFERENCES</div>}
                <nav className={`space-y-3 px-4 text-white ${collapsed ? 'mt-4' : ''}`}>
                    {/* <div
                        onClick={() => setActiveMenu('notification')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'notification' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <BellIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">การแจ้งเตือน</span>}
                    </div> */}

                    <div
                        onClick={() => setActiveMenu('setting')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'setting' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <Cog6ToothIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">การตั้งค่า</span>}
                    </div>
                </nav>

                <hr className={`border-[#868686] my-2 ${collapsed ? 'hidden' : 'block'} w-4/5 mx-auto`} />

                {!collapsed &&
                    <div className="px-4 mt-8">
                        {/* Header with arrow */}
                        <div
                            className="flex items-center space-x-4 cursor-pointer select-none"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <ChevronUpIcon className="w-5 h-5 text-[#868686]" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-[#868686]" />
                            )}
                            <div className="text-sm text-[#868686] font-semibold">WATCHLIST</div>
                        </div>

                        {/* Content, toggle visibility */}
                        <div
                            className={`transition-all duration-200 transform origin-top
                                ${expanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}
                            `}
                        >
                            <nav className="mt-3 text-white max-h-65 overflow-y-auto">
                                {stockList.map((stock, index) => (
                                    <div key={index} className="flex items-center p-2 justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className={`w-6 h-6 rounded-full ${stock.status === 'Buy'
                                                    ? 'bg-[#41DC8E]'
                                                    : stock.status === 'Sell'
                                                        ? 'bg-[#FF8282]'
                                                        : 'bg-[#E0B469]'
                                                    }`}
                                            ></div>
                                            <span className="text-lg text-white">{stock.stockSymbol}</span>
                                        </div>
                                        <div
                                            className={`${stock.status === 'Buy'
                                                ? 'text-[#41DC8E]'
                                                : stock.status === 'Sell'
                                                    ? 'text-[#FF8282]'
                                                    : 'text-[#E0B469]'
                                                }`}
                                        >
                                            {stock.changePct > 0 ? '+' : ''}
                                            {stock.changePct}%
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>

                    </div>
                }
            </div>

            {/* Content */}
            <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-24' : 'ml-68'}`}>
                {/* border-b-1 w-[98%] border-[#868686] mb-4 mx-auto */}
                <header className="sticky top-0 z-50 flex flex-col items-center justify-between px-4 py-4 bg-[#1F2230] text-white shadow-md">
                    <div className='flex items-center justify-between w-full'>
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="ค้นหาหุ้น"
                                className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#5D6275] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41DC8E]"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {showDropdown && filteredStocks.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-[#2E3343] border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {filteredStocks.map((stock, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer hover:bg-[#3E4355] text-white"
                                            onClick={() => handleSelect(stock)}
                                        >
                                            {stock.stockSymbol}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div>Jonanathan Wong</div>
                                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='w-full mx-auto border-b-1 mt-4 border-[#868686]' />
                </header>

                {activeMenu === 'dashboard' && (
                    <StockSignal
                        key={signalKey}
                        onSwitchChange={switchState}
                        stock={stockDetail}
                    />
                )}

                {activeMenu === 'stock' && (
                    <AllStock
                        key={signalKey}
                        onSwitchChange={switchState}
                        stock={stockDetail}
                    />
                )}

                {activeMenu === 'setting' && (
                    <Setting />
                )}
            </div>
        </div>
    )
}

export default Dashboard
