var PANDORA_URL = "http://www.pandora.com/station/play/";
var data = {};
var loaded = false;

chrome.storage.local.clear(function() {});

function playpause() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			var url = tab.url;
			if (url.indexOf(PANDORA_URL) != 0) {
				continue; 
			}
			var id = tab.id;
			chrome.tabs.executeScript(id,
				{file:"playpause.js"}
			);
		}
	});
}

function like() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			var url = tab.url;
			if (url.indexOf(PANDORA_URL) != 0) {
				continue; 
			}
			var id = tab.id;
			chrome.tabs.executeScript(id,
				{code: "document.getElementsByClassName(\"thumbUpButton\")[0].click()"}
			);
		}
	});
}

function dislike() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			var url = tab.url;
			if (url.indexOf(PANDORA_URL) != 0) {
				continue; 
			}
			var id = tab.id;
			chrome.tabs.executeScript(id,
				{code: "document.getElementsByClassName(\"thumbDownButton\")[0].click()"}
			);
		}
	});
}

function skip() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			var url = tab.url;
			if (url.indexOf(PANDORA_URL) != 0) {
				continue; 
			}
			var id = tab.id;
			chrome.tabs.executeScript(id,
				{code: "document.getElementsByClassName(\"skipButton\")[0].click()"}
			);
		}
	});
}

function updateDOM() {
	document.getElementById("playpause").onclick = playpause;
	document.getElementById("like").onclick = like;
	document.getElementById("dislike").onclick = dislike;
	document.getElementById("skip").onclick = skip;

	if (Object.keys(data).length === 0)
		return;

	document.getElementById("title").innerHTML = data.title;
	document.getElementById("artist").innerHTML = data.artist;
	document.getElementById("album").innerHTML = data.album;

	document.getElementById("imgsrc").src = data.imgsrc;
}

function saveToLocal() {
	chrome.storage.local.set({data: data}, function() {})
}

chrome.storage.local.get("data", function(o) {
	data = o;
	if (loaded) {
		updateDOM();
	}
});

document.addEventListener('DOMContentLoaded', function () {
	console.log("Popup.js called!");
	loaded = true;
	updateDOM();

	chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
		console.log("Got a message!");
		
		data = req.data;

		updateDOM();
		saveToLocal();

	  	sendResponse({farewell: "goodbye"});
	});
});