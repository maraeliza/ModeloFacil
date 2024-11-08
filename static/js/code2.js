const firebaseConfig = {
  apiKey: "AIzaSyDb_3npjjgS4hWugGVyTpu7QZciGrmzmr8",
  authDomain: "emailstemplate-cf63e.firebaseapp.com",
  databaseURL: "https://emailstemplate-cf63e-default-rtdb.firebaseio.com",
  projectId: "emailstemplate-cf63e",
  storageBucket: "emailstemplate-cf63e.appspot.com",
  messagingSenderId: "924458863765",
  appId: "1:924458863765:web:76b452363be4d11cc81f9c",
};
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
var db = firebase.database();

$(document).ready(() => {
  var emailUser = localStorage.getItem("emailUser");
  if (!emailUser) {
    window.location = '/'
  }
  var id = localStorage.getItem("idUser");
  $("#barraAssinatura").css("width", $("#inputAss").outerWidth())
  $("#barraAssinatura").progressbar({ value: 0 });
  $("#barraAssinatura").hide();

  $("#imgAssinatura").css("width", $("#inputAss").outerWidth())
  $("#imgAssinatura").css("height", $("#imgAssinatura").outerWidth() / 3)
  $("#imgAssinatura").hide()
  $("#delAssinatura").hide()

  $("#barraFundo").css("width", $("#inputAss").outerWidth())
  $("#barraFundo").progressbar({ value: 0 });
  $("#barraFundo").hide();

  $("#delFundo").hide()

  var userDados;
  var ativou = false;
  db.ref("/users/" + id).on("value", (data) => {
    userDados = data.val();

    $("#nome").val(userDados.nome);
    $("#email").val(userDados.email);
    $("#seuNome").text(userDados.nome);

    ativou = userDados.ativou || false;
    if(ativou==false){
      Swal.fire({
        icon: 'warning',
        title: "Ativação de conta pendente no Google",
        text:"Por favor, autorize o envio de e-mails da sua conta no Google",
        confirmButtonText: "Ativar",
        confirmButtonColor: "#151546",
        showCancelButton: false, 
        showConfirmButton: true, 
        allowOutsideClick: false, 
        allowEscapeKey: false, 
        allowEnterKey: false, 

      }).then((result) => {
        if (result.isConfirmed) {
          db.ref("/users/" + id + "/ativou").set(true);
          window.open('https://myaccount.google.com/lesssecureapps?pli=1&rapt=AEjHL4MkZh54OxDrLe-77Btt-fuJtqWVFI79TW4cDnxNCPPR-cT4KKZ9f5bet3C_EV7ehIr57YXcZn_inuLZm382nACIKgYLYUD3nM1eMAPgBXZQAVhV6SI', "_blank");
        }
      });
    }

    if (userDados.fundo) {
      var linkFundo = userDados.fundo.url;
      carregarImagem(linkFundo, "fundo");
      $("#labelFundo").text("");

    } else {
      $("#labelFundo").text("Nenhuma imagem de fundo definida");
      $("#fundo").fadeOut(() => {
        $("#fundo").attr("src", "");
        $("#fundo2").attr("src", "");
        $("#delFundo").hide();
      })

    }
    if (userDados.assinatura) {
      var linkAssin = userDados.assinatura.url;

      carregarImagem(linkAssin, "imgAssinatura");
      setTimeout(() => {
        $("#delAssinatura").fadeIn();
      }, 2000)


    } else {


      $("#imgAssinatura").fadeOut(() => {

        $("#delAssinatura").hide();
        $("#imgAssinatura").attr("src", "");
        $("#labelAss").text("Nenhuma assinatura definida");
      });

    }
  });
  enviarImagem(
    "upFundo",
    "inputFundo",
    "fundo",
    "fundo",
    "barraFundo",
    "labelFundo"
  );
  enviarImagem(
    "upAss",
    "inputAss",
    "assinatura",
    "imgAssinatura",
    "barraAssinatura",
    "labelAss"
  );

  $("#delFundo").click(() => {
    console.log(userDados)
    var fileRef = storage.refFromURL(userDados.fundo.url)
    fileRef.delete().then(() => {
      db.ref("/users/" + id).update({
        fundo: null,
      });
      mostrarMensagem("Imagem excluída com sucesso", "#00905F");
      $("#delFundo").fadeOut();
    }).catch((err) => {
      console.log(err)
    })



  });
  $("#delAssinatura").click(() => {
    var fileRef = storage.refFromURL(userDados.assinatura.url)
    fileRef.delete().then(() => {
      db.ref("/users/" + id).update({
        assinatura: null,
      });
      mostrarMensagem("Imagem excluída com sucesso", "#00905F");
    }).catch((err) => {
      console.log(err)
    })
  });
  $("#salvar").click(() => {
    var erro = false;
    if ($("#nome").val() != "") {
      db.ref("/users/" + id).update({
        nome: $("#nome").val(),
      });
      mostrarMensagem("Nome alterado com sucesso", "#00905F");
      erro = false;
    }
    if ($("#email").val() != "") {
      if (
        $("#email").val().includes("@") &&
        $("#email").val().includes(".com")
      ) {
   
          db.ref("/users/").on("value", (data) => {
            var users = data.val();
            var jaExiste = false
            for (var i in users) {
              if (users[i].email == $("#email").val()) {
                if (users[i].email != userDados.email) {
                  mostrarMensagem(
                    "Não foi possível alterar o e-mail, pois o e-mail informado está em uso",
                    "orange"
                  );
                  erro = true;
                  $("#email").val(userDados.email);
                  jaExiste = true;
                  break;
                }
              }
            }
            if (!jaExiste) {
              db.ref("/users/" + id).update({
                email: $("#email").val(),
              });
              mostrarMensagem("Email alterado com sucesso", "#00905F");
              erro = false;
            }
          })

        
      } else {
        erro = true;
        mostrarMensagem(
          "Não foi possível alterar o e-mail, pois o e-mail informado é inválido",
          "orange"
        );

        $("#email").val(userDados.email);
      }
    }
    if ($("#senha").val() != "") {
      db.ref("/users/" + id).update({
        senha: $("#senha").val(),
      });
      mostrarMensagem("Senha alterada com sucesso", "#00905F");
      erro = false;
    }
    setTimeout(() => {
      if (!erro) {
        swal({
          title: "Alterações feitas com sucesso!"
        })
      }
    }, 1000)

  });

});
function atualizarProgresso(progressoTotal, idBarra) {
  if (progressoTotal >= 0 || progressoTotal <= 100) {
    var cor;
    if (progressoTotal <= 25) {
      cor = "#ff0000"; // Vermelho
    } else if (progressoTotal <= 50) {
      cor = "#ffa500"; // Laranja
    } else if (progressoTotal <= 75) {
      cor = "#90ee90"; // Verde claro
    } else {
      cor = "#4caf50"; // Verde escuro para 75-100%
    }
    $("#" + idBarra).progressbar("value", progressoTotal);
    $("#" + idBarra + " .ui-progressbar-value").css(
      "background-color",
      cor + " !important"
    );
  }
}
function definirImagem(url, idImg, idLabel) {
  checarImagem(idImg, url, function (valida) {
    if (valida) {
      if (idImg == "fundo") {
        $("#" + idImg).fadeIn(400, () => {
          $("#fundo").css("opacity", 1);
          $("#fundo2").css("opacity", 1);
          $("#fundo2").attr("src", url);
          $("#delFundo").fadeIn();
        });




      } else {
        $("#imgAssinatura").fadeIn(400, () => {
          $("#labelAss").text("");
        });
      }
      $("#" + idLabel).text("");
    } else {
      console.log("erro ao carregar imagem de fundo");
    }
  });
}
function checarImagem(idImagem, url, callback) {
  $("#" + idImagem)
    .attr("src", url)
    .on("load", () => {
      callback(true);
    })
    .on("error", () => {
      callback(false);
    });
}

function enviarImagem(idBtn, idInput, propImg, idPreview, idBarra, idLabel) {
  $("#" + idBtn).hide();
  $("#" + idInput).on("change", () => {
    fileInput = $("#" + idInput).prop("files")[0];
    if (fileInput && fileInput.type.startsWith("image/")) {
      var leitor = new FileReader();
      leitor.onload = (e) => {
        $("#" + idPreview).attr("src", e.target.result);
        $("#" + idPreview).fadeIn(200, () => {

          $("#" + idBtn).fadeIn();
          $("#" + idLabel).text("");
        });
      };
      leitor.readAsDataURL(fileInput);
    } else {
      $("#" + idBtn).hide();
    }
  });

  $("#" + idBtn).click(() => {
    $("#" + idBtn).fadeOut();
    $("#" + idBarra).progressbar("value", 75);
    fileInput = $("#" + idInput).prop("files")[0];
    if (fileInput) {
      const storageRef = storage.ref(
        "images/" +
        localStorage.getItem("idUser") +
        "/" +
        propImg +
        "/" +
        fileInput.name
      );
      var uptask = storageRef.put(fileInput);
      $("#" + idBarra).show();
      uptask.on(
        "state_changed",
        (envio) => {
          var progresso = Math.round(
            (envio.bytesTransferred / envio.totalBytes) * 100
          );
          atualizarProgresso(progresso, idBarra);
        },
        (erro) => {
          console.error(erro);
        },
        () => {
          $("#" + idBarra).fadeOut();

          mostrarMensagem("Imagem salva com sucesso", "#00905F");
          uptask.snapshot.ref.getDownloadURL().then((url) => {
            db.ref("/users/" + id + "/" + propImg + "/").update({
              url: url,
              nomeArquivo: fileInput.name,
            });
          });
        }
      );
    }
  });
}
function mostrarMensagem(texto, cor) {
  $("#labelMsg").text(texto);
  $("#labelMsg").css("color", cor);
  $("#labelMsg").slideDown();
}
function carregarImagem(link, idImg) {
  if (link) {
    var imgRef = storage.refFromURL(link);
    imgRef
      .getDownloadURL()
      .then((url) => {
        definirImagem(url, idImg);
      })
      .catch((error) => {
        console.log("erro ao obter imagem do storage: ", error);
      });
  }
}
