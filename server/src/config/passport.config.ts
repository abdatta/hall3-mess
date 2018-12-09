import { Model } from 'mongoose';
import { PassportStatic } from 'passport';
import { Strategy, IStrategyOptions, VerifyFunction } from 'passport-local';

import { UserModel } from '../models/user.model';

export class PassportConfig {

  static setup = (passport: PassportStatic, model: Model<UserModel>) => {

    // serialize by username as it is unique <Type of user, type of id>
    passport.serializeUser<UserModel, string>((user: UserModel, done) => {
      // Return unique identification of the user
      done(null, user._id);
    });

    // deserialize by username <Type of user, typeof of id>
    passport.deserializeUser<UserModel, string>((id: string, done) => {
      // findbyid and return user
      model.findById(id, (err, user: UserModel) => {
        done(err, user);
      });
    });

    // Specify strategy options
    const options: IStrategyOptions = {
      usernameField: 'rollno',
      passwordField: 'password',
      passReqToCallback: false
    };

    // verify function for signup
    const verifySignUp: VerifyFunction = (rollno: string, password: string, done) => {
      process.nextTick(() => {
        model.findOne({
          'rollno': rollno
        }, (err, user: UserModel) => {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(err, null);
          } else {
            const newUser = new model();
            newUser.rollno = rollno;
            newUser.password = newUser.generateHash(password);
            // save the user
            newUser.save((error) => {
              return done(error, newUser);
            });
          }
        });
      });
    };

    const verifySignIn: VerifyFunction = (rollno: string, password: string, done) => {
      process.nextTick(() => {
        model.findOne({
          'rollno': rollno
        }, (err, user: UserModel) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, null);
          } else if (!user.validPassword(password)) {
            return done(null, null);
          } else {
            return done(null, user);
          }
        });
      });
    };

    passport.use('signup', new Strategy(options, verifySignUp));
    passport.use('signin', new Strategy(options, verifySignIn));

  }
}
