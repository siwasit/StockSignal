import React from 'react'
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

function Footer() {
    const navigate = useNavigate();
    return (
        <footer className='bg-[#202431]'>
            <div className='flex justify-evenly h-3/4'>
                <div className='w-xs flex flex-col h-full  justify-center'>
                    <img src="/images/logo.png" className='mb-4' width={200} height={200} alt="logo" />
                    <p className='text-[#CDCDCD] text-lg leading-tight '>
                        Pi Securities Public Company Limited<br />
                        บริษัทหลักทรัพย์ พาย จำกัด (มหาชน)
                    </p>
                </div>
                <div className='w-xs flex flex-col pt-8'>
                    <div className='text-white text-3xl my-4 font-bold'>Pages</div>
                    <div className='flex space-y-4 flex-col'>
                        <button onClick={() => {
                            navigate('/');
                            window.scrollTo(0, 0);
                        }} className="text-[#CDCDCD] text-left text-lg relative cursor-pointer 
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#007A4D] after:transition-all after:duration-300 hover:after:w-30">
                            หน้าหลัก
                        </button>

                        <button onClick={() => {
                            navigate('/Dashboard')
                            window.scrollTo(0, 0);
                        }} className="text-[#CDCDCD] text-left text-lg relative cursor-pointer
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#007A4D] after:transition-all after:duration-300 hover:after:w-30">
                            Dashboard
                        </button>

                        <button onClick={() => {
                            navigate('/About-us')
                            window.scrollTo(0, 0);
                        }} className="text-[#CDCDCD] text-left text-lg relative cursor-pointer
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#007A4D] after:transition-all after:duration-300 hover:after:w-30">
                            เกี่ยวกับเรา
                        </button>

                    </div>

                </div>

                <div className='w-xs flex flex-col pt-8 text-white'>
                    <div className='text-3xl my-4 font-bold'>ติดต่อเรา</div>

                    <div className='flex flex-col space-y-6'>

                        <div className='flex items-start gap-4'>
                            <div className='bg-[#007A4D] rounded-lg p-1 flex items-center justify-center'>
                                <MapPinIcon className='w-6 h-6  text-white' />
                            </div>

                            <div>
                                132 อาคารสินธร ทาวเวอร์ 3 ชั้น 27<br />
                                ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน<br />
                                กรุงเทพมหานคร 10330
                            </div>
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className='bg-[#007A4D] rounded-lg p-1 flex items-center justify-center'>
                                <PhoneIcon className='w-6 h-6 text-white' />
                            </div>
                            <div>02 205 7041</div>
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className='bg-[#007A4D] rounded-lg p-1 flex items-center justify-center'>
                                <EnvelopeIcon className='w-6 h-6 text-white' />
                            </div>
                            <div>yanisa.ph@pi.financial</div>
                        </div>
                    </div>
                </div>
            </div>
            <hr className='w-full mt-16 border-1 border-white' />
            <div className='text-white text-2xl font-medium text-center my-8'>© 2025 Signal IdeaTrade. All Rights Reserved.</div>
        </footer>

    )
}

export default Footer
