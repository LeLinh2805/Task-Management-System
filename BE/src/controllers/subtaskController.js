const {Task, Subtask, Op} = require('../models');

const subtaskController = {
    createSubtask: async (req, res) => {
        try {
            const { taskId, title, description } = req.body;

            if (!taskId || !title) {
                return res.status(400).json({ message: "Thiếu taskId hoặc title" });
            }
            const task = await Task.findByPk(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task cha không tồn tại" });
            }

            const newSub = await Subtask.create({
                taskId,
                title,
                description,
                status: 'TODO'
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
            const updateData = req.body;

            const subtask = await Subtask.findByPk(id);
            if (!subtask) {
                return res.status(404).json({ message: "Không tìm thấy Subtask" });
            }
            await subtask.update(updateData);
            return res.status(200).json(subtask);
        } catch (error) {
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    },

    deleteSubtask: async (req, res) => {
        try {
            const { id } = req.params;

            const subtask = await Subtask.findByPk(id);
            if (!subtask) {
                return res.status(404).json({ message: "Subtask không tồn tại" });
            }
            await subtask.destroy();
            return res.status(200).json({ message: "Đã xóa thành công" });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi Server", error: error.message });
        }
    }
};

module.exports = subtaskController;