import React from 'react'

function Privacy() {
    return (
        <div className='flex flex-col'>
            <div className='text-2xl text-white mb-4 font-semibold'>การแจ้งเตือน</div>
            <div className="rounded-xl bg-black/10 space-y-10 border-2 border-[#868686] shadow-md p-4 w-full">
                <div className="flex items-center w-full space-x-4">
                    {/* Line Logo */}

                    {/* Text */}
                    <div className="flex-1">
                        <p className="text-lg font-medium text-white">
                            ลบบัญชี
                        </p>
                        <p className="text-sm text-[#868686]">
                            ลบข้อมูลและบัญชีทั้งหมด
                        </p>
                    </div>

                    <div className='border border-[#FF8282] text-[#FF8282] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-[#FF8282]/20'>
                        ลบบัญชี
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Privacy
