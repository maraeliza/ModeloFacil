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
var id = localStorage.getItem("idUser");
var userDados;
db.ref("/users/" + id).on("value", (data) => {
  userDados = data.val();
  localStorage.setItem("emailUser", userDados.email);
  if (userDados.fundo) {
    $("#fundo").attr("src", userDados.fundo.url);
    $("#fundo").css("opacity", 1);

    $("#fundo2").attr("src", userDados.fundo.url);
    $("#fundo2").css("opacity", 1);

  }
  $("#nomeUser").text(userDados.nome);

})

$(document).ready(() => {
  var emailUser = localStorage.getItem("emailUser");
  if (!emailUser) {
    window.location = '/'
  }
  $(".pdiv h4").hide()
  $(".pdiv h3").click(function () {
    $(this).find("img").toggleClass('up down');
    console.log('oi')
    var nH4 = $(this).next('h4');
    nH4.slideToggle()
  })
  $(".meios div").hide()
  $(".meios h3").click(function () {
    console.log('oi')
    var ndiv = $(this).next('div');
    ndiv.slideToggle()
  })
})