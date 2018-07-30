const path = require('path')
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname, '../public')
const app = express()
var server = http.createServer(app)
var io = SocketIO(server)
const {generateMessage} = require('./utils/message')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'))
    socket.broadcast.emit('newMessage',generateMessage('Admin', 'New User Joined'))

    socket.on('createMessage', (data, callback) => {
        console.log('create message', data)
        io.emit('newMessage', generateMessage(data.from, data.message))
        callback('this is from server')
        // socket.broadcast.emit('newMessage', {
        //     from: data.from,
        //     message: data.message,
        //     createdAt: new Date().getTime()
        // })
    })
    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

