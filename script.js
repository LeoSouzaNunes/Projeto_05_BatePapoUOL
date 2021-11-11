let promise;

function carregarMensagens() {
    promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages")

    promise.then(respostaMessages)
}

function respostaMessages(resposta) {
    let messages = resposta.data;
    let blocoMensagens = document.querySelector(".messages")
    blocoMensagens.innerHTML = "";
    for (let i = 0; i < messages.length; i++) {

        if (messages[i].type === "status") {

            blocoMensagens.innerHTML += `<li class=\"cinza\"> <span class="message"> <time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> entra na sala...</span></li> `

        } else if (messages[i].type === "message") {
            blocoMensagens.innerHTML += `<li class="branco"><span class="message"><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> para <strong>${messages[i].to}:</strong> ${messages[i].text}</span></li>`

        } else if (messages[i].type === "private_message") {
            blocoMensagens.innerHTML += ` <li class="rosa"><span class="message"><span><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> reservadamente para <strong> ${messages[i].to}:</strong> ${messages[i].text}</span></li>`
        }
    }

}

setInterval(carregarMensagens, 3000)


