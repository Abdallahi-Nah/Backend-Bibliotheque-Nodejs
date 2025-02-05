const express = require('express');
require('./config/connect');
const User = require('./routers/userRouter');
const Book = require('./routers/bookRouter');

const app = express();
app.use(express.json());

app.use('/user', User);
app.use('/book', Book);

app.use('/getfile', express.static('./uploads'));

app.listen(3000, () => {
    console.log('Server Work...');
})