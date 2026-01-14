const { Comment, User, Task } = require('../models');

exports.createComment = async (req, res) => {
    try {
        const { taskId, content } = req.body;
        const userId = req.user.id;

        if(!content || content.trim() === "") {
            return res.status(400).json({ message: "Nội dung không được để trống" });
        }

        const task = await Task.findByPk(taskId);
        if(!task) {
            return res.status(404).json({ message: "Task không tồn tại" });
        }

        if (task.visibility === 'PRIVATE') {
            const isCreator = task.creatorId === userId;
            const isAssignee = task.assigneeId === userId;

            if (!isCreator && !isAssignee) {
                return res.status(403).json({ 
                    message: "Bạn không có quyền bình luận vào task riêng tư này." 
                });
            }
        }

        const newComment = await Comment.create({ taskId, userId, content });

        const fullComment = await Comment.findByPk(newComment.id, {
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'fullName', 'photo']
            }]
        });

        res.status(201).json(fullComment);
    } catch(error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

exports.getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const comments = await Comment.findAll({
            where: { taskId },
            include: [{
                model: User,
                as: 'author',
                attributes: ['id', 'fullName', 'photo']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(comments);
    } catch(error) {
        res.status(500).json({ message: "Lỗi tải comment", error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id);
        if (!comment) return res.status(404).json({ message: "Không tìm thấy comment" });

        if (comment.userId !== userId) {
            return res.status(403).json({ message: "Bạn chỉ có thể sửa bình luận của chính mình" });
        }

        comment.content = content;
        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findByPk(id);
        if(!comment) return res.status(404).json({message: "Không tìm thấy comment"});

        if(comment.userId !== userId) {
            return res.status(403).json({message: "Bạn chỉ có thể xoá bình luận của chính mình"});
        }

        await comment.destroy();
        res.status(200).json({message: "Đã xoá comment"});
    } catch (error) {
        res.status(500).json({message: "Lỗi xoá", error: error.message});
    }
};