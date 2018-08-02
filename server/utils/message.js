const moment = require('moment')

const generateMessage = (from, message) => {
    return {
        from, 
        message,
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