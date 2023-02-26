require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./passport");
const MongoStore = require("connect-mongo");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    cookieName: "sessionName",
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // store sessions in database instead of memory
    saveUninitialized: true,
    httpOnly: true, // dont let browser javascript access cookie ever
    secure: true, // only use cookie over https
    ephemeral: true, // delete this cookie while browser close
    cookie: {
      sameSite: "strict"
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

const authRoute = require(__dirname + "/routes/auth.js");
const tasksRoute = require(__dirname + "/routes/tasks.js");

app.use(express.static(__dirname + "/views"))
app.use("/api", tasksRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running in port ${process.env.PORT || 3000}`);
});
