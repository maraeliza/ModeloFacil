const firebaseConfig = {
    apiKey: "AIzaSyDb_3npjjgS4hWugGVyTpu7QZciGrmzmr8",
    authDomain: "emailstemplate-cf63e.firebaseapp.com",
    databaseURL: "https://emailstemplate-cf63e-default-rtdb.firebaseio.com",
    projectId: "emailstemplate-cf63e",
    storageBucket: "emailstemplate-cf63e.appspot.com",
    messagingSenderId: "924458863765",
    appId: "1:924458863765:web:76b452363be4d11cc81f9c"
};


firebase.initializeApp(firebaseConfig);
var db = firebase.database()

var dados = []

db.ref("/users/").on("value", (data) => {
    dados = data.val();
})

function login() {
    var logou = false;
    var emailExiste = false;
    var email = document.getElementById("email").value;
    email = email.toLowerCase();
    var password = document.getElementById("senha").value;
    if (email && password) {

        console.log(dados)
        for (var i in dados) {
            console.log(dados[i])
            if (dados[i].email == email) {
                emailExiste = true;
            }
            if (dados[i].email == email && dados[i].senha == password) {
                localStorage.setItem("idUser", dados[i].id)
                localStorage.setItem("emailUser", dados[i].email)
                window.location = "perfil.html"
                logou = true;
            }
        }

        if (logou == false && emailExiste) {

            $("#erroLogin").text("E-mail ou senha incorretos")
            swal({
                title: "Email ou senha incorretos",
                confirmButtonText: "Tentar novamente!"
            }, function () {
                document.getElementById("email").value = '';
                document.getElementById("senha").value = '';
            })

        }
        if (emailExiste == false) {
            $("#erroLogin").text("E-mail não encontrado na base de dados, verifique seu email ou crie uma nova conta! ")

        }

    } else {
        $("#erroLogin").text("Preencha os campos de e-mail e senha para logar")
    }

}
$(document).ready(function () {
    function atualizarProgresso(id) {
        // Calcula o progresso total
        var progressoTotal = (pN + pS + pE + pS2) * 100 / 6;
        if (progressoTotal > 0) {
            // Garante que o valor não ultrapasse 100
            if (progressoTotal > 100) {
                progressoTotal = 100;
            }
            $("#" + id).progressbar("value", progressoTotal);

            var cor;
            if (progressoTotal <= 25) {
                cor = '#ff0000'; // Vermelho
            } else if (progressoTotal <= 50) {
                cor = '#ffa500'; // Laranja
            } else if (progressoTotal <= 75) {
                cor = '#90ee90'; // Verde claro
            } else {
                cor = '#4caf50'; // Verde escuro para 75-100%
            }
            $("#" + id + " .ui-progressbar-value").css('background', cor);
            $("#" + id).show()
        } else {
            $("#" + id).hide()
        }

    }
    $(document).tooltip();
    $("#barraProgresso").hide()
    // Inicialize a barra de progresso
    $("#barraProgresso").progressbar({ value: 0 });

    var pN = 0; // Progresso Nome
    var pL = 0; // Progresso Link
    var pS = 0; // Progresso Senha
    var pE = 0; // Progresso Email
    var pS2 = 0;


    $("#addNome").on("input", function () {
        pN = $(this).val().length > 0 ? 1 : 0;
        atualizarProgresso("barraProgresso");
    });

    $("#addEmail").on("input", function () {
        if ($(this).val().length > 0) {

            var jaExiste = false;
            for (var i in dados) {
                if (dados[i].email == $("#addEmail").val()) {
                    $("#erroCadastro").text("E-mail já está cadastrado!")
                    $("#erroCadastro").show()
                    jaExiste = true;
                    break;
                }
            }
            if (!jaExiste) {
                if($(this).val().includes("@") && $(this).val().includes(".com")){
                    pE = 2
                    $("#erroCadastro").text('')
                } else {
                    pE = 1
                }
            }

        } else {
            pE = 0;
        }
        atualizarProgresso("barraProgresso");
    });

    $("#addSenha").on("input", function () {
        pS = $(this).val().length > 0 ? 1 : 0;
        atualizarProgresso("barraProgresso");
    });
    $("#addSenha2").on("input", function () {
        if ($(this).val().length > 0) {
            if ($(this).val() == $("#addSenha").val()) {
                pS2 = 2
                $("#erroCadastro").text('')
            }
            else {
                pS2 = 1
            }

        } else {
            pS2 = 0;
        }
        atualizarProgresso("barraProgresso");
    });
});

$("#criarDiv").hide();

var loginExibido = true;
$("#alternar").click(function () {

    if (loginExibido) {
        $("#entrar").hide();
        $("#criarDiv").show();
        $("#alternar").text("LOGAR")
        $("#texto").text("Já tem uma conta? Clique aqui para logar e entrar em contato com os fornecedores")
        $("#criar").hide()
        $("#caixaNome").hide()
        loginExibido = false;
        $("#barraProgresso").progressbar({
            value: 0
        });


    } else {
        $("#entrar").show();
        $("#criarDiv").hide();

        $("#barraProgresso").hide()
        $("#alternar").text("CADASTRAR")
        $("#texto").text("Crie sua conta e entre em contato com mais facilidade com os fornecedores")
        loginExibido = true;
    }
})

$("#proximo").click(() => {
    if ($("#proximo").text() == "Próximo ➡") {

        var email = $("#addEmail").val()
        var password = $("#addSenha").val()
        var pw2 = $("#addSenha2").val()
        if (password == pw2) {
            if (email && password && pw2) {


                var jaExiste = false;
                for (var i in dados) {
                    if (dados[i].email == email) {
                        $("#erroCadastro").text("E-mail já está cadastrado!")
                        jaExiste = true;
                        break;
                    }
                }
                if (!jaExiste) {
                    if(email.includes("@") && email.includes(".com")){
                        $("#proximo").text("Anterior");
                        $("#caixaEmail").hide();
                        $("#caixaSenha").hide();
                        $("#caixaSenha2").hide();
                        $("#caixaNome").show();
                        $("#criar").show();
                        $("#erroCadastro").text('')
                    } else {
                        swal({
                            title: "E-mail inválido!",
                            text: "Verifique se o e-mail informado está correto",
                            confirmButtonText: "Tentar novamente!"
                        })
                        $("#erroCadastro").text("Verifique se o e-mail informado está correto")
                    }
                }



            } else {
                $("#erroCadastro").text("Preencha todos os campos!")
            }
        } else {
            $("#erroCadastro").text("As senhas diferem!");
            $("#addSenha2").val('')
            $("#addSenha").val('')
        }

    } else {

        $("#proximo").text("Próximo ➡");
        $("#caixaEmail").show();
        $("#caixaSenha").show();
        $("#caixaSenha2").show();
        $("#caixaNome").hide();
        $("#criar").hide();

    }

})
function criarConta() {

    var nome = document.getElementById("addNome").value;
    var email = document.getElementById("addEmail").value;
    var password = document.getElementById("addSenha").value;
    var password2 = document.getElementById("addSenha2").value;

    if (nome && email && password && password2) {

        if (password2 == password) {
            var jaExiste = false;
            for (var i in dados) {
                if (dados[i].email == email) {
                    $("#erroCadastro").text("E-mail já existe!")
                    jaExiste = true;
                    break;
                }


            }
            if (!jaExiste) {
                $("#erroCadastro").text("")
                var id = (Math.random().toFixed(10) * 1000000000000).toString();
                db.ref("/users/" + id).set({
                    email: email.toLowerCase(),
                    senha: password,
                    id: id,
                    nome: nome,
                    ativou:false
                })
                window.location.reload();
            }

        } else {
            $("#addSenha").val("");
            $("#addSenha2").val("");
            $("#erroCadastro").text("As senhas diferem!")
        }

    } else {
        swal({
            title: "Preencha todos os campos"
        })
        $("#erroCadastro").text("Preencha todos os campos!")
    }

}


function reset() {
    db.ref("/users/").set({})
}