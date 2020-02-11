var express = require("express");
var siteRouter = express.Router();

// AUTHENTICATION CHECKER
siteRouter.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } 																//		|
  else {                          	//    |
  	res.redirect("/login");       	//    |
  }                                 //    |
});																	//		|
// 		 ------------------------------------  
//     | 
//     V

siteRouter.get('/secret',  (req, res) => {
  res.render('secret')
})


siteRouter.get('/logout', (req, res) => {
  req.session.destroy( (err) => {
    res.redirect('/login')
  })
})



/* 
// EXAMPLE 2 - horizontal middleware
function isLoggedIn (req, res, next) {
  if (req.session.currentUser) next();
  else res.redirect("/login"); 
}

siteRouter.get('/secret', isLoggedIn,  (req, res) => {
  res.send('<h1> SECRET PAGE/ROUTE </h1>')
}); 
*/


module.exports = siteRouter;
