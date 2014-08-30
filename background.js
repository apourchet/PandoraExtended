var PANDORA_URL = "http://www.pandora.com/station/play/";

chrome.storage.local.clear(function() {
});

function getAllInfo(tabid) {
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
			chrome.runtime.sendMessage({data: data}, function(response) {

			});
		}
	);
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
		}
	});
}

setInterval(loop, 1000);
