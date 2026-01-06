import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/Auth/RegisterForm';
import authApi from '../../api/authApi';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleRegister = async (formData) => {
    setLoading(true);
    setAlert("");

    try {
      await authApi.register(formData);
      setUserEmail(formData.email);
      setIsSuccess(true);

    } catch {
      setAlert("Đăng ký thất bại. Vui lòng thử lại!");
      setTimeout(() => {
        setAlert("");
      }, 3000)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f4f6] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[440px] p-10 rounded-2xl shadow-xl border border-gray-100">
        {isSuccess ? (
          <div className="text-center ">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Kiểm tra email!</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Chúng tôi đã gửi link xác thực đến:<br />
              <span className="font-bold text-gray-900">{userEmail}</span>
            </p>

            <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-700">
              Vui lòng bấm vào link trong email để kích hoạt tài khoản trước khi đăng nhập.
            </div>

            <Link
              to="/login"
              className="block w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Đã xác thực? Đăng nhập ngay
            </Link>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium underline"
            >
              Đăng ký lại bằng email khác
            </button>
          </div>
        ) : (<>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="w-10 h-10 flex items-center justify-center text-blue-500 text-xl font-bold">
                TaskMaster
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
            <p className="text-gray-500 text-sm mt-2">Bắt đầu công việc của bạn một cách hiệu quả hôm nay.</p>
          </div>
          {alert && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded text-center border border-red-100">
                {alert}
            </div>
          )}
          <RegisterForm onSubmit={handleRegister} isLoading={loading} />
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
                Đăng nhập
              </Link>
            </p>
          </div></>)}

      </div>
    </div>
  );
};

export default RegisterPage;