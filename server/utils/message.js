const moment = require('moment')

const generateMessage = (from, message, clientId) => {
    return {
        from, 
        message,
        clientId,
        createdAt: moment().valueOf()
    }
}

const generateLocationMessage = (from, lat, long) => {
    return{
        from,
        lat,
        long,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage}