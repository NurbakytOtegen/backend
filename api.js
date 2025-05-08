const express = require('express')
const router = express.Router()
const User = require('./Data')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//JWT secret
const JWT_SECRET = 'secret_key'


//Register
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body
    const hashedPass = await bcrypt.hash(password, 10)
    const user = new User({username, email, password: hashedPass})
    await user.save()
    res.json({message: "User registered"})
})

//Login
router.post('/login', async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if (!user) return res.status(401).json({message: 'User not found'})
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(401).json({message: 'Invalid password'})
    
    const token = jwt.sign({
        id: user._id, 
        username: user.username}, 
        JWT_SECRET, 
        {expiresIn: '1h'})
    res.json({token})
})


const authMiddle = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Если заголовок авторизации отсутствует, возвращаем 401
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Извлекаем токен
    const token = authHeader.split(' ')[1];

    // Если токен отсутствует, возвращаем 401
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    try {
        // Проверяем токен
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;  // Добавляем информацию о пользователе в запрос
        next();  // Переходим к следующему обработчику
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}


//List of Users
router.get('/', authMiddle, async (req, res) => {
    const users = await User.find()
    res.json(users)
})


module.exports = router