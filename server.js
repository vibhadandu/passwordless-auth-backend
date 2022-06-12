const express = require("express"); //import statement
const morgan = require("morgan");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const User = require("./models/Users");
require("dotenv").config();
const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/sso")
  .then(()=>{
    console.log("MongoDB Connected")
  })
  .catch((error) => handleError(error));

var transport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function sendMail(email, id) {
  var mailOptions = {
    from: '"Vibha Miniproject" <test@vibhaminiproject.ml>',
    to: email,
    subject: "Sign in Mail",
    html:
      "<b>Hey there! </b><br> This is a test mail to log you in to your account. <br> " +
      "http://localhost:3000/verify/" +
      id,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

// replace with a database
let accounts = [];
let loginAttempt = [];

app.get("/", (req, res) => {
  res.send("online");
});

// first register the user
app.post("/signup", async (req, res) => {
  accounts.push({ email: req.body.email });
  const user = await User.create({ email: req.body.email })
  console.log(req.body.email + " signed up");
  res.send({ status: "success" });
});

// when the user enters the email this route is called
app.post("/signin", async (req, res) => {
  const email = req.body.email;
  const account = await User.findOne({email:email})
  console.log(account + "is trying to sign in");
  if (account) {
    const id = uuidv4();
    console.log("generated code");
    const userwithid = await User.findOneAndUpdate({email:email},{email:email,id:id})
    loginAttempt.push({ email: email, id: id });
    console.log(userwithid);
    sendMail(email, id);

    res.send({ message: "success", id: id });
  } else {
    res.send({ message: "failure" });
  }
});

// route that handles all the links sent in the mail
app.post("/verify", async (req, res) => {
  const id = req.body.id;
  const account = await User.findOne({id:id})
  if (account) {
    // authenticated
    res.send({ message: "signed in", status: "successful" });
  } else {
    res.status(401).json({ message: "Oops something went wrong" });
  }
});

app.listen(1231, () => {
  console.log("listening on 1231");
});
