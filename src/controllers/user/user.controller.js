const User = require("../../models/userSchema");

const getUser = async (req, res) => {
    try {
        if (req.userId!=req.params.id) return res.status(403).json({ message: "No tienes permiso para ver este usuario" });

        const user = await User.findById(req.params.id);

        if (!user||user.deleted) return res.status(400).json({ message: "El usuario no existe" });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        if (req.userId!=req.params.id) return res.status(403).json({ message: "No tienes permiso para actualizar este usuario" });

        let user = await User.findById(req.params.id);
        if (user.deleted) return res.status(400).json({ message: "El usuario no existe" });

        user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.userId!=req.params.id) return res.status(403).json({ message: "No tienes permiso para eliminar este usuario" });

        const user = await User.findById(req.params.id);
        if (user.deleted) return res.status(400).json({ message: "El usuario no existe" });

        user.deleted = true;
        await user.save()

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {getUser, updateUser, deleteUser};