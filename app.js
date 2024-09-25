const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const router = require('./router/route'); 
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(router);
mongoose.connect(process.env.STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));


const port = process.env.PORT || 3000; 
app.listen(port, () => {
    console.log('Application is listening on PORT', port);
});
