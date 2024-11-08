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

var fornecedores = [];
var solicitantes = [];
var idFor = 0;



function esconderFilhos(pai) {
  cpBox = $("#" + pai);
  cpBox.hide();
  cps = cpBox.children();
  cps.each((i, e) => $(e).hide());

  if (pai == "camposPersonalizadosBox") {
    $("#nfCaixaBox").hide();
    $("#nfCaixa").hide();
  }
}

function attAssunto(assunto) {
  $("#assunto").val("");
  var idEmail = $("#idEmCaixa").val();
  var opSol = $("#solOp").val();
  var texto = " [";
  if (opSol == "cliente") {
    texto += "id_ti: " + idEmail + "]";
  } else {
    emailUser = localStorage.getItem("emailUser");
    if (emailUser == "maraelizateste@gmail.com") {
      texto += "id_ag: " + idEmail + "]";
    } else {
      $("#assunto").val("");
      texto = "";
    }
  }
  $("#assunto").val(assunto + texto);
  habilita();
}

function resetar() {
  deleteFiles(files)
  files = [];
  $(".prevAnex label").remove();

  $("#camposPersonalizadosBox input").val("");

  esconderFilhos("camposPersonalizadosBox");
  $("#alertMsg").text("");
  $("#campoOp").val('').trigger("change");
  $("#solOp").val('').trigger("change");
  $("#desOp").val('').trigger("change");
  $("#forOp").val(0).trigger("change");
  $("#tipOp").val(0).trigger("change");

  $("#desBox").hide();
  $("#tipBox").hide();
  $("#toggle2").hide();
  $("#toggleBox2").hide();

  $(".caixa_email input").val("");

  $("#idEmCaixa").val("");

  template = [
    "Bom dia! Tudo bem?",
    "",
    "<span style='color:#FFFFFF00'></span>",
    "Desde já, agradeço!",
    "Qualquer dúvida, estou à disposição.",
    "Atenciosamente,",
    "[seu_nome]",
    "",
    "",
    "<span style='color:darkred'>Desconsidere o ID e o número do assunto; são apenas para controle interno.</span>",
    "[sua_assinatura]",
  ];
  $("#btnEmail").attr("disabled", true);
  montarTemplate(userDados, template, []);
  $("html, body").animate({ scrollTop: 0 }, "fast");
}

function limparEditor() {
  var editor = $("#email").cleditor();
  ed = editor[0];
  ed.$area.val("");
  ed.updateFrame();
  return ed;
}

function montarTemplate(userDados, template1, template2) {


  if (userDados.fundo) {
    $("#fundo").attr("src", userDados.fundo.url);
    $("#fundo").css("opacity", 1);

    $("#fundo2").attr("src", userDados.fundo.url);
    $("#fundo2").css("opacity", 1);
  }
  $("#nomeUser").text(userDados.nome);
  ed = limparEditor();
  var template = [];
  template.push(template1[0]);
  template.push(template1[1]);

  for (var i = 0; i < template1.length; i++) {
    if (template1[i] == "[seu_nome]") {
      template1[i] = userDados.nome;
    } else if (template1[i] == "[sua_assinatura]") {
      if (userDados.assinatura) {
        template1[i] = "<img src='" + userDados.assinatura.url + "'>";
      } else {
        template1[i] = "";
      }
    }
  }
  template2.forEach((linha) => {
    template.push(linha);
  });
  for (var i = 2; i < template1.length; i++) {
    template.push(template1[i]);
  }

  template.forEach((linha) => {
    var texto = ed.$area.val() + linha + "<br>";
    ed.$area.val(texto);

    ed.updateFrame();
  });
  //mudarCor("valores", "#FFFFFF00");

}
function definirTipo() {
  var desEmail = $("#desOp").val();
  $("#destinatario").val(desEmail);
  $("#tipOp").html('<option value="0">Selecione uma opção</option>');
  var idDes = $("#desOp").val();

  if (idDes != 0) {
    idFor = $("#forOp").val();
    var forn = fornecedores.find((forn) => forn.id == idFor);
    var tipos = forn.tipos.sort((t1, t2) => {
      return t1.assunto.localeCompare(t2.assunto);
    });
    tipos.forEach((tipo) => {
      $("#tipOp").append(
        '<option value="' + tipo.id + '">' + tipo.assunto + "</option>"
      );
    });
    $("#tipBox").show();
  } else {
    esconderFilhos("camposPersonalizadosBox");
    $("#tipBox").hide();
  }
}
function mudarCor(word, color) {
  var editor = $("#email").cleditor();
  ed = editor[0];
  var content = ed.$area.val(); // Obtém o conteúdo HTML atual do editor
  var newContent = content.replace(
    new RegExp(`\\b${word}\\b`, "gi"),
    `<span style="color:${color};">${word}</span>`
  );
  ed.$area.val(newContent); // Define o novo conteúdo na textarea
  ed.updateFrame(); // Atualiza o editor com o novo conteúdo
}

function enviarEmail(email) {
  Swal.fire({
    title: "Enviando e-mail...",
    text: "Por favor, aguarde.",
    allowOutsideClick: true, // Impede que o usuário feche o alerta clicando fora
    showConfirmButton: false, // Oculta o botão de confirmação
    willOpen: () => {
      Swal.showLoading(); // Exibe um ícone de carregamento
    },
  });
  $("#btnEmail").attr("disabled", true);
  var assunto = $("#assunto").val();
  var editor = $("#email").cleditor();
  ed = editor[0];

  var cc = $("#cc").val().replace(/\s+/g, "").split(",");
  var destinatario = $("#destinatario").val().replace(/\s+/g, "").split(",");

  var userEmail = userDados.email;
  var userSenha = userDados.senha;

  var formulario = {
    assunto: assunto,
    email: email,
    cc: cc,
    destinatario: destinatario,
    userEmail: userEmail,
    userSenha: userSenha,
    files: files,
  };

  $.ajax({
    url: "/sendEmail",
    method: "POST",
    data: JSON.stringify(formulario),
    contentType: "application/json",
    success: function (data) {
      Swal.close();
      console.log("Recebido de resposta:", data);
      $("#btnEmail").attr("disabled", false);
      console.log("status", data);

      if (data.result) {
        if (
          data.result[0] == "success" ||
          data.result[1] == "warn" ||
          data.result[1] == "success"
        ) {
          Swal.fire({
            icon: "success",
            title: "Email enviado com sucesso!",
            confirmButtonText: "Enviar outro e-mail",
            confirmButtonColor: "#151546",
            cancelButtonText: "Voltar",
            cancelButtonColor: "#0070b5",
            showCancelButton: true,

            footer:
              '<a target="_blank" href="https://mail.google.com/mail/u/0/#sent">Checar e-mail enviado</a>',
          }).then((result) => {
            if (result.isConfirmed) {
              resetar();
            }
          });
        } else {

          Swal.fire({
            icon: "error",
            title: data.result[0],
            text: data.result[1],
          });
        }
      } else {

        Swal.fire({
          icon: "error",
          title: data[0],
          text: data[1],
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.close();
      console.error("Requisição para a API falhou");
      console.log("textStatus", textStatus);

      // Exibir mensagem de erro para o usuário ou realizar outra ação
      Swal.fire({
        icon: "error",
        title: "Erro ao enviar o email!",
        text: "Não foi possível enviar o e-mail. Tente novamente mais tarde!",
      });

      $("#btnEmail").attr("disabled", false);
    },
  });

}

function sendEmail() {
  var email = ed.$area.val();

  if (email.includes("anexo") && files.length == 0) {
    Swal.fire({
      icon: "info",
      title: "Sem arquivo anexado!",
      text: "Você mencionou anexo, mas não enviou nenhum arquivo, deseja enviar assim mesmo?",
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
    }).then(function (result) {
      if (result.isConfirmed) {
        enviarEmail(email);
      }
    });
  } else {
    enviarEmail(email);
  }
}
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function addTemplate(data) {

  var editor = $("#email").cleditor();
  ed = editor[0];
  var email = ed.$area.val();
  idFor = $("#forOp").val();
  $("#email").empty();
  var campos = data.campos;
  var template = ["<span style='color:black;'>"];
  var texto = "";
  campos.forEach((cam) => {
    var campoInput = $("#" + cam.idElemento);
    if (campoInput.val() !== "" && campoInput.val() !== undefined) {

      if (cam.idElemento != "nfCaixa") {
        texto = "<br><b>" + cam.nome.toUpperCase() + ":</b> ";
        texto += $("#" + cam.idElemento).val();
        template.push(texto);
      } else {

        try {
          var nf = $("#nfCaixa").val();

          var parsed = JSON.parse(nf);
          var formatado = JSON.stringify(parsed, null, 2);

          // Adiciona o JSON formatado ao template
          template.push('<pre>' + escapeHtml(formatado) + '</pre>');
        } catch (error) {
          console.log("Dados da nota fiscal inválidos!");
          alert('Dados da nota fiscal inválidos!');
        }
      }
    }

  });

  template.push("</span><br>");
  template.push("<span style='color:#FFFFFF00'></span>");
  listaLinhas = email.split("<br>");
  for (var i = 0; i < listaLinhas.length; i++) {
    if (
      listaLinhas[i].includes("span") &&
      listaLinhas[i].includes("#FFFFFF00")
    ) {

      listaLinhas[i] = template.join("");
    }
  }
  email = listaLinhas.join("<br>");
  ed.$area.val(email);
  ed.updateFrame();
  $("#camposPersonalizadosBox input").val("");
}
function attTemplate(data) {
  var idOp = $("#tipOp").val();
  idFor = $("#forOp").val();
  var fornecedores = data.fornecedores;

  var forn = fornecedores.find((forn) => forn.id == idFor);
  var tipos = forn.tipos;
  var tipo = tipos.find((tip) => tip.id == idOp);
  if (idOp != 0) {
    template2 = tipo.template;
  } else {
    template2 = [];
  }
  template1 = tipos.find((tip) => tip.id == 0);
  attAssunto(tipo.assunto);
  montarTemplate(userDados, template1.template, template2);
  $("#cpTxt").show();
  $("#cpBtn").show();

  esconderFilhos("camposPersonalizadosBox");
  $("#toggle2").show();
  $("#toggleBox2").slideDown(600, "swing");
  $("#camposPersonalizadosBox").show();
  $(".delBtn").show();
  $("#idEmBox").show();
  $("#campoBox").show();
  var campos = tipo.campos;
  var camposConteudo = [];
  campos.forEach((cam) => {
    var campo = data.campos.find((cp) => cp.id == cam);
    camposConteudo.push(campo);
    //exibe campo
    $("#" + campo.idElemento + "Box").show();
    $("#" + campo.idElemento).show();
  });
}
function definirCamposPersonalizados(campos) {
  cpBox = $("#camposPersonalizadosBox");

  campos.forEach((cam) => {
    id = cam.idElemento;
    if (id != "nfCaixa") {
      var place = "";
      if (cam.nome == "CPF" || cam.nome == "CNPJ") {
        place = "Informe " + cam.nome + " aqui";
      } else {
        place = "Informe " + cam.nome.toLowerCase() + " aqui";
      }
      var conteudo = "<div class='nf' id='" + cam.idElemento + "Box'>";
      conteudo +=
        "<label for=" + cam.idElemento + ">" + cam.nome + ": </label>";
      var texto =
        "<input placeholder='" +
        place +
        "' name=" +
        cam.idElemento +
        " class='form-control lg-6 md-6 sm-12 xs-12' id='" +
        cam.idElemento +
        "'></div>";
      conteudo += texto;
      cpBox.append(conteudo);
    }
  });
  cpBox.append("</div>");
  $("#dataCaixa").datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    showAnim: "slideDown",
    dateFormat: "dd/mm/yy",
  });
  $("#dataCaixa").attr("placeholder", "Digite a data aqui");
  $("#dataCaixa2").datepicker({
    showOtherMonths: true,
    selectOtherMonths: true,
    showAnim: "slideDown",
    dateFormat: "dd/mm/yy",
  });
  $("#dataCaixa2").attr("placeholder", "Digite a data aqui");
  montarCampos(campos);
}

function montarCampos(campos) {
  $("#campoOp").select2({
    placeholder: "Digite o campo que deseja adicionar",
    theme: "classic",
    allowClear: true,
    width: "100%",
    templateSelection: function (data) {
      $("#cpTxt").show();
      $("#cpBtn").show();
      $("#" + data.element.value + "Box").show();
      $("#" + data.element.value).show();
      return data.text;
    },

    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#campoOp").on("select2:unselect", function (e) {
    $("#" + e.params.data.element.value + "Box").hide();
    $("#" + e.params.data.element.value).val("");
  });
  campos.forEach((cam) => {
    $("#campoOp").append(
      '<option value="' +
      cam.idElemento +
      '">' +
      cam.nome.toUpperCase() +
      "</option>"
    );
  });
}

function definirCampos(userDados, data) {
  solicitantes = data.solicitantes;
  fornecedores = data.fornecedores;
  emailUser = localStorage.getItem("emailUser");
  if (emailUser == "maraelizateste@gmail.com") {
    //definindo os valores
    $("#solOp").attr("multiple", "multiple");
  }
  $("#solOp").select2({
    placeholder: "Selecione o tipo de solicitante",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#solOp").val("cliente");
  $("#dataBox1").show();
  $("#tipOp").select2({
    placeholder: "Selecione o tipo de email",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });

  $("#forOp").select2({
    placeholder: "Selecione o fornecedor",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  $("#desOp").select2({
    placeholder: "Selecione o destinatário",
    theme: "classic",
    width: "100%",
    language: {
      noResults: function () {
        return "Nenhum resultado encontrado";
      },
    },
  });
  emailUser = localStorage.getItem("emailUser");
  if (emailUser == "maraelizateste@gmail.com") {
    //definindo os valores

    solicitantes.forEach((sol) => {
      $("#solOp").append(
        '<option value="' + sol.email + '">' + sol.nome + "</option>"
      );
    });
  } else {
    $("#solOp").append(
      '<option value="' +
      solicitantes[0].email +
      '">' +
      solicitantes[0].nome +
      "</option>"
    );
    $("#solOp").append(
      '<option value="' +
      solicitantes[1].email +
      '">' +
      solicitantes[1].nome +
      "</option>"
    );
  }

  fornecedores.forEach((forn) => {
    $("#forOp").append(
      '<option value="' + forn.id + '">' + forn.nome + "</option>"
    );
  });
  montarTemplate(userDados, fornecedores[0].tipos[0].template, []);
}

function habilita() {
  var d = $("#destinatario").val();
  var a = $("#assunto").val();
  var e = $("#email").val();

  if (
    d.length > 3 &&
    a.length > 0 &&
    e.length > 0 &&
    d.includes("@") &&
    d.includes(".com")
  ) {
    $("#btnEmail").attr("disabled", false);
  } else {
    $("#btnEmail").attr("disabled", true);
  }
}

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
async function addAnexo(newfiles) {

  for (var i = 0; i < newfiles.length; i++) {
    $("#barraProgresso").progressbar({ value: 0 });
    $("#barraProgresso").show();
    var link = await upFile(newfiles[i]);
    files.push(link);
    $("#barraProgresso").hide();
  }
}
function upFile(file) {
  return new Promise((resolve, reject) => {
    var nome = file.name;
    var storageRef = firebase
      .storage()
      .ref("anexos/" + localStorage.getItem("idUser") + "/" + new Date().getTime() + "-" + nome);

    var uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = Math.round(progress);
        atualizarProgresso(progress, "barraProgresso");
      },
      (error) => {
        console.error("Upload falhou:", error);
        reject(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Erro ao anexar arquivos!",
        })
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          miniArquivo = "<label class='labAnex' id=" + downloadURL + ">" + nome;
          btnExcluir = "<button class='delAnex'></button></label>";
          lbl = miniArquivo + btnExcluir;
          $(".prevAnex").append(lbl);

          resolve(downloadURL);
        });
      }
    );
  });
}
function deleteFileFromURL(fileURL) {
  return new Promise((resolve, reject) => {
    // Obtém uma referência ao arquivo com base na URL
    var storageRef = firebase.storage().refFromURL(fileURL);
    storageRef
      .delete()
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error("Erro ao excluir arquivo:", error);
        reject(error);
      });
  });
}

// Função para apagar vários arquivos
function deleteFiles(fileURLs) {
  const deletePromises = fileURLs.map(url => deleteFileFromURL(url));

  Promise.all(deletePromises)
    .then(() => {
      console.log("Todos os arquivos foram apagados com sucesso.");
      $(".prevAnex label").remove();

    })
    .catch((error) => {
      console.error("Erro ao apagar alguns arquivos:", error);
    });
}

function attId(idEmail) {
  var tipAssunto = $("#solOp").val();
  var idEmail = "";
  if (tipAssunto == "cliente") {
    idEmail = " [id_ti: " + idEmail + "]";
  } else if ( localStorage.getItem("emailUser") == "maraelizateste@gmail.com") {
    idEmail = " [id_ag: " + idEmail + "]";
  }
  $("#assunto").append(idEmail);
}
var files = [];

function pegarArquivos(e) {
  if (e.originalEvent.dataTransfer.types.includes("Files")) {
    $(".dragover-area").hide();
    e.preventDefault();
    e.stopPropagation();

    var dropFiles = e.originalEvent.dataTransfer.files;
    if (dropFiles.length > 0) {
      addAnexo(dropFiles);
    }
  }
}

function entrou(e) {
  if (e.originalEvent.dataTransfer.types.includes("Files")) {
    var editor = $("#email").cleditor();
    var $iframe = $(editor[0].$frame);
    e.preventDefault();
    e.stopPropagation();
    $iframe.addClass("dragover");
    $(".dragover-area").show();
  }
}
var emailUser;
var idUser;
var userDados;

$(document).ready(() => {

  emailUser = localStorage.getItem("emailUser");
  idUser = localStorage.getItem("idUser");

  if (!emailUser || !idUser) {
    window.location = '/'
  }

  $("#cpTxt").hide();
  $("#cpBtn").hide();
  $("#desBox").hide();
  $("#tipBox").hide();
  $("#email").cleditor();
  $("#dataCaixaBox").hide();
  $("#dataCaixa2Box").hide();

  $("#btnEmail").attr("disabled", true);
  $("#cpBtn").attr("disabled", true);
  $("#labelId").hide();
  $("#idEmCaixa").hide();
  $("#idEmBox").hide();
  $(".dragover-area").hide();

  $("#barraProgresso").css("width", $(".prevAnex").outerWidth());
  $("#barraProgresso").progressbar({ value: 0 });
  $("#barraProgresso").hide();

  var editor = $("#email").cleditor();
  var $iframe = $(editor[0].$frame);
  $(".dragover-area").css({
    width: $(".emailBox").width(),
    height: $(".emailBox").height(),
  });
  $(window).on("resize", function () {
    $(".cleditorMain").css({
      width: "100%",
      height: "100%",
    });
    $(".dragover-area").css({
      width: $(".emailBox").width(),
      height: $(".emailBox").height(),
    });
    $("#barraProgresso").css("width", $(".prevAnex").outerWidth());
    editor = $("#email").cleditor();
    $iframe = $(editor[0].$frame);
    $iframe.contents().on("dragenter dragover", function (e) {
      entrou(e);
    });
  });
  editorFocado = false;

  $iframe
    .contents()
    .on("focusin", () => {
      editorFocado = true;
    })
    .on("focusout", () => {
      editorFocado = false;
    });
  $iframe.contents().on("paste", (e) => {
    if (!editorFocado) {
      return false;
    } else {
      var dadosColados = e.originalEvent.clipboardData;

      var items = dadosColados.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            var blob = items[i].getAsFile();
            var leitor = new FileReader();
            leitor.onload = (e) => {
              var imgUrl = e.target.result;
              uploadImagem(imgUrl);
            };
            leitor.readAsDataURL(blob);
          }
        }
      }
    }
  });
  $("#delCp").click(() => {
    $("#camposPersonalizadosBox input").val("");
    $("#cpBtn").attr("disabled", true);
  });
  $("#resBtn").click(() => {
    resetar();

    $("#btnEmail").attr("disabled", true);
  });

  $("#clipImg").click(() => {
    $("#anexoInput").click();
  });
  $("#anexoInput").on("change", () => {
    newfiles = $("#anexoInput").prop("files");
    addAnexo(newfiles);
  });
  $(document).on("click", ".delAnex", function () {

    deleteFileFromURL($(this).parent().attr('id'))
    files = files.filter(item => item !== $(this).parent().attr('id'));
    console.log(files)

    $(this).parent().remove();
  });
  $iframe.contents().on("dragenter dragover", function (e) {
    entrou(e);
  });
  $(".caixa_email").on("dragenter dragover", function (e) {
    entrou(e);
  });
  $(".caixa_email").on("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $iframe.removeClass("dragover");
    $(".dragover-area").hide();
  });
  $(".caixa_email").on("drop", function (e) {
    pegarArquivos(e);
    $iframe.removeClass("dragover");
  });
  var carregou = false;
  // Função para carregar o  arquivo JSON
  $.getJSON("../static/dados.json", (data) => {
    db.ref("/users/" + id).on("value", (dataBD) => {
      if(!carregou){
        userDados = dataBD.val();
        campos = data.campos;
        toggleTheme(userDados.darkTheme)
        definirCamposPersonalizados(campos);
        esconderFilhos("camposPersonalizadosBox");
        definirCampos(userDados, data);
  
        $("#toggle1").click(function () {
          $(this).find("img").toggleClass("up down");
  
          $("#toggleBox1").slideToggle(400, "swing");
        });
        $("#toggle2").hide();
        $("#toggle2").click(function () {
          $(this).find("img").toggleClass("up down");
          $("#toggleBox2").slideToggle(400, "swing");
        });
        $("#toggle3").click(function () {
          $(this).find("img").toggleClass("up down");
          $("#toggleBox3").slideToggle(400, "swing");
        });
  
        $("#solOp").change(() => {
  
          $("#cc").trigger("change");
          if ($("#solOp").val() && $("#solOp").val() != 0) {
            var solEmail = $("#solOp").val();
            if (solEmail == "") {
              $("#labelId").hide();
              $("#idEmBox").hide();
              $("#idEmCaixa").hide();
            } else {
              $("#labelId").show();
              $("#idEmBox").show();
              $("#idEmCaixa").show();
            }
            if (solEmail == "cliente") {
              $("#idEmBox").show();
              $("#idEmCaixa").show();
              $("#labelId").show();
              $("#idEmCaixa").attr("placeholder", "Digite o id do ticket");
              $("#labelId").text("ID DO TICKET: ");
            } else {
              emailUser = localStorage.getItem("emailUser");
              if (emailUser == "maraelizateste@gmail.com") {
                $("#idEmCaixa").attr("placeholder", "Digite o id da agenda");
                $("#labelId").text("ID DA AGENDA: ");
                $("#labelId").show();
              } else {
                $("#idEmBox").hide();
                $("#idEmCaixa").hide();
                $("#labelId").hide();
              }
            }
  
            $("#cc").val(solEmail).trigger("change");
          } else {
            $("#cc").val("").trigger("change");
          }
        });
        $("#cc").change(() => {
          var emailDes = $("#desOp").val();
          var cc = $("#cc").val();
         
  
          var txt = $("#cc").val();
          txt = txt.replace("cliente,", "");
          txt = txt.replace("ej,", "");
          txt = txt.replace("cliente", "");
          txt = txt.replace("ej", "");
          $("#cc").val(txt);
        });
        $("#idEmCaixa").change(() => {
          var idEmail = $("#idEmCaixa").val();
          if (idEmail) {
            $("#forBox").show();
            var assunto = $("#assunto").val();
            if (assunto.length > 2) {
              var idOp = $("#tipOp").val();
              idFor = $("#forOp").val();
              var forn = fornecedores.find((forn) => forn.id == idFor);
              var tipos = forn.tipos;
              var tipo = tipos.find((tip) => tip.id == idOp);
              attAssunto(tipo.assunto);
  
            }
          }
        });
        $("#forOp").change(() => {
          if ($("#forOp").val() && $("#forOp").val() != 0) {
            idFor = $("#forOp").val();
            if (idFor != 0) {
              var forn = fornecedores.find((forn) => forn.id == idFor);
  
              if (forn.emails) {
                $("#desOp").empty()
  
                forn.emails.forEach((email) => {
                  $("#desOp").append(
                    '<option value="' +
                    email.email +
                    '">' +
                    email.nome +
                    " [" +
                    email.tipo +
                    "]" +
                    "</option>"
                  );
                });
                $("#desOp").val(forn.emails[0].email);
  
                if ($("#forOp").val() == 3) {
                  $("#desOp").attr("multiple", "multiple");
                } else {
                  $("#desOp").removeAttr("multiple");
                }
                $("#desOp").select2({
                  placeholder: "Selecione o destinatário",
                  theme: "classic",
                  width: "100%",
                  language: {
                    noResults: function () {
                      return "Nenhum resultado encontrado";
                    },
                  },
                });
                $("#desBox").show();
  
                $("#cc").trigger("change");
                definirTipo();
                attTemplate(data)
              }
            } else {
              $("#tipBox").hide();
              $("#desBox").hide();
              esconderFilhos("camposPersonalizadosBox");
            }
          }
        });
        $("#desOp").change(() => {
          $("#cc").trigger("change");
          if ($("#desOp").val() && $("#desOp").val() != 0) {
            definirTipo();
          }
        });
        $("#tipOp").change(() => {
          if ($("#tipOp").val() && $("#tipOp").val() != 0) {
            var forId = $("#forOp").val();
            var tipId = $("#tipOp").val();
  
          
            var txt = "";
            if (forId == 1) {
              if (tipId == 4 || tipId == 19 || tipId == 13) {
                txt =
                  "Antes de abrir o chamado, por favor, verifique as credenciais do cliente diretamente no site do tribunal";
              } else if (tipId == 20) {
                txt =
                  "Antes de solicitar o refinamento, peça autorização para o cilente, pois corre-se o risco de perda de publicação.";
              } else if (tipId == 10 || tipId == 7) {
                txt =
                  "O prazo de coleta de andamentos é de 48 horas úteis, por favor, verifique se está realmente fora do prazo";
              } else if (tipId == 11 || tipId == 8) {
                txt =
                  "O prazo de coleta de publicações é de 12 horas úteis, por favor, verifique se está realmente fora do prazo";
              } else if (tipId == 12 || tipId == 9) {
                txt =
                  "O prazo de coleta de intimações é de 24 horas úteis, por favor, verifique se está realmente fora do prazo";
              } else {
                tipId = 0;
              }
            } else if (forId == 2) {
              
              if (tipId == 3) {
                txt =
                  "O monitoramento de processos distribuídos é feito pela razão social. Para monitorar pelo CNPJ, cadastre-o como variação de um termo monitorado (razão social).";
              } else {
                tipId = 0;
              }
            } else if (forId == 3) {
              //se for o Asaas
              if (tipId == 3) {
                txt =
                  "Adicione as respostas do cliente do formulário de solicitação de aumento de limite diretamente na caixa de e-mail!";
              } else {
                tipId = 0;
              }
            }
            if (tipId != 0 && tipId != "") {
              $("#alertMsg").text(txt);
              Swal.fire({
                icon: "info",
                title: "Atenção!",
                text: txt,
              });
            } else {
              $("#alertMsg").text("");
            }
            attTemplate(data);
          }
        });
  
        $("#destinatario").on("input", () => {
          habilita();
        });
        $("#assunto").on("input", () => {
          habilita();
        });
        $("#email").on("input", () => {
          habilita();
        });
        $("#camposPersonalizadosBox").on("input", "input", () => {
          var preenchido = false;
          $("#camposPersonalizadosBox input").each(function () {
            if ($(this).val().trim() !== "") {
              preenchido = true;
              return false;
            }
          });
  
          $("#cpBtn").attr("disabled", !preenchido);
        });
  
        $("#cpBtn").click(() => {
          $("html, body").animate(
            {
              scrollTop: $("#toggle3").offset().top,
            },
            300
          );
          addTemplate(data);
        })
        carregou = true;
      }
      

    });
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.error("Error fetching JSON data:", textStatus, errorThrown);
  });
});

function uploadImagem(base64Image) {
  var storageRef = firebase
    .storage()
    .ref("images/prints/" + new Date().getTime() + ".png");

  // Convert base64 to Blob
  var byteString = atob(base64Image.split(",")[1]);
  var mimeString = base64Image.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ab], { type: mimeString });

  var uploadTask = storageRef.put(blob);
  uploadTask.on(
    "state_changed",
    function () { },
    function (error) {
      console.error("Erro ao fazer upload", error);
    },
    function () {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        var editor = $("#email").cleditor();
        var $iframe = $(editor[0].$frame);
        var editorDoc =
          $iframe[0].contentDocument || $iframe[0].contentWindow.document;
        var imagens = editorDoc.getElementsByTagName("img");

        var img_colada = Array.from(imagens).find(
          (img) => img.src.trim() == base64Image.trim()
        );
        if (img_colada) {
          imgstr = img_colada.outerHTML;
          ed = editor[0];
          conteudo = ed.$area.val();
          conteudo = conteudo.replace(
            imgstr,
            '<img src="' + downloadURL + '">'
          );
          ed.$area.val(conteudo);
          ed.updateFrame();
        }
      });
    }
  );
}

function changeTheme(){

  mudarTema();

}