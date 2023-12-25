import {productsService} from '../../services/products/products.service.js';
import { logger } from '../../winston.js';
import { transport } from '../../nodmailer.js';


class ProductsController {
    async getAllProducts(req,res) {
      try {
        const products = await productsService.getPorducts(req.query); 
        res.status(200).json({products});
      } catch (error) {
        logger.error({message:error.message});
        res.status(500).json({error});
      }
    }
    async getProductById(req, res) {
        const {pid} = req.params
        try {
          const product = await productsService.getProductById(pid);
          res.status(200).json({message:'this product is',product});  
        } catch (error) {
            logger.error({message:error.message});
            res.status(400).json({message:error.message});
        }
    }
    async addProduct(req, res) {
      try {
        const newProduct = await productsService.addProduct(req.body);
        res.status(200).json({message:'New product created',newProduct});
      } catch (error) {
          logger.error({message:error.message});
          res.status(400).json({message:error.message});
      }
    }
    async updateProduct(req, res) {
      const {pid} = req.params;
      try {
        const result = await productsService.updateProduct(pid, req.body);
        res.status(200).json({message:'Product updated successfully',result});
      } catch (error) {
          logger.error({message:error.message});
          res.status(400).json({message:error.message});
      }  
    }
    async productDelete(req, res, next) {
        const {pid} = req.params;
        try {
          const result = await productsService.deleteProduct(pid);  
          res.status(200).json({message:'Product deleted successfully'});
        } catch (error) {
            logger.error({message:error.message});
            res.status(400).json({message:error.message});
        }
    next();
    }

    async premiunAlertDelete(req, res, next) {
      const {pid} = req.params;
      const prod = await productsService.getProductById(pid);
      if (!prod.owner){
        next();
      }else{
        const messageOptions = {
          from: 'ecommerce alert',
          to: prod.owner,
          subject: 'your product has been deleted',
          text: `hi, your product published is deleted ${prod.name}`
        };
        await transport.sendMail(messageOptions);
        res.send('mail sent successfully');
      }
      next();
    }

    
}

export const productsController = new ProductsController();