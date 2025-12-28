import React from "react";
import { useState } from "react";
const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', passWord: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.passWord !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!")
      return;
    }
    const { confirmPassword, ...dataToSend } = formData
    onSubmit(dataToSend);
  }

  return (
    <form className="bg-slate-300 p-8 rounded-3xl shadow-xl border border-gray-400 space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Email: </label>
        <input type="email" name="email" required
          className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                  focus:ring-2 focus:ring-black-400 outline-none translate-all"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-700 ml-1">FullName: </label>
        <input type="text" name="fullName" required
          className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                  focus:ring-2 focus:ring-black-400 outline-none translate-all"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Mật khẩu: </label>
        <div className="relative flex justify-between items-center px-1">
          <input type={showPassword ? "text" : "password"}
            name="passWord" placeholder="******" required
            className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                  focus:ring-2 focus:ring-black-400 outline-none translate-all"
            onChange={handleChange}
          />
          <button type="button"
            className="absolute right-3 top-2.2 text-xs font-black text-slate-700 hover:text-slate-800 p-1"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>

      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-bold text-slate-700 ml-1">Nhập lại mật khẩu: </label>
        <div className="relative flex justify-between items-center px-1">
          <input type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword" placeholder="******" required
            className="w-full px-2 py-1 rounded-xl bg-white focus:bg-slate-50 
                  focus:ring-2 focus:ring-black-400 outline-none translate-all"
            onChange={handleChange}
          />
          <button type="button"
            className="absolute right-3 top-2.2 text-xs font-black text-slate-700 hover:text-slate-800 p-1"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Ẩn" : "Hiện"}
          </button>
        </div>

      </div>
      <button type="submit"
        className="w-full py-1.5 bg-blue-400 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg"
        disabled={isLoading}
      >
        {isLoading ? 'Đang xử lý ...' : 'Đăng kí'}
      </button>

    </form>
  );
};

export default RegisterForm;