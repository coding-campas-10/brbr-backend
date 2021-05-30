import express from 'express';
import stationDB from '../database/models/stationSchema.js';
import usersDB from '../database/models/userSchema.js';

const router = express.Router();

const addNewStation = async (req, res) => {
    try{
        const user = await usersDB.findOne({id: req.session.kakao.user.id});
        if(!(user.isAdmin === true)){
            res.status(401).send('권한 없음');
            return;
        }
        const body = req.body;
        const newStation= new stationDB ({
            //Unique한 ID를 발급해야함
            name: body.name,
            stationID: body.station_id,
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
        stations.forEach((station) => console.log(station));
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

router.post('/', addNewStation ) ;    //새 스테이션 등록
router.get('/all', getAllStations );   //모든 스테이션 정보 조회
// router.get('/detail/:id', );    //스테이션별 상세 정보 조회
// router.put('/station/:id', );   //id 스테이션 정보 수정
// router.delete('/station/:id', );    //id 스테이션 정보 삭제

export default router;