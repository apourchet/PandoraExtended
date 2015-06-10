var PANDORA_URL = "http://www.pandora.com"
var NOOP = function(){}

var lastData = {}

chrome.storage.local.clear(NOOP)

function getAllInfo(tabid) {
  console.log("Running")
	chrome.tabs.executeScript(tabid, {file: "getAllInfo.js"},
		function(results) {
			lastData = results[0]
		}
	)
}

function sendLastData() {
	if (Object.keys(lastData).length !== 0) {
    chrome.runtime.sendMessage({data: lastData, timeStamp: new Date().getTime()}, NOOP)
  }
}

function sendNoTab() {
	chrome.runtime.sendMessage({data: {}, error: 1, timeStamp: new Date().getTime()}, NOOP)
}

function loop() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
    tabid = -1
    tabs.forEach(function(tab) {
			if (tab.url.indexOf(PANDORA_URL) == 0) {
        tabid = tab.id
			}
    })

    if (tabid == -1) {
      lastData = {}
      sendNoTab()
    } else {
      getAllInfo(tabid)
    }
	})
}

setInterval(loop, 200)
setInterval(sendLastData, 50)
