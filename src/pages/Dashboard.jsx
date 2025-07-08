import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronUpIcon, ChevronDownIcon, History, Search, LineChart } from 'lucide-react'; // optional icon set
import { HomeIcon, BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import StockSignal from '../components/StockSignal';

function Dashboard() {

    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    const [expanded, setExpanded] = useState(false);

    return (
        <div className='min-w-screen bg-[#202431] min-h-screen flex'>
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
                        onClick={() => setActiveMenu('dashboard')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'dashboard' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <HomeIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-xl text-white">Dashboard</span>}
                    </div>
                    {/* <div className="flex items-center space-x-3">
                        <LineChart size={25} />
                        {!collapsed && <span className='text-xl'>หุ้น</span>}
                    </div> */}
                    <div
                        onClick={() => setActiveMenu('stock')}
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
                    <div
                        onClick={() => setActiveMenu('notification')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'notification' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <BellIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">การแจ้งเตือน</span>}
                    </div>

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
                            <nav className="mt-3 text-white h-50 overflow-y-auto">
                                <div className="flex items-center p-2 justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-[#41DC8E]"></div>
                                        <span className="text-lg text-white">GULF</span>
                                    </div>
                                    <div className="text-[#41DC8E]">1.0%</div>
                                </div>
                                <div className="flex items-center p-2 justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-[#41DC8E]"></div>
                                        <span className="text-lg text-white">CPALL</span>
                                    </div>
                                    <div className="text-[#41DC8E]">1.0%</div>
                                </div>
                                <div className="flex items-center p-2 justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF8282]"></div>
                                        <span className="text-lg text-white">PTTEP</span>
                                    </div>
                                    <div className="text-[#FF8282]">-1.0%</div>
                                </div>
                                <div className="flex items-center p-2 justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF8282]"></div>
                                        <span className="text-lg text-white">PTTEP</span>
                                    </div>
                                    <div className="text-[#FF8282]">-1.0%</div>
                                </div>
                                <div className="flex items-center p-2 justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-[#FF8282]"></div>
                                        <span className="text-lg text-white">PTTEP</span>
                                    </div>
                                    <div className="text-[#FF8282]">-1.0%</div>
                                </div>
                            </nav>
                        </div>

                    </div>
                }
            </div>

            {/* Content */}
            <div className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-24' : 'ml-68'}`}>
                <header className="flex items-center justify-between px-4 py-4 text-white">

                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="ค้นหาหุ้น"
                            className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#5D6275] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41DC8E]"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className='flex items-center gap-6'>
                        {/* <div className="ml-4 px-4 py-2 bg-[#6870FA] text-white rounded-lg cursor-pointer hover:bg-[#5D62F9] transition-colors">
                            สมัคร Package
                        </div> */}

                        <div className="flex items-center gap-2">
                            <div>Jonanathan Wong</div>
                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>


                </header>

                <hr className='border-b-1 w-[98%] border-[#868686] mb-4 mx-auto'/>

                <StockSignal />
                {/* <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
                <p className=''>This is the dashboard page.</p>
                <p className=''>You can add your content here.</p> */}
            </div>
        </div>
    )
}

export default Dashboard
