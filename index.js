/**
 * Sends an email using Nodemailer and data from the request
 * and environment variables.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
function handlePOST(req, res) {
  res.set("Access-Control-Allow-Origin", "*");

  if (!req.body.subject || !req.body.text) {
    res.status(422).send({
      error: {
        code: 422,
        message: "Missing arguments"
      }
    });
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
      res.status(200).send({
        data: {
          code: 200,
          message: "Mail sent"
        }
      });
    })
    .catch(e => {
      res.status(500).send({
        error: {
          code: 500,
          message: e.toString()
        }
      });
    });
}

/**
 * Send response to OPTIONS requests
   Set CORS headers for preflight requests
   Allows POSTs from any origin with the Content-Type header
   and caches preflight response for 3600s
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
function handleOPTIONS(req, res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  res.status(204).end();
}

/**
 * Responds only to OPTIONS or POST requests.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sendMail = (req, res) => {
  switch (req.method) {
    case "OPTIONS":
      handleOPTIONS(req, res);
      break;
    case "POST":
      handlePOST(req, res);
      break;
    default:
      res.status(405).send({
        error: {
          code: 405,
          message: "Wrong HTTP method"
        }
      });
      break;
  }
};
