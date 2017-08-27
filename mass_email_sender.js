require('dotenv').config();
var Lambda = require('aws-sdk').Lambda;

function MassEmailSender(recipients, templateName, templateData) {
    this.recipients = recipients;       // An array of recipient objects
    this.templateName = templateName;   // The name of an outbound email template
    this.templateData = templateData;   // A map of k/v pairs to pass in to the template
}

MassEmailSender.prototype.getPayloadForRecipient = function getPayloadForRecipient(recipient, templateName, templateData) {
    return {
        FunctionName: process.env.AWS_LAMBDA_FUNCTION,
        InvocationType: process.env.AWS_LAMBDA_INVOCATION_TYPE,
        Payload: JSON.stringify({
            recipient: recipient,
            templateName: templateName,
            templateData: templateData
        })
    };
};


MassEmailSender.prototype.send = function send(callback)
{
    var lambda = new Lambda({region: process.env.AWS_REGION});

    for (var i=0; i<this.recipients.length; i++) {
        var recipient = this.recipients[i];
        var payload = this.getPayloadForRecipient(recipient, this.templateName, this.templateData);

        lambda.invoke(payload, function (error, result) {
            if (error) {
                return callback(error);
            }

            return callback(null, { payload: payload, result: result });
        });
    }
};

module.exports = MassEmailSender;