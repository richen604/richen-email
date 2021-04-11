require("dotenv").config()
//const bodyParser = require("body-parser")
const express = require("express")
const { body, validationResult } = require("express-validator")
const nodemailer = require("nodemailer")
const cors = require("cors")
const app = express()
//app.use(bodyParser.urlencoded())
app.use(cors())
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
    const test = {
      email: req.body.email,
      name: req.body.name,
      subject: req.body.subject,
      message: req.body.message,
    }

    console.log(test)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
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

app.get("/health", (req, res) => {
  res.send("ok")
})

app.listen(process.env.PORT, () => {
  console.log(`richen-emailer ready at ${process.env.PORT}`)
})
