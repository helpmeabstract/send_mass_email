var MassEmailSender = require('./mass_email_sender');

var validateEvent = function sendMassEmail(recipients, templateName, templateData) {
    if (typeof recipients === 'undefined' || recipients.length === 0) {
        throw new Error("Invalid recipient list: ", recipients);
    }
    if (!templateName) throw new Error("No email template specified");
    if (typeof templateData !== 'object') throw new Error("No template data provided");
};

exports.handler = function (event, context) {
    console.log("[send_mass_email] incoming event: ", event);
    try {
        validateEvent(event.recipients, event.templateName, event.templateData);

        (new MassEmailSender(event.recipients, event.templateName, event.templateData)).send(function (error, result) {
            if (error) context.fail(error);
            context.succeed(result);
        });
    } catch (error) {
        context.fail(error.message);
    }
};
