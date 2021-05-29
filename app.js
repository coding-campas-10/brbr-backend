import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import pkg from 'nunjucks';
import logger from 'morgan';
import MongoSession from 'connect-mongo';

import database from './database/connect.js';
import Route from './router/route.js';

const { configure } = pkg;
const app = express(); 

dotenv.config('./');

app.set('view engine','html');
configure('views',{
    express:app,
})

app.use(logger('dev'));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    secure: false,
    saveUninitialized: true,
    store: MongoSession.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));    //mongoDB를 session store로 사용


app.use('/', Route);
 
// app.get(kakao.redirectUri)
 
app.listen(3000, ()=>{
    console.log(`server start 3000`);
})