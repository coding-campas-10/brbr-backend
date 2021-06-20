import express from 'express';
import stationDB from '../database/models/stationSchema.js';
import userDB from '../database/models/userSchema.js';

const router = express.Router();

const addNewStation = async (req, res) => {
    try{
        const user = await userDB.findOne({user_id: req.session.user_id});
        if(!(user.isAdmin === true)){
            throw new Error('권한이 없는 사용자입니다.');
        }
        const body = req.body;
        const newStation= new stationDB ({
            name: body.name,
            description: body.description,
            location: { 
                type: 'Point',
                coordinates: [body.location[1], body.location[0]] //경도, 위도 순서
            }
        })
        await newStation.save();
        res.status(201).send();
        return;
    }
    catch(e){
        console.log(e);
        res.status(401).send();
        return;
    }
}

const getAllStations = async (req, res) => {    //station ID, station location만 조회
    try{
        const stations = await stationDB.find({}, {_id: 0, station_id: 1, location: 1});
        res.status(200).json({stations: stations});
    }
    catch(e){
        res.status(401).send();
        return;
    }
}

const getDetailStation = async (req, res) => {
    try{
        const station = await stationDB.findOne({station_id: req.params.id});
        res.status(200).json(station);
    }
    catch(e){
        res.status(401).send('대상을 찾을 수 없습니다.');
        return;
    }
}

const updateStation = async (req, res) => {
    try{
        await stationDB.updateOne({station_id: req.params.id}, req.body);
        res.status(201).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 수정할 수 없습니다.');
    }
}

const deleteStation = async (req, res) => {
    try{
        await stationDB.deleteOne({station_id: req.params.id});
        res.status(204).send();
    }
    catch(e){
        res.status(401).send('대상이 없거나 삭제할 수 없습니다.');
    }
}

const getNearestStation = async (req, res) => {
    try{
        const query = (await stationDB.aggregate([{
            $geoNear: {
                spherical: true,
                maxDistance: 3000,
                near: {
                  type: 'Point',
                  coordinates: [req.body.location.lng, req.body.location.lat]
                },
                distanceField: 'distance',
                key: 'location'
              }
        }, {
            $limit: 1
        }]))[0];
        if (!query) { return res.status(204).send() };
        return res.status(200).json(query);
    }
    catch(e){
        console.log(e);
        res.status(400).send();
    }
}

router.post('/', addNewStation ) ;    //새 스테이션 등록
router.get('/', getAllStations );   //모든 스테이션 정보 조회
router.post('/near', getNearestStation);    //가장 가까운 스테이션 정보 조회
router.get('/:id', getDetailStation);    //id 스테이션 상세 정보 조회
router.put('/:id', updateStation);   //id 스테이션 정보 수정
router.delete('/:id', deleteStation);    //id 스테이션 정보 삭제

export default router;