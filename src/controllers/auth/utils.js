const argon2 = require('argon2');

async function hashPassword(password) {
    try {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    } catch (err) {
        console.error('Error hashing password:', err);
    }
}

async function verifyPassword(hashedPassword, plainPassword) {
    try {
        const isMatch = await argon2.verify(hashedPassword, plainPassword);
        return isMatch;
    } catch (err) {
        console.error('Error verifying password:', err);
    }
}

module.exports = {hashPassword, verifyPassword };