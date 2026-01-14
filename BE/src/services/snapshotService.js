const {TaskSnapshot} = require('../models');

/** Helper: Tu dong chup lai trang thai Task
 * @param {Object} task - Object task vua dc luu 
 * @param {String} actionType - 'CREATE' | 'UPDATE'
 * @param {Interger} userId - ID 
 */

const captureSnapshot = async (task, actionType, userId) =>{
    try{
        await TaskSnapshot.create({
            taskId: task.id,
            actionType: actionType,
            title: task.title,
            description: task.description,
            status: task.status,
            updatedBy: userId
        });
        console.log(`Đã lưu lịch sử Task #${task.id} | Action: ${actionType}`);
        
    } catch(error){
        console.error('Lỗi khi tạo snapshot', error);
    }
}
module.exports = {captureSnapshot};
