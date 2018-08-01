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
//     console.log('Got it ', (data)
// })

socket.on('newLocationMessage', function(message){
    var li = $('<li></li>')
    var a = $('<a target="_blank">My Current Location</a>')
    li.text(`${message.from}: `)
    a.attr('href', message.url)
    li.append(a)
    $('#messages').append(li)
})

$('#message-form').on('submit', function(e){
    e.preventDefault()
    socket.emit('createMessage', {
        from: 'User',
        message: $('[name=message]').val()
    }, function(){
        $('[name=message]').val('')
    })
})


var locationButton = $('#sendLocation')
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation Not Supported')
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location ...')

    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send Location')
        socket.emit('createLocationMessage',{
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    }, function(){
        locationButton.removeAttr('disabled').text('Send Location')        
        console.log('Unable to fetch location')
    })
})