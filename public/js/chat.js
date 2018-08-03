var socket = io();

let clientSocketId;

function scrollToBottom(){
    var messages = $('#messages')
    var newMessage = messages.children('li:last-child')
    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop')
    var scrollHeight = messages.prop('scrollHeight')
    var newMessageHeight = newMessage.innerHeight()
    var lastMessageHeight = newMessage.prev().innerHeight()
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight)
        messages.scrollTop(scrollHeight)
}

socket.on('connect', function() {
    var params = jQuery.deparam(window.location.search)
    socket.emit('join', params, function(err){
        if(err){
            alert(err)
            window.location.href = '/'
        }else{
            console.log('No error')
        }
    })
})

// socket.emit('createMessage', {
//     to: 'kashish',
//     message: 'works'
// })

socket.on('disconnect', function(){
    console.log('Disconnected from server')
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
    scrollToBottom()
})

$('#message-form').on('submit', function(e){
    e.preventDefault()
    clientSocketId = socket.id;
    console.log('aaaaaaaaaaa', clientSocketId)
    socket.emit('createMessage', {
        from: 'User',
        message: $('[name=message]').val(),
        clientId: clientSocketId
    }, function(){
        $('[name=message]').val('')
    })
})

socket.on('newMessage', function(message){
    
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var cssClass = '';
    var template = $('#message-template').html()
    if(clientSocketId === message.clientId && clientSocketId != undefined){
        cssClass = 'GreenText'   
        console.log(cssClass) 
    }else{
        cssClass = 'BlueText'
        console.log(cssClass)
    }
    var html = Mustache.render(template,{
        text: message.message,
        from: message.from,
        createdAt: formattedTime,
        clientId: message.clientId,
        class: cssClass
    })
    
    $('#messages').append(html)
    scrollToBottom()
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