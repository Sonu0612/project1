const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

const authRouter = require('./ROUTES/auth')
const profileRouter = require('./ROUTES/profile')
const requestRouter = require('./ROUTES/request')
app.use("/",authRouter);
app.use("/",profileRouter)
app.use("/",requestRouter)
app.listen(3001, () => {
    console.log('Server running on port 3001');
});
