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
      }, 1000);
      
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
    <div>
      <div>
        <h2>Đăng ký tài khoản</h2>
        <RegisterForm onSubmit={handleRegister} isLoading={loading} />
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;