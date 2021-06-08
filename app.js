import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import pkg from 'nunjucks';
import morgan from 'morgan';
import MongoSession from 'connect-mongo';

import database from './database/connect.js';   // DB연결
import Route from './router/route.js';
import { stream } from './logger.js';

const { configure } = pkg;
const app = express(); 

dotenv.config('./');

app.set('view engine','html');
configure('views',{
    express:app,
})

app.use(morgan('dev'));
app.use(express.json());
app.use(morgan(`HTTP/:http-version :method :remote-addr 
    :url :remote-user :status :res[content-length] 
    :referrer :user-agent :response-time ms`, { stream }));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    secure: false,
    saveUninitialized: true,
    cookie: {maxAge: parseInt(process.env.SESSION_EXPIRE)}, //만료 시간 6개월
    store: MongoSession.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));    //mongoDB를 session store로 사용


app.use('/', Route);
 
// app.get(kakao.redirectUri)
 
app.listen(3000, ()=>{
    console.log(`server start 3000`);
})