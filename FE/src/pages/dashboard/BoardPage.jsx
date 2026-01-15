import { useState, useEffect, useMemo } from 'react';
import { Loader2, Search, Filter, Download } from 'lucide-react';
import TaskColumn from '../../components/Board/TaskColumn';
import MainLayout from '../../components/Layout/MainLayout';
import TaskDetailModal from '../../components/Board/TaskDetailModal';
import { BOARD_COLUMNS } from '../../lib/constants';
import taskApi from '../../api/taskApi';
import userApi from '../../api/userApi';
import { formatDaysLeft } from '../../lib/utils';
import TaskForm from '../../components/Board/TaskForm';
import NotificationDropdown from '../../components/NotificationDropdown';

const BoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTask, setSearchTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState("all");
  const [colum, setColum] = useState('TODO');
  const [users, setUsers] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  // DANH SÁCH USERS 
  const fetchUsers = async () => {
    try {
      const response = await userApi.getAll(); 
      console.log("Phản hồi từ API Users:", response);
      const data = Array.isArray(response) ? response : (response.data || []);
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterPriority !== 'all') {
        params.priority = filterPriority; 
      }

      const response = await taskApi.getAllTasks(params);
      const rawTasks = Array.isArray(response) ? response : (response.data || []);

      const processedTasks = rawTasks.map(task => ({
        ...task,
        id: task.id || task._id,
        daysLeft: task.dueDate ? formatDaysLeft(task.dueDate) : null,
      }));

      setTasks(processedTasks);
    } catch (error) {
      console.error("Lỗi khi tải danh sách task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, [filterPriority]);


  const groupedTasks = useMemo(() => {
    const groups = {};
    BOARD_COLUMNS.forEach(col => groups[col.id] = []);

    const filteredTasks = tasks.filter(task =>
      task.title?.toLowerCase().includes(searchTask.toLowerCase())
    );

    filteredTasks.forEach(task => {
      const statusKey = task.status ? task.status.toUpperCase() : 'TODO';
      if (groups[statusKey]) {
        groups[statusKey].push(task);
      }
    });
    return groups;
  }, [tasks, searchTask]);

  const openCreateModal = (columnId) => {
    setColum(columnId);
    setCreateModalOpen(true);
  };

  const handleAddTask = async (formData) => {
    try {
      const res = await taskApi.createTask({ ...formData, status: colum });
      const taskData = res.task || res;

      const newTask = {
        ...taskData,
        assignee: users.find(u => u.id == formData.assigneeId), 
        status: colum
      };
      setTasks(prev => [newTask, ...prev]);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Lỗi tạo task:", error);
    }
  };

  const handleUpdateTask = async (updatedData) => {
    try {
      const res = await taskApi.updateTask(updatedData.id, updatedData);
      const taskFromServer = res.task || res;

      setTasks(prevTasks => {
        return prevTasks.map(task =>
          String(task.id) === String(updatedData.id)
            ? {
              ...task,
              ...taskFromServer,
              daysLeft: taskFromServer.dueDate
                ? formatDaysLeft(taskFromServer.dueDate)
                : task.daysLeft
            }
            : task
        );
      });

      setSelectedTask(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setSelectedTask(null);
    } catch (error) {
      console.error("Lỗi khi xóa task:", error);
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
  };

  const handleExport = async () => {
    try {
      const response = await taskApi.exportTasks(filterPriority);
      console.log("Dữ liệu nhận được từ API:", response);
      const blobData = response.data || response;

      const blob = new Blob([blobData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tasks_Export_${new Date().getTime()}.xlsx`);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error("Export lỗi chi tiết:", error);
      alert("Không thể xuất file.");
    }
  };
  return (
    <>
      <MainLayout user={user}>
        <div className="flex flex-col h-screen bg-gray-50">
          <header className="px-8 py-5 bg-white border-b border-gray-200 flex justify-between items-center">
            <div className="w-48">
              <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-center">
              {/* Search */}
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm tên task..."
                  className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchTask}
                  onChange={(e) => setSearchTask(e.target.value)}
                />
              </div>

              <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div>

              {/* Filter Priority */}
              <div className="relative">
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <select
                  className="pl-9 pr-8 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 font-medium hover:bg-gray-50"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="all">ALL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
              >
                <Download size={16} /> Xuất file Excel
              </button>
              <NotificationDropdown />
            </div>
          </header>

          <div className="flex-1 overflow-x-auto p-8 mx-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 gap-2">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="flex gap-16 h-full w-fit mx-auto min-w-min px-4">
                {BOARD_COLUMNS.map((column) => (
                  <TaskColumn
                    key={column.id}
                    title={column.title}
                    color={column.color}
                    tasks={groupedTasks[column.id]}
                    emptyConfig={column}
                    onAddTask={() => openCreateModal(column.id)}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>

      <TaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleAddTask}
        users={users}
        defaultStatus={colum}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          currentUser={user}
        />
      )}
    </>
  );
};

export default BoardPage;