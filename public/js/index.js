var socket = io();
socket.on('connect', function() {
    console.log('Connected to server')
})

// socket.emit('createMessage', {
//     to: 'kashish',
//     message: 'works'
// })

socket.on('disconnect', function(){
    console.log('Disconnected from server')
})
socket.on('newMessage', function(message){
    console.log('New message')
    console.log(message)
    var li = $('<li></li>')
    li.text(`${message.from}: ${message.message}`)
    $('#messages').append(li)
})
// socket.emit('createMessage', {
//     from: 'Kashish',
//     message: "Hello"
// }, function(data)  {
//     console.log('Got it ', data)
// })

$('#message-form').on('submit', function(e){
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        message: $('[name=message]').val()
    }, function(){

    })
})
