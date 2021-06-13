import express from 'express';
import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode';
import otpDB from '../database/models/otpSchema.js';
import walletDB from '../database/models/walletSchema.js';
import { logger } from '../logger.js';

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


const router = express.Router();

const getBarcode = async (req, res) => {
    try {
        const uid= req.session.user_id;
    }
    catch(e) {
        logger.error(e);
        res.status(401).send(e);
        return;
    }
    const barcode= Math.random().toString(36).substr(2, 10);
    JsBarcode(svgNode, barcode, {
        xmlDocument: document,
        displayValue: false,
    });
    const newCode = new otpDB ({
        user_id: req.session.user_id,
        otp_code: barcode,
        createdAt: new Date()
    })
    try{
        await newCode.save()
        let svgBarcode = xmlSerializer.serializeToString(svgNode).replace(/"/g, "'");
        let time= new Date()
        time.setSeconds(time.getSeconds()+50)
        res.status(200).json({svg: svgBarcode, code: barcode, ttl: time});
        return;
    }
    catch(e){
        logger.error(e);
        res.status(401).send(e);
    }
}

const authBarcode = async (req, res) => {
    try{
        const queryOtp = await otpDB.findOne({otp_code: req.body.otp});
        res.status(200).json(await walletDB.findOne({user_id: queryOtp.user_id}));
    }
    catch(e){
        logger.error(e);
        res.status(401).send('없거나 만료된 토큰입니다.');
    }
}

router.get('/', getBarcode);
router.post('/', authBarcode);

export default router;