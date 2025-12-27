import React from "react";
import { useState } from "react";
const RegisterForm = ({onSubmit, isLoading}) => {
    const [formData, setFormData] = useState({
        fullName: '', email: '', passWord: '', confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    
    const handleChange = (e)=> {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (error) setError("");
    };

    const handleSubmit = (e)=> {
        e.preventDefault();
        if(formData.passWord !== formData.confirmPassword){
            setError("Mật khẩu xác nhận không khớp!")
            return;
        }
        const {confirmPassword, ...dataToSend} = formData
        onSubmit(dataToSend);
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
                <label>FullName: </label>
                <input type="text" name="fullName" required 
                  onChange={handleChange}
                />
            </div>
            <div>
                <label>Mật khẩu: </label>
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
            <div>
                <label>Nhập lại mật khẩu: </label>
                <div>
                   <input type={showConfirmPassword ? "text" : "password"} 
                     name="confirmPassword" required 
                     onChange={handleChange}
                   /> 
                   <button type="button"
                     onClick={()=> setShowConfirmPassword(!showConfirmPassword)}
                   >
                    {showConfirmPassword ? "Ẩn" : "Hiện"}
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

export default RegisterForm;