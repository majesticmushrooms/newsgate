module.exports = {
  authenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('autenticated!');
      console.log(req.user);
      next();
    } else {
      console.log('not authenticated');
      res.redirect('/login.html');
    }
  }
};