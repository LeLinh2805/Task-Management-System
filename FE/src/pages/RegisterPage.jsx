import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import authApi from '../api/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  const handleRegister = async (formData) => {
    setLoading(true);
    setAlert("");

    try {
      await authApi.register(formData);
      setAlert("Đăng ký thành công! Đang chuyển về trang đăng nhập...");

      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    }catch{
      setAlert("Đăng ký thất bại. Vui lòng thử lại!");
      setTimeout(()=>{
            setAlert("");
        }, 3000)
    } finally {
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
                <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
                <p className="text-gray-500 text-sm mt-2">Bắt đầu công việc của bạn một cách hiệu quả hôm nay.</p>
            </div>
            <RegisterForm onSubmit={handleRegister} isLoading={loading} />
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                    Bạn đã có tài khoản?{" "}
                    <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
};

export default RegisterPage;