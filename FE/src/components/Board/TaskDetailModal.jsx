import React, { useState, useEffect } from 'react';
import { Calendar, Flag, Trash2, Save, AlignLeft, Clock, Link, CheckSquare, MessageSquare, Send, History, X } from 'lucide-react';
import Modal from '../common/Modal';
import { getPriorityColor } from '../../lib/utils';
import taskApi from "../../api/taskApi";
import subtaskApi from "../../api/subtaskApi";
import commentApi from "../../api/commentApi";
import defaultAvatar from '../../assets/default_avatar.png'

const TaskDetailModal = ({ task, onClose, onUpdate, onDelete, currentUser }) => {

  const [formData, setFormData] = useState({ ...task });
  const [activeTab, setActiveTab] = useState('details');
  const [subtasks, setSubtasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [snapshots, setSnapshots] = useState([]);

  const [newSubtask, setNewSubtask] = useState('');
  const [newComment, setNewComment] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  useEffect(() => {
    if (task) {
      setFormData({ ...task });
      fetchData();
    }
  }, [task, activeTab]);

  const fetchData = async () => {
    try {
      // Load Subtasks Comments
      if (activeTab === 'details') {
        if (task.Subtasks && subtasks.length === 0) {
          setSubtasks(task.Subtasks);
        } else if (subtasks.length === 0) {

        }

        if (comments.length === 0) {
          const commentsRes = await commentApi.getCommentsByTask(task.id);
          setComments(Array.isArray(commentsRes) ? commentsRes : []);
        }
      }
      if (activeTab === 'history' && snapshots.length === 0) {
        setLoadingHistory(true);
        const historyRes = await taskApi.getSnapshots(task.id);
        setSnapshots(Array.isArray(historyRes) ? historyRes : []);
        setLoadingHistory(false);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setLoadingHistory(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleAddSubtask = async (e) => {
    if (e.key === 'Enter' && newSubtask.trim()) {
      try {
        const res = await subtaskApi.createSubtask({ taskId: task.id, title: newSubtask });
        setSubtasks([...subtasks, res]);
        setNewSubtask('');
      } catch (err) {
        console.error(err)
      }
    }
  };

  const toggleSubtask = async (subId, currentStatus) => {
    try {
      await subtaskApi.updateSubtask(subId, { isCompleted: !currentStatus });
      setSubtasks(subtasks.map(s => s.id === subId ? { ...s, isCompleted: !currentStatus } : s));
    } catch (err) { console.error(err); }
  };

  const deleteSubtask = async (subId) => {
    try {
      await subtaskApi.deleteSubtask(subId);
      setSubtasks(subtasks.filter(s => s.id !== subId));
    } catch (err) { console.error(err); }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await commentApi.createComment({ taskId: task.id, content: newComment });
      setComments([res, ...comments]);
      setNewComment('');
    } catch (err) { console.error(err) }
  };
  const handleUpdateComment = async (id) => {
    if (!editText.trim()) return;
    try {
      await commentApi.updateComment(id, { content: editText });
      setComments(comments.map(c =>
        c.id === id ? { ...c, content: editText } : c
      ));
      setEditingId(null);
      setEditText('');
    } catch (err) {
      console.error("Lỗi cập nhật bình luận:", err);
    }
  };
  const deleteComment = async (cId) => {
    try {
      await commentApi.deleteComment(cId);
      setComments(comments.filter(c => c.id !== cId));
    } catch (err) { console.error(err) }
  };

  const renderFooter = (
    <>
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors mr-auto"
      >
        <Trash2 size={18} /> Xóa Task
      </button>
      <button
        onClick={onClose}
        className="px-5 py-2 text-gray-600 font-medium bg-white border border-gray-200 hover:bg-gray-50 rounded-lg"
      >
        Đóng
      </button>
      {activeTab === 'details' && (
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md"
        >
          <Save size={18} /> Lưu Thay Đổi
        </button>
      )}
    </>
  );
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-1 border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
          >
            <History size={16} /> History
          </button>
        </div>
      }
      footer={renderFooter}
    >
      {/*TaskDetail*/}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">


            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-lg font-bold text-gray-800 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors py-1"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                <AlignLeft size={18} /> <span>Description</span>
              </div>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-sm"
                placeholder="..."
              />
            </div>
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium text-sm">
                <Link size={18} className="text-gray-400" />
                <span>attachmentUrl</span>
              </div>
              <input
                type="text"
                name="attachmentUrl"
                value={formData.attachmentUrl || ''}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-all"
                placeholder="Thêm link tài liệu (nếu có)..."
              />
            </div>

            {/* SUBTASKS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm">
                  <CheckSquare size={16} /> SubTask ({subtasks.filter(s => s.isCompleted).length}/{subtasks.length})
                </h3>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${subtasks.length ? (subtasks.filter(s => s.isCompleted).length / subtasks.length) * 100 : 0}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                {subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 group hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={sub.isCompleted}
                      onChange={() => toggleSubtask(sub.id, sub.isCompleted)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className={`flex-1 text-sm ${sub.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {sub.title}
                    </span>
                    <button
                      onClick={() => deleteSubtask(sub.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <input
                  type="text"
                  placeholder="+ SubTask"
                  className="w-full px-2 py-1.5 text-sm border-none bg-transparent hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded transition-all"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={handleAddSubtask}
                />
              </div>
            </div>

            {/* 4. COMMENTS */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2 text-sm mb-4">
                <MessageSquare size={16} /> Bình luận
              </h3>

              {/* Comments */}
              <div className="max-h-[250px] overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin">
                {comments.length === 0 && <p className="text-xs text-gray-400 italic text-center">Chưa có Comment nào.</p>}

                {comments.map((c) => (
                  <div key={c.id} className="flex gap-2 group">
                    <img src={c.author?.photo || defaultAvatar} className="w-7 h-7 rounded-full mt-0.5 shadow-sm" alt="avatar" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1 px-1">
                        <span className="text-[11px] font-bold text-gray-800">{c.author?.fullName}</span>
                        <span className="text-[10px] text-gray-400">{new Date(c.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm relative">
                        {editingId === c.id ? (
                          <div className="space-y-2">
                            <textarea
                              className="w-full text-sm border rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              autoFocus
                            />
                            <div className="flex justify-end gap-3">
                              <button onClick={() => setEditingId(null)} className="text-[10px] text-gray-400 hover:underline">Hủy</button>
                              <button onClick={() => handleUpdateComment(c.id)} className="text-[10px] text-blue-600 font-bold hover:underline">Lưu</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
                        )}
                      </div>
                      {currentUser?.id == c.userId && !editingId && (
                        <div className="flex justify-end gap-4 mt-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditingId(c.id); setEditText(c.content); }}
                            className="text-[11px] text-gray-500 hover:text-blue-600 font-medium transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteComment(c.id)}
                            className="text-[11px] text-gray-500 hover:text-red-500 font-medium transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendComment} className="relative">
                <input
                  className="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Viết bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 p-1.5 hover:bg-blue-50 rounded-full">
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/**/}
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Visibility</label>
              <div className="flex gap-2">
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Priority</label>
              <div className="relative">
                <Flag className={`absolute left-3 top-2.5 h-4 w-4 ${getPriorityColor(formData.priority)}`} />
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">dueDate</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
              <Clock size={12} />
              <span>Tạo ngày: {new Date(task.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>
        </div>
      )}

      {/*Histoty */}
      {activeTab === 'history' && (
        <div className="max-h-[500px] overflow-y-auto pr-2">
          {loadingHistory && <div className="text-center py-4 text-gray-500">Đang tải lịch sử...</div>}

          {!loadingHistory && snapshots.length === 0 && (
            <div className="text-center text-gray-400 py-10 italic">Chưa có lịch sử thay đổi.</div>
          )}

          {!loadingHistory && snapshots.length > 0 && (
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pl-6 py-2">
              {snapshots.map((snap) => (
                <div key={snap.id} className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 bg-white border-2 border-blue-500 rounded-full"></span>

                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-gray-800">{snap.editor?.fullName || 'User'}</span>
                      <span className="text-xs text-gray-500">đã cập nhật • {new Date(snap.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p><strong>Action</strong> {snap.actionType}</p>
                      <p><strong>Tiêu đề:</strong> {snap.title || 'Không thay đổi'}</p>
                      <p><strong>Trạng thái:</strong> {snap.status || 'Không thay đổi'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default TaskDetailModal;