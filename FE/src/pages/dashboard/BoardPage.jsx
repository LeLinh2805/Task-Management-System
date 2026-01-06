import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import TaskColumn from '../../components/Board/TaskColumn';
import MainLayout from '../../components/Layout/MainLayout';
import { BOARD_COLUMNS } from '../../lib/constants';
import taskApi from '../../api/taskApi'; 

const BoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTask, setSearchTask] = useState("");
  
  // Lấy thông tin user từ localStorage để hiển thị Sidebar
  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await taskApi.getAllTasks();
        setTasks(Array.isArray(response) ? response : []); 
      } catch (error) {
        console.error("Lỗi khi tải danh sách task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const groupedTasks = useMemo(() => {
    const groups = {};
    BOARD_COLUMNS.forEach(col => groups[col.id] = []);
    
    const filteredTasks = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTask.toLowerCase())
    );

    filteredTasks.forEach(task => {
      const statusKey = task.status?.toLowerCase();
      if (groups[statusKey]) { 
        groups[statusKey].push(task);
      }
    });
    return groups;
  }, [tasks, searchTask]);

  return (
    <MainLayout user={user}>
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="px-8 py-5 bg-white border-b border-gray-200 flex justify-between items-center">
           <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
           
           <div className="relative">
              <input 
                type="text"
                placeholder="Tìm kiếm task..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTask}
                onChange={(e) => setSearchTask(e.target.value)}
              />
           </div>
        </header>

        <div className="flex-1 overflow-x-auto p-8">
          {loading ? (
             <div className="h-full flex items-center justify-center text-gray-500 gap-2">
                <Loader2 className="animate-spin" /> Đang tải dữ liệu...
             </div>
          ) : (
            <div className="flex gap-8 h-full min-w-max">
              {BOARD_COLUMNS.map((column) => (
                <TaskColumn 
                  key={column.id}
                  title={column.title}
                  color={column.color}
                  tasks={groupedTasks[column.id]} 
                  emptyConfig={column}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BoardPage;