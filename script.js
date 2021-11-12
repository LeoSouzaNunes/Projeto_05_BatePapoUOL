let promise;



function carregarPagina() {


    let userName = { name: prompt("Por favor insira seu nome.") };

    let promiseUserName = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", userName);

    promiseUserName.then(nomeAceito);
    promiseUserName.catch(nomeJaCadastrado);

    function nomeJaCadastrado(fracasso) {
        console.log(fracasso.response.statusText);
        window.location.reload(true);
    }
    function nomeAceito() {
        function userOnline() {
            axios.post("https://mock-api.driven.com.br/api/v4/uol/status", userName);
        }
        function carregarMensagens() {
            promise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");

            promise.then(respostaMessages);
        }

        function respostaMessages(resposta) {
            let messages = resposta.data;
            let blocoMensagens = document.querySelector(".messages")
            blocoMensagens.innerHTML = "";
            for (let i = 0; i < messages.length; i++) {

                if (messages[i].type === "status") {

                    blocoMensagens.innerHTML += `<li class="cinza"> <span class="message" data-identifier="message"> <time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> ${messages[i].text}</span></li> `

                } else if (messages[i].type === "message") {
                    blocoMensagens.innerHTML += `<li class="branco"><span class="message" data-identifier="message"><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> para <strong>${messages[i].to}:</strong> ${messages[i].text}</span></li>`

                } else if (messages[i].type === "private_message" && userName.name === messages[i].to) {
                    blocoMensagens.innerHTML += ` <li class="rosa"><span class="message" data-identifier="message"><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> reservadamente para <strong> ${messages[i].to}:</strong> ${messages[i].text}</span></li>`
                }
            }
            blocoMensagens.lastElementChild.scrollIntoView()
        }
        setInterval(userOnline, 5000)
        setInterval(carregarMensagens, 3000)
    }
}

carregarPagina()


