const path = require('path')
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname, '../public')
const app = express()
var server = http.createServer(app)
var io = SocketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New User Connected')
    socket.emit('newMessage', {
        from: 'Admin',
        message: 'Welcome to the chat app'
    })
    socket.broadcast.emit('newMessage',{
        from: 'Admin',
        message: 'New User Joined',
        createdAt: new Date().getDate()
    })
    socket.on('createMessage', (data) => {
        console.log('create message', data)
        io.emit('newMessage', {
            from: data.from,
            message: data.message,
            createdAt: new Date().getTime()
        })
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

