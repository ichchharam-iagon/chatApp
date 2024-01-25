const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const bcrypt = require('bcrypt');

const registerLoad = async (req, res) => {
  try {
    res.render('register');
  } catch (err) {
    console.log(err.message);
  }
};

const register = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const userLow = userName.toLowerCase();

    const check = await User.findOne({ userName: userLow });
    if (!check) {
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        userName: userLow,
        password: passwordHash,
      });
      res.render('register', {
        message: 'User registration successful Please Login',
      });
    } else {
      res.render('register', { messageEr: 'User already exist' });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
};

const loginLoad = async (req, res) => {
  try {
    res.render('login');
  } catch (err) {
    console.log(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        req.session.user = user;
        res.redirect('/user/dashboard');
      } else {
        res.render('login', { message: 'Invalid user name or password!' });
      }
    } else {
      res.render('login', { message: 'Invalid user name or password!' });
    }
  } catch (err) {
    console.log(err.message);
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (err) {
    console.log(err.message);
  }
};

const dashboardLoad = async (req, res) => {
  try {
    var users = await User.find({ _id: { $nin: [req.session.user._id] } });
    res.render('dashboard', { user: req.session.user, users: users });
  } catch (err) {
    console.log(err.message);
  }
};

const saveChat = async (req, res) => {
  try {
    const { message, senderId, recieverId } = req.body;
    const chat = await Chat.create({
      message: message,
      senderId: senderId,
      recieverId: recieverId,
    });
    res.status(200).send({ success: true, data: chat });
  } catch (err) {
    res.status(400).send({ error: err.message, success: false });
  }
};

module.exports = {
  register,
  registerLoad,
  loginLoad,
  login,
  dashboardLoad,
  logout,
  saveChat,
};
