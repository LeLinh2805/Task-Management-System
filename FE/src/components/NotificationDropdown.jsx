import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import notificationApi from '../api/notificationApi';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNoti();
    const interval = setInterval(fetchNoti, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNoti = async () => {
    try {
      const res = await notificationApi.getAll();
      const data = Array.isArray(res) ? res : [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (e) { console.error(e); }
  };

  const handleRead = async (noti) => {
    if (!noti.isRead) {
      try {
        await notificationApi.markAsRead(noti.id);
        setNotifications(prev =>
          prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        fetchNoti();
      } catch (error) {
        console.error("Lỗi đánh dấu đã đọc:", error);
      }
    }
  };

  return (
    <div className="relative z-20">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 text-sm">Thông báo</h3>
              <span className="text-xs text-blue-600 cursor-pointer" onClick={fetchNoti}>Làm mới</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? <p className="p-4 text-center text-xs text-gray-400">Không có thông báo mới</p> : null}
              {notifications.map(noti => (
                <div
                  key={noti.id}
                  onClick={() => handleRead(noti)}
                  className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${!noti.isRead ? 'bg-blue-50/60' : ''}`}
                >
                  <p className={`text-sm ${!noti.isRead ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{noti.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{noti.description}</p>
                  <p className="text-[10px] text-gray-400 mt-2 text-right">{new Date(noti.createdAt).toLocaleString('vi-VN')}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default NotificationDropdown;