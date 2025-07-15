import React, { useState } from 'react'
import { Search, Bell, Link2, Star, Monitor, Shield, User } from 'lucide-react';

function Setting() {
    const [activeMenu, setActiveMenu] = useState('notification');
    const menuItems = [
        { id: 'notification', label: 'การแจ้งเตือน', icon: Bell },
        { id: 'connection', label: 'การเชื่อมต่อ', icon: Link2 },
        { id: 'watchlist', label: 'Watchlist', icon: Star },
        { id: 'display', label: 'การแสดงผล', icon: Monitor },
        { id: 'privacy', label: 'ความเป็นส่วนตัว', icon: Shield },
        { id: 'account', label: 'ตั้งค่าบัญชี', icon: User },
    ];

    return (
        // <div className='px-4 w-full'>
            <div className='px-4 flex w-full flex-col p-4'>

                {/* หัวข้อ */}
                <div className="text-white w-full text-3xl my-4 font-semibold">การตั้งค่า</div>

                {/* Search Bar */}
                <div className="relative mb-3 max-w-xs">
                    <input
                        type="text"
                        placeholder="ค้นหา..."
                        className="w-full bg-[#2C2F38] text-white rounded-lg py-3 px-4 pr-10 placeholder-gray-400 focus:outline-none focus:ring focus:ring-[#6870FA]"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* เนื้อหาแบบ Sidebar + Content */}
                <div className='flex w-full items-start'>

                    {/* Sidebar */}
                    <ul className="space-y-1 w-xs text-white w-52 shrink-0">
                        {menuItems.map(({ id, label, icon: Icon }) => (
                            <li
                                key={id}
                                onClick={() => setActiveMenu(id)}
                                className={`flex items-center gap-2 p-3 text-lg rounded-lg cursor-pointer transition-colors
                                    ${activeMenu === id
                                        ? 'bg-[#6870FA] text-white'
                                        : 'hover:bg-[#6870FA]/50'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${activeMenu === id ? 'text-white' : 'text-white/80'}`} />
                                {label}
                            </li>
                        ))}
                    </ul>

                    {/* Content ใช้ flex-1 */}
                    <div className='flex-1 ml-4 bg-[#2C2F38] rounded-lg p-4 min-h-[300px] text-white'>
                        {activeMenu === 'notification' && <div>{activeMenu}</div>}
                        {activeMenu === 'connection' && <div>{activeMenu}</div>}
                        {activeMenu === 'watchlist' && <div>{activeMenu}</div>}
                        {activeMenu === 'display' && <div>{activeMenu}</div>}
                        {activeMenu === 'privacy' && <div>{activeMenu}</div>}
                        {activeMenu === 'account' && <div>{activeMenu}</div>}
                    </div>

                </div>

            </div>
        // </div>

    )
}

export default Setting
