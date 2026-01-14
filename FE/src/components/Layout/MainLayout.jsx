import { useState } from 'react';
import { Menu } from 'lucide-react'; 
import Sidebar from './Sidebar';

const MainLayout = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* Header Mobile: */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
           <span className="font-bold text-gray-800">TaskMaster</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>
      <Sidebar 
        user={user} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
     <main className="flex-1 overflow-y-auto overflow-x-hidden w-full relative transition-all duration-300">
        <div className="min-h-full">
            {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;