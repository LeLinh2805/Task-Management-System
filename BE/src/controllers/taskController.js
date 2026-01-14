const {Task, User, Op} = require('../models');
const {captureSnapshot} = require('../services/snapshotService');
const eventHub = require('../utils/eventHub');
const ExcelJS = require('exceljs');
//Create
exports.createTask = async(req, res) =>{
    try{
        const creatorId = req.user.id;
        const {title, description, status, priority, visibility, assigneeId, dueDate, attachmentUrl} = req.body;

        if(!title || title.trim() === ""){
            return res.status(400).json({message: "Tiêu đề không được để trống"});
        }

        if(!dueDate) {
            return res.status(400).json({message: "Công việc bắt buộc phải có hạn chót" });
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
            priority: priority || 'MEDIUM',
            visibility: visibility || 'PRIVATE',
            attachmentUrl,
            creatorId,
            dueDate: dueDate,
            assigneeId: assigneeId || null
        });

        eventHub.emit('TASK_CREATED', { task: newTask, actor: req.user });
        captureSnapshot(newTask, 'CREATE', req.user.id);
        
        return res.status(201).json(newTask);

    } catch(error){
        return res.status(500).json({error: error.message});
    }
}

//Get
exports.getTasks = async(req, res)=> {
    try{
        const userId = req.user.id;
        const {filterStatus, filterAssignee, filterPriority} = req.query;

        let whereClause = {
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
        if(filterPriority && filterPriority !== 'all') {
            whereClause.priority = filterPriority;
        }
        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                {model: User, as: 'creator', attributes: ['id', 'fullName', 'photo']},
                {model: User, as: 'assignee', attributes: ['id', 'fullName', 'photo']}
            ], 
            order: [
                ['dueDate', 'ASC'],
                ['createdAt', 'DESC']
            ]
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
        const canEdit = task.creatorId === req.user.id || (task.assigneeId && task.assigneeId === req.user.id);
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
        console.log("DEBUG - User ID đang thực hiện:", req.user?.id);
        eventHub.emit('TASK_UPDATED', { task, actor: req.user });
        captureSnapshot(task, 'UPDATE', req.user.id);
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
        eventHub.emit('TASK_DELETED', { task, actor: req.user });
        await task.destroy();
        return res.json({message: "Bạn đã xóa thành công"});
    
    } catch(error){
        return res.status(500).json({message: error.message});
    }
}
//export
exports.exportTasks = async (req, res) => {
    try {
        const { priority } = req.body;
        const whereClause = { creatorId: req.user.id };
        
        if (priority && priority !== 'all') {
            whereClause.priority = priority;
        }
    
        const tasks = await Task.findAll({
            where: whereClause,
            include: [
                { model: User, as: 'creator', attributes: ['fullName'] },
                { model: User, as: 'assignee', attributes: ['fullName'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Tasks');
        worksheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Priority', key: 'priority', width: 12 },
            { header: 'Assignees', key: 'assignee', width: 20 },
            { header: 'Created By', key: 'creator', width: 20 },
            { header: 'Created At', key: 'createdAt', width: 15 },
            { header: 'DueDate', key: 'dueDate', width: 15 },
        ];

        tasks.forEach(task => {
            worksheet.addRow({
                title: task.title,
                status: task.status,
                priority: task.priority,
                assignee: task.assignee?.fullName || '',
                creator: task.creator?.fullName || '', 
                createdAt: new Date(task.createdAt).toISOString().split('T')[0],
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
            });
        });

        worksheet.getRow(1).font = { bold: true };
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=' + 'tasks.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xuất file", error: error.message });
    }
};