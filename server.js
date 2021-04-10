require("dotenv").config()
const bodyParser = require("body-parser")
const express = require("express")
const body = require("express-validator")
const nodemailer = require("nodemailer")
const app = express()
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
const mailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
})
app.post(
  "/contact",
  body("email").isEmail().normalizeEmail(),
  body("name").not().isEmpty().trim().escape(),
  body("subject").not().isEmpty().trim().escape(),
  body("message").not().isEmpty().trim().escape(),
  (req, res) => {
    mailer.sendMail(
      {
        from: req.body.email,
        to: [process.env.CONTACT_EMAIL],
        subject: req.body.subject || "[No subject]",
        html: req.body.message || "[No message]",
      },
      function (err) {
        if (err) return res.status(500).send(err)
        res.json({ success: true })
      }
    )
  }
)
app.listen(process.env.PORT, () => {
  console.log(`richen-emailer ready at ${process.env.PORT}`)
})
