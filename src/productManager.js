const fs = require("fs/promises")

class ProductManager{
    constructor(path){
        this.pathDB = path;
    }

    async createProduct(product){
        try{
        const {titulo,descripcion,precio,thumbnail,stock,codigo} = product;
        const allProducts = await this.getProducts(); 
        allProducts.products.push(product);
        await fs.writeFile(this.pathDB,JSON.stringify(allProducts))        
        }catch(error){
            console.log(error)
        }     
    }

    async getProducts(){
        try{
            const allProducts = await fs.readFile(this.pathDB);    
            return JSON.parse(allProducts);
        }catch(error){
            console.log(error);
        }
    }

    async getProductById(id){
        try{
            const allProducts = await this.getProducts();    
            // for(let i = 0;i<allProducts.products.length;i++) if(i+1 === id)return allProducts.products[i]
            const productoBuscado = await allProducts.products.find((p) => parseInt(p.id,10) === parseInt(id,10));            
            if(productoBuscado!==undefined) return productoBuscado;
            else throw new Error("No existe el producto")                    
        }catch(error){
            console.log(error);
        }
    }

    async updateProduct(id,nuevoObjeto){
        try{            
            const arrayNuevo = {"products" : [] }
            console.log(id,nuevoObjeto)
            const copiaDeLosProductos = await this.getProducts();
            for(let i = 0; i < copiaDeLosProductos.products.length;i++){
                arrayNuevo.products.push((i+1 !== Number(id))?copiaDeLosProductos.products[i]:nuevoObjeto)
            } 
            await fs.writeFile(this.pathDB,JSON.stringify(arrayNuevo))
        }catch(error){
            console.log(error);
        }
    }

    async deleteProduct(id){
        
        try{
        const todosLosProductos = require("./products.json");
        for(let i = 0;i<todosLosProductos.products.length;i++){
            if(Number(todosLosProductos.products[i].id) === Number(id)){
                todosLosProductos.products.splice(i,1)
            }
        }
        await fs.writeFile(this.pathDB,JSON.stringify(todosLosProductos))
        }catch(error){
            console.log(error)
        }
    }

}   

module.exports = ProductManager;