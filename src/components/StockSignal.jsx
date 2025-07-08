import React from 'react'
import { TrendingUp, ChevronUp, Triangle, ChevronDown, Equal } from 'lucide-react'; // หรือไอคอนอื่นตามต้องการ
import StockCard from './StockCard';

function StockSignal() {

    const stockList = [
        {
            stockSymbol: 'PTT',
            status: 'Buy',
            reason: 'ราคา Break EMA20 + ปริมาณซื้อเพิ่มสูง',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:30',
            isFavorite: true,
        },
        {
            stockSymbol: 'CPALL',
            status: 'Hold',
            reason: 'ราคาแกว่งตัวในกรอบ ยังไม่ชัดเจน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:15',
            isFavorite: true,
        },
        {
            stockSymbol: 'AOT',
            status: 'Sell',
            reason: 'มีแรงขายต่อเนื่องและต่ำกว่า EMA20',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:45',
            isFavorite: true,
        },
        {
            stockSymbol: 'SCB',
            status: 'Buy',
            reason: 'สัญญาณ MACD ตัดขึ้นเหนือเส้นศูนย์',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 13:50',
            isFavorite: true,
        },
        {
            stockSymbol: 'ADVANC',
            status: 'Hold',
            reason: 'ยังไม่มีแนวโน้มที่ชัดเจนจาก RSI',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:20',
            isFavorite: true,
        },
        {
            stockSymbol: 'GULF',
            status: 'Sell',
            reason: 'ราคาลงต่อเนื่องหลายวันติดต่อกัน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:10',
            isFavorite: true,
        },
        {
            stockSymbol: 'BBL',
            status: 'Buy',
            reason: 'เกิด Golden Cross บนกราฟรายวัน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:40',
            isFavorite: true,
        },
        {
            stockSymbol: 'DELTA',
            status: 'Hold',
            reason: 'Sideway แคบ รอเบรกแนวต้าน',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:35',
            isFavorite: false,
        },
        {
            stockSymbol: 'TRUE',
            status: 'Sell',
            reason: 'มีแรงขายสูง RSI ต่ำกว่า 30',
            timeStamp: 'อัปเดตล่าสุด: 2025-07-08 14:00',
            isFavorite: true,
        },
    ];

    return (
        <div className='py-2 px-4'>
            <div className='flex flex-col'>
                <div className="flex items-center gap-6">
                    <div className="text-white text-3xl font-semibold">ภาพรวมสัญญาณล่าสุด</div>
                    <TrendingUp className="w-10 h-10 text-white" />
                    <div className="text-[#8C8F99] text-md self-end ml-[-1rem]">(อัปเดตล่าสุด: 14:25)</div>
                </div>

                <div className="flex gap-4 text-white my-3">
                    {/* Buy */}
                    <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-[#41DC8E]"></div>
                        <div className="font-bold">10</div>
                        <div className="text-md">Buy</div>
                    </div>

                    {/* Hold */}
                    <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                        <Equal className="w-6 h-6 text-yellow-400" />
                        <div className="font-bold">8</div>
                        <div className="text-md">Hold</div>
                    </div>

                    {/* Sell */}
                    <div className="flex bg-[#5D6275] p-2 rounded-xl items-center gap-2">
                        <div className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-transparent border-t-[#FF8282]"></div>
                        <div className="font-bold">10</div>
                        <div className="text-md">Sell</div>
                    </div>
                </div>

                <div className='flex flex-col mt-6'>
                    <div className='flex items-center gap-4'>
                        <div className="text-white text-3xl font-semibold pb-1">หุ้นที่ติดตาม</div>
                        <img src="/icon/watchlist.svg" alt="Watchlist" className="w-8 h-8" />
                    </div>
                    <div
                        className={`overflow-x-auto mt-2 px-4`}
                        style={{ scrollbarWidth: 'thin' }}
                    >


                    </div>

                    <div className="overflow-y-auto max-h-110">
                        <div className="grid grid-cols-1 my-1 md:grid-cols-3 gap-4 mt-2">
                            {stockList.map((stock, index) => (
                                <StockCard key={index} {...stock} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default StockSignal
