import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import authApi from '../api/authApi';

const LoginPage = () =>{
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const handleLogin = async(formData)=>{
        setLoading(true);
        setAlert('');
        try{
            const res = await authApi.login(formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
             
            setAlert("Đăng nhập thành công!");
            setTimeout(()=>{
                navigate('/dashboard');
            }, 1000);
        }catch{
            setAlert("Đăng nhập thất bại!");
            setTimeout(()=>{
                setAlert("");
            }, 3000)
        }finally{
            setLoading(false);
        }
    };
    return(
        <div>
            <div>
                <h2>TaskMaster Login</h2>
                <LoginForm onSubmit={handleLogin} isLoading={loading} />
                <p>Chưa có tài khoản?
                    <Link to="/register">Đăng ký</Link>
                </p>
            </div>
        </div>
    )
}
export default LoginPage;