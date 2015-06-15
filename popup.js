var PANDORA_URL = "http://www.pandora.com"
var NOOP = function(){}
var DEFAULT_IMG_SRC = "http://investorplace.com/wp-content/uploads/2014/01/Pandora-stock-p-stock.jpg"

var data = {}
var loaded = false
var lastMessage = 0

chrome.storage.local.clear(NOOP)

function getPandoraTab(cb) {
	chrome.tabs.getAllInWindow(null, function(tabs) {
    tabs.forEach(function(tab) {
      if (tab.url.indexOf(PANDORA_URL) === 0) {
        cb(tab)
      }
    })
  })
}

function playpause() {
  getPandoraTab(function(tab) {
    chrome.tabs.executeScript(tab.id, {file: "playpause.js"})
  })
}

function like() {
  getPandoraTab(function(tab) {
			chrome.tabs.executeScript(tab.id, {code: "document.getElementsByClassName(\"thumbUpButton\")[0].click()"})
  })
}

function dislike() {
  getPandoraTab(function(tab) {
			chrome.tabs.executeScript(tab.id, {code: "document.getElementsByClassName(\"thumbDownButton\")[0].click()"})
  })
}

function skip() {
  getPandoraTab(function(tab) {
			chrome.tabs.executeScript(tab.id, {code: "document.getElementsByClassName(\"skipButton\")[0].click()"})
  })
}

function removeClassName(el, className) {
  classes = el.className.split(" ")
  newClasses = ""
  for (var i in classes) {
    if (classes[i] !== className) {
      newClasses += classes[i] + " "
    }
  }
  el.className = newClasses
}

function addClassName(el, className) {
  if (el.className.indexOf(className) != -1) {
    return
  }
  el.className += " " + className
}

function updateDOM() {
	document.getElementById("playpause").onclick = playpause
	document.getElementById("like").onclick = like
	document.getElementById("dislike").onclick = dislike
	document.getElementById("skip").onclick = skip

	if (Object.keys(data).length === 0)
		return

	document.getElementById("title").innerHTML = data.title
	document.getElementById("artist").innerHTML = data.artist
	document.getElementById("album").innerHTML = data.album
	document.getElementById("imgsrc").src = data.imgsrc
  data.liked ? addClassName(document.getElementById("like"), "toggled") : removeClassName(document.getElementById("like"), "toggled")
  data.disliked ? addClassName(document.getElementById("dislike"), "toggled") : removeClassName(document.getElementById("dislike"), "toggled")
}

function saveToLocal() {
	chrome.storage.local.set({data: data}, NOOP)
}

chrome.storage.local.get("data", function(o) {
	data = o
	if (loaded) {
		updateDOM()
	}
})

document.addEventListener('DOMContentLoaded', function () {
	console.log("Popup.js called!")
	loaded = true
	updateDOM()

	chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
		if (lastMessage > req.timeStamp) {
			return
		}
		console.log("Got a message!")
				
		lastMessage = req.timeStamp
		if (req.error === 1) {
			data.title = "No Song Playing"
			data.artist = ""
			data.album = ""
			data.imgsrc = DEFAULT_IMG_SRC
		} else {	
			data = req.data
		}
				
		updateDOM()
		saveToLocal()

	 	sendResponse({ok: 1})
	})
})
