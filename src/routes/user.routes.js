const {Router} = require('express');
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/user/user.controller');
const { verifyToken } = require('../controllers/auth/auth.controller');

const router=Router();

router.get("/:id", verifyToken, getUser); //Obtener un usuario
router.patch("/update/:id", verifyToken, updateUser); //Actualizar un usuario
router.delete("/delete/:id", verifyToken, deleteUser); //Actualizar un usuario

module.exports = router;