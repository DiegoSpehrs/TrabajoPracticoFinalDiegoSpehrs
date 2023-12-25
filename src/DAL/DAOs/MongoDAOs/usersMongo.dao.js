import { usersModel } from '../../mongoDB/models/users.model.js';
import BasicMongo from '../MongoDAOs/basicMongo.dao.js';
import { logger } from '../../../winston.js';

class UsersMongo extends BasicMongo {
    constructor() {
        super(usersModel);
    }

    async findOne(email) {
        logger.info(email);
        const response = await usersModel.findOne(email);
        if(!response) throw new Error('Users not found');
        return response;
    }


    async addCart(obj) {
        logger.info('interior obj',obj);
        const {email, cartId} = obj;
        logger.warning('confirmacion de cartId en la funcion addCart',cartId, email);
        const userMod = await usersModel.findOne({email});
        if(!userMod) throw new Error('User not found');
        userMod.cartId = cartId;
        logger.info(userMod);
        const test = await usersModel.findOneAndUpdate({email},{cartId},{new: true});
        logger.info(test);
        return ("cart linked successfully", userMod)
    }
}

export const usersMongo = new UsersMongo();