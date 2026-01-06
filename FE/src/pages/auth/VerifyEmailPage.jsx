import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';


const VerifyEmailPage = ()=> {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Đang xác thực email...');

    useEffect(() =>{
        if (!token) {
            setStatus('error');
            setMessage('Đường dẫn không hợp lệ (Thiếu token).');
            return;
        }
        const verifyAccount = async () => {
            try{
                // Goi Backend. 
                await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);

                setStatus('success');
                setMessage('Xác thực thành công! Bạn có thể đăng nhập ngay.');
            }catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.msg || 'Link xác thực đã hết hạn hoặc không đúng.');
            }
        };

        verifyAccount();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-gray-100">
                {status === 'loading' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Đang xử lý...</h2>
                        <p className="text-gray-500 mt-2">Vui lòng đợi trong giây lát.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link
                            to="/login"
                            className="inline-block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-3xl">❌</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi xác thực</h2>
                        <p className="text-red-600 mb-6">{message}</p>
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Quay lại trang đăng nhập
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmailPage;