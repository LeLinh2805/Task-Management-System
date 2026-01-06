import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp!");
            setStatus('error');
            return;
        }
        setLoading(true);
        setStatus('idle');
        try {

            await axios.post('http://localhost:5000/api/auth/reset-password', {
                token,
                newPassword
            });

            setStatus('success');
            setMessage('Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.msg || 'Link đã hết hạn hoặc không hợp lệ.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Lỗi đường dẫn</h2>
                    <p className="text-gray-600 mb-4">Link đặt lại mật khẩu bị thiếu token.</p>
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">Gửi lại yêu cầu</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Đặt lại mật khẩu</h2>
                    <p className="text-gray-500 text-sm mt-2">Nhập mật khẩu mới cho tài khoản của bạn.</p>
                </div>

                {status === 'success' ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold">
                        ✅ {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu mới</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="******"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                                placeholder="******"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                ❌ {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70"
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận đổi mật khẩu'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;