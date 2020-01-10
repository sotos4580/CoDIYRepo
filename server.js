var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require("crypto-js");
var cors = require("cors");


function genUUID() {
	 var d = new Date().getTime();
	 var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

io.sockets.on('connection', function(socket) {
    
    socket.on("first Call",function(Data){
    	var fileFolder = Data.substring(0,Data.length-4)
    	var pathName = __dirname + "/public/ide/database/DIYs/" + fileFolder +"/"+Data 
    	console.log(pathName) 
    	fs.readFile(pathName, 'utf8', function (err,data) {
    		if (err) {
        		throw err;
    		}
    		dataF = data
    		socket.emit("get DIY", dataF) 
    	});
    });
    
	socket.on("send DIY",function(Data) { 
		var text = Data.textStuff;
		var fileName = Data.fileName;
        fs.writeFile(__dirname + "/public/ide/database/DIYs" + fileName, text, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log(fileName + " was saved!");
        }); 
		var returnMessage = "Wow";
		socket.emit("Return Value", { returnValue: returnMessage })
	});
	
	socket.on("Account Creation",function(Data){
	    //Database stuff
	    var username = Data.userName;
	    var password = Data.password;
	    var registered = fs.existsSync(__dirname + '/public/ide/database/accounts/' + username + ".txt")
		var encrypted = crypto.AES.encrypt(password,password);

	    
	    if (registered)
	        var Data = { UniqueAccount: false };
	    else {
	    	var sessionID = genUUID();
	    	var Data = {UniqueAccount: true };
	    	fs.writeFile(__dirname + "/public/ide/database/accounts/" + username + ".txt", encrypted + "," + username + "," + sessionID, function(err) {
            if(err) {
                return console.log(err);
            }
        
        
        	//Below code is Decryption of stored password, used for testing purposes
            console.log(encrypted + " was registered!");
            var bytes  = crypto.AES.decrypt(encrypted.toString(), password);
			var plaintext = bytes.toString(crypto.enc.Utf8);
 
			console.log(plaintext);
        });
	    	
	    }
	    	
	    socket.emit("Return Validation", Data)
	});
	
	
	socket.on("Account Login", function(Data) {
	    
	    var username = Data.userName;
	    var password = Data.password;
	    var pathName = __dirname + "/public/ide/database/accounts/" + username + ".txt";
	    var sessionID = genUUID();
		console.log(sessionID);
	    
		var encrypted = fs.readFile(pathName, 'utf8', function (err,data) {
		  if (err) {
		    console.log("Not a valid account");
		    var data = {loggedIn: false};
		    socket.emit("Auth Account", data)
		  } else {
			var authData = new Array();
			authData = data.split(",");

			var bytes  = crypto.AES.decrypt(authData[0].toString(), password);
	    	var plaintext = bytes.toString(crypto.enc.Utf8);
	    	
	    	//Run authentication script and generate UUID for Login Session
	    	if (plaintext == password)
	    		{
					fs.writeFile(__dirname + "/public/ide/database/accounts/" + username + ".txt", authData[0] + "," + username + "," + sessionID, function(err) {
			            if(err) {
			                return console.log(err);
			            } else {
			            	var data = {userName: username, loggedIn: true, uuid: sessionID};
			            	socket.emit("Auth Account", data);
			            	console.log("Login Successful");
			            }
					});
	    		} else { 
	    			console.log("Not a valid account");
				    var data = {loggedIn: false};
				    socket.emit("Auth Account", data)
	    		}
			}
		});
	});
	
	socket.on("Load Directory", function (Data) {
		//Asynchronously read filenames stored within the DIYs Directory and return results as an Array for searching
		fs.readdir(__dirname + "/public/ide/database/DIYs/", (err, files) => {
		  var query = Data.query;
		  var fileSystem = "";
		  files.forEach(file => {
		  	if (file.toLowerCase().includes(query.toLowerCase()))
		  		{
				  	fileSystem += (file + ",");
		  		}
		  });
			var data = {files: fileSystem}
			socket.emit("Display Files", data)
		})
	  });
	  
	});


 





function send404Response(response) {
    response.writeHead(404, {
        "Content-Type": "text/plain"
    });
    response.write("Error 404: Page not found!");
    response.end();
};

app.use(cors()); 
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

//app.use(express.static(__dirname + '/public'));


server.listen(process.env.PORT, process.env.IP || 8080);
