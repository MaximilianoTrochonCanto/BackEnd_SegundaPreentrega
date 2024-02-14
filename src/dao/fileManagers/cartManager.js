const fs = require("fs/promises")
const path = require("path");
const ProductManager = require("./productManager")

const pManager = new ProductManager(path.join(__dirname, "./products.json"))

class CartManager{
    constructor(path){
        this.pathDB = path;
    }


    async addProduct(cid,product){
        try{        
        const allProducts = await this.getProducts(cid); 
        

        const prod = await pManager.getProductById(product)
        
            if (prod.status) {                                        
            
            (allProducts.products.some(p => parseInt(p.product,10) === Number(product)))?(allProducts.products.find(p => p.product === product)).quantity+=1:
            
            
            allProducts.products.push(new Object({
                product:product,
                quantity:1
        }))
        const arrayNuevo = {"carts":[]}
        const copia = await fs.readFile(this.pathDB)
        const carritos = JSON.parse(copia)
        
        for(let i = 0;i<carritos.carts.length;i++){
            arrayNuevo.carts.push((parseInt(carritos.carts[i].id,10) === Number(cid))?allProducts:carritos.carts[i])
        }
        
        await fs.writeFile(this.pathDB,JSON.stringify(arrayNuevo))        
        }else{ 
            throw new Error("El producto no tiene stock")
        }
    }catch(error){
        throw new Error(error)
    }     
}

    async getProducts(cid){
        
            const cartsFileRead = await fs.readFile(this.pathDB);
            const allCarts = JSON.parse(cartsFileRead)                       
            const retorno = allCarts.carts.find((c) => parseInt(c.id,10) === Number(cid))
            if(retorno === undefined)throw new Error("No existe el carrito")
            return retorno
        
    }

    
}   

module.exports = CartManager;