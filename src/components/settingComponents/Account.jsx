import { useState } from 'react';
import { Pencil } from 'lucide-react';

function Account() {
    const [passwordEditing, setPasswordEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');

    const [emailEditing, setEmailEditing] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleEmailSubmit = () => {
        if (!newEmail) {
            setEmailError('กรุณากรอกอีเมลใหม่');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            setEmailError('รูปแบบอีเมลไม่ถูกต้อง');
            return;
        }

        setEmailError('');
        console.log('เปลี่ยนอีเมลเป็น:', newEmail);
        setEmailEditing(false);
    };

    const handlePasswordSubmit = () => {
        if (!currentPassword || !newPassword) {
            setError('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (newPassword.length < 6) {
            setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        // ถ้าผ่าน
        setError('');
        console.log('Submit:', { currentPassword, newPassword });
        setPasswordEditing(false);
    };

    return (
        <div className='flex flex-col'>
            <div className='text-2xl text-white mb-4 font-semibold'>ตั้งค่าบัญชี</div>

            <div className='flex flex-col space-y-4'>
                <div className="border-2 border-[#868686] w-full rounded-xl bg-black/20 text-white p-4 flex items-center gap-4">

                    {/* User Icon */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-600 rounded-full text-sm font-semibold">
                        JW
                    </div>

                    {/* User Details */}
                    <div className="flex-1">
                        <div className="flex items-center w-40 justify-between">
                            <div className="font-medium">Jonathan Wong</div>

                            {/* Edit Icon */}
                            <div className="p-1 hover:bg-gray-700 rounded cursor-pointer">
                                <Pencil className="w-4 h-4 text-[#868686]" />
                            </div>
                        </div>
                        <div className="text-sm text-[#868686]">
                            Jonathan@gmail.com
                        </div>
                    </div>
                </div>

                <div className="border-2 border-[#868686] w-full rounded-xl bg-black/20 text-white p-4 flex flex-col gap-4">

                    {/* Text Section */}
                    <div className="flex flex-col gap-4">

                        {/* ส่วนข้อความและปุ่ม */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-lg font-medium text-white">
                                    เปลี่ยนรหัสผ่าน
                                </p>
                                <p className="text-sm text-[#868686]">
                                    เปลี่ยนรหัสผ่านที่ใช้เข้าสู่ระบบ
                                </p>
                            </div>

                            {!passwordEditing && (
                                <div
                                    onClick={() => setPasswordEditing(true)}
                                    className="border border-[#F4F3F2] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-gray-500"
                                >
                                    เปลี่ยน
                                </div>
                            )}
                        </div>

                        {/* ฟอร์มเปลี่ยนรหัส */}
                        {passwordEditing && (
                            <div className="flex flex-wrap gap-3">

                                {error && (
                                    <div className="w-full text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <input
                                    type="password"
                                    placeholder="รหัสผ่านปัจจุบัน"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="flex-1 min-w-[200px] bg-[#1f2937] border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <input
                                    type="password"
                                    placeholder="รหัสผ่านใหม่"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="flex-1 min-w-[200px] bg-[#1f2937] border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div
                                    onClick={handlePasswordSubmit}
                                    className="w-36 text-center border border-[#F4F3F2] rounded-lg px-3 py-2 hover:bg-gray-500 cursor-pointer"
                                >
                                    ยืนยัน
                                </div>
                            </div>
                        )}

                    </div>


                </div>

                <div className="border-2 border-[#868686] w-full rounded-xl bg-black/20 text-white p-4 flex flex-col gap-4">

                    {/* หัวข้อ + ปุ่มเปลี่ยน */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-lg font-medium text-white">
                                เปลี่ยนอีเมล
                            </p>
                            <p className="text-sm text-[#868686]">
                                เปลี่ยนอีเมลที่ใช้เข้าสู่ระบบ
                            </p>
                        </div>

                        {!emailEditing && (
                            <div
                                onClick={() => setEmailEditing(true)}
                                className="border border-[#F4F3F2] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-gray-500"
                            >
                                เปลี่ยน
                            </div>
                        )}
                    </div>

                    {/* ฟอร์มเปลี่ยนอีเมล */}
                    {emailEditing && (
                        <div className="flex flex-wrap gap-3 items-center">

                            {emailError && (
                                <div className="w-full text-red-400 text-sm">
                                    {emailError}
                                </div>
                            )}

                            <input
                                type="email"
                                placeholder="อีเมลใหม่"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="flex-1 min-w-[200px] bg-[#1f2937] border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <div
                                onClick={handleEmailSubmit}
                                className="w-36 text-center border border-[#F4F3F2] rounded-lg px-3 py-2 hover:bg-gray-500 cursor-pointer"
                            >
                                ยืนยัน
                            </div>

                        </div>
                    )}

                </div>

                <div className="border-2 border-[#868686] w-full rounded-xl bg-black/20 text-white p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-lg font-medium text-white">
                            Export ข้อมูล
                        </p>
                        <p className="text-sm text-[#868686]">
                            ขอข้อมูลอาจใช้เวลาประมาณ 3 วันทำการ
                        </p>
                    </div>

                    <div className='border border-[#F4F3F2] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-gray-500'>
                        เปลี่ยน
                    </div>
                </div>

                <div className="border border-[#FF8282] w-full rounded-xl bg-black/20 text-white p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <p className="text-lg font-medium text-white">
                            ออกจากระบบ
                        </p>
                    </div>

                    <div className='border border-[#FF8282] text-[#FF8282] text-center cursor-pointer w-36 rounded-lg px-3 py-2 hover:bg-[#FF8282]/20'>
                        ออกจากระบบ
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Account
