const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const quiz1Routes = require('./routes/quiz1Routes');
const quizFactoryRoutes = require('./routes/quizFactoryRoutes');
const quizRoutes = require('./routes/quizRoutes');
const answersRoutes = require('./routes/answersRoutes');

mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
const con = mongoose.connection

con.on('open', () => {
    console.log("DB Connection successful...");
})

con.on('error', () => {
    console.log("DB connection failed...");
})

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT,() => {
    console.log('Listening on Port',process.env.PORT);
});


app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/quiz1', quiz1Routes);
app.use('/api/quizFactory', quizFactoryRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/answers', answersRoutes);
