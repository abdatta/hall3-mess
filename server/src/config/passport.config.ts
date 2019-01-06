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

    const verifySignIn: VerifyFunction = (rollno: string, password: string, done) => {
      process.nextTick(() => {
        model.findOne({ rollno: rollno })
          .then((user: UserModel | null) => {
              if (!user || !user.validPassword(password)) {
                done(null, null,  { message: 'INCORRECT_ROLLNO_OR_PASSWORD' });
              } else if (!user.verified) {
                return done(null, null, { message: 'ACCOUNT_NOT_VERIFIED' });
              } else {
                return done(null, user);
              }
          })
          .catch((error: any) => done(error));
      });
    };

    passport.use('signin', new Strategy(options, verifySignIn));

  }
}
