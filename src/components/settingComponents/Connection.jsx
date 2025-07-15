import React from 'react'

function Connection() {
    return (
        <div className='flex flex-col'>
            <div className='text-2xl text-white mb-4 font-semibold'>การเชื่อมต่อ</div>
            <div className="rounded-xl bg-black/10 space-y-10 border-2 border-[#868686] shadow-md p-4 w-full">
                <div className="flex items-center w-full space-x-4">
                    {/* Line Logo */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                        <img src="/images/LINE_logo.png" alt="Line Logo" className="object-contain" />
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-regular text-white">
                            Line Notify                        
                        </p>
                    </div>

                    <div className='border border-[#F4F3F2] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-gray-500'>
                        เชื่อมต่อ
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Connection
