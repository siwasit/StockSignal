import { ArrowRight, Search, Clock, UserCheck, Bell, TrendingUp, Headphones, CircleDollarSign, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === '/';

  useEffect(() => {
    // trigger fade in หลัง component mount
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
      // ทำงานต่อ เช่น ส่ง API
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
      // ส่งข้อมูลไป API ได้
      setIsRegisterOpen(false);
    }
  };


  return (
    <>
      <div className='flex flex-col min-w-[99vw] bg-[#F5F5F5]'>
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
              ${isActive ? 'after:w-full ' : 'text-[#00000090]'}`}
            >
              หน้าหลัก
            </div>
            <div onClick={() => {
              navigate('/Dashboard')
              window.scrollTo(0, 0);
            }} className='cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full'>
              Dashboard
            </div>
            <div onClick={() => {
              navigate('/About-us')
              window.scrollTo(0, 0);
            }} className='cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full'>
              เกี่ยวกับเรา
            </div>
          </div>

          <div className='w-70 flex space-x-4 items-center'>
            <div
              onClick={() => {
                navigate('/Login')
                window.scrollTo(0, 0);
              }}
              className='cursor-pointer text-[#007A4D] relative after:block after:bg-[#007A4D] after:h-[2px] px-4 py-2 after:w-0 after:transition-all after:duration-300 hover:after:w-full'
            >
              เข้าสู่ระบบ
            </div>

            <div
              onClick={() => {
                navigate('/Register')
                window.scrollTo(0, 0);
              }}
              className='text-white bg-[#007A4D] rounded-xl cursor-pointer transition text-lg font-medium px-4 py-2 hover:bg-[#00a67a]'
            >
              สมัครใช้งานฟรี
            </div>
          </div>
        </nav>

        <div className={`transition-opacity duration-700 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className='w-full flex flex-col py-20'>
            <div className='self-center px-2 text-center py-1 border border-[#5D6275] text-[#5D6275] rounded-full max-w-85 my-2'>นักลงทุนทั่วประเทศไว้วางใจในสัญญาณของเรา</div>

            <div className='mx-auto flex justify-center max-w-3xl flex-col text-center'>
              <div className='flex flex-col space-y-1 items-center'>
                <div className='text-[4rem] font-bold text-black leading-none'>
                  สัญญาณหุ้นที่
                </div>

                <div className='flex items-center justify-center space-x-2 leading-none'>
                  <p className='text-[4rem] font-bold text-[#007A4D] leading-none'>เข้าใจง่าย</p>
                  <p className='text-[4rem] font-bold text-black leading-none'>พร้อมใช้ทุกเวลา</p>
                </div>
              </div>


              <div className='text-xl text-[#5D6275] max-w-md w-full mx-auto mt-4'>
                ติดตามสัญญาณซื้อ ถือ ขาย แบบเรียลไทม์
              </div>
              <div className='text-xl text-[#5D6275] max-w-xl w-full mx-auto'>
                พร้อมเหตุผลสั้น ๆ ชัดเจน เพื่อการตัดสินใจที่มั่นใจยิ่งขึ้น
              </div>

              <div className='mt-8 bg-[#007A4D] py-4 px-6 cursor-pointer hover:bg-[#00a67a] transition self-center rounded-full flex items-center space-x-2'>
                <div className='text-white text-3xl font-semibold mb-1' onClick={() => {
                  navigate('/Register')
                  window.scrollTo(0, 0);
                }}>เริ่มเลย</div>
                <ArrowRight className="w-9 h-9 text-white" />
              </div>

            </div>
          </div>

          <div className='w-full h-80'>
            <div className='h-50 bg-gradient-to-r from-[#00A378] to-[#007A4D] relative'>
              <div className='flex items-center justify-evenly space-x-4 absolute top-1/3 left-1/2 -translate-x-1/2  w-[70%] bg-[#F5F5F5] shadow-lg rounded-lg h-60'>
                <div>
                  <p className='text-[#007A4D] text-center font-bold text-5xl'>30K</p>
                  <p className='text-[#868686] font-semibold max-w-30 text-center leading-tight mt-2'>Signal ที่เราได้แจ้งเตือน</p>
                </div>
                <div>
                  <p className='text-[#007A4D] text-center font-bold text-5xl'>50</p>
                  <p className='text-[#868686] font-semibold max-w-30 text-center leading-tight mt-2'>จำนวนหุ้นบนแพลตฟอร์มนี้</p>
                </div>
                <div>
                  <p className='text-[#007A4D] text-center font-bold text-5xl'>12K</p>
                  <p className='text-[#868686] font-semibold max-w-30 text-center leading-tight mt-2'>จำนวนผู้สมัครใช้งานกับเรา</p>
                </div>
              </div>
            </div>
          </div>


          <div className='flex flex-col justify-center mx-auto my-12'>
            <div className='text-3xl font-bold text-black text-center'>เริ่มใช้งานไอเดียเทรดง่าย ๆ ใน 3 ขั้นตอน</div>

            <div className='flex my-8 items-center self-center'>
              <div className='text-black flex items-center justify-center h-15 w-15 bg-[#D9D9D9] text-3xl rounded-full font-semibold'>1</div>
              <hr className='border-2 border-[#D9D9D9] w-100' />
              <div className='text-black flex items-center justify-center h-15 w-15 bg-[#D9D9D9] text-3xl rounded-full font-semibold'>2</div>
              <hr className='border-2 border-[#D9D9D9] w-100' />
              <div className='text-black flex items-center justify-center h-15 w-15 bg-[#D9D9D9] text-3xl rounded-full font-semibold'>3</div>
            </div>

            <div className='flex justify-evenly'>
              <div className='flex flex-col text-center justify-center w-75'>

                <UserCheck className="w-[120px] h-[120px]  my-2 mx-auto text-[#007A4D]" />
                <div className='text-xl font-bold'>สมัครบัญชีกับไอเดียเทรด</div>
                <div className='text-xl'>กรอกข้อมูลและยืนยันตัวตนเพื่อเริ่มใช้งานทันที</div>
              </div>
              {/* <hr className='border-2 border-transparent ' /> */}
              <div className='flex flex-col text-center justify-center w-75'>
                <Search className='mx-auto w-[120px] my-2 h-[120px] text-[#007A4D]' />

                <div className='text-xl font-bold'>ค้นหาหุ้นที่สนใจ</div>
                <div className='text-xl'>เลือกหุ้นที่ตรงกับเป้าหมายและสไตล์การลงทุนของคุณ</div>
              </div>
              {/* <hr className='border-2 border-transparent ' /> */}
              <div className='flex flex-col text-center justify-center w-75'>
                <Clock className='mx-auto w-[120px] my-2 h-[120px] text-[#007A4D]' />

                <div className='text-xl font-bold'>กดเพิ่มหุ้นไปใน Watchlist</div>
                <div className='text-xl'>ติดตามสัญญาณซื้อขายและอัปเดตสถานะได้แบบเรียลไทม์</div>
              </div>

            </div>
          </div>

          <div className='w-full h-180'>
            <div className='h-70 bg-gradient-to-r flex items-center justify-center from-[#00A378] to-[#007A4D] relative'>
              <div className='text-white text-4xl font-bold'>ทำไมต้องเลือกสัญญานหุ้นของ ไอเดียเทรด?</div>
              <div className='absolute top-3/4 left-1/2 py-8 -translate-x-1/2 w-[70%] bg-[#F5F5F5] shadow-lg rounded-lg p-4 grid grid-cols-2 gap-4'>

                {/* Card 1 */}
                <div className='p-4 flex flex-col items-center'>
                  <Bell className='w-16 h-16 text-[#007A4D] mb-4' strokeWidth={2.5} />
                  <p className='text-[#007A4D] text-center font-bold text-2xl'>บริการแจ้งเตือนผ่าน LINE</p>
                  <p className='text-[#868686] font-semibold max-w-[200px] text-center leading-tight mt-2'>
                    ไม่พลาดทุกการเคลื่อนไหวสัญญาณบน ไอเดียเทรด ด้วย LINE
                  </p>
                </div>

                {/* Card 2 */}
                <div className='p-4 flex flex-col items-center'>
                  <div className='flex flex-col items-center mb-3'>
                    <TrendingUp className='w-16 h-16 text-[#007A4D]' />
                    <div className='w-16 h-1 bg-[#007A4D] rounded'></div>
                  </div>

                  <p className='text-[#007A4D] text-center font-bold text-2xl'>สัญญาณที่ผู้เชี่ยวชาญวิเคราะห์</p>
                  <p className='text-[#868686] font-semibold max-w-[200px] text-center leading-tight mt-2'>
                    วิเคราะห์โดยทีมผู้เชี่ยวชาญ พร้อมสัญญาณที่แม่นยำและเชื่อถือได้
                  </p>
                </div>

                {/* Card 3 */}
                <div className='p-4 flex flex-col items-center'>
                  <Headphones className='w-16 h-16 text-[#007A4D] mb-4' strokeWidth={2.5} />
                  <p className='text-[#007A4D] text-center font-bold text-2xl'>พร้อมช่วยเหลือ 24 ชั่วโมง</p>
                  <p className='text-[#868686] font-semibold max-w-[200px] text-center leading-tight mt-2'>
                    สอบถามได้ทุกเวลา ทีมงานพร้อมดูแลตลอด 24 ชั่วโมง
                  </p>
                </div>

                {/* Card 4 */}
                <div className='p-4 flex flex-col items-center'>
                  <CircleDollarSign className='w-16 h-16 text-[#007A4D] mb-4' />
                  <p className='text-[#007A4D] text-center font-bold text-2xl'>เริ่มต้นได้ฟรี ไม่ต้องเสียเงิน</p>
                  <p className='text-[#868686] font-semibold max-w-[200px] text-center leading-tight mt-2'>
                    สมัครง่าย เริ่มใช้บริการฟรีทันทีโดยไม่มีค่าใช้จ่าย
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-full flex h-100 bg-cover bg-center mt-16"
            style={{ backgroundImage: "url('/images/BackgroundHomeStock.png')" }}
          >
            <div className='w-[75%] mx-auto flex flex-col py-20'>
              <div className='text-white font-bold text-4xl'>ปลดล็อกโอกาสการลงทุน ด้วยข้อมูลที่ใช่</div>
              <div className='flex-1 text-white font-medium text-xl mt-2'>รับสัญญาณซื้อขายทันที วิเคราะห์ง่าย ใช้งานสะดวก</div>
              <div onClick={() => {
                navigate('/Register')
                window.scrollTo(0, 0);
              }} className='text-center text-white bg-[#007A4D] max-w-40 rounded-xl cursor-pointer transition text-lg font-medium px-4 py-2 hover:bg-[#00a67a]'>
                สมัครใช้งานฟรี
              </div>
            </div>
          </div>
        </div>

        <Footer />

      </div>

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
    </>

  )
}

export default Home
