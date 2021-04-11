require("dotenv").config()
const { json, urlencoded } = require("body-parser")
const express = require("express")
const { body, validationResult } = require("express-validator")
const nodemailer = require("nodemailer")
const cors = require("cors")
const app = express()
app.use(json())
app.use(urlencoded())
app.use(cors())
const mailer = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
})
app.post(
  "/contact",
  body("email").isEmail().normalizeEmail().escape(),
  body("name").not().isEmpty().trim().escape(),
  body("subject").not().isEmpty().trim().escape(),
  body("message").not().isEmpty().trim().escape(),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    mailer.sendMail(
      {
        from: `${req.body.name + req.body.email}`,
        to: process.env.CONTACT_EMAIL,
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
