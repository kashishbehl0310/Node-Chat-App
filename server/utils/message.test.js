var expect = require('expect')
const {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate message object', () => {
        var from = 'kashish';
        var message = 'Ssup';
        var messageFunc = generateMessage(from, message)
        expect(messageFunc.createdAt).toBeA('number')
        expect(messageFunc).toInclude({
            from, message
        })
    })
})

describe('generateLocationMessage', () => {
    it('should generatelocation object', () => {
        var from = 'Deb';
        var lat = 15;
        var long = 16;
        var url = `https://www.google.com/maps?q=15,16`
        var message = generateLocationMessage(from, lat, long)

        expect(message.createdAt).toBeA('number')
        expect(message).toInclude({
            from, url
        })
    })
})