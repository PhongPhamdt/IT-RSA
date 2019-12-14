$(document).ready(function () {
  $("#generate").click(() => {
    let keys = RSA_generateKeys(16);
    n = keys.n.toString();
    e = keys.e.toString();
    d = keys.d.toString();
    $("#key-e").html(e);
    $("#key-d").html(d);
    $("#key-n").html(n);
    $("#key-n2").html(n);
  });
  $("#encrypt").click(() => {
    let plaintText = $("#plain-text").val();
    let cryptedText = RSA_encrypt(plaintText, e, n);
    $("#result-text").val(cryptedText);
  });
  $("#decrypt").click(() => {
    let cryptedText = $("#crypted-text").val();
    let result = RSA_decrypt(cryptedText, d, n);
    $("#result").val(result);
  })
});