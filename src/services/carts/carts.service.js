import {cartsMongo} from '../../DAL/DAOs/MongoDAOs/cartsMongo.dao.js';
import {usersMongo} from '../../DAL/DAOs/MongoDAOs/usersMongo.dao.js';
import { ErrorMessage } from '../../errors/error.enum.js';
import CustomError from '../../errors/CustomError.js';
import { logger } from '../../winston.js';

class CartsService {
    async getAllCarts(){
        const response = await cartsMongo.findAll();
        return response;
    }
    async getCartById(cid) {
        const cart = await cartsMongo.findById(cid);
        if(!cart) throw new CustomError(ErrorMessage.CART_NOT_FOUND); 
        const response = await cartsMongo.model.findById(cid).populate('products');
        return response;
    }
    async createCart(pucharse) {
        console.log(pucharse);
        if(!pucharse ) throw new CustomError(ErrorMessage.CART_DATA_MISSING);
        const response = await cartsMongo.createOne({pucharse});
        return response;
    }
    async cartDelete(cid) {
        const cart = await cartsMongo.findById(cid);
        if(!cart) throw new CustomError(ErrorMessage.CART_NOT_FOUND);
        const response = await cartsMongo.deleteOne(cid);
        return response;
    }
    async cartUpdate(id,obj) {
        const response = await cartsMongo.model.updateOne({_id:id},{...obj});
        return response;
    }
    async productDelete(cid,pid) {
        const cart = await cartsMongo.findById(cid);
        if(!cart) throw new CustomError(ErrorMessage.CART_NOT_FOUND);
        const response = await cartsMongo.model.updateOne({_id:cid},{$pull:{products:pid}});
        return response;
    }
    async updateProduct(cid,pid,quantity) {
        const cart = await cartsMongo.findById(cid);
        if(!cart) throw new CustomError(ErrorMessage.CART_NOT_FOUND);
        const response = await cartsMongo.model.findById(cid).updateOne({_id:pid},{$inc:{quantity:quantity}});
    }
    async addProduct(cid,pid) {
        const cart = await cartsMongo.findById(cid);
        if(!cart) throw new CustomError(ErrorMessage.CART_NOT_FOUND);
        const response = await cartsMongo.model.findById(cid).updateOne({$push:{products:pid}});
        return response;
    }

    async cartData(cid){
        const cartData = await this.getCartById(cid);
        const cartProducts = cartData.products;
        const list = [];
        cartProducts.map(e => {
            const find = list.find(t => t.id === e.id)
            if(find){
                find.quantity = find.quantity + 1
                find.total = find.price * find.quantity
            }
            else{
                list.push(
                    {
                    id: e.id,
                    title: e.title,
                    price: e.price,
                    total: e.price * e.quantity,
                    quantity: 1
                    }
                )   

            }
        })
        logger.info('interior de list', list);
        return list
    }

    async totalPriceCart(obj){
        logger.info(obj);
        const total = obj.reduce((acum, e) => acum + e.total, 0)
        logger.info(total);
        return total
    }

    async addCartToUser(cartId, email){
        await usersMongo.addCart(cartId, email);
    }
}

export const cartsService = new CartsService()