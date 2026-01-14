const {TaskSnapshot, User} = require('../models');

const getTaskHistory = async(req, res) =>{
    try {
        const {id} = req.params;
        const history = await TaskSnapshot.findAll({
            where: {taskId: id},
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'editor',
                    attributes: ['id', 'fullName', 'photo']
                }

            ]
        });
        return res.json(history);
    } catch(error){
        console.error(error);
        return res.status(500).json({message: "Lỗi server khi lấy lịch sử task "});
    }
}
module.exports = { getTaskHistory };