import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function Notification() {
  const [lineNotiEnabled, setLineNotiEnabled] = useState(false);
  const [isFavoriteEnabled, setIsFavoriteEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('All');
  const options = ['All', 'Buy', 'Hold', 'Sell'];

  return (
    <div className='flex flex-col'>
      <div className='text-2xl text-white mb-4 font-semibold'>การแจ้งเตือน</div>
      <div className="rounded-xl bg-black/10 space-y-10 border-2 border-[#868686] shadow-md p-4 w-full">

        <div className="flex items-center w-full space-x-4">
          {/* Line Logo */}
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <img src="/images/LINE_logo.png" alt="Line Logo" className="object-contain" />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-lg font-medium text-white">
              เปิดการแจ้งเตือน Line
            </p>
            <p className="text-sm text-[#868686]">
              แจ้งเตือนผ่านไลน์ Notify
            </p>
          </div>

          {/* Toggle Switch */}
          <div>
            <div
              onClick={() => setLineNotiEnabled(!lineNotiEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${lineNotiEnabled ? 'bg-[#6870FA]' : 'border-2 border-[#868686]'
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full transition ${lineNotiEnabled ? 'translate-x-6 bg-black' : 'bg-[#868686] translate-x-1'
                  }`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center w-full space-x-4">

          {/* Text */}
          <div className="flex-1">
            <p className="text-lg font-medium text-white">
              เปิดแจ้งเตือนเฉพาะหุ้นที่ติดตาม
            </p>
            <p className="text-sm text-[#868686]">
              แจ้งเตือนเฉพาะหุ้นที่อยู่ใน Watchlist เท่านั้น
            </p>
          </div>

          {/* Toggle Switch */}
          <div>
            <div
              onClick={() => setIsFavoriteEnabled(!isFavoriteEnabled)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${isFavoriteEnabled ? 'bg-[#6870FA]' : 'border-2 border-[#868686]'
                }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full transition ${isFavoriteEnabled ? 'translate-x-6 bg-black' : 'bg-[#868686] translate-x-1'
                  }`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center w-full space-x-4">
          <div className="flex-1">
            <p className="text-lg font-medium text-white">
              เปิดแจ้งเตือนสัญญาณที่กำหนด
            </p>
            <p className="text-sm text-[#868686]">
              แจ้งเตือนเฉพาะสัญญาณที่เลือก เช่น Buy Hold
            </p>
          </div>

          <div className="relative">
            {/* Button */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between cursor-pointer text-white px-4 py-2 rounded-md border border-gray-600 w-32"
            >
              {selected}

              {open ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </div>

            {/* Dropdown Menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-32 bg-[#1f2937] rounded-md shadow-lg border border-gray-700 z-10">
                {options.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelected(option);
                      setOpen(false);
                    }}
                    className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center w-full space-x-4">
          <div className="flex-1">
            <p className="text-lg font-medium text-white">
              เปิดแจ้งเตือนเมื่อราคาเปลี่ยนแปลง
            </p>
            <p className="text-sm text-[#868686]">
              แจ้งเตือนหุ้นเมื่อราคาเปลี่ยนแปลง % เท่ากับ หรือมากกว่าที่กำหนด
            </p>
          </div>

          {/* Input + % */}
          <div className="w-32 relative">
            <input
              type="number"
              placeholder="0"
              className="w-full bg-[#1f2937] border border-gray-600 text-white rounded-md pl-3 pr-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute top-0 right-8 h-full flex items-center text-white pointer-events-none">
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notification
