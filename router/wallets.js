import express from 'express';
import walletDB from '../database/models/walletSchema.js';
import stationDB from '../database/models/stationSchema.js';

const router = express.Router();

const getPoint = (body) => {

    let point = body.weights.plastic * 10 + body.weights.paper * 10 + body.weights.glass * 10 + body.weights.styrofoam * 10 + body.weights.etc * 10;

    return point;
}

const makeReceipt = async (req, res) => { //station을 특정할 수 있는 key 필요
    try{
        const wallet = await walletDB.findOne({ user_id: req.session.user_id });
        const point = getPoint(req.body);
        wallet.receipts.push({
            station_id: req.body.station_id,
            station_name: (await stationDB.findOne({ station_id: req.body.station_id })).name,
            
            point: point,

            plastic_weight: req.body.weights.plastic,
            paper_weight: req.body.weights.paper,
            glass_weight: req.body.weights.glass,
            styrofoam_weight: req.body.weights.styrofoam,
            etc_weight: req.body.weights.etc,
        })
        await walletDB.updateOne({ user_id: req.session.user_id }, {
            total_points: wallet.total_points + point
        });
        await wallet.save()
        res.status(200).send('거래 성공');
    }
    catch(e){
        console.log(e);
        res.status(401).send(e);
    }
}

const getAllReceipt = async (req, res) => {
    try{
        const wallet = await walletDB.findOne({ user_id: req.session.user_id });
        const receipts = wallet.receipts.pull();
        res.status(200).send(receipts);    
    }
    catch(e){
        console.log(e);
        res.status(401).send();
    }
}

const recentReceipt = async (req, res) => {
    try{
        const wallet = await walletDB.findOne({user_id: req.session.user_id});
        const receipt = wallet.receipts.pull();
        res.status(200).send(receipt[receipt.length - 1]);  //전체 receipt에서 마지막 index 반환
    }
    catch(e) {
        res.status(401).send(e);
    }
}

const mostVisitedStation = async (req, res) => {
    try{
        const wallet = await walletDB.aggregate([
            { $match: { user_id: req.session.user_id }},
            { $unwind: '$receipts' },
            { $group: { _id: '$receipts.station_id', total: { $sum: 1}}},
            { $sort: { total: -1 }}
        ]);

        const station = await stationDB.findOne({ station_id: wallet[0]._id }, { _id: 0, name: 1 });

        const result = { station_name: station.name, station_total: wallet[0].total };

        res.status(200).json(result);
    }
    catch(e){
        console.log(e);
        res.status(401).send();
    }
}

router.get('/most-visited', mostVisitedStation);
router.post('/', makeReceipt);
router.get('/', getAllReceipt);
router.get('/recent', recentReceipt);

export default router;