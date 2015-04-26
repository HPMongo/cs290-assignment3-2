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

function callGitHub(inLang, inUser) {
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
			document.write(gistArray[0].getID());
		}	
	}
	req.open('GET', url);
	req.send();
}

function getGist() {
	var userName = document.getElementsByName('userText')[0].value;
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
	callGitHub(languageSelected, userName);
}	

