import React, { useState } from 'react';
import { Calendar, Flag, User, Eye, Link, AlignLeft, Loader2 } from 'lucide-react';
import Modal from '../common/Modal'; // Import Modal có sẵn của bạn

const TaskForm = ({ isOpen, onClose, onCreate, users = [] }) => {
  // State dữ liệu form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    visibility: "PUBLIC",
    attachmentUrl: "",
    assigneeId: ""
  });

  // State trạng thái
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm reset và đóng
  const handleClose = () => {
    setFormData({
      title: "", description: "", priority: "MEDIUM",
      dueDate: "", visibility: "PUBLIC", attachmentUrl: "", assigneeId: ""
    });
    setError("");
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Xoá lỗi khi user nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề công việc!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      // Gọi hàm từ cha (BoardPage)
      await onCreate(formData);

      // Thành công -> Đóng modal
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  // --- NỘI DUNG FOOTER ---
  const renderFooter = (
    <>
      <button
        type="button"
        onClick={handleClose}
        disabled={isLoading}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Hủy bỏ
      </button>

      <button
        type="submit"
        form="create-task-form" // QUAN TRỌNG: Link nút này với form bên dưới
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
        {isLoading ? "Đang xử lý..." : "Tạo công việc"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo công việc mới"
      footer={renderFooter}
    >
      <form id="create-task-form" onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Tiêu đề */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            autoFocus
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Priority */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Flag size={12} /> Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Calendar size={12} /> Deadline
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <User size={12} /> Assignee
            </label>
            <select
              name="assigneeId"
              value={formData.assigneeId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Chọn thành viên --</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </div>

          {/* Visibility */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
              <Eye size={12} /> Visibility
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="PRIVATE">PRIVATE</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
            <AlignLeft size={12} /> Description
          </label>
          <textarea
            name="description"
            rows="4"
            placeholder="Nhập nội dung công việc..."
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          ></textarea>
        </div>

        {/* Attachment */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
            <Link size={12} /> Link đính kèm
          </label>
          <input
            type="text"
            name="attachmentUrl"
            value={formData.attachmentUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;