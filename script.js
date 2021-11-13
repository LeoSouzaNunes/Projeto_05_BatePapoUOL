let promise;
let userName;
let addHiddenButton;
let addHiddenInput;
let loginPage;
let trazerPage;

function telaLogin() {
    let pegarNome = document.querySelector(".login input")

    userName = { name: pegarNome.value }

    loginPage = document.querySelector(".login")
    addHiddenInput = document.querySelector(".login input");
    addHiddenButton = document.querySelector(".login .enter");
    let loadingOn = document.querySelector(".login .loading");
    let loadingTextOn = document.querySelector(".login .text-loading")

    trazerPage = document.querySelectorAll(".hidden")

    addHiddenInput.classList.add("hidden")
    addHiddenButton.classList.add("hidden")
    loadingOn.classList.remove("hidden")
    loadingTextOn.classList.remove("hidden")

    carregarPagina()

    pegarNome.value = ""
}

function carregarPagina() {

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

            loginPage.classList.add("hidden")

            for (let i = 2; i < trazerPage.length; i++) {

                trazerPage[i].classList.remove("hidden")
            }
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
function enviarMensagem() {
    let conteudoMensagem = document.querySelector(".footer input")
    console.log(conteudoMensagem.value);
    let promiseMensagem = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
        from: userName.name,
        to: "Todos",
        text: conteudoMensagem.value,
        type: "message" // ou "private_message" para o bônus
    })
    promiseMensagem.then(mensagemEnviada);
    promiseMensagem.catch(userOffline)


    function mensagemEnviada() {
        conteudoMensagem.value = ""
    }
    function userOffline() {
        window.location.reload(true)
    }
}


