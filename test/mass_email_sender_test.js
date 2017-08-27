var test = require('ava');

test('test domain extraction', function (t) {
    var sender = new (require ('../mass_email_sender'))([], '', {});

    t.is(sender.getDomain("foo@test.com"), "test.com");
});