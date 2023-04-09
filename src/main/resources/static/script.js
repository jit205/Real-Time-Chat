var stompClient=null


function connect()
{
    let socket=new SockJS("/server1")
    stompClient=Stomp.over(socket)
    stompClient.connect({},function(fram){
        console.log("connected: "+fram)
        $("#name-form").addClass('d-none')
        $("#chat-room").removeClass('d-none')

        stompClient.subscribe("/topic/return-to",function(response){
            console.log("suscrube")
            showMessage(JSON.parse(response.body))
        })
    })
}


function sendMessage()
{
    let jsonobj={
        name:localStorage.getItem("name"),
        content:$("#message-value").val()
    }
    stompClient.send("/app/message",{},JSON.stringify(jsonobj))
 
}




function showMessage(message)
{
    console.log("show message")
    $("#message-container-table").append(`<tr><td><b>${message.name} : </b>${message.content}</td></tr>`)
}


$(document).ready((e)=>{

    $("#login").click(()=>{
        let name=$("#name-value").val()
        localStorage.setItem("name",name)
        $("#name-title").html(`Welcome ,<b>${name}</b>`)

        connect();
    })

    $("#send-btn").click(()=>{

        sendMessage()
    })
    $("#logout").click(()=>{
        localStorage.removeItem("name")
        if(stompClient !== null)
        {
            stompClient.disconnect()
            $("#name-form").removeClass('d-none')
        $("#chat-room").addClass('d-none')
        }
    })
})