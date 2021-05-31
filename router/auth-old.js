import express from 'express';
import axios from 'axios';
import QueryString, { stringify } from 'qs';
import dotenv from 'dotenv';
import userDB from '../database/models/userSchema.js'

const router = express.Router();

dotenv.config('../');

const kakao = {
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_SECRET_ID,
    redirectUri: process.env.KAKAO_REDIRECT_URI
}
//profile account_email
router.get('/kakao/login',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile`;
    res.redirect(kakaoAuthURL);
});

router.get('/kakao/callback', async(req,res)=>{
    //axios>>promise object
    let token;
    try{//access토큰을 받기 위한 코드
    token = await axios({//token
        method: 'POST',
        url: 'https://kauth.kakao.com/oauth/token',
        headers:{
            'content-type':'application/x-www-form-urlencoded'
        },
        data:stringify({
            grant_type: 'authorization_code',//특정 스트링
            client_id:kakao.clientID,
            client_secret:kakao.clientSecret,
            redirectUri:kakao.redirectUri,
            code:req.query.code,
        })//객체를 string 으로 변환
    })
    }catch(err){
        res.json(err.data);
    }
    //access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
    let user;
    try{
        //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        user = await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`
            }//헤더에 내용을 보고 보내주겠다.
        })
        try{
            const exUser = await userDB.findOne({id: user.data.id});
            if(!exUser) { throw new Error('DB에 사용자가 없음'); }
                
            req.session.kakao = {"user": user.data, "token": token.data};
            res.status(200).json(exUser);
            return;
        }
        catch(e){
            const regesterUser = new userDB({
                id: user.data.id,
                name: user.data.properties.nickname,
                connected_at: user.data.connected_at,
                isAdmin: false
            });
            await regesterUser.save();
            req.session.kakao = {"user": user.data, "token": token.data};
            res.status(200).json(user.data);
            return;
        }
    }catch(e){
        console.log(e);
        res.status(401).json(e.data);
        return;
    }

    // res.redirect('/');
    //req.session = {['kakao'] : user.data};
});

router.post('/kakao/refresh', async(req, res) => {  //재활용할 코드임
    let token;
    try {
        token = await axios({
            method: 'post',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: QueryString.stringify({
                grant_type: 'refresh_token',
                client_id: kakao.clientID,
                client_secret: kakao.clientSecret,
                refresh_token: req.body.refresh_token
            })
        })
      
    }
    catch(e) {
        res.status(401).json(e.data);
        return;
    }
}); 

router.get('/kakao/logout', async (req, res) => {
    try{
        user = await axios({
            method:'post',
            url:'https://kapi.kakao.com/v1/user/logout',
            headers:{
                Authorization: `Bearer ${req.session.kakao.token.access_token}`
            }
        })

        res.json(user);
        return;
    }
    catch(e) {
        res.json(e.data);
        return;
    }
});

export default router;