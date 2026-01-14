const { User } = require('../models');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'fullName', 'email', 'photo'],
            order: [['fullName', 'ASC']]
        });
        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({ message: e.message });
    }
};

