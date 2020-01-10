// JS Initialization and Callout for checking registration and pushing to Server.js

//var socket = io.connect('https://bpa-final-jsneak.c9users.io');
var socket = io.connect('https://codiy.herokuapp.com/');

//Creates a Cookie stored to the Website's relative filename
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

//Reads the value of a cookie based on it's stored name
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//Erases a previously created cookie (Used for testing purposes)
function eraseCookie(name) {
    createCookie(name,"",-1);
}


function checkVal(str , type)
{
    if(str == "")
    {
        alert("Enter a " + type);
        return false;
    }else{
        return true;
    }
}

function checkPassword()
{
  if(document.getElementById("passwordField").value == document.getElementById("2ndPasswordField").value && document.getElementById("passwordField").value != "" && document.getElementById("2ndPasswordField").value != "")
  {
     return true;
  } else {
      
      alert("One of your passwords are wrong.");
      
  }
}
   
function createAccount()
{
  var userName = document.getElementById("userNameField").value
  if(checkVal(userName , "Username") == true && checkPassword() == true)
  {
      var password = document.getElementById("passwordField").value;
      var Data = {
         userName: userName,
         password: password
  }
  socket.emit("Account Creation", Data)
  }
}

socket.on("Return Validation", function(Data){
    if(Data.UniqueAccount == true)
    {
        alert("Success!")
    }else{
        alert("Username taken")
    }
});

//End of Registration Script

//Login Script

function loginAccount()
{
    
    var userName = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;
    if (checkVal(userName, "Username") && checkVal(password, "Password")) {
        var Data = {
            userName: userName,
            password: password
        }
        socket.emit("Account Login", Data)
    }
}


socket.on("Auth Account", function(Data) {
    if (Data.loggedIn == false)
        alert("Invalid Username or Password");
    else
        {
            createCookie("session", Data.uuid + "   " + Data.userName, 1);
            alert(readCookie("session"));
            eraseCookie("session");
            window.location.href = "index.html";
        }
});

/*function redirect(destination)
{
    socket.emit("Redirect", destination)
}
socket.on("redirect", function(data){
   window.location.href = data 
});*/

//socket.on("Account Auth", function(Data) { } });