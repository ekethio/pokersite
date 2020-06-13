let socket = io();
let username;
let stack;
$(document).ready(() => {
  $("#emptySeat1").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat1").css("display", "none");
    $("#player1Info").css("display", "block");
    $("#username1").text(username);
    $("#stack1").text(stack);
  });
  $("#emptySeat2").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat2").css("display", "none");
    $("#player2Info").css("display", "block");
    $("#username2").text(username);
    $("#stack2").text(stack);
  });
  $("#emptySeat3").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat3").css("display", "none");
    $("#player3Info").css("display", "block");
    $("#username3").text(username);
    $("#stack3").text(stack);
  });
  $("#emptySeat4").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat4").css("display", "none");
    $("#player4Info").css("display", "block");
    $("#username4").text(username);
    $("#stack4").text(stack);
  });
  $("#emptySeat5").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat5").css("display", "none");
    $("#player5Info").css("display", "block");
    $("#username5").text(username);
    $("#stack5").text(stack);
  });
  $("#emptySeat6").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat6").css("display", "none");
    $("#player6Info").css("display", "block");
    $("#username6").text(username);
    $("#stack6").text(stack);
  });
  $("#emptySeat7").click(() => {
    username = window.prompt("Enter name:");
    stack = window.prompt("Enter stack:");

    $("#emptySeat7").css("display", "none");
    $("#player7Info").css("display", "block");
    $("#username7").text(username);
    $("#stack7").text(stack);
  });
});
