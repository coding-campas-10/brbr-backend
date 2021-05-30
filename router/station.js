import express from 'express';
import stationDB from '../database/models/stationSchema.js';
import usersDB from '../database/models/userSchema.js';

const router = express.Router();

const addNewStation = async (req, res) => {
    try{
        const user = await usersDB.findOne({id: req.session.kakao.user.id});
        if(!(user.isAdmin === true)){
            throw new Error('권한이 없는 사용자입니다.');
        }
        const body = req.body;
        const newStation= new stationDB ({
            name: body.name,
            stationID: body.stationID, // Unique한 ID를 발급해야함 근데 어떻게 하는지 모름
            description: body.description,
            location: { 
                latitude: body.location.latitude,
                longitude: body.location.longitude
            }
        })
        await newStation.save();
        res.status(200).send();
        return;
    }
    catch(e){
        console.log(e);
        res.status(401).send();
        return;
    }
}

const getAllStations = async (req, res) => {
    try{
        const stations = await stationDB.find();
        res.status(200).json({stations: stations});
    }
    catch(e){
        res.status(401).send();
        return;
    }
}

const getDetailStation = async (req, res) => {
    try{
        const station = await stationDB({stationID: req.params.id});
    }
    catch(e){
        res.status(401).send('대상을 찾을 수 없습니다');
        return;
    }
}

const updateStation = async (req, res) => {
    try{
        await stationDB.updateOne({stationID: req.params.id}, req.body);
        res.status(201).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 삭제할 수 없습니다.');
    }
}

const deleteStation = async (req, res) => {
    try{
        await stationDB.deleteOne({stationID: req.params.id});
        res.status(204).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 삭제할 수 없습니다.');
    }
}

router.post('/', addNewStation ) ;    //새 스테이션 등록
router.get('/', getAllStations );   //모든 스테이션 정보 조회
router.get('/:id', getDetailStation);    //id 스테이션 상세 정보 조회
router.put('/:id', updateStation);   //id 스테이션 정보 수정
router.delete('/:id', deleteStation);    //id 스테이션 정보 삭제

export default router;