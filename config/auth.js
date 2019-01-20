module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Для просмотра данной страницы необходимо авторизоваться!');
      res.redirect('/login');
    }
};