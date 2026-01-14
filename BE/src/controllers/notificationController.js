const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const [count] = await Notification.update(
            { isRead: true },
            {
                where: {
                    id,
                    userId: req.user.id
                }
            }
        );

        if (count === 0) {
            return res.status(404).json({
                success: false,
                message: "Không có thông báo!"
            })
        }
        res.status(200).json({ success: true });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};