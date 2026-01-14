const {Task, Subtask, Op} = require('../models');

const subtaskController = {
    createSubtask: async (req, res) => {
        try {
            const { taskId, title, description } = req.body;
            const userId = req.user.id;

            if (!taskId || !title) {
                return res.status(400).json({ message: "Thiếu taskId hoặc title" });
            }
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task cha không tồn tại" });
            }
            const hasPermission = task.creatorId === userId || task.assigneeId === userId;
            if (!hasPermission) {
                return res.status(403).json({ message: "Bạn không có quyền thêm subtask vào task này" });
            }

            const newSub = await Subtask.create({
                taskId,
                title,
                description,
                isCompleted: false,
            });

            return res.status(201).json(newSub);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    getSubtasksByTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            const subtasks = await Subtask.findAll({
                where: { taskId },
                order: [['createdAt', 'ASC']]
            });
            return res.status(200).json(subtasks);
        } catch (error) {
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    updateSubtask: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, isCompleted } = req.body;
            const userId = req.user.id;

            const subtask = await Subtask.findByPk(id, {
                include: [{ model: Task, as: 'task' }] 
            });
            if (!subtask) {
                return res.status(404).json({ message: "Không tìm thấy Subtask" });
            }

            const parentTask = subtask.task; 
            if (parentTask) {
                const hasPermission = parentTask.creatorId === userId || parentTask.assigneeId === userId;
                if (!hasPermission) {
                     return res.status(403).json({ message: "Bạn không có quyền sửa task này" });
                }
            }
            await subtask.update({
                title,
                description,
                isCompleted
            });
            return res.status(200).json(subtask);
        } catch (error) {
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    deleteSubtask: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const subtask = await Subtask.findByPk(id, {
                include: [{ model: Task, as: 'task' }]
            });
            if (!subtask) {
                return res.status(404).json({ message: "Subtask không tồn tại" });
            }
            const parentTask = subtask.task;
            if (parentTask) {
                if (parentTask.creatorId !== userId && parentTask.assigneeId !== userId){
                    return res.status(403).json({ message: "Không có quyền xóa" });
                }
            }
            await subtask.destroy();
            return res.status(200).json({ message: "Đã xóa thành công" });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    }
};

module.exports = subtaskController;