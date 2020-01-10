//var socket = io.connect('https://bpa-final-jsneak.c9users.io');
var socket = io.connect('https://codiy.herokuapp.com/');

//Load DIY Projects using Node to Asynchronously check database values from Search Query
var displayFiles = new Array();
    function loadDiys(query)
        {
            var Data = { query: query}
            socket.emit("Load Directory", Data)
            viewScroll('diy-display');
        }

    function createCookie(value,days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires = "; expires="+date.toGMTString();
            }
            else var expires = "";
            document.cookie = "fileName="+displayFiles[value]+expires+"; path=/";
            window.open("ide/index.html");
        }
    
    
        
//Display formatted database results
    socket.on("Display Files", function(data){
        var csvList = data.files;
        displayFiles = csvList.split(",");
        var output = "<table>"
        for (var i = 0; i < displayFiles.length - 1; i++)
            {
                output += '<div class="col-sm-4 intro-content" id = ' + displayFiles[i] + ' onmouseover="hoverEvent(this.id)" onmouseout="unhoverEvent(this.id)">';
                output += '<div class="icon-lg">';
                output += "<i class='icon icon-trophy' onclick=createCookie("+i+")></i>";
                output += '</div>';
                output += ("<h4><strong onclick=createCookie("+i+",1)>" + displayFiles[i] + '</strong></h4>');
                output += '</div>';
                
                
            }
        output += "</table>"
        
        document.getElementById("diy-display").innerHTML = output;
        
    });
    
    
    function hoverEvent(id)
      {
         document.getElementById(id).className = "col-sm-4 intro-content animated infinite pulse";
      }
      
   function unhoverEvent(id)
      {
         document.getElementById(id).className = "col-sm-4 intro-content";
      }