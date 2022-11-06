import bodyParser from 'body-parser';
import express from 'express';
import httpLogger from 'morgan';
import moment from 'moment';
import path from 'path';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';

// Routes
import { AccountsRoute } from './routes/accounts.route';
import { DishesRoute } from './routes/dishes.route';
import { TokensRoute } from './routes/tokens.route';
import { NotificationsRoute } from './routes/notifications.route';

// Controllers
import { AccountCtrl } from './controllers/accounts.controller';
import { DishesCtrl } from './controllers/dishes.controller';
import { TokensCtrl } from './controllers/tokens.controller';
import { NotificationsCtrl } from './controllers/notifications.controller';

// Models
import { UserModel } from './models/user.model';
import { DishModel } from './models/dish.model';
import { TokenModel } from './models/token.model';
import { SubscriptionModel } from './models/subscription.model';

// Schema
import { UserSchema } from './schemas/user.schema';
import { DishSchema } from './schemas/dish.schema';
import { TokenSchema } from './schemas/token.schema';
import { SubscriptionSchema } from './schemas/subscription.schema';

// Config
import { PassportConfig } from './config/passport.config';
import { MailerConfig } from './config/mailer.config';

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  // The express app instance
  public app: express.Application;

  // The mongoose Connection
  private connection!: mongoose.Connection;

  // Global instances of models for dependency injection
  private userModel!: mongoose.Model<UserModel>; // an instance of UserModel
  private dishModel!: mongoose.Model<DishModel>; // an instance of DishModel
  private tokenModel!: mongoose.Model<TokenModel>; // an instance of TokenModel
  private subscriptionModel!: mongoose.Model<SubscriptionModel>; // an instance of SubscriptionModel

  // Global instances of controllers for dependency injection
  private accountCtrl!: AccountCtrl; // an instance of AccountCtrl
  private dishesCtrl!: DishesCtrl; // an instance of DishesCtrl
  private tokensCtrl!: TokensCtrl; // an instance of TokensCtrl
  private notificationCtrl!: NotificationsCtrl; // an instance of NotificationCtrl

  /**
   * Bootstrap the application
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app
   */
  public static bootstrap = (): Server => {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {

    // create expressjs application
    this.app = express();

    // configure application (the order of calls is very important)
    this.config();
    this.models();
    this.controllers();
    this.routes();

  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config = (): void => {
    // MongoDB connection
    const dbaddr: string = process.env.DB_ADDR || 'localhost';
    const dbport: string = process.env.DB_PORT || '27017';
    const dbname: string = process.env.DB_NAME || 'Hall3_Mess_Local';
    const dbauth: string = process.env.DB_USER ? `${process.env.DB_USER}:${process.env.DB_PASS}@` : '';
    const MONGODB_CONNECTION = `mongodb://${dbauth}${dbaddr}:${dbport}/${dbname}?authSource=admin`;

    const getDate = () => moment().format('DD MMM\'YY HH:mm:ss');

    const log = console.log;
    console.log = (...args) => log(`[${getDate()}]`, ...args);

    const errorLogger = console.error;
    console.error = (...args) => errorLogger('\x1b[31m', ...args, '\x1b[0m');

    httpLogger.token('date', getDate);

    httpLogger.token('user', (req: express.Request, res: express.Response) => {
      let user = '';
      if (req.user) {
        user = '\x1b[36m' + req.user.rollno + '\x1b[0m'; // in cyan color
        if (req.session && req.session.mess === true) {
          user += ' @ \x1b[35m' + 'mess' + '\x1b[0m'; // in magenta color
        }
      }
      return user;
    });

    httpLogger.token('post', (req: express.Request, res: express.Response) => {
        if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
            req.body['password'] = undefined;
            req.body['newpassword'] = undefined;
            return JSON.stringify(req.body);
        } else {
            return ' ';
        }
    });

    this.app.use(
      httpLogger('[:date] :method :url [:user] (:status) :post', {
        skip: (req) => {
          // exclude logs for assets except if they are from api call
          const ignoredExtensions = ['.css', '.js', '.json', '.ico', '.jpg', '.jpeg', '.png'];
          if (!req.originalUrl.startsWith('/api/') && ignoredExtensions.some(ext => req.url.includes(ext))) {
            return true;
          }
          // exclude spam logging of dishes api call for all days except today & tomorrow
          if (
            req.url.endsWith('day') &&
            !req.url.endsWith(moment().format('dddd').toLowerCase()) &&
            !req.url.endsWith(moment().add(1, 'days').format('dddd').toLowerCase())
          ) {
            return true;
          }

          return false;
        }
      })
    );

    // use json bodyparser
    this.app.use(bodyParser.json());

    // use query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // trust nginx proxy if present
    this.app.set('trust proxy', true);

    // connect to mongoose
    require('mongoose').Promise = global.Promise;

    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    this.connection = connection;

    // create MongoStore
    const MongoStore = connectMongo(session);

    // create session
    const esession = session({
      secret: process.env.SESSION_SECRET || 'local-session',
      saveUninitialized: false,
      resave: true,
      store: new MongoStore({
        mongooseConnection: connection
      }),
      cookie: {
        // domain: 'mess.hall3iitk.com', // TODO: make this for domain specific
        maxAge: 14 * 24 * 60 * 60 * 1000  // 14 days
      }
    });

    // use session
    this.app.use(esession);

  }

  /**
   * Create models
   *
   * @class Server
   * @method models
   */
  public models = () => {
    this.userModel = this.connection.model<UserModel>('User', UserSchema);
    this.dishModel = this.connection.model<DishModel>('Dish', DishSchema);
    this.tokenModel = this.connection.model<TokenModel>('Token', TokenSchema);
    this.subscriptionModel = this.connection.model<SubscriptionModel>('Subscription', SubscriptionSchema);
  }

  /**
   * Create controllers
   *
   * @class Server
   * @method controllers
   */
  public controllers = () => {
    // Set up passport
    PassportConfig.setup(passport, this.userModel);
    this.app.use(passport.initialize());
    this.app.use(passport.session()); // persistent login sessions

    // Set up mailer
    const mailer = MailerConfig.setup();

    // Set up controllers
    this.accountCtrl = new AccountCtrl(this.userModel, this.tokenModel, passport, mailer);
    this.dishesCtrl = new DishesCtrl(this.dishModel);
    this.tokensCtrl = new TokensCtrl(this.tokenModel, this.dishModel, this.userModel);
    this.notificationCtrl = new NotificationsCtrl(this.subscriptionModel);
  }

  /**
   * Create router
   *
   * @class Server
   * @method routes
   */
  public routes = () => {

    // API Routes
    this.app.use('/api/account', AccountsRoute.create(this.accountCtrl));
    this.app.use('/api/notifications', NotificationsRoute.create(this.notificationCtrl, this.accountCtrl));
    this.app.use('/api/dishes', DishesRoute.create(this.dishesCtrl, this.accountCtrl));
    this.app.use('/api/tokens', TokensRoute.create(this.tokensCtrl, this.accountCtrl));

    // Public Routes
    this.app.use('/', express.static(path.join(__dirname, '../public')));
    this.app.use('*', express.static(path.join(__dirname, '../public/index.html')));

  }

  /**
   * Shutdown
   *
   * @class Server
   * @method shutdown
   */
  public shutdown = () => {
    console.log('Shutting Down');
    this.connection.close();
  }

}
