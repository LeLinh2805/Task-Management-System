import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import authApi from '../../api/authApi';

const LoginPage = () =>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const handleLogin = async(formData)=>{
        setLoading(true);
        setAlert('');
        try{
            const res = await authApi.login(formData);
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
             
            setAlert("Đăng nhập thành công!");
            setTimeout(()=>{
                navigate('/dashboard');
            }, 2000);
        }catch{
            setAlert("Đăng nhập thất bại!");
            setTimeout(()=>{
                setAlert("");
            }, 3000)
        }finally{
            setLoading(false);
        }
    };
    return (
    <div className="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-[440px] p-10 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-3">
                    <div className="w-10 h-10 flex items-center justify-center text-blue-500 text-xl font-bold">
                        TaskMaster
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Đăng nhập</h2>
                <p className="text-gray-500 text-sm mt-2">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
            </div>
            <LoginForm onSubmit={handleLogin} isLoading={loading} />
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Bạn chưa có tài khoản?{" "}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline transition-all">
                        Đăng ký ngay
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}
export default LoginPage;