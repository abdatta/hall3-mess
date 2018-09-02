import bodyParser from 'body-parser';
import express from 'express';
import httpLogger from 'morgan';
import moment from 'moment';
import path from 'path';

// Routes
import { AccountsRoute } from './routes/accounts.routes';

// Models

// Schema

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

    // create MongoStore

    // create session

    // use session

  }

  /**
   * Create router
   *
   * @class Server
   * @method routes
   */
  public routes = () => {

    // Main Website API Routes
    this.app.use('/api/accounts', AccountsRoute.create());

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
    // this.connection.close();
  }

}
