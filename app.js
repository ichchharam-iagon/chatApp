const express = require('express')
const connection = require('./config/dbConnect.js')
const app = express()

const Chat = require('./models/chat.model.js')
require('dotenv').config()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const ApiRouter = require('./routes/main')

connection()

app.use(ApiRouter)
app.use('/logout', function (req, res) {
	res.redirect('/user/logout')
})
app.use('/*', function (req, res) {
	res.redirect('/user/')
})

const http = require('http').Server(app)

const io = require('socket.io')(http)
var userNameSpace = io.of('/user-namespace')
userNameSpace.on('connection', function (socket) {
	console.log('user connected')

	socket.on('disconnect', function () {
		console.log('user disconnected')
	})

	//chat implementation
	socket.on('chat', function (data) {
		socket.broadcast.emit('loadNewChat', data)
	})

	//chat History
	socket.on('chatHistory', async function (data) {
		var chat = await Chat.find({
			$or: [
				{ senderId: data.senderId, recieverId: data.recieverId },
				{ senderId: data.recieverId, recieverId: data.senderId },
			],
		})

		socket.emit('loadChatHistory', { chats: chat })
	})
})
http.listen(3000, function () {
	console.log('Api is running')
})
