import express from 'express';
import { DOMImplementation, XMLSerializer } from 'xmldom';
import JsBarcode from 'jsbarcode';
import otpDB from '../database/models/otpSchema.js';

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');


const router = express.Router();

const getBarcode = (req, res) => {
    try {
        const uid= req.session.kakao.user.id;
    }
    catch(e) {
        res.status(401).send(e);
        return;
    }
    const barcode= Math.random().toString(36).substr(2, 10);
    JsBarcode(svgNode, barcode, {
        xmlDocument: document,
        displayValue: false,
    });

    const newCode = new otpDB ({
        user_id: req.session.kakao.user.id,
        otp_code: barcode,
        createdAt: new Date()
    })
    newCode.save()
    .then(() => {
        res
            .status(200)
            .header('Content-Type', 'image/svg')
            .header('Content-disposition', `attachment; filename=${encodeURI('barcode.svg')}`)
            .send(xmlSerializer.serializeToString(svgNode));
        return;
    })
    .catch((err) => {
        res.status(401).send();
    });
}

const authBarcode = (req, res) => {
    otpDB.findOne({otp_code: req.body.otp})
        .then((post) => {
            res.status(200).json(post);
            return;
        })
        .catch((e) => {
            res.status(401).send(e);
        })
}

router.get('/', getBarcode);
router.post('/', authBarcode);

export default router;