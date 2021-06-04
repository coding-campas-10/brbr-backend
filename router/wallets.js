import express from 'express';
import walletDB from '../database/models/walletSchema.js';

const router = express.Router();

const makeReceipt = async (req, res) => { //station을 특정할 수 있는 key 필요
    try{
        const wallet = await walletDB.findOne({ user_id: req.session.user_id });
        const point = getPoint(req.body);
        wallet.receipts.push({
            station_id: req.body.station_id,
            point: req.body.point,    //backend에서 weight 기반으로 포인트 정산하는 모듈 필요
                            //그리고 그걸 wallet에 합산해야함

            plastic_weight: req.body.weights.plastic,
            paper_weight: req.body.weights.paper,
            glass_weight: req.body.weights.glass,
            styrofoam_weight: req.body.weights.styrofoam,
            etc_weight: req.body.weights.etc,
        })
        await walletDB.updateOne({ user_id: req.session.user_id }, {
            total_points: wallet.total_points + 
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
        console.log(e);
        res.status(401).send(e);
    }
}

const mostFrequentStation = async (req, res) => {
    try{
        const wallet = await walletDB.findOne({user_id: req.session.user_id});
        // const receipt = wallet.receipts.pull();
        const count = walletDB.aggregate([{
            $unwind : "$receipts"
            //$group : { _id : '$user', count : {$sum : 1}}
        }]).result
        
        console.log(count);
        res.status(200).send();
    }
    catch(e){
        console.log(e);
        res.status(401).send();
    }
}

router.get('/frequent', mostFrequentStation);
router.post('/', makeReceipt);
router.get('/', getAllReceipt);
router.get('/recent', recentReceipt);

export default router;
