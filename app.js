require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// middleware
const authUser = require('./middleware/authentication');

// connectDB
const connectDB = require('./db/connect');

// routers
const dashboardRouter = require('./routes/dashboard');    // contains tasks and notes routers
const authRouter = require('./routes/auth');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra security packages
const helmet = require('helmet');     // set numerous headers to prevent http attacks
const cors = require('cors');         // cross origin resource sharing (api accessable in different domain)
const xss = require('xss-clean');     // sanitizes input in req to prevent cross-site scripting attack
const rateLimiter = require('express-rate-limit');    // restrict request user can make

app.use(express.static('./public'));    // express.static(root, [options])
app.use(express.json());

app.set('trust proxy', 1);    // trust proxy like heroku
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,   // 15 min
  max: 100                    // limit each IP to 100 requests per windowMs
}));

app.use('/api/v1', authRouter);
// authUser will check authentication AND set req.user information for dashboardRouter
app.use('/api/v1', authUser, dashboardRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
