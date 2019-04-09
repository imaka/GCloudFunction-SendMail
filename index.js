/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendMail = (req, res) => {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SG_API_KEY);
  const msg = {
    to: req.body.to,
    from: req.body.from,
    subject: req.body.subject,
    text: req.body.text
  };
  sgMail
    .send(msg)
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
