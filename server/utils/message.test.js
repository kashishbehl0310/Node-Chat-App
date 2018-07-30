var expect = require('expect')
const {generateMessage} = require('./message')

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