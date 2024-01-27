const express = require('express');
const userRouter = express();
const path = require('path');
const session = require('express-session');
const ss = process.env.SS_SECRET;
userRouter.use(session({ secret: ss, resave: false, saveUninitialized: true }));

const userController = require('../../controllers/user.controller');
const { isLogin, isLogout } = require('../../middlewares/auth');

userRouter.set('view engine', 'ejs');
userRouter.set('views', path.join(__dirname, '../..', 'views'));

userRouter.use(express.static('public'));

userRouter.get('/register', isLogout, userController.registerLoad);
userRouter.post('/register', userController.register);

userRouter.get('/', isLogout, userController.loginLoad);
userRouter.post('/', userController.login);
userRouter.get('/logout', userController.logout);
userRouter.get('/dashboard', isLogin, userController.dashboardLoad);
userRouter.post('/save-chat', userController.saveChat);

module.exports = userRouter;
