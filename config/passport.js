const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'login'}, (login, password, done) => {

      // Match user
      User.findOne({
        where: {
            login: login
        }
      })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Такой пользователь не зарегистрирован!' });
        };

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Неверный пароль!' });
          };
        });
      })
      .catch(err => console.log('Error:' + err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
