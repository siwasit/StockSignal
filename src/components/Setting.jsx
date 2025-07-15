import React, { useState } from 'react'
import { Search, Bell, Link2, Star, Monitor, Shield, User } from 'lucide-react';
import Notification from './settingComponents/Notification';
import Connection from './settingComponents/Connection';
import Privacy from './settingComponents/Privacy';
import Account from './settingComponents/Account';
import StockDetail from './StockDetail';

function Setting({ onSwitchChange, stock }) {
    const [activeMenu, setActiveMenu] = useState('notification');
    const [switchState, setSwitchState] = useState(onSwitchChange);
    const [stockDetail, setStockDetail] = useState(stock);
    const menuItems = [
        { id: 'notification', label: 'การแจ้งเตือน', icon: Bell },
        { id: 'connection', label: 'การเชื่อมต่อ', icon: Link2 },
        // { id: 'watchlist', label: 'Watchlist', icon: Star },
        // { id: 'display', label: 'การแสดงผล', icon: Monitor },
        { id: 'privacy', label: 'ความเป็นส่วนตัว', icon: Shield },
        { id: 'account', label: 'ตั้งค่าบัญชี', icon: User },
    ];

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const settingStructure = [
        { id: 'notification', detail: ['เปิดการแจ้งเตือน Line', 'เปิดแจ้งเตือนเฉพาะหุ้นที่ติดตาม', 'เปิดแจ้งเตือนสัญญาณที่กำหนด', 'เปิดแจ้งเตือนเมื่อราคาเปลี่ยนแปลง'] },
        { id: 'connection', detail: ['Line Notify'] },
        // { id: 'display', detail: ['None'] },
        { id: 'privacy', detail: ['ลบบัญชี'] },
        { id: 'account', detail: ['ตั้งค่าบัญชี', 'เปลี่ยนรหัสผ่าน', 'เปลี่ยนอีเมล', 'Export ข้อมูล', 'ออกจากระบบ'] },
    ];

    const handleSearch = (text) => {
        setSearch(text);

        if (!text) {
            setResults([]);
            return;
        }

        // ค้นหาใน detail
        const matches = [];
        settingStructure.forEach((section) => {
            section.detail.forEach((item) => {
                if (item.toLowerCase().includes(text.toLowerCase())) {
                    matches.push({ text: item, sectionId: section.id });
                }
            });
        });

        setResults(matches);
    };

    const handleSelect = (item) => {
        setSelectedId(item.sectionId);
        setSearch('');
        setResults([]);
        // console.log('Selected Section ID:', item.sectionId);
        setActiveMenu(item.sectionId)
    };

    return (
        // <div className='px-4 w-full'>
        <div className='px-4 '>
            {switchState ? (
                <div className='flex w-full flex-col py-4'>

                    {/* หัวข้อ */}
                    <div className="text-white w-full text-3xl my-4 font-semibold">การตั้งค่า</div>

                    {/* Search Bar */}
                    <div className='flex w-full'>
                        <div className='flex flex-col'>
                            <div className="flex flex-col relative w-full max-w-xs">
                                <div className="relative mb-3">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder="ค้นหา..."
                                        className="w-full bg-[#2C2F38] text-white rounded-lg py-3 px-4 pr-10 placeholder-gray-400 focus:outline-none focus:ring focus:ring-[#6870FA]"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                                </div>

                                {/* Autocomplete List */}
                                {results.length > 0 && (
                                    <div className="absolute top-full mt-1 w-full bg-[#2C2F38] border border-gray-700 rounded-lg z-10">
                                        {results.map((item) => (
                                            <div
                                                key={item.text}
                                                onClick={() => handleSelect(item)}
                                                className="px-4 py-2 text-white hover:bg-[#3A3D48] cursor-pointer"
                                            >
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                )}
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

                            </div>
                        </div>

                        <div className='flex-1 ml-4 rounded-lg px-4  text-white'>
                            {activeMenu === 'notification' && <Notification />}
                            {activeMenu === 'connection' && <Connection />}
                            {/* {activeMenu === 'watchlist' && <div>{activeMenu}</div>} */}
                            {/* {activeMenu === 'display' && <div>{activeMenu}</div>} */}
                            {activeMenu === 'privacy' && <Privacy />}
                            {activeMenu === 'account' && <Account />}
                        </div>
                    </div>

                </div>
            ) : (
                <StockDetail stock={stockDetail} />
            )}
        </div>

        // </div>
        // 

    )
}

export default Setting
