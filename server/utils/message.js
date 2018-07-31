const generateMessage = (from, message) => {
    return {
        from, 
        message,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (from, lat, long) => {
    return{
        from,
        url: `https://www.google.com/maps?q=${lat},${long}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {generateMessage, generateLocationMessage}