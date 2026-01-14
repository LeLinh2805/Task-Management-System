const eventHub = require('../utils/eventHub');
const { Notification, User } = require('../models')

const setupNotificationSubscriber = () => {
    const notifyUsers = async ({task, actor, title, description, type }) => {
        try {
            const userSet = new Set();
            if (task.creatorId) userSet.add(task.creatorId);
            if (task.assigneeId) userSet.add(task.assigneeId);

            

            const notificationsData = Array.from(userSet).map(uId => ({
                userId: uId,
                title,
                description,
                type,
                referenceId: task.id,
                isRead: false
            }));
            await Notification.bulkCreate(notificationsData);

        } catch (error) {
            console.error("Notification Error", error);
        }
    };
    eventHub.on('TASK_CREATED', async ({ task, actor }) => {
        await notifyUsers({
            task,
            actor,
            title: `Task mới`,
            description: `${actor.fullName} đã tạo task: "${task.title}"`,
            type: 'TASK_CREATED'
        });
    });

    eventHub.on('TASK_UPDATED', async ({ task, actor }) => {
        await notifyUsers({
            task,
            actor,
            title: `Cập nhật Task`,
            description: `${actor.fullName} đã cập nhật trạng thái/nội dung task: "${task.title}"`,
            type: 'TASK_UPDATED'
        });
    });



    eventHub.on('TASK_DELETED', async ({task, actor}) => {
        await notifyUsers({
            task,
            actor,
            title: `Task đã xoá`,
            description: `${actor.fullName} đã xoá task: "${task.title}"`,
            type: 'TASK_DELETED'
        });
    });
}
module.exports = setupNotificationSubscriber;