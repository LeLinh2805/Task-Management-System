import React from "react";
import { useState } from "react";

const LoginForm = ({onSubmit, isLoading}) =>{
    const [formData, setFormData] = useState({email:'', passWord:''});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e)=> {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e)=> {
        e.preventDefault();
        onSubmit(formData);
    }

    return(
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email: </label>
                <input type="email" name="email" required 
                  onChange={handleChange}
                />
            </div>
            <div>
                <label>Mật khẩu: </label>
                <a href="/" title="Quên mật khẩu">Quên mật khẩu</a>
                <div>
                   <input type={showPassword ? "text" : "password"} 
                     name="passWord" required 
                     onChange={handleChange}
                   /> 
                   <button type="button"
                     onClick={()=> setShowPassword(!showPassword)}
                   >
                    {showPassword ? "Ẩn" : "Hiện"}
                   </button>
                </div>
                
            </div>
            <button type="submit"
              disabled={isLoading}  
            >
                {isLoading ? 'Đang xử lý ...' : 'Đăng nhập'}
            </button>
            
        </form>

    );
};

export default LoginForm