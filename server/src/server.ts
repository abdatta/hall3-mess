import bodyParser from 'body-parser';
import express from 'express';
import httpLogger from 'morgan';
import moment from 'moment';
import path from 'path';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

// Routes
import { AccountsRoute } from './routes/accounts.route';

// Models
import { UserModel } from './models/user.model';

// Schema
import { UserSchema } from './schemas/user.schema';

// Config
import { Config } from './config/local';

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

  private userModel!: mongoose.Model<UserModel>; // an instance of UserModel

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

    // configure application
    this.config();
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
    const dbaddr: string = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
    const dbport: string = process.env.MONGO_PORT_27017_TCP_PORT || '27017';
    const MONGODB_CONNECTION = `mongodb://${ dbaddr }:${ dbport }/${ Config.dbname }`;

    httpLogger.token('date', (req: express.Request, res: express.Response) =>
      moment().format('DD MMM\'YY HH:mm:ss'));

    httpLogger.token('post', (req: express.Request, res: express.Response) => {
        if (req.method === 'POST') {
            req.body['password'] = undefined;
            return JSON.stringify(req.body);
        } else {
            return ' ';
        }
    });

    this.app.use(httpLogger(':method :url (:status) :post'));

    // use json bodyparser
    this.app.use(bodyParser.json());

    // use query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // connect to mongoose

    require('mongoose').Promise = global.Promise;

    const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION, { useNewUrlParser: true });
    mongoose.set('useCreateIndex', true);
    this.connection = connection;

    // create models
    this.userModel = connection.model<UserModel>('User', UserSchema);

    // create MongoStore
    const MongoStore = connectMongo(session);

    // create session
    const esession = session({
      secret: Config.session_secret,
      saveUninitialized: true,
      resave: false,
      store: new MongoStore({
        mongooseConnection: connection
      }),
      cookie: {
        // domain: 'mess.hall3iitk.com', // TODO: make this for domain specific
        maxAge: 1 * 24 * 60 * 60 * 1000  // 1 day
      }
    });

    // use session
    this.app.use(esession);

  }

  /**
   * Create router
   *
   * @class Server
   * @method routes
   */
  public routes = () => {

    // API Routes
    this.app.use('/api/accounts', AccountsRoute.create(this.userModel));

    // Public Routes
    this.app.use('/', express.static(path.join(__dirname, '../public')));

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
