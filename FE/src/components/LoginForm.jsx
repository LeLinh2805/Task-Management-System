import React from "react";
import { useState } from "react";

const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({ email: '', passWord: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form className="bg-slate-300 p-8 rounded-3xl shadow-xl border border-gray-400 space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-700 ml-1">
          Email:
        </label>
        <input type="email" name="email" placeholder="nhap@email.com" required
          className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                  focus:ring-2 focus:ring-black-400 outline-none translate-all"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">

        <label className="text-sm font-bold text-slate-700 ml-1">
          Mật khẩu:
        </label>

        <div className="relative">
          <div className="flex justify-between items-center px-1">
            <input type={showPassword ? "text" : "password"}
              name="passWord" placeholder="********" required
              className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                       focus:ring-2 focus:ring-black-400 outline-none translate-all"
              onChange={handleChange}
            />
            <button type="button" className="absolute right-3 top-2.2 text-xs font-black text-slate-700 hover:text-slate-800 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
          <div className="flex justify-end mt-1">
            <a href="/" title="Quên mật khẩu" 
            className="text-xs font-bold text-slate-700 ml-1 hover:text-blue-800" >
              Quên mật khẩu
            </a>
          </div>
          
        </div>



      </div>
      <button type="submit"
      className="w-full py-1.5 bg-blue-400 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý ...' : 'Đăng nhập'}
      </button>

    </form>

  );
};

export default LoginForm