var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");

var router = require("./routes/index");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

var app = express();
const dbName = "basicAuth";

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


//
//
//
//    app()  SERVER LISTENING
//      
//      ║         ⇈
//      ║         ║
//      ⇊         ║  
//      ║         ⇈
//      ║         ║
//      ║         ╚═══════════════════════════════════════════════╗
//      ║                                                         ║        R E S P O N S E
//      ║     SESSION                                             ║
//      ║    MIDDLEWARE                                           ║
//      ║                                                         ║
//      ║   checks if cookie with session id exists on the        ║
//      ║   HTTP request and if it does it verifies               ║
//      ║   it, and gets the user data from                       ║
//      ║   the sessions storage and assigns                      ║
//      ║   it to `req.session.currentUser`                       ║
//      ║                                                         ║
//      ⇊      🍪 session Id  ❓                                  ║
app.use(                      //                                  ║   ⬆ 🍪
  session({                   //                                  ║   
    store: new MongoStore({   //                                  ║
      mongooseConnection: mongoose.connection,//      session checks if `req.session.currentUser` exists
      ttl: 24 * 60 * 60, // 1 day                     and if it does it sets a cookie 🍪 on the headers
    }),                  //                           with the session id 
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000,},
  }),
);//    ║                     ⇈ 
//      ║                     ║
//      ║                     ║
//      ║                     ║
//      ║      MIDDLEWARE     ║
//      ⇊                     ║
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//      ║                     ⇈
//      ║                     ║
//      ║                     ║       
//      ║                     ║
//      ║                     ║                     R E S P O N S E 
//      ║                     ║
//      ║  ROUTER MIDDLEWARE  ║   res.send()  ||  res.json() || res.redirect()  ||  res.render()
//      ║                     ║
//      ⇊                     ║
app.use("/", router);  // ════╣   ⬙ or  
//                            ║
//                            ║  next(Error)
//                            ╚════════════════════════╗
//                                                     ║
//       ERROR HANDLING                                ║
//                                                     ║
// catch 404 and forward to error handler              ║
app.use(function(req, res, next) {    //               ║
  next(createError(404));             //               ║
});//              ║                  //               ║
//                 ║          ╔════════════════════════╝
//                 ⇊          ║
//       ERROR HANDLING       ║
//                            ⇊
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
