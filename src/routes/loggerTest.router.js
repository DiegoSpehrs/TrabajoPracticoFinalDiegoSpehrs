import { Router } from "express";
import { logger } from "../winston.js";

const router = Router();

router.get('/', (req,res) => {
    logger.fatal('Testing FatalLevel');
    logger.error('Testing ErrorLevel');
    logger.warning('Testing WarningLevel');
    logger.info('Testing InfoLevel');
    logger.http('Testing HttpLevel');
    logger.debug('Testing DebugLevel');
    res.send('Testing logger winston');
})


export default router