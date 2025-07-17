import React, { useEffect, useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function About() {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === '/About-us';
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
    const [loginErrors, setLoginErrors] = useState({});
    const [registerErrors, setRegisterErrors] = useState({});
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = () => {
        const errs = {};

        if (!validateEmail(loginData.email)) {
            errs.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
        if (loginData.password.length < 6) {
            errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        }

        setLoginErrors(errs);

        if (Object.keys(errs).length === 0) {
            setIsLoginOpen(false);
        }
    };

    const handleRegister = () => {
        const errs = {};

        if (!validateEmail(registerData.email)) {
            errs.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
        if (registerData.password.length < 6) {
            errs.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
        }
        if (registerData.password !== registerData.confirmPassword) {
            errs.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
        }

        setRegisterErrors(errs);

        if (Object.keys(errs).length === 0) {
            setIsRegisterOpen(false);
        }
    };

    return (
        
        <div className='flex flex-col min-h-screen bg-[#F5F5F5]'>
            <nav className='flex items-center bg-[#F5F5F5] px-8 py-2 sticky top-0 z-50 shadow'>
                <span className='w-70'>
                    <img src="/images/logoBlack.png" alt="Logo" className="h-20" />
                </span>

                <div className='flex-1 space-x-8 font-semibold text-lg flex justify-center'>
                    <div
                    onClick={() => {
                        navigate('/')
                        window.scrollTo(0, 0);
                    }}
                    className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full
                    `}
                    >
                    หน้าหลัก
                    </div>
                    <div 
                        onClick={() => {
                        navigate('/Dashboard')
                        window.scrollTo(0, 0);
                        }} 
                        className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full
                        `}
                    >
                    Dashboard
                    </div>
                    <div 
                        onClick={() => {
                        navigate('/About-us')
                        window.scrollTo(0, 0);
                        }} 
                        className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full
                        ${isActive ? 'after:w-full ' : 'text-[#00000090]'}`}
                    >
                    เกี่ยวกับเรา
                    </div>
                </div>

                <div className='w-70 flex space-x-4 items-center'>
                    <div
                        onClick={() => setIsLoginOpen(true)}
                        className='cursor-pointer text-[#007A4D] relative after:block after:bg-[#007A4D] after:h-[2px] px-4 py-2 after:w-0 after:transition-all after:duration-300 hover:after:w-full'
                    >
                        เข้าสู่ระบบ
                    </div>

                    <div
                        onClick={() => setIsRegisterOpen(true)}
                        className='text-white bg-[#007A4D] rounded-xl cursor-pointer transition text-lg font-medium px-4 py-2 hover:bg-[#00a67a]'
                    >
                        สมัครใช้งานฟรี
                    </div>
                </div>
            </nav>
            <div className={`transition-opacity duration-700 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className='flex flex-col flex-1'>
                    <div
                        style={{
                            backgroundImage: `url('images/AboutBG.png')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: '100%',
                            height: '25rem'
                        }}
                        className='flex relative flex-col justify-center space-y-4 items-center'
                    >
                        <div className='text-white font-bold text-6xl'>เกี่ยวกับเรา</div>
                        <p className='w-2xl text-center font-semibold text-white/70 text-xl'>พวกเราเชื่อมั่นว่าทุกคนควรสามารถลงทุนในหลักทรัพย์มากมายหลากหลายประเภท
                            ตามที่ต้องการได้อย่างสะดวกสบาย เพื่อไล่ตามความฝันและบรรลุเป้าหมายทางการเงินที่ได้ตั้งใจไว้</p>
                        <div className='absolute top-5/6 w-[75%] h-100 shadow-lg rounded-lg overflow-hidden'>
                            <img
                                className="w-full h-full object-cover rounded-lg"
                                src="images/PiFin.jpg"
                                alt=""
                            />
                        </div>
                    </div>
                    <div className='h-80 w-10'></div>
                    <div className='my-12 flex flex-col items-center justify-center'>
                        <div className='text-black font-bold text-center mb-6 text-5xl'>ข้อมูลบริษัท</div>
                        <p className='text-black max-w-4xl text-center text-lg'>บริษัทหลักทรัพย์ พาย หรือ Pi Securities เป็นผู้ให้บริการด้านการลงทุนชั้นนำของประเทศไทยมาอย่างยาวนานกว่า 50 ปี เราเป็นสมาชิกหมายเลข 3 ของตลาดหลักทรัพย์แห่งประเทศไทย (SET) และอยู่ภายใต้การกำกับดูแลของสำนักงานคณะกรรมการกำกับหลักทรัพย์และตลาดหลักทรัพย์ (ก.ล.ต.)</p>
                    </div>

                    <div className='h-120 w-full flex justify-between items-center p-8 bg-gradient-to-r from-[#01A478] to-[#003E2D]'>
                        <div className='w-[50%] rounded-lg overflow-hidden flex justify-center'>
                            <img
                                className="w-[90%] h-full shadow-lg object-contain rounded-lg"
                                src="images/4ppl.jpg"
                                alt=""
                            />
                        </div>
                        <div className='flex w-[50%] flex-col'>
                            <div className='text-white text-5xl font-bold py-8'>วิสัยทัศน์</div>
                            <p className='text-white/90 font-medium max-w-2xl text-2xl py-10'>
                                สร้างสังคมไทยให้เป็นสังคมทางการเงินที่แข็งแกร่ง และเท่าเทียมเพื่อให้ทุกคนสามารถเข้าถึงบริการทางการลงทุนได้ง่ายและมีประสิทธิภาพ สามารถไปถึงเป้าหมายความมั่งคั่งตามที่ได้วางแผนไว้
                            </p>
                        </div>
                    </div>

                    <div className='h-120 w-full flex justify-between items-center p-8 bg-gradient-to-r from-[#202431] to-[#636F97]'>
                        <div className='flex w-[50%] flex-col'>
                            <div className='text-white text-5xl font-bold p-10'>พันธกิจ</div>
                            <p className='text-white/90 font-medium max-w-2xl text-2xl p-10'>
                                เปิดโอกาสให้ทุกคนสามารถเข้าถึงการลงทุนใน
                                หลักทรัพย์หลากหลายประเภทในตลาดทุน
                                สำคัญทั่วโลกได้แบบไร้ขีดจำกัด พร้อมนำเสนอสาระความรู้ทางการเงินที่เข้าใจ
                                ง่ายจากผู้เชี่ยวชาญตัวจริงในอุตสาหกรรม
                            </p>
                        </div>
                        <div className='w-[50%] h-100 rounded-lg overflow-hidden flex justify-center'>
                            <img
                                className="w-125 shadow-lg object-cover rounded-lg"
                                src="images/HandShake.png"
                                alt=""
                            />
                        </div>
                    </div>

                    <div className='h-120 w-full flex flex-col p-8'>
                        <div className='text-black m-10 font-bold text-5xl'>ค่านิมยมองค์กร</div>
                        <div className='flex justify-between px-10 py-6'>
                            <div className='flex flex-col w-sm'>
                                <div>
                                    <img src="/icons/Comfort.svg" alt="Icon" className="w-15 h-15" />
                                </div>
                                <div className='text-black my-2 font-semibold text-3xl'>ความเรียบง่าย</div>
                                <p className='text-black mt-2'>
                                    การลงทุน การเงิน และเศรษฐกิจ ไม่ควรเป็นเรื่องยุ่งยากซับซ้อนที่มีผู้คนเพียงไม่กี่กลุ่มเท่านั้นที่สามารถเข้าถึงได้ บริการและผลิตภัณฑ์ของเราจึงผ่านกระบวนการออกแบบโดยคำนึงถึงความเรียบง่ายเป็นหลัก
                                </p>
                            </div>

                            <div className='flex flex-col w-sm'>
                                <div>
                                    <img src="/icons/Precise.svg" alt="Icon" className="w-15 h-15" />
                                </div>
                                <div className='text-black my-2 font-semibold text-3xl'>ความละเอียดอ่อน</div>
                                <p className='text-black mt-2'>
                                    ยิ่งโลกพึ่งพิงเทคโนโลยีมากขึ้นเท่าไหร่ เรายิ่งเล็งเห็นถึงความสำคัญของความเป็นมนุษย์ โดยเฉพาะการเข้าใจอารมณ์ความรู้สึกอย่างลึกซึ้ง เพื่อให้สามารถมอบบริการที่ตอบโจทย์และตรงใจผู้คน
                                    แต่ละกลุ่มได้อย่างมีประสิทธิภาพ
                                </p>
                            </div>

                            <div className='flex flex-col w-sm'>
                                <div>
                                    <img src="/icons/Divert.svg" alt="Icon" className="w-15 h-15" />
                                </div>
                                <div className='text-black my-2 font-semibold text-3xl'>ความหลากหลาย</div>
                                <p className='text-black mt-2'>
                                    ความหลากหลายในทุกมิติคือความสวยงามที่
                                    ขับเคลื่อนให้สังคมก้าวหน้า เราจึงมุ่งสร้างสรรค์พร้อมสนับสนุนให้
                                    เกิดวัฒนธรรมการโอบรับและเคารพความ แตกต่างของผู้คนทั้งในและนอกองค์กร
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {isLoginOpen && (
                <div
                    onClick={() => setIsLoginOpen(false)}
                    className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
                >
                    <AnimatePresence>
                        <motion.div
                            key="login-modal"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='bg-[#202431] text-white rounded-lg p-6 w-[320px] shadow-lg'
                        >
                            <img src="/images/logo.png" className='mx-auto' alt="logo" />
                            <div className='text-xl font-bold my-4 text-center'>ลงชื่อเข้าใช้</div>

                            <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
                                <div className='flex items-center bg-[#EFEFEF] rounded-lg px-3 py-2'>
                                    <Mail className='text-gray-500 w-5 h-5 mr-2' />
                                    <input
                                        type='email'
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        placeholder='อีเมล'
                                        className='bg-transparent outline-none text-black w-full placeholder-gray-400'
                                    />
                                </div>
                                {loginErrors.email && <div className="text-red-400 text-sm">{loginErrors.email}</div>}

                                <div className='flex items-center bg-[#EFEFEF] rounded-lg px-3 py-2'>
                                    <Lock className='text-gray-500 w-5 h-5 mr-2' />
                                    <input
                                        type='password'
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        placeholder='รหัสผ่าน'
                                        className='bg-transparent outline-none text-black w-full placeholder-gray-400'
                                    />
                                </div>
                                {loginErrors.password && <div className="text-red-400 text-sm">{loginErrors.password}</div>}

                                <button
                                    type='button'
                                    onClick={handleLogin}
                                    className='bg-[#6870FA] w-full py-2 rounded-lg font-semibold hover:bg-[#4f57d8] transition'
                                >
                                    เข้าสู่ระบบ
                                </button>
                                <div className='flex justify-center text-sm mt-2'>
                                    <span className='text-gray-400'>ยังไม่มีบัญชี ?&nbsp;</span>
                                    <span
                                        className='text-[#6870FA] font-semibold hover:underline cursor-pointer'
                                        onClick={() => {
                                            setIsLoginOpen(false);
                                            setIsRegisterOpen(true);
                                        }}
                                    >
                                        สร้างบัญชี
                                    </span>
                                </div>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            {isRegisterOpen && (
                <div
                    onClick={() => setIsRegisterOpen(false)}
                    className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'
                >
                    <AnimatePresence>
                        <motion.div
                            key="register-modal"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='rounded-lg p-6 w-[300px] bg-[#202431] text-white shadow-lg'
                        >
                            <img src="/images/logo.png" className='mx-auto' alt="logo" />
                            <div className='text-xl font-bold my-4 text-center'>สร้างบัญชี</div>

                            <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
                                <div className='flex items-center bg-[#EFEFEF] rounded-lg px-3 py-2'>
                                    <Mail className='text-gray-500 w-5 h-5 mr-2' />
                                    <input
                                        type='email'
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        placeholder='อีเมล'
                                        className='bg-transparent outline-none text-black w-full placeholder-gray-400'
                                    />
                                </div>
                                {registerErrors.email && <div className="text-red-400 text-sm">{registerErrors.email}</div>}

                                <div className='flex items-center bg-[#EFEFEF] rounded-lg px-3 py-2'>
                                    <Lock className='text-gray-500 w-5 h-5 mr-2' />
                                    <input
                                        type='password'
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        placeholder='รหัสผ่าน'
                                        className='bg-transparent outline-none text-black w-full placeholder-gray-400'
                                    />
                                </div>
                                {registerErrors.password && <div className="text-red-400 text-sm">{registerErrors.password}</div>}

                                <div className='flex items-center bg-[#EFEFEF] rounded-lg px-3 py-2'>
                                    <Lock className='text-gray-500 w-5 h-5 mr-2' />
                                    <input
                                        type='password'
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        placeholder='ยืนยันรหัสผ่าน'
                                        className='bg-transparent outline-none text-black w-full placeholder-gray-400'
                                    />
                                </div>
                                {registerErrors.confirmPassword && <div className="text-red-400 text-sm">{registerErrors.confirmPassword}</div>}

                                <button
                                    type='button'
                                    onClick={handleRegister}
                                    className='bg-[#6870FA] text-white w-full py-2 rounded-lg font-semibold hover:bg-[#4f57d8] transition'
                                >
                                    สร้างบัญชี
                                </button>
                                <div className='flex justify-center text-sm mt-2'>
                                    <span className='text-gray-400'>มีบัญชีแล้ว ?&nbsp;</span>
                                    <span
                                        className='text-[#6870FA] font-semibold hover:underline cursor-pointer'
                                        onClick={() => {
                                            setIsRegisterOpen(false);
                                            setIsLoginOpen(true);
                                        }}
                                    >
                                        ลงชื่อเข้าใช้
                                    </span>
                                </div>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
        
    )
}

export default About