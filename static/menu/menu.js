function ajustarContainer(larguraMenu) {

  if ((window.innerWidth * 0.2) < 350) {
    $(".container").css({
      "margin-left": "100px",
      width: "90%",
    });
    if (larguraMenu == "auto") {
      $(".container").css({
        width: $(".container").width() + 350 + "px",
      });
    }
  } else {
    $(".container").css({
      "margin-left": "auto",
      "margin-right": "auto",

    });
  }

}

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
function sair() {
  localStorage.removeItem("idUser");
  window.location = "/index.html";
}

function encolher() {
  esconderFilhos("expandido");
  $("#expandido").animate({ width: "0px" }, 400, "swing", function () {
    esconderMenuLateral();
    mostrarFilhos("nao_expandido");
    ajustarContainer("auto");


    if ($(".emailBox").is(":visible") == false) {
      $(".emailBox").show()
    }
  });
}

function expandir() {
  esconderFilhos("nao_expandido");


  $("#expandido")
    .css({ width: "0px", display: "block" })
    .animate({ width: "300px" }, 400, "swing", function () {
      mostrarMenuLateral();
      mostrarFilhos("expandido");

      if ((window.innerWidth * 0.2) < 350) {
        $(".container").css({
          "margin-left": "350px",
          width: $(window).width() - 450 + "px",
        });
      } else {
        $(".container").css({
          "margin-left": "auto",
          "margin-right": "auto"
        });
      }
      if ($(".emailBox").width() < 500) {
        $(".emailBox").hide()
      }

    });
}

function esconderFilhos(pai) {
  cpBox = $("#" + pai);
  cpBox.hide();
  cps = cpBox.children();
  cps.each((i, e) => $(e).fadeOut());
}
function mostrarFilhos(pai) {
  cpBox = $("#" + pai);
  cpBox.hide();
  cps = cpBox.children();
  cps.each((i, e) => $(e).fadeIn());
}
function esconderMenuLateral() {
  esconderFilhos("expandido");
  $("#imgLogo").hide();
  $("#logoText").hide();
  $("#expandido").css("z-index", "0");
  $("#expandido").css("width", "0px");
}
function mostrarMenuLateral() {
  esconderFilhos("nao_expandido");
  $("#imgLogo").show();
  $("#logoText").show();
  $("#expandido").css("z-index", "999");
}
var temaEscuro = false;
var id = localStorage.getItem("idUser");

function toggleTheme(temaEscuro){
  if (temaEscuro) {

    $("#cpBtn").css("background-color", "#2784B1");
    $("#btnEmail").css("background-color", "#2784B1");


    $("#expandido").removeClass("claro");
    $("#expandido").addClass("escuro");

    $("#nao_expandido").removeClass("claro");
    $("#nao_expandido").addClass("escuro");

    $(".nav-link").removeClass("claro");
    $(".nav-link").addClass("escuro");

    $(".dropdown-item").removeClass("claro");
    $(".dropdown-item").addClass("escuro");

    $(".seta").attr("src", "../static/imgs/arrow-down-white.png");
    $(".emailLogo").attr("src", "../static/imgs/email_light.png");
    $(".helpLogo").attr("src", "../static/imgs/help_white.png");
    $(".temaLogo").attr("src", "../static/imgs/moon_white.png");
    $(".userLogo").attr("src", "../static/imgs/user_white.png");
    $("#nomeUser").removeClass("claro");
    $("#nomeUser").addClass("escuro");

    $(".container").css("background-color", "#1e1e24");
    $("#site").removeClass("fundo-claro");
    $("#site").addClass("fundo-escuro");
    $("h2").css("color", "#FFF");
    $("h3").css("color", "#FFF");
    $("label").css("color", "#FFF");

    $("#salvar").removeClass("btn-escuro");
    $("#salvar").addClass("btn-claro");

    $(".dropdown-menu").removeClass("light");
    $(".dropdown-menu").addClass("dark");
    $(".pdiv").css("color", "#FFF");
    $("#msg").css("color", "#FFF");
    $(".btnSair img").attr("src", "../static/imgs/share2.png");
    $(".btnSair a").removeClass("dark");
    $(".btnSair a").addClass("light");
    $(".meios a").removeClass("dark");
    $(".meios a").addClass("light");
    $(".labAnex").css("color", "#151546");
  } else {
    $(".labAnex").css("color", "#FFF");

    $("#cpBtn").css("background-color", "#151546");
    $("#btnEmail").css("background-color", "#151546");


    $(".pdiv").css("color", "#00002C");
    $("#msg").css("color", "#00002C");
    $(".meios a").removeClass("light");
    $(".meios a").addClass("dark");
    $(".btnSair img").attr("src", "../static/imgs/share.png");
    $(".btnSair a").removeClass("light");
    $(".btnSair a").addClass("dark");

    $(".dropdown-menu").removeClass("dark");
    $(".dropdown-menu").addClass("light");

    $("#salvar").removeClass("btn-claro");
    $("#salvar").addClass("btn-escuro");

    $("#expandido").removeClass("escuro");
    $("#expandido").addClass("claro");

    $("#nao_expandido").removeClass("escuro");
    $("#nao_expandido").addClass("claro");

    $(".nav-link").removeClass("escuro");
    $(".nav-link").addClass("claro");

    $(".dropdown-item").removeClass("escuro");
    $(".dropdown-item").addClass("claro");

    $("#nomeUser").removeClass("escuro");
    $("#nomeUser").addClass("claro");

    $(".temaLogo").attr("src", "../static/imgs/moonoff_dark.png");
    $(".seta").attr("src", "../static/imgs/arrow-down-blue.png");
    $(".emailLogo").attr("src", "../static/imgs/email_dark.png");
    $(".helpLogo").attr("src", "../static/imgs/help_dark.png");
    $(".userLogo").attr("src", "../static/imgs/user_dark.png");


    $(".container").css("background-color", "#FFFFFF");
    $("#site").removeClass("fundo-escuro");
    $("#site").addClass("fundo-claro");
    $("label").css("color", "#00002C");
    $("h2").css("color", "#00002C");
    $("h3").css("color", "#00002C");

  }
}

$(document).ready(() => {
  esconderMenuLateral();
  window.addEventListener("resize", ajustarContainer);
  db.ref("/users/" + id + "/darkTheme").on("value", (data) => {
    temaEscuro = data.val();
    toggleTheme(temaEscuro)
  });
});

function mudarTema() {
  id = localStorage.getItem("idUser");
  db.ref("/users/" + id + "/").update({ darkTheme: !temaEscuro });
}
