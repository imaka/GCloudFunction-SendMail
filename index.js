/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendMail = (req, res) => {
  if (!req.body.subject || !req.body.text) {
    console.error("Nothing to send!");
    res
      .status(422)
      .send("Nothing to send!")
      .end();
    return;
  }

  const nodeMailer = require("nodemailer");

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_ADDRESS,
      serviceClient: process.env.CLIENT_ID,
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, "\n")
    }
  });

  const mailOptions = {
    from: req.body.from || process.env.MAIL_FROM,
    to: req.body.to || process.env.MAIL_TO,
    bcc: req.body.bcc || process.env.MAIL_BCC,
    subject: req.body.subject,
    text: req.body.text
  };

  transporter
    .sendMail(mailOptions)
    .then(() => {
      res
        .status(200)
        .send("Mail sent")
        .end();
    })
    .catch(e => {
      console.error(e.toString());
      res.status(500).end();
    });
};
