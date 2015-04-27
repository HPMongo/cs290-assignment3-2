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
/*
	This function will call the GitHub API to get the public gists
*/
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
			for(var i=0; i<30; i++) {	//load 30 items at a time
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

/*
	This function will check the user's input to see if there is a language selected
*/
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
//Add the row to the favorite table
	var	favoriteBox = document.getElementById("favoriteTable");
	var rowCount = favoriteBox.rows.length;
	var insertRow = favoriteBox.insertRow(rowCount);
	insertRow.insertCell(0).innerHTML='<input type="button" value = "Remove from Favorite" onClick="Javacsript:removeFromFav(this)">';
	insertRow.insertCell(1).innerHTML= sID;
	insertRow.insertCell(2).innerHTML= sDesc;
	insertRow.insertCell(3).innerHTML= sURL;
}

/*
	This function will remove an item from the favorite table, remove it from local storage,
	reload local storage and populate the item back to the result table.
*/
function removeFromFav(obj) {
	var index = obj.parentNode.parentNode.rowIndex;
	var	favoriteBox = document.getElementById("favoriteTable");
//Get information from the table
	var sID = favoriteBox.rows[index].cells[1].innerHTML;
	var sDesc = favoriteBox.rows[index].cells[2].innerHTML;
	var sURL = favoriteBox.rows[index].cells[3].innerHTML;
//Insert the row back to the result table
	var	resultBox = document.getElementById("resultTable");
	var rowCount = resultBox.rows.length;
	var insertRow = resultBox.insertRow(rowCount);
	insertRow.insertCell(0).innerHTML='<input type="button" value = "Add to Favorite" onClick="Javacsript:addToFav(this)">';
	insertRow.insertCell(1).innerHTML= sID;
	insertRow.insertCell(2).innerHTML= sDesc;
	insertRow.insertCell(3).innerHTML= sURL;
//Remove the item from the setting array
	var elementIdx = 0, notFound = 1, currentIdx = 0;
	while(notFound === 1 && currentIdx <settings.favorites.length) {
		if(settings.favorites[currentIdx].gistId === sID) {
			notFound = 0;
			settings.favorites.splice(currentIdx, 1);
		}
		else {
			currentIdx++;
		}
	}
//Reload the local storage with the updated array
	localStorage.setItem('userFavorites', JSON.stringify(settings));
//Delete the row from the favorite table
	favoriteBox.deleteRow(index);
}

/*
	This function will populate the favorite table using setting from the local storage.
*/
function loadFavorites() {
	var favoriteBox = document.getElementById("favoriteTable");
	var rowCount, row;
	settings.favorites.forEach(function(s) {
		rowCount = favoriteBox.rows.length;
		row = favoriteBox.insertRow(rowCount);
		row.insertCell(0).innerHTML='<input type="button" value = "Remove from Favorite" onClick="Javacsript:removeFromFav(this)">';
		row.insertCell(1).innerHTML= s.gistId;
		row.insertCell(2).innerHTML= s.gistDesc;
		row.insertCell(3).innerHTML= s.gistURL;
	});
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
		loadFavorites();
	}
}