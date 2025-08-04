import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, UserCheck } from 'lucide-react';
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import Footer from '../components/Footer';

function Register() {
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState({ email: '', password: '' });
    const [registerErrors, setRegisterErrors] = useState({});
    const [isMounted, setIsMounted] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const hasMinLength = newPassword.length >= 12;
    const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    const [isCompleted, setIsCompleted] = useState(false);

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        let errors = {};
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 1. Validate email
        if (!registerData.email) {
            errors.email = "กรุณากรอกอีเมล";
        } else if (!emailRegex.test(registerData.email)) {
            errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }

        // 2. Validate password
        if (!newPassword) {
            errors.password = "กรุณากรอกรหัสผ่าน";
        } else if (!(hasMinLength && hasUpperLower && hasNumber)) {
            errors.password = "รหัสผ่านไม่ตรงตามเงื่อนไข";
        }

        // 3. Validate confirm password
        if (!confirmPassword) {
            errors.confirm = "กรุณายืนยันรหัสผ่าน";
        } else if (confirmPassword !== newPassword) {
            errors.confirm = "รหัสผ่านไม่ตรงกัน";
        }

        // 4. Update errors
        setRegisterErrors({ email: errors.email || "", password: errors.password || "" });
        setConfirmError(errors.confirm || "");
        setPasswordError(errors.password || "");

        // 5. ถ้าไม่มี error → mock submit
        if (Object.keys(errors).length === 0) {
            console.log("✅ Register Data:", {
                email: registerData.email,
                password: newPassword,
            });

            setIsCompleted(true);
            setRegisterData({ email: '', password: '' });
            setNewPassword('');
        }
    };


    useEffect(() => {
        // trigger fade in หลัง component mount
        setIsMounted(true);
    }, []);

    return (
        <div className='flex flex-col max-w-[99vw] bg-[#F5F5F5] min-h-screen'>
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
                {!isCompleted ? (
                    <div
                        className="flex-1 flex bg-cover space-x-8 bg-center items-center justify-center min-h-[calc(100vh-96px)]"
                        style={{ backgroundImage: "url('images/AuthBG.png')" }}
                    >
                        <div className='w-1/3 rounded-lg space-y-2 h-120'>
                            <div className='px-8 font-bold text-[#007A4D] text-2xl'>ยกระดับการเทรดของคุณให้แม่นยำกว่าเดิมกับ ไอเดียเทรด</div>
                            <div className='w-50 py-[.4rem] ml-8 bg-[#007A4D] rounded-full' />
                            <p className='px-8 text-md text-[#5D6275]'>
                                แพลตฟอร์มสัญญาณหุ้นแบบเรียลไทม์ ครอบคลุมทั้งตลาดไทย สหรัฐ และจีน วิเคราะห์แม่นยำ ไม่พลาดทุกโอกาสสำคัญในทุกตลาดทั่วโลก
                            </p>
                            <div className="w-full mt-4">
                                <img
                                    src="images/AdobeExpress.png"
                                    alt="login-bg"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        <div className='w-1/3 px-16 rounded-lg h-120'>
                            <div className='h-auto font-bold text-center text-3xl'>สมัครสมาชิก</div>
                            {/* <div className='mb-10' /> */}
                            <form className="space-y-2" onSubmit={handleRegisterSubmit}>
                                <label className='text-[#5D6275] text-md'>อีเมล</label>
                                <div className={`flex items-center bg-white border border-[#9E9E9E] ${registerErrors.email ? 'border border-[#FF8282]' : ''} rounded-lg px-3 py-2`}>
                                    <Mail className={`${registerErrors.email ? 'text-[#FF8282]' : 'text-gray-500'} w-5 h-5 mr-2`} />
                                    <input
                                        type='email'
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        placeholder='กรอกอีเมล'
                                        className={`bg-transparent outline-none text-black w-full placeholder-gray-400`}
                                    />
                                </div>
                                {registerErrors.email && (
                                    <div className="px-2 flex items-center gap-1 text-[#FF8282] text-sm">
                                        <ExclamationCircleIcon className="w-4 h-4" />
                                        <p className='pb-1'>{registerErrors.email}</p>
                                    </div>
                                )}
                                <div className='my-1' />
                                <label className='text-[#5D6275] text-md'>รหัสผ่าน</label>
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
                                    สมัครสมาชิก
                                </button>
                                <div className='flex justify-center text-sm'>
                                    <span className=''>หากเป็นสมาชิกแล้ว&nbsp;</span>
                                    <span
                                        className='text-[#007A4D] font-semibold hover:underline cursor-pointer'
                                        onClick={() => {
                                            navigate('/Login')
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        เข้าสู่ระบบที่นี่
                                    </span>
                                </div>
                            </form>
                        </div>

                    </div>
                ) :
                    (
                        <div
                            className="flex-1 flex flex-col items-center justify-center min-w-[99vw] min-h-[calc(100vh-84px)] bg-cover bg-center"
                            style={{ backgroundImage: "url('images/AuthBG.png')" }}
                        >
                            <div className="flex flex-col items-center bg-white/70 backdrop-blur-md px-12 py-10 rounded-2xl shadow-lg text-center space-y-4">
                                {/* Success Icon */}
                                <UserCheck className="w-16 h-16 text-[#00C490]" />

                                {/* Success Message */}
                                <div className="text-2xl font-bold text-[#007A4D]">สมัครสมาชิกสำเร็จ</div>
                                <p className="text-[#5D6275] text-md">บัญชีของคุณพร้อมใช้งานแล้ว</p>

                                {/* Back to Home Button */}
                                <button
                                    onClick={() => navigate("/")} // <-- เปลี่ยนตาม routing ของคุณ
                                    className="bg-[#00C490] hover:bg-[#007A4D] transition w-full py-2 text-white font-semibold rounded-lg mt-2"
                                >
                                    กลับสู่หน้าหลัก
                                </button>
                            </div>
                        </div>

                    )}
            </div>

            <Footer />
        </div>
    )
}

export default Register
