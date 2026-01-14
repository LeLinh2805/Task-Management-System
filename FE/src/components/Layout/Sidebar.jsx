import { LogOut, X } from 'lucide-react';
import { NavLink, replace, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { SIDEBAR_MENU } from '../../lib/constants';
import defaultAvatar from '../../assets/default_avatar.png'

const Sidebar = ({ user, isOpen, onClose }) => {
    const navigate = useNavigate();
    const hangleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
    }
    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                )}
                onClick={onClose}>
            </div>
            <div className={cn('w-72 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out',
                isOpen ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0 md:static")}>

                {/* Logo */}
                <div className='p-6 h-20 flex items-center'>
                    <span className='text-2xl font-bold text-gray-800 tracking-tighter'>
                        TaskMaster
                    </span>
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700 ml-auto">
                        <X size={24} />
                    </button>
                </div>

                {/* Menu chính */}
                <nav className='flex-1 px-4 space-y-1 overflow-y-auto'>
                    {SIDEBAR_MENU.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </NavLink>
                    ))}

                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                        <img
                            src={user.photo || defaultAvatar}
                            alt="avatar"
                            className="w-9 h-9 rounded-full object-cover border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-900">{user.fullName}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={hangleLogout}
                            title='Logout'
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                            <LogOut size={18} />
                        </button>

                    </div>

                </div>
            </div>
        </>
    );
}

export default Sidebar;