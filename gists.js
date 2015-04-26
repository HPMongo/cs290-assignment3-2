function getID() {
	return this.gistId;
}

function getDesc() {
	return this.gistDesc;
}
function getURL() {
	return this.gistURL;
}

function gistDetail(inId, inDes, inURL) {
	this.gistId = inId;
	this.gistDesc = inDes;
	this.gistURL = inURL;

	this.getID = getID;
	this.getDesc = getDesc;
	this.getURL = getURL;
}	

function callGitHub(inLang) {
	var req = new XMLHttpRequest();
	if(!req) {
		throw "Unable to create HttpRequest.";
	}
	var url = 'https://api.github.com/gists/public';
	var gistArray = new Array();

	req.onreadystatechange=function() {
		if(req.readyState===4) {
			var returnGist = JSON.parse(this.responseText)
			var tmpURL, tmpID, tmpDesc;
			for(var i=0; i<5; i++) {
				tmpID = returnGist[i].id;
				tmpDesc = returnGist[i].description;
				tmpURL = returnGist[i].url;
				var newGist = new gistDetail(tmpID, tmpDesc, tmpURL);
				gistArray.push(newGist);
			}
			displayResult(gistArray);
			return gistArray;
		}	
	}
	req.open('GET', url);
	req.send();
}

function getGist() {
	var languageSelected;
	if(document.getElementById('r1').checked) {
		languageSelected = document.getElementById('r1').value;
	} else if(document.getElementById('r2').checked) {
		languageSelected = document.getElementById('r2').value;
	} else if(document.getElementById('r3').checked) {
		languageSelected = document.getElementById('r3').value;
	} else if(document.getElementById('r4').checked) {
		languageSelected = document.getElementById('r4').value;
	} else {
		languageSelected = null;	
	}
	var gistList = callGitHub(languageSelected);
}	

function displayResult(inArray) {
	var resultBox = document.getElementById("resultTable");
	var tmpText;
	for(var i=0; i<inArray.length; i++) {
		tmpText = "Description: " + inArray[i].getDesc() + "\n" + "URL:" + inArray[i].getURL() + "\n \n";
		var tmpNode = document.createTextNode(tmpText);
		resultBox.appendChild(tmpNode);
	}
}

