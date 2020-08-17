const nodeMailer = require('../config/nodemailer');

//this is another way to exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment : comment}, '/comments/new_comments.ejs');
    console.log(htmlString);
    nodeMailer.transporter.sendMail({
        from: 'sanjeevkumarv2.0@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published",
        html: htmlString
    }, (error, info)=>{
        if(error){
            console.log('Error in sending mail', error);
            return;
        }
        console.log('Message Sent', info);
        return;
    });
}