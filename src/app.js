// Import FeathersJS and dependencies
import { feathers } from '@feathersjs/feathers';
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express';
import configuration from '@feathersjs/configuration';
import socketio from '@feathersjs/socketio';
import { configurationValidator } from './configuration.js';
import { logger } from './logger.js';
import { logError } from './hooks/log-error.js';
import { services } from './services/index.js';
import { channels } from './channels.js';

// Create a Feathers app instance
const app = express(feathers());

// Load app configuration
app.configure(configuration(configurationValidator));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Host the public folder for serving static files
app.use('/', serveStatic(app.get('public')));

// Configure services and real-time functionality
app.configure(rest());
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
);
app.configure(services);
app.configure(channels);

// Configure a middleware for 404 errors and the error handler
app.use(notFound());
app.use(errorHandler({ logger }));

// Register hooks for all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
});

// Register application setup and teardown hooks
app.hooks({
  setup: [],
  teardown: []
});

// Export the Feathers app for serverless deployment
export default app;