import { query } from 'express';
import {productsMongo} from '../../DAL/DAOs/MongoDAOs/productsMongo.dao.js';
import CustomError from '../../errors/CustomError.js';
import { ErrorMessage } from '../../errors/error.enum.js';
import { logger } from '../../winston.js';

class ProductsService{
    async getPorducts(obj){
      const {limit=10 ,page=1, ...query } = obj;
      const result = await productsMongo.model.paginate(
        query,
        {limit ,page}
      );
      logger.info(result);
      const info = {
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: `http://localhost:8080/api/products?page=${result.prevPage}`,
        nextLink: `http://localhost:8080/api/products?page=${result.nextPage}`
      };
      return {info};
    }

    async addProduct(obj){
      const {title, description, price, thumbnail, category, code, sotck, quantity} = obj;
      if(!title || !description || !price || !thumbnail || !category || !code || !sotck || !quantity) throw new CustomError(ErrorMessage.PRODUCT_DATA_MISSSING);
      const newProduct = await productsMongo.createOne(obj);
      return newProduct;
    }

    async getProductById(pid){
        const product = await productsMongo.findById(pid);
        if(!product) throw new CustomError(ErrorMessage.PRODUCT_NOT_FOUND);
        return product;
    }

    async updateProduct (pid,obj){
        const product = await productsMongo.findById(pid);
        if(!product) throw new CustomError(ErrorMessage.PRODUCT_NOT_FOUND);
        const response = await productsMongo.updateOne({_id:pid},{...obj});
        return response;
    }

    async deleteProduct(pid){
      const product = await productsMongo.findById(pid);
      if(!product) throw new CustomError(ErrorMessage.PRODUCT_NOT_FOUND); 
      const response = await productsMongo.deleteOne(pid);
       return response;
    }
}

export const productsService = new ProductsService()