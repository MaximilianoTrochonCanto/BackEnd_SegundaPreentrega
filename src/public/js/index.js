const socket = io()


const title = document.getElementById("txtTitle")
const price = document.getElementById("txtPrecio")
const stock = document.getElementById("txtStock")
const description = document.getElementById("txtDescription")
const category = document.getElementById("txtCategory")
const code = document.getElementById("txtCode")
const thumbnails = document.getElementById("txtThumbnails")
const listaProductos = document.getElementById("listaProductos")
const idProd = document.getElementById("txtProductoBorrar")
const botonBorrar = document.getElementById("btnBorrar")

document.getElementById("formProd").addEventListener("submit",async (e) => {
    e.preventDefault();
    
    if(!title.value.trim().length) return;
    

    
    socket.emit("new-prod",
    {
        title: title.value,
        price: price.value,
        stock: stock.value,
        description: description.value,
        category: category.value,
        code: code.value                
    }
    )    
})

socket.on("prod-logs",(data) => {
    listaProductos.innerHTML = ""         
    if(data.length>0)
    data.forEach(p => {
        listaProductos.innerHTML += `        
        <h2>ID: ${p.id}</h2>                
        <h2>Titulo: ${p.title}</h2>                
        <h2>Precio: ${p.price}</h2>
        <h2>Stock: ${p.stock}</h2>
        <h2>Descripcion: ${p.description}</h2>
        <h2>Categoria: ${p.category}</h2>
        <h2>Codigo: ${p.code}</h2>
        <hr>
        `
    }); 

})

botonBorrar.addEventListener("click",(e) =>{
    e.preventDefault()
    socket.emit("borrar-prod",idProd.value)
})
    
