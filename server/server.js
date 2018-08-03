const path = require('path')
const express = require('express')
const SocketIO = require('socket.io')
const http = require('http')

const publicPath = path.join(__dirname, '../public')
const app = express()
var server = http.createServer(app)
const {isRealString} = require('./utils/validation')
var io = SocketIO(server)
const {generateMessage, generateLocationMessage} = require('./utils/message')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    var id = socket.id;
    // console.log(id)
    console.log(`New User Connected with id ${id}`)
    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room name required')
        }
        socket.join(params.room)
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App'))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin', `${params.name} has joined`))
        callback()

    })
    socket.on('createMessage', (data, callback) => {
        console.log('create message', data)
        io.emit('newMessage', generateMessage(data.from, data.message, data.clientId))
        callback()
       
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.long))
    })
    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

