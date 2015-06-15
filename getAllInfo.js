var data = {
  title: document.getElementsByClassName('songTitle')[0].text,
  artist: document.getElementsByClassName('artistSummary')[0].text,
  album: document.getElementsByClassName('albumTitle')[0].text,
  imgsrc: document.getElementsByClassName('playerBarArt')[0].src,
  liked: (document.getElementsByClassName('thumbUpButton')[0].className.indexOf("indicator") != -1),
  disliked: (document.getElementsByClassName('thumbDownButton')[0].className.indexOf("indicator") != -1)
}; data
