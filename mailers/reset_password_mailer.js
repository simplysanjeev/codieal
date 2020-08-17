const nodeMailer = require('../config/nodemailer');

exports.resetPassword = (token) => {
    let htmlString = nodeMailer.renderTemplate({accesstoken:token.accesstoken}, '/reset_password/reset_password.ejs');
    console.log(htmlString);
    nodeMailer.transporter.sendMail({
        from: 'sanjeevkumarv2.0@gmail.com',
        to: token.user.email,
        subject: "Reset Password Codeial",
        html: htmlString
    }, (error, info) => {
        if(error){
            console.log('Error in sending mail', error);
            return;
        }
        console.log('Message sent', info);
        return;
    })
}