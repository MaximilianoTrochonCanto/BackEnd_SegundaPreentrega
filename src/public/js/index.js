const socket = io()



const listaMensajes = document.getElementById("listaMensajes")
const user = document.getElementById("userTxt")
const message = document.getElementById("messageTxt")


document.getElementById("btnIngresarMensaje").addEventListener("click",function(){    
    socket.emit("newMessage",{
        user:user.value,
        message:message.value
    })
    
    
    socket.on("msg",(data) => {
        listaMensajes.innerHTML = ""
        data.forEach(m => listaMensajes.innerHTML += `${m.user} dijo: ${m.message} <br>`)
        
    })
    
})

    
