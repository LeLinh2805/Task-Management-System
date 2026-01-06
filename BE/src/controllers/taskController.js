const {Task, User, Op} = require('../models');

//Create
exports.createTask = async(req, res) =>{
    try{
        const creatorId = req.user.id;
        const {title, description, status, visibility, assigneeId, attachmentUrl} = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({message: "Tiêu đề không được để trống"});
        }

        if(assigneeId){
            const assigneeExists = await User.findByPk(assigneeId);
            if(!assigneeExists){
                return res.status(404).json({message: "Người được giao task không tồn tại"});
            }
        }
        const newTask = await Task.create({
            title,
            description,
            status: status || 'TODO',
            visibility: visibility || 'PRIVATE',
            attachmentUrl,
            creatorId,
            assigneeId: assigneeId || null
        });
        return res.status(201).json(newTask);

    } catch(error){
        return res.status(500).json({error: error.message});
    }
}

//Get
exports.getTasks = async(req, res)=> {
    try{
        const userId = req.user.id;
        const {filterStatus, filterAssignee} = req.query;

        let whereClause = {
            isArchived: false,
            [Op.or]: [
                {creatorId: userId},
                {assigneeId: userId},
                {visibility: 'PUBLIC'}
            ]
        }
        
        if(filterStatus){
            whereClause.status = filterStatus;
        }
        if(filterAssignee){
            whereClause.assigneeId = filterAssignee;
        }
        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                {model: User, as: 'creator', attributes: ['id', 'fullName', 'photo']},
                {model: User, as: 'assignee', attributes: ['id', 'fullName', 'photo']}
            ], 
            order: [['createdAt', 'DESC']]
        })
        return res.json(tasks);
    } catch(error){
        return res.status(500).json({error: error.message});
    }
}
// Get detail
exports.getTaskDetail = async (req, res) =>{
    try{
        const {id} = req.params;
        const task = await Task.findByPk(id, {
            include: [
                {model: User, as: 'creator', attributes: ['id', 'fullName', 'photo']},
                {model: User, as: 'assignee', attributes: ['id', 'fullName', 'photo']}
            ]
        });
        if(!task){
            return res.status(404).json({message: "Task không tồn tại"});
        }
        const isCreator = task.creatorId === req.user.id;
        const isAssignee = task.assigneeId === req.user.id;
        const isPublic = task.visibility === 'PUBLIC';
        if(!isPublic && !isCreator && !isAssignee){
            return res.status(403).json({message: "Bạn không có quyền xem task riêng tư này"});
        }
        return res.json(task);
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}

//update
exports.updateTask = async(req, res) =>{
    try{
        const {id} = req.params;
        const {title, status, assigneeId, ...ortherData} =req.body;
        const task = await Task.findByPk(id);

        if(!task){
            return res.status(404).json({message: "Không tìm thấy task để cập nhật"})
        }
        //check quyen
        const canEdit = task.creatorId === req.user.id || task.assigneeId === req.user.id;
        if(!canEdit){
            return res.status(403).json({message: "Bạn không có quyền chỉnh sửa task này"});
        }

        if(title !== undefined && title.trim() === ""){
            return res.status(400).json({message: "Tiêu đề không được để trống"});
        }
        if(assigneeId){
            const user = await User.findByPk(assigneeId);
            if(!user){
                return res.status(404).json({message: "Người được giao k hợp lệ"})
            }
        }
        await task.update({title, status, assigneeId, ...ortherData});
        return res.json({message: "Cập nhật thành công", task});
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
}

//delete
exports.deleteTask = async(req, res) =>{
    try{
        const {id} = req.params;
        const task = await Task.findByPk(id);

        if(!task){
            return res.status(404).json({message: "Không tìm thấy task"});
        }
        //check quyen
        if(task.creatorId !== req.user.id){
            return res.status(403).json({message: "Chỉ người tạo mới có quyền xóa task"});

        }
        await task.destroy();
        return res.json({message: "Bạn đã xóa thành công"});
    
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}