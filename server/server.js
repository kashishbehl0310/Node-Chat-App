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
    socket.on('disconnect', () => {
        console.log('User was disconnected')
    })
})



const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

