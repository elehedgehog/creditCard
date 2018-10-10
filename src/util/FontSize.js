(function(win) {
  var doc = win.document
  var docEl = doc.documentElement

  function refreshRem() {
    var width = docEl.getBoundingClientRect().width > docEl.clientWidth
      ? docEl.getBoundingClientRect().width : docEl.clientWidth
    docEl.style.fontSize = width / 10  + 'px'
  }
  refreshRem()

  win.addEventListener('resize', refreshRem)

})(window);
