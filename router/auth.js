import express from 'express';
import axios from 'axios';
import { stringify } from 'qs';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config('../');

const kakaoLogin = async (req, res) => {
    try{
        //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        const user = await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${req.body.access_token}`
            }//헤더에 내용을 보고 보내주겠다.
        })
        req.session.kakao = user.data;
    }catch(e){
        console.log('/getUser ', e.data);
        res.status(401).json(e.data);
    }
    res.status(200).send();
}

const kakaoLogout = async (req, res) => {
    // 토큰 받아서 세션만 지우면 됨
}

router.get('/kakao/login', kakaoLogin);
router.get('/kakao/logout', kakaoLogout );


export default router;