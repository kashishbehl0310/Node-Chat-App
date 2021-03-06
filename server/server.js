const path = require('path')
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname, '../public')
const app = express()
var server = http.createServer(app)
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
var io = SocketIO(server)
var users = new Users()
const {generateMessage, generateLocationMessage} = require('./utils/message')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    var id = socket.id;
    // console.log(id)
    console.log(`New User Connected with id ${id}`)
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
           return callback('Name and room name required')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id, params.name, params.room)
        io.to(params.room).emit('updateUserList', users.getUserList(params.room))
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined`))
        callback()

    })
    socket.on('createMessage', (data, callback) => {
        var user = users.getUser(socket.id)
        if(user && isRealString(data.message)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, data.message, data.clientId))
            // io.emit('newMessage', generateMessage(data.from, data.message, data.clientId))
        }
        callback()
       
    })

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id)
        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.lat, coords.long))
        }
    })
    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))            
        }
        console.log('User was disconnected')
    })
})



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

