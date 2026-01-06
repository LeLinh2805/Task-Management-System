import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');
        setMessage('');
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setStatus('success');
            setMessage('Link đặt lại mật khẩu đã được gửi vào email của bạn.');
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.msg || 'Không thể gửi yêu cầu. Vui lòng kiểm tra lại email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu?</h2>
                    <p className="text-gray-500 text-sm mt-2">Nhập email để nhận hướng dẫn lấy lại mật khẩu.</p>
                </div>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="mb-4 text-4xl">✅</div>
                        <p className="text-green-600 font-medium mb-6">{message}</p>
                        <Link to={"/login"} className="text-blue-600 font-bold hover:underline">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email của bạn</label>
                            <input type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
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
                            className="w-full py-2.5 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </button>
                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 font-medium">
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )


}
export default ForgotPasswordPage;