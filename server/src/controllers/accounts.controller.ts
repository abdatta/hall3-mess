import { Request, Response, NextFunction } from 'express';
import { Model, Types } from 'mongoose';
import request from 'request';
const ssh = new (require('node-ssh'))();

import { UserModel } from '../models/user.model';
import { TokenModel } from '../models/token.model';
import { Mailer } from '../config/mailer.config';
import { PassportStatic } from 'passport';
import moment from 'moment';
import schedule from 'node-schedule';

export class AccountCtrl {

    /**
     * Constructor
     *
     * @class AccountCtrl
     * @constructor
     */
    constructor(
        private userModel: Model<UserModel>,
        private tokenModel: Model<TokenModel>,
        private passport: PassportStatic,
        private mailer: Mailer
    ) {
        // cleanup inactive users at 00:02 AM every day
        schedule.scheduleJob('2 0 * * *', this.cleanupInactiveUsers);
    }

    /**
     * Sanitize user json being sent
     *
     * @class AccountCtrl
     * @method sanitize
     */
    public sanitize = (user: any) => {
        user = JSON.parse(JSON.stringify(user));
        user['tokens'] = undefined;
        user['password'] = undefined;
        user['_id'] = undefined;
        user['__v'] = undefined;
        return user;
    }

    /**
     * Check authentication status
     *
     * @class AccountCtrl
     * @method checkAuth
     */
    public checkAuth = (req: Request, res: Response, next: NextFunction) => {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(401);  // Unauthorized
        }
    }

    public checkPermissions(...permissions: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.isAuthenticated() &&
                    (req.user.rollno === 'admin' ||
                    permissions.every(permission => req.user.permissions.includes(permission)))) {
                next();
            } else {
                res.sendStatus(401);  // Unauthorized
            }
        };
    }

    /**
     * Login user into the session
     *
     * @class AccountCtrl
     * @method logIn
     */
    public logIn = (req: Request, res: Response) => {
        this.passport.authenticate('signin', (error, user, info) => {
            if (error) {
                this.internalServer(res, error);
            } else if (!user) {
                switch (info.message) {
                    case 'INCORRECT_ROLLNO_OR_PASSWORD':
                        res.sendStatus(401);
                        break;
                    case 'ACCOUNT_NOT_VERIFIED':
                        res.sendStatus(403); // Forbidden as not verified
                        break;
                    default:
                        res.sendStatus(404);
                }
            } else {
                req.logIn(user, (err) => {
                    if (err) {
                        this.internalServer(res, err);
                    }
                    res.status(200).json(this.sanitize(user));
                });
            }
          })(req, res);
    }

    /**
     * Check authentication status
     *
     * @class AccountCtrl
     * @method getAuthStatus
     */
    public getAuthStatus = (req: Request, res: Response) => {
        res.status(200).json({
            user: req.isAuthenticated() ? this.sanitize(req.user) : null,
            mess: req.session ? req.session.mess : null
        });
    }

    /**
     * Check if the user is an IITK user
     *
     * @class AccountCtrl
     * @method checkIITKUser
     */
    public checkIITKUser = (req: Request, res: Response, next: NextFunction) => {
        ssh.connect({
            host: 'appserver.cc.iitk.ac.in',
            username: req.body.IITKusername,
            password: req.body.IITKpassword
        })
        .then(() => {
            ssh.dispose();
            next();
        })
        .catch((error: any) => {
            ssh.dispose();
            if (error.level === 'client-authentication') {
                res.sendStatus(403); // Forbidden
            } else if (error.level === 'client-timeout') {
                res.sendStatus(408); // Request Timeout
            } else {
                this.internalServer(res, error);
            }
        });

        req.body.IITKpassword = undefined; // Removing iitk password immediately after use
    }

    /**
     * Create a account of a new user
     *
     * @class AccountCtrl
     * @method createNewUser
     */
    public createNewUser = (req: Request, res: Response, next: NextFunction) => {
        this.userModel.findOne({ 'rollno': req.body.rollno })
            .then((user: UserModel | null) => {
                if (user) {
                    res.sendStatus(user.verified ? 401 : 400);
                    return;
                }
                const newUser = new this.userModel();
                newUser.name = req.body.name;
                newUser.rollno = req.body.rollno;
                newUser.password = newUser.generateHash(req.body.password);
                // save the user
                return newUser.save()
                        .then((savedUser: UserModel) => {
                            req.user = { rollno: savedUser.rollno };
                            console.log('New Account Created: ',
                                        JSON.stringify(req.user));
                            next();
                        });
            })
            .catch((error) => this.internalServer(res, error));
      }

    /**
     * Send account verification mail
     *
     * @class AccountCtrl
     * @method sendVerificationMail
     */
    public sendVerificationMail = (req: Request, res: Response, next: NextFunction) => {
        this.userModel.findOne({ rollno: req.user.rollno })
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(404);  // Not found
                    return;
                }

                const verifyLink = `${req.protocol}://${req.get('host')}/verify/${user._id}`;
                const deregisterLink = `${req.protocol}://${req.get('host')}/deregister/${user._id}`;

                this.mailer.sendAccountVerficationLink(user, req.body.IITKusername, verifyLink, deregisterLink)
                    .then((info) => next())
                    .catch((error) => {
                        user.remove()
                            .then(() =>
                                console.log('Account deleted due to error in verification mail sending: ',
                                            JSON.stringify({ rollno: user.rollno })))
                            .catch(() =>
                                console.log('Failed to delete account after error in verification mail sending'));
                        this.internalServer(res, error);
                    });
            })
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Update a account of a user
     *
     * @class AccountCtrl
     * @method updateUser
     */
    public updateUser = (req: Request, res: Response) => {
        this.userModel.findOne({
            'rollno': req.user.rollno
        }, (err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(404);  // Not found
            } else if (req.body['newpassword'] && !user.validPassword(req.body.password)) {
                res.sendStatus(403); // Wrong Password, forbidden
            } else {
                user.name = req.body.name || user.name;
                if (req.body['newpassword']) {
                    user.password = user.generateHash(req.body['newpassword']);
                }
                user.email = req.body.email || user.email || (user.rollno + '@iitk.ac.in');
                if (req.body.liked !== undefined) {
                    user.liked = req.body.liked;
                }
                user.save((error) => {
                    if (error) {
                        this.internalServer(res, error);
                    } else {
                        res.status(200).json(this.sanitize(user));
                    }
                });
            }
        });
    }

    /**
     * Set user account as verified
     *
     * @class AccountCtrl
     * @method verifyUser
     */
    public verifyUser = (req: Request, res: Response) => {
        this.userModel.findByIdAndUpdate(req.params.id, { verified: true })
                .then((user: UserModel | null) => {
                    if (!user) {
                        res.sendStatus(404); // Not found
                        return;
                    }
                    res.sendStatus(200);
                })
                .catch((error) => this.internalServer(res, error));
    }

    /**
     * Delete unverified user
     *
     * @class AccountCtrl
     * @method deleteUnverifiedUser
     */
    public deleteUnverifiedUser = (req: Request, res: Response) => {
        this.userModel.findOneAndRemove({ _id: req.params.id, verified: false })
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(404); // Not found
                    return;
                }
                console.log('Deleted unverified user: ', JSON.stringify({ rollno: user.rollno }));
                res.sendStatus(200);
            })
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Send reset password code on forget password
     *
     * @class AccountCtrl
     * @method sendResetPasswordCode
     */
    public sendResetPasswordCode = (req: Request, res: Response) => {
        const resetCode = Types.ObjectId();
        this.userModel.findOneAndUpdate({rollno: req.body.rollno}, { resetPasswordCode: resetCode })
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(404); // Not found
                    return;
                }

                const resetLink = `${req.protocol}://${req.get('host')}/reset/${user.rollno}/${resetCode}`;
                this.mailer.sendResetPasswordLink(user, resetLink)
                    .then((info) => res.sendStatus(200))
                    .catch((error) => this.internalServer(res, error));
            })
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Resets the password for the user
     *
     * @class AccountCtrl
     * @method resetPassword
     */
    public resetPassword = (req: Request, res: Response) => {
        this.userModel.findOneAndUpdate(
                { rollno: req.body.rollno, resetPasswordCode: req.body.reset_code },
                {
                    $set: {
                        password: new this.userModel().generateHash(req.body.password),
                        verified: true
                    },
                    $unset: { resetPasswordCode: 1 }
                }
            )
            .then((user: UserModel | null) => {
                if (!user) {
                    res.sendStatus(404);
                    return;
                }
                console.log('Password Reset for user: ', JSON.stringify({ rollno: user.rollno}));
                res.sendStatus(200);
            })
            .catch((error) => this.internalServer(res, error));
    }

    /**
     * Fetch photo of a user from IITK OA
     *
     * @class AccountCtrl
     * @method fetchPhoto
     */
    public fetchPhoto = (req: Request, res: Response) => {
        const url = `https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${req.params.roll}_0.jpg`;
        request.get(url).on('error', () => res.sendStatus(404)).pipe(res);
    }

    /**
     * Logout user
     *
     * @class AccountCtrl
     * @method logout
     */
    public logout = (req: Request, res: Response) => {
        console.log('Logging out user: ', '\x1b[36m' + req.user.rollno + '\x1b[0m');
        req.logout();
        res.sendStatus(200);
    }

    /**
     * Authenticate and start mess session
     *
     * @class AccountCtrl
     * @method messIn
     */
    public messIn = (req: Request, res: Response) => {
        if (req.session === undefined) {
            this.internalServer(res, { err: 'Session not initialised'});
            return;
        }
        this.userModel.findOne({
            rollno: 'mess'
        }, (err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(401);  // Unauthorised, only mess login allowed
            } else if (!user.validPassword(req.body.password)) {
                res.sendStatus(403); // Wrong Password, forbidden
            } else {
                (req.session as Express.Session).mess = true;
                res.status(200).send({ mess: true });
            }
        });
    }

    /**
     * Check mess session authentication status
     *
     * @class AccountCtrl
     * @method checkMessAuth
     */
    public checkMessAuth = (req: Request, res: Response, next: NextFunction) => {
        if (req.session && req.session.mess === true) {
            next();
        } else {
            res.sendStatus(401);  // Unauthorized
        }
    }

    /**
     * End mess session
     *
     * @class AccountCtrl
     * @method messOut
     */
    public messOut = (req: Request, res: Response) => {
        if (req.session === undefined) {
            res.sendStatus(200);
            return;
        }
        this.userModel.findOne({
            rollno: 'mess'
        }, (err: Error, user: UserModel) => {
            if (err) {
                this.internalServer(res, err);
            } else if (!user) {
                res.sendStatus(404);  // Not Found
            } else if (!user.validPassword(req.body.password)) {
                res.sendStatus(401); // Wrong Password, unauthorised
            } else {
                (req.session as Express.Session).mess = undefined;
                req.logOut();
                res.sendStatus(200);
            }
        });
    }

    private cleanupInactiveUsers = async () => {
        console.log('Starting cleanupInactiveUsers job');
        const users = await this.userModel
            .find({ permissions: { $size: 0 } })
            .populate({
                path: 'tokens',
                options: { sort: '-date', limit: 1 },
                select: 'date'
            });

        const MAX_INACTIVITY_THRESHOLD = 110;
        const MIN_INACTIVITY_THRESHOLD = 100;
        const WARNING_INTERVAL = 3;
        const today = moment().startOf('day');
        const lastUseDate = (user: UserModel): string => {
            const lastToken = user.tokens[0] as TokenModel;
            return lastToken ? lastToken.date : user._id.getTimestamp();
        };

        const inactiveUsers = users.filter(user => today.diff(lastUseDate(user), 'days') >= MIN_INACTIVITY_THRESHOLD);

        const unverifiedInactiveUsers = inactiveUsers.filter(user => !user.verified);
        const verifiedInactiveUsers = inactiveUsers.filter(user => !!user.verified);

        // We will send a warning email iff they have not crossed the max threshold,
        // and do not aleady have a warning email sent in last WARNING_INTERVAL days.
        const verifiedInactiveUsersToBeWarned = verifiedInactiveUsers.filter(user =>
            today.diff(lastUseDate(user), 'days') < MAX_INACTIVITY_THRESHOLD &&
            (!user.inactivityMailSentOn || today.diff(user.inactivityMailSentOn, 'days') >= WARNING_INTERVAL)
        );

        // We will delete any user who have crossed the max threshold without any warning email
        const verifiedInactiveUsersToBeDeleted = verifiedInactiveUsers.filter(user =>
            today.diff(lastUseDate(user), 'days') >= MAX_INACTIVITY_THRESHOLD
        );

        console.log('Number of inactive users found: ' + inactiveUsers.length);
        console.log('Number of unverified inactive users found: ' + unverifiedInactiveUsers.length);
        console.log('Number of verified inactive users to be warned: ' + verifiedInactiveUsersToBeWarned.length);
        console.log('Number of verified inactive users to be deleted: ' + verifiedInactiveUsersToBeDeleted.length);

        // delete the unverified inactive users first
        if (unverifiedInactiveUsers.length > 0) {
            const unverifiedInactiveUsersRollNos = unverifiedInactiveUsers.map(u => u.rollno);
            await this.userModel.deleteMany({ rollno: { $in: unverifiedInactiveUsersRollNos }})
                .then(() => console.log('Deleted unverified users:', unverifiedInactiveUsersRollNos.join(',')))
                .catch((err) => console.error('Failed to delete unverified users:', err));
        }

        // warn inactive users that have crossed the min inactivity threshold
        for (const user of verifiedInactiveUsersToBeWarned) {
            const daysSinceLastActive = today.diff(lastUseDate(user), 'days');
            const daysLeftTillDeletion = MAX_INACTIVITY_THRESHOLD - daysSinceLastActive;
            try {
                await this.mailer.sendInactivityWarningMail(user, daysSinceLastActive, daysLeftTillDeletion);
                await this.userModel.findByIdAndUpdate(user.id, { inactivityMailSentOn: today.format() });
            } catch (error) {
                console.error('Error warning inactive user: ' + user.rollno, error);
            }
        }

        // inform and remove inactive users that have crossed the max inactivity threshold
        for (const user of verifiedInactiveUsersToBeDeleted) {
            try {
                // ideally these two operations should be part of a transaction
                // however transactions are only supported post MongoDB 4.0
                await this.tokenModel.deleteMany({ rollno: user.rollno });
                await this.userModel.findByIdAndRemove(user.id);
                await this.mailer.sendAccountDeletionMail(user);
            } catch (error) {
                console.error('Error removing inactive user: ' + user.rollno, error);
            }
        }
        console.log('Finished cleanupInactiveUsers job');
    }

    /**
     * Send internal server error messages
     *
     * @class AccountCtrl
     * @method internalServer
     */
    private internalServer = (res: Response, err: any) => {
        console.error('[Internal Server Error]', JSON.stringify(err));
        res.status(500).json({ 'Error': err });
    }
}
