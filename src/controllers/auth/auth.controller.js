const jwt = require('jsonwebtoken');
const User = require('../../models/userSchema');
const { hashPassword, verifyPassword } = require('./utils');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user||user.deleted) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        isMatch = await verifyPassword(user.password, password);

        if (!isMatch) {
            return res.status(401).json({ message: "Credenciales Invalidas" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        const err = JSON.parse(error.message);
        res.status(err.code).json({ message: "Error al iniciar sesión", err });
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Por favor complete todos los campos" });
        }

        if (await User.findOne({ email})) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const passwordHash = await hashPassword(password);

        const newUser = new User({
            name,
            email,
            password:passwordHash,
        });

        await newUser.save();

        res.status(201).json({
            message: "Usuario registrado exitosamente", user: newUser
        });

    } catch (error) {
        res.status(500).json({ message: "Error al registrar usuario", error });
    }
};

const verifyToken=async (req, res, next)=>{
    try {
        
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No autorizado" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        const user = await User.findById(req.userId, { password: 0 });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        next();

    } catch (error) {
        res.status(500).json({message: "No autorizado", error});
    }
}

module.exports = { login, register, verifyToken};