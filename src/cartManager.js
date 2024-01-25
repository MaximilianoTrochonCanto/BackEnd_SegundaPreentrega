const fs = require("fs/promises")

class CartManager{
    constructor(path){
        this.pathDB = path;
    }

    async addProduct(cid,product){
        try{        
        const allProducts = await this.getProducts(cid); 
        
        
        (allProducts.products.some(p => parseInt(p.product,10) === Number(product)))?(allProducts.products.find(p => p.product === product)).quantity+=1:
        allProducts.products.push(new Object({
            product:product,
            quantity:1
        }))
        const arrayNuevo = {"carts":[]}
        const copia = await fs.readFile(this.pathDB)
        const carritos = JSON.parse(copia)
        console.log(carritos)
         for(let i = 0;i<carritos.carts.length;i++){
             arrayNuevo.carts.push((parseInt(carritos.carts[i].id,10) === Number(cid))?allProducts:carritos.carts[i])
         }

        await fs.writeFile(this.pathDB,JSON.stringify(arrayNuevo))        
        }catch(error){
            throw new Error(error)
        }     
    }

    async getProducts(cid){
        try{
            const cartsFileRead = await fs.readFile(this.pathDB);
            const allCarts = JSON.parse(cartsFileRead)                       
            return allCarts.carts.find((c) => parseInt(c.id,10) === Number(cid))
        }catch(error){
            throw new Error(error)
        }
    }

    
}   

module.exports = CartManager;