import express from 'express';
import walletDB from '../database/models/walletSchema.js';

const router = express.Router();

const makeReceipt = async (req, res) => { //station을 특정할 수 있는 key가 있으면 좋을듯
    try{
        const wallet = await walletDB.findOne({ user_id: req.body.user_id });
        wallet.receipts.push({
            point: 123
        })
        await wallet.save()
        res.status(200).send('거래 성공');
    }
    catch(e){
        console.log(e);
        res.status(401).send();
    }
}

const getReceipt = async (req, res) => {
    try{
        console.log(req.body);
        const wallet = await walletDB.findOne({user_id: req.body.user_id}, {_id:0, receipts:1});
        console.log(wallet);
        res.status(200).send()    
    }
    catch(e){
        console.log(e);
        res.status(401).send();
    }
}

router.post('/', makeReceipt);
router.post('/', getReceipt);

export default router;
