import express from 'express';
import dotenv from 'dotenv';
import userDB from '../database/models/userSchema.js';
import walletDB from '../database/models/walletSchema.js';
import { logger } from '../logger.js';

const router = express.Router();

dotenv.config('../');

const login = async (req, res) => {   //우리측 DB와 대조하기만 하면 됨, 회원가입 안되어있으면 401 반환
    try{
        const exUser = await userDB.findOne({user_id: req.body.user_id}, {_id:0, user_id:1, name:1, connected_at:1});
        if(!exUser) { 
            req.session.destroy();
            return res.status(401).send('등록되지 않은 카카오 계정입니다'); 
        }
        else{
            req.session.user_id = req.body.user_id;
            logger.info(`user ${req.body.user_id} login`);
            res.status(200).json(exUser);
        }
    }
    catch(e){
        logger.error(e);
        res.status(400).send(e);
    }
}

const register = async (req, res) => {  //회원가입 되어있으면 401 반환, 이외 에러는 400 반환, 아니면 userDB와 walletDB 생성하고 200 반환
    try{
        const exUser = await userDB.findOne({user_id: req.body.user_id}, {_id:0, user_id:1, name:1, connected_at:1});    //kakao측 user 데이터쪽에 맞춰서 user_id 대신 id 사용
        if(exUser) { 
            req.session.destroy();
            return res.status(401).send('이미 등록된 카카오 계정입니다.'); 
        };
        
        const registerUser = new userDB({
            user_id: req.body.user_id,
            name: req.body.name,
            connected_at: req.body.connected_at,
            isAdmin: false
        });

        const registerWallet = new walletDB({
            user_id: req.body.user_id
        });
        await registerUser.save();
        await registerWallet.save();

        req.session.user_id = req.body.user_id;
        res.status(200).json(exUser);
    }
    catch(e){
        logger.error(e);
        res.status(401).send(e);
    }
}

const logout = (req, res) => {  //우리측 세션만 만료
    if (req.session.user_id){
        logger.info(`user ${req.session.user_id} logout`);
        req.session.destroy();
        res.status(204).send('로그아웃 성공');
    }
    else{
        res.status(400).send('로그아웃 불가');
    }
}

const getUserInfo = async (req, res) => {
    try{
        const exUser = await userDB.findOne({user_id: req.session.user_id}, {_id:0, user_id:1, name:1, connected_at:1});
        if(!exUser) { return res.status(401).send('계정 정보를 찾을 수 없습니다.')};
        res.status(200).send(exUser);
    }
    catch(e){
        logger.error(e);
        res.status(401).send(e);
    }
}

const leave = async (req, res) => {
    try{
        await userDB.deleteOne({user_id: req.session.user_id});
        await walletDB.deleteOne({user_id: req.session.user_id});
        req.session.destroy();

        return res.status(204).send();
    }
    catch(e){
        return res.status(400).send();
    }
}

router.delete('/leave', leave);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout );
router.get('/info', getUserInfo);

export default router;