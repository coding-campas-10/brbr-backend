import express from 'express';
import announceDB from '../database/models/announceSchema.js';
import userDB from '../database/models/userSchema.js';

const router = express.Router();

const addNewAnnounce = async (req, res) => {
    try{
        const user = await userDB.findOne({user_id: req.session.user_id});
        if(!(user.isAdmin === true)){
            throw new Error('권한이 없는 사용자입니다.');
        }
        const body = req.body;
        const newStation= new announceDB ({
            title: body.title,
            description: body.description
        })
        await newStation.save();
        res.status(201).send();
         
    }
    catch(e){
        console.log(e);
        res.status(401).send();
         
    }
}
const getAllAnnounces = async (req, res) => {
    try{
        const announce = await announceDB.find({}, {_id: 0, title: 1, announce_id: 1}).sort({ "created_at": -1 });
        res.status(200).json({announce: announce});
    }
    catch(e){
        res.status(401).send();
        
    }
}
const getRecentAnnounce = async (req, res) => { // 가장 최근 announce의 제목과 id만 반환
    try{
        const announce = await announceDB.findOne({}, {_id: 0, title: 1, announce_id: 1}).sort({ "created_at": -1 });
        res.status(200).json({announce: announce});
    }
    catch(e){
        res.status(401).send();
        
    }
}

const getDetailAnnounce = async (req, res) => {
    try{
        const station = await announceDB.findOne({announce_id: req.params.id}, {_id: 0, title: 1, description: 1, created_at: 1, announce_id: 1});
        res.status(200).json(station);
    }
    catch(e){
        res.status(401).send('대상을 찾을 수 없습니다.');
        
    }
}

const updateAnnounce = async (req, res) => {
    try{
        const user = await userDB.findOne({user_id: req.session.user_id});
        if(!(user.isAdmin === true)){
            throw new Error('권한이 없는 사용자입니다.');
        }
        await announceDB.updateOne({announce_id: req.params.id}, req.body);
        res.status(201).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 삭제할 수 없습니다.');
    }
}

const deleteAnnounce = async (req, res) => {
    try{
        const user = await userDB.findOne({user_id: req.session.user_id});
        if(!(user.isAdmin === true)){
            res.status(401).send('권한이 없는 사용자입니다.');
        }
        await announceDB.deleteOne({announce_id: req.params.id});
        res.status(204).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 삭제할 수 없습니다.');
    }
}

router.post('/', addNewAnnounce ) ;    //새 공지 등록
router.get('/', getRecentAnnounce );   //가장 최근 공지 조회
router.get('/all', getAllAnnounces );   //가장 최근 공지 조회
router.get('/:id', getDetailAnnounce );    //id 공지 상세 정보 조회
router.put('/:id', updateAnnounce );   //id 공지 정보 수정
router.delete('/:id', deleteAnnounce );    //id 공지 정보 삭제

export default router;