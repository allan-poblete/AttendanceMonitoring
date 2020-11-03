const express = require('express');

const eventRouter = require('./routers/eventRouter');
const memberRouter = require('./routers/memberRouter');
const attendanceRouter = require('./routers/attendanceRouter');

const dotenv = require('dotenv');
const connect = require('./db');

const app = express();

dotenv.config({ path: './config/config.env' });

connect();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/events', eventRouter);
app.use('/api/members', memberRouter);
app.use('/api/attendance', attendanceRouter);

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.send({
      errorMessage: err.message,
      errorStack: err.stack
    });
});

app.get('/', (req, res) => {
    res.end('Attendance monitoring app running.');
});

app.listen(port, () => {
    console.log(`Server is now listening to port: ${port}`);
});

