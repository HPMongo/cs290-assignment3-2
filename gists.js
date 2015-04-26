var settings = null; //setting from local storage

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


/* 
	Display result back in a table using an array input.
	Elements to generate HTML table were copied from:
	http://www.mysamplecode.com/2012/04/generate-html-table-using-javascript.html
*/
function displayResult(inArray) {
	var resultBox = document.getElementById("resultTable");
	var tmpID, rowCount, row;
	for(var i=0; i<inArray.length; i++) {
		tmpID = inArray[i].getID();
		rowCount = resultBox.rows.length;
		row = resultBox.insertRow(rowCount);
		row.insertCell(0).innerHTML='<input type="button" value = "Add to Favorite" onClick="Javacsript:addToFav(this)">';
		row.insertCell(1).innerHTML= inArray[i].getID();
		row.insertCell(2).innerHTML= inArray[i].getDesc();
		row.insertCell(3).innerHTML= inArray[i].getURL();
	}
}

/*
	This function will get the gist information from the page then store it to 
	local storage and delete it from the result table. 
*/
function addToFav(obj) {
	var index = obj.parentNode.parentNode.rowIndex;
	var	resultBox = document.getElementById("resultTable");
//Get information from the table
	var sID = resultBox.rows[index].cells[1].innerHTML;
	var sDesc = resultBox.rows[index].cells[2].innerHTML;
	var sURL = resultBox.rows[index].cells[3].innerHTML;
//Transform it to a gist object
	var newFav = new gistDetail(sID, sDesc, sURL);
//Add it to the setting 
	settings.favorites.push(newFav);
//Store it to local storage
	localStorage.setItem('userFavorites', JSON.stringify(settings));
//Delete the row from the result table
	resultBox.deleteRow(index);
}

/*
	This function will populate the favorite table using setting from the local storage.
*/
function loadFavorites() {
	var favoriteBox = document.getElementById("favoriteTable");
	var tmpID, rowCount, row;
	for(var i=0; i<inArray.length; i++) {
		tmpID = inArray[i].getID();
		rowCount = resultBox.rows.length;
		row = resultBox.insertRow(rowCount);
		row.insertCell(0).innerHTML='<input type="button" value = "Remove from Favorite" onClick="Javacsript:removefromFav(this)">';
		row.insertCell(1).innerHTML= inArray[i].getID();
		row.insertCell(2).innerHTML= inArray[i].getDesc();
		row.insertCell(3).innerHTML= inArray[i].getURL();
	}
}
/*
	This function will load variables from the local storage.
	The code was copied from the course demo - CS290 - Spring 2015 - Oregon State
*/
window.onload = function() {
	var favoritesStr = localStorage.getItem('userFavorites');
	if( favoritesStr === null ) {
		settings = {'favorites':[]};
		localStorage.setItem('userFavorites', JSON.stringify(settings));
	}
	else {
		settings = JSON.parse(localStorage.getItem('userFavorites'));
		//loadFavorites();
	}
}