import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, CheckCircle } from 'lucide-react';
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import Footer from '../components/Footer';

function Login() {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [resetData, setResetData] = useState({ email: "" });
    const [loginErrors, setLoginErrors] = useState({});
    const [isMounted, setIsMounted] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);
    const [resetErrors, setResetErrors] = useState('');
    const [alert, setAlert] = useState({ show: false, type: "", message: "" });
    const [passEmailCheck, setPassEmailCheck] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const hasMinLength = newPassword.length >= 12;
    const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = () => {
        const errs = {};

        if (!validateEmail(loginData.email)) {
            errs.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }
        if (loginData.password.length < 6) {
            errs.password = 'รหัสผ่านไม่ถูกต้อง';
        }

        setLoginErrors(errs);

        if (Object.keys(errs).length === 0) {
            // ทำงานต่อ เช่น ส่ง API
            setIsLoginOpen(false);
        }
    };

    useEffect(() => {
        // trigger fade in หลัง component mount
        setIsMounted(true);
    }, []);

    const handleSubmitNewPassword = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!hasMinLength || !hasUpperLower || !hasNumber) {
            setPasswordError("รหัสผ่านไม่ตรงตามเงื่อนไข");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (confirmPassword !== newPassword) {
            setConfirmError("รหัสยืนยันไม่ตรงกับรหัสผ่านใหม่");
            isValid = false;
        } else {
            setConfirmError("");
        }

        if (isValid) {
            // ✅ แสดง Bootstrap Alert success
            setAlert({ show: true, type: "success", message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว" });

            // reset state
            // setIsSwitching(false);
            // setPassEmailCheck(false);
            // setResetData({ email: "" });
            // setNewPassword("");
            // setConfirmPassword("");
        }
    };

    const handleReset = (e) => {
        e.preventDefault();

        // mock check email
        if (!resetData.email) {
            setResetErrors("กรุณากรอกอีเมล");
            return;
        }

        // regex ตรวจสอบรูปแบบอีเมลแบบง่าย
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validateEmail(resetData.email)) {
            errs.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
        }

        // mock: สมมติว่าเฉพาะ test@example.com เท่านั้นที่อยู่ในระบบ
        // console.log("Reset email:", resetData.email === "test@example.com");
        if (resetData.email === "test@example.com") {
            setResetErrors("");
            setPassEmailCheck(true);
        } else {
            setResetErrors("ไม่พบอีเมลนี้ในระบบ");
            return;
        }
    };

    return (
        <div className='flex flex-col min-w-[99vw] max-w-[99vw] bg-[#F5F5F5] min-h-screen'>
            <nav className='flex items-center bg-[#F5F5F5] px-8 py-2 sticky top-0 z-50 shadow w-full'>
                <span className='w-70'>
                    <img src="/images/logoBlack.png" alt="Logo" className="h-20" />
                </span>

                <div className='flex-1 space-x-8 font-semibold text-lg flex justify-center'>
                    <button
                        onClick={() => {
                            navigate('/')
                            window.scrollTo(0, 0);
                        }}
                        className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full
                    `}
                    >
                        หน้าหลัก
                    </button>
                    <button
                        onClick={() => {
                            navigate('/Dashboard')
                            window.scrollTo(0, 0);
                        }}
                        className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full
                        `}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => {
                            navigate('/About-us')
                            window.scrollTo(0, 0);
                        }}
                        className={`cursor-pointer relative after:block after:bg-black after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full`}
                    >
                        เกี่ยวกับเรา
                    </button>
                </div>

                <div className='w-70 flex space-x-4 items-center'>
                    <button
                        onClick={() => {
                            navigate('/Login')
                            window.scrollTo(0, 0);
                            setIsSwitching(false);
                            setPassEmailCheck(false);
                        }}
                        className='cursor-pointer text-[#007A4D] relative after:block after:bg-[#007A4D] after:h-[2px] px-4 py-2 after:w-0 after:transition-all after:duration-300 hover:after:w-full'
                    >
                        เข้าสู่ระบบ
                    </button>

                    <button
                        onClick={() => {
                            navigate('/Register')
                            window.scrollTo(0, 0);
                        }}
                        className='text-white bg-[#007A4D] rounded-xl cursor-pointer transition text-lg font-medium px-4 py-2 hover:bg-[#00a67a]'
                    >
                        สมัครใช้งานฟรี
                    </button>
                </div>
            </nav>
            <div className={`flex-1 transition-opacity duration-500 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                {!isSwitching ? (
                    <div
                        className="flex flex-1 bg-cover bg-center justify-center items-stretch min-h-[calc(100vh-84px)] space-x-8 p-4"
                        style={{ backgroundImage: "url('images/AuthBG.png')" }}
                    >
                        {/* Left Card */}
                        <div className="w-1/3 backdrop-blur rounded-lg space-y-2 p-6 flex flex-col justify-center">
                            <div className="font-bold text-[#007A4D] text-2xl">
                                ยินดีต้อนรับสู่ไอเดียเทรด
                            </div>
                            <div className="w-32 h-1 bg-[#007A4D] rounded-full ml-1" />
                            <p className="text-md text-[#5D6275]">
                                เพิ่มโอกาสในการเทรดหุ้นทั่วโลก ทั้งไทย สหรัฐ และจีน
                                ด้วยสัญญาณแม่นยำบนแพลตฟอร์มที่ใช้งานง่าย
                            </p>
                            <div className="w-full mt-4">
                                <img
                                    src="images/AdobeExpress.png"
                                    alt="login-bg"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        {/* Right Card */}
                        <div className="w-1/3 mt-[-4rem] backdrop-blur rounded-lg p-8 flex flex-col justify-center">
                            <div className="font-bold text-center text-3xl">เข้าสู่ระบบ</div>
                            <div className="mb-8" />

                            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                                {/* Email */}
                                <div>
                                    <label className="text-[#5D6275] text-md">อีเมล</label>
                                    <div
                                        className={`flex items-center bg-white border rounded-lg px-3 py-2 
                                        ${loginErrors.email ? 'border-[#FF8282]' : 'border-[#9E9E9E]'}`}
                                    >
                                        <Mail
                                            className={`${loginErrors.email ? 'text-[#FF8282]' : 'text-gray-500'} w-5 h-5 mr-2`}
                                        />
                                        <input
                                            type="email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            placeholder="กรอกอีเมล"
                                            className="bg-transparent outline-none text-black w-full placeholder-gray-400"
                                        />
                                    </div>
                                    {loginErrors.email && (
                                        <div className="flex items-center gap-1 text-[#FF8282] text-sm mt-1">
                                            <ExclamationCircleIcon className="w-4 h-4" />
                                            <p>{loginErrors.email}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="text-[#5D6275] text-md">รหัสผ่าน</label>
                                    <div
                                        className={`flex items-center bg-white border rounded-lg px-3 py-2 
                                        ${loginErrors.password ? 'border-[#FF8282]' : 'border-[#9E9E9E]'}`}
                                    >
                                        <Lock
                                            className={`${loginErrors.password ? 'text-[#FF8282]' : 'text-gray-500'} w-5 h-5 mr-2`}
                                        />
                                        <input
                                            type="password"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            placeholder="กรอกรหัสผ่าน"
                                            className="bg-transparent outline-none text-black w-full placeholder-gray-400"
                                        />
                                    </div>
                                    {loginErrors.password && (
                                        <div className="flex items-center gap-1 text-[#FF8282] text-sm mt-1">
                                            <ExclamationCircleIcon className="w-4 h-4" />
                                            <p>{loginErrors.password}</p>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className="text-[#007A4D] text-md text-end hover:underline cursor-pointer"
                                    onClick={() => setIsSwitching(true)}
                                >
                                    ลืมรหัสผ่าน
                                </div>

                                <button
                                    type="button"
                                    onClick={handleLogin}
                                    className="bg-[#00C490] w-full py-2 text-white mt-4 rounded-lg hover:bg-[#007A4D] transition"
                                >
                                    เข้าสู่ระบบ
                                </button>

                                <div className="flex justify-center text-sm">
                                    <span>หากยังไม่ได้เป็นสมาชิก&nbsp;</span>
                                    <button
                                        className="text-[#007A4D] font-semibold hover:underline cursor-pointer"
                                        onClick={() => {
                                            navigate('/Register');
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        สร้างบัญชี
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex flex-1 bg-cover bg-center justify-center items-stretch min-h-[calc(100vh-84px)] space-x-8 p-4"
                        style={{ backgroundImage: "url('images/AuthBG.png')" }}
                    >
                        {!passEmailCheck ? (
                            <div className="w-1/3 rounded-lg p-8 flex flex-col space-y-4 justify-center" >
                                <div>
                                    <div className='text-3xl font-bold text-center'>ขอเปลี่ยนรหัสผ่าน</div>
                                    <p className='text-md text-center'>กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่านใหม่ทางอีเมล</p>
                                </div>

                                <form onSubmit={handleReset} className="space-y-3">
                                    {/* Email */}
                                    <div>
                                        <label className="text-[#5D6275] text-md">อีเมล</label>
                                        <div
                                            className={`flex items-center bg-white border rounded-lg px-3 py-2 
                                            ${resetErrors ? 'border-[#FF8282]' : 'border-[#9E9E9E]'}`}
                                        >
                                            <Mail
                                                className={`${resetErrors ? 'text-[#FF8282]' : 'text-gray-500'} w-5 h-5 mr-2`}
                                            />
                                            <input
                                                type="email"
                                                value={resetData.email}
                                                onChange={(e) =>
                                                    setResetData({ ...resetData, email: e.target.value })
                                                }
                                                placeholder="กรอกอีเมล"
                                                className="bg-transparent outline-none text-black w-full placeholder-gray-400"
                                            />
                                        </div>
                                        {resetErrors && (
                                            <div className="flex items-center gap-1 text-[#FF8282] text-sm mt-1">
                                                <ExclamationCircleIcon className="w-4 h-4" />
                                                <p>{resetErrors}</p>
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            className="bg-[#00C490] w-full py-2 text-white mt-4 rounded-lg hover:bg-[#007A4D] transition"
                                        >
                                            ส่งอีเมลรีเซ็ตรหัสผ่าน
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="w-1/3 rounded-lg p-8 flex flex-col space-y-4 justify-center" >
                                <div className='text-3xl font-bold text-center'>ตั้งรหัสผ่านใหม่</div>
                                <form className="space-y-3" onSubmit={handleSubmitNewPassword}>
                                    {/* Password */}
                                    <label className="text-[#5D6275] text-md">รหัสผ่านใหม่</label>
                                    <div
                                        className={`flex items-center bg-white border rounded-lg px-3 py-2
                                                ${passwordError
                                                ? "border-[#FF8282]"
                                                : (hasMinLength && hasUpperLower && hasNumber)
                                                    ? "border-[#00C490]"
                                                    : "border-[#9E9E9E]"
                                            }`}

                                    >
                                        <Lock
                                            className={`${passwordError
                                                ? "text-[#FF8282]"
                                                : (hasMinLength && hasUpperLower && hasNumber)
                                                    ? "text-[#00C490]"
                                                    : "text-[#9E9E9E]"
                                                } w-5 h-5 mr-2`}
                                        />

                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="กรอกรหัสผ่านใหม่"
                                            className="bg-transparent outline-none text-black w-full placeholder-gray-400"
                                        />
                                    </div>

                                    {/* Checklist */}
                                    <div className="flex flex-col space-y-1 p-4 rounded-lg bg-gray-50 border border-[#868686]">
                                        <div className="flex items-center gap-2">
                                            <CheckCircleIcon
                                                className={`w-5 h-5 ${hasMinLength ? "text-[#00C490]" : "text-gray-400"}`}
                                            />
                                            <span className={`${hasMinLength ? "text-green-600" : "text-gray-500"}`}>
                                                มีความยาวอย่างน้อย 12 ตัว
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CheckCircleIcon
                                                className={`w-5 h-5 ${hasUpperLower ? "text-[#00C490]" : "text-gray-400"}`}
                                            />
                                            <span className={`${hasUpperLower ? "text-green-600" : "text-gray-500"}`}>
                                                มีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่และพิมพ์เล็ก
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CheckCircleIcon
                                                className={`w-5 h-5 ${hasNumber ? "text-[#00C490]" : "text-gray-400"}`}
                                            />
                                            <span className={`${hasNumber ? "text-green-600" : "text-gray-500"}`}>
                                                มีตัวเลข 0-9 อย่างน้อย 1 ตัว
                                            </span>
                                        </div>
                                    </div>

                                    {/* Confirm Password */}
                                    <label className="text-[#5D6275] text-md">ยืนยันรหัสผ่าน</label>
                                    <div
                                        className={`flex items-center bg-white border rounded-lg px-3 py-2 
                                        ${confirmError ? "border-[#FF8282]" : "border-[#9E9E9E]"}`}
                                    >
                                        <Lock
                                            className={`${confirmError ? "text-[#FF8282]" : "text-gray-500"} w-5 h-5 mr-2`}
                                        />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="ยืนยันรหัสผ่าน"
                                            disabled={!(hasMinLength && hasUpperLower && hasNumber)} // ✅ disable ถ้าไม่ผ่านเงื่อนไข
                                            className="bg-transparent outline-none text-black w-full placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                    </div>
                                    {confirmError && <div className="text-[#FF8282] text-sm">{confirmError}</div>}

                                    <button
                                        type="submit"
                                        disabled={!(hasMinLength && hasUpperLower && hasNumber)} // ✅ disable ปุ่มถ้าไม่ผ่านเงื่อนไข
                                        className="bg-[#00C490] w-full py-2 text-white mt-4 rounded-lg hover:bg-[#007A4D] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                    >
                                        เปลี่ยนรหัสผ่าน
                                    </button>
                                </form>
                                {alert.show && (
                                    <div className={`alert bg-[#E0B469A1] justify-center flex gap-2 border rounded-lg py-2 border-[#E0B469] alert-${alert.type} text-center`} role="alert">
                                        <p>{alert.message}</p> 
                                        <button
                                            className='text-[#007A4D] hover:underline cursor-pointer'
                                            onClick={() => {
                                                setAlert({ show: false, type: "", message: "" });
                                                navigate('/Login');
                                                setIsSwitching(false);
                                                setPassEmailCheck(false);
                                                setResetData({ email: "" });
                                                setNewPassword("");
                                                setConfirmPassword("");
                                                window.scrollTo(0, 0);
                                            }}
                                        >เข้าสู่ระบบที่นี่</button>
                                    </div>
                                )}
                            </div>
                        )}


                    </div>
                )
                }
            </div >

            <Footer />
        </div >
    )
}

export default Login
