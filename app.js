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


app.use(express.static('./public'));    // express.static(root, [options])
app.use(express.json());

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
