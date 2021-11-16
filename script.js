let promise;
let userName;
let addHiddenButton;
let addHiddenInput;
let loginPage;
let trazerPage;
let pegarNome = document.querySelector(".login input")
let promiseUsers;
let oldUsers;

function telaLogin() {
    userName = { name: pegarNome.value }

    loginPage = document.querySelector(".login")
    addHiddenInput = document.querySelector(".login input");
    addHiddenButton = document.querySelector(".login .enter");
    let loadingOn = document.querySelector(".login .loading");
    let loadingTextOn = document.querySelector(".login .text-loading")

    trazerPage = document.querySelector(".page")

    addHiddenInput.classList.add("hidden")
    addHiddenButton.classList.add("hidden")
    loadingOn.classList.remove("hidden")
    loadingTextOn.classList.remove("hidden")

    carregarPagina()
}

function usuariosAtivos() {
    promiseUsers = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");

    promiseUsers.then(carregarUsers);
}

function carregarUsers(users) {
    let usersOnline = users.data;

    let contatos = document.querySelector(".aside .contacts")

    contatos.innerHTML = ""

    for (let i = 0; i < usersOnline.length; i++) {
        contatos.innerHTML += ` <li class="contact" onclick="selectUser(this)">
        <ion-icon class="people"  name="person-circle"></ion-icon> <span class="username">${usersOnline[i].name} </span> <ion-icon class="checkmark hidden" name="checkmark"></ion-icon>
        </li>`
    }


}
setInterval(usuariosAtivos, 10000);


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
            trazerPage.classList.remove("hidden")

            let messages = resposta.data;
            let blocoMensagens = document.querySelector(".messages")
            blocoMensagens.innerHTML = "";
            for (let i = 0; i < messages.length; i++) {

                if (messages[i].type === "status") {

                    blocoMensagens.innerHTML += `<li class="cinza"> <span class="message" data-identifier="message"> <time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> ${messages[i].text}</span></li> `

                } else if (messages[i].type === "message") {
                    blocoMensagens.innerHTML += `<li class="branco"><span class="message" data-identifier="message"><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> para <strong>${messages[i].to}:</strong> ${messages[i].text}</span></li>`

                } else if (messages[i].type === "private_message" && (userName.name === messages[i].to || userName.name === messages[i].from)) {
                    blocoMensagens.innerHTML += ` <li class="rosa"><span class="message" data-identifier="message"><time>(${messages[i].time})</time> <strong>${messages[i].from}</strong> reservadamente para <strong> ${messages[i].to}:</strong> ${messages[i].text}</span></li>`
                }
            }
            blocoMensagens.lastElementChild.scrollIntoView()
        }
        setInterval(userOnline, 5000);
        setInterval(carregarMensagens, 3000);
    }
}



function enviarMensagem() {
    let conteudoMensagem = document.querySelector(".footer .escreva-aqui")
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

function sideBar() {
    let background = document.querySelector(".background-sidebar")
    let sidebar = document.querySelector(".aside")

    background.classList.toggle("hidden")
    sidebar.classList.toggle("hidden")
}


function selectUser(enviarPara) {
    let checkmark = enviarPara.querySelector(".checkmark")
    checkmark.classList.remove("hidden")
    let allContacts = document.querySelectorAll(".contacts .hidden")
    console.log(allContacts)
}

function logarEnter(event) {

    if (event.keyCode === 13) {
        let enter = document.querySelector(".login .enter")
        enter.click()
    }

}

function enterMensagem(event) {

    if (event.keyCode === 13) {
        let sendMessage = document.querySelector(".main .footer .send-message")
        sendMessage.click()
    }
}
pegarNome.value = ""
