var PANDORA_URL = "http://www.pandora.com";
var lastData = {};

chrome.storage.local.clear(function() {
});

function getAllInfo(tabid) {
			console.log("Running")
	chrome.tabs.executeScript(tabid,
		{file: "getAllInfo.js"},
		function(results) {
			var allInfo = results[0].split(";");
			var data = {
				title: allInfo[0],
				artist: allInfo[1],
				album: allInfo[2],
				imgsrc: allInfo[3]
			};
			lastData = data;
		}
	);
}

function sendLastData() {
	if (Object.keys(lastData).length === 0) {
		return;
	}
	chrome.runtime.sendMessage({data: lastData, timeStamp: new Date().getTime()}, function(response) {
	});
}

function sendNoTab() {
	chrome.runtime.sendMessage({data: {}, error: 1, timeStamp: new Date().getTime()}, function(response) {
	});
}

function loop() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			var tab = tabs[i];
			var url = tab.url;
			if (url.indexOf(PANDORA_URL) != 0) {
				continue; 
			}
			var id = tab.id;
			getAllInfo(id);
			return;
		}
		lastData = {};
		sendNoTab();
	});
}

setInterval(loop, 200);
setInterval(sendLastData, 50);
