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
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = $('#message-template').html()
    var html = Mustache.render(template,{
        text: message.message,
        from: message.from,
        createdAt: formattedTime
    })
    $('#messages').append(html)
    
})

socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#location_message-template').html()
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        lat: message.lat,
        createdAt: formattedTime
    })
    // var li = $('<li></li>')
    // var a = $('<a target="_blank">My Current Location</a>')
    // li.text(`${message.from}: ${formattedTime} `)
    // a.attr('href', message.url)
    // li.append(a)
    $('#messages').append(html)
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