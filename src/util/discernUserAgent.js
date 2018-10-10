/**
 * @description  判断设备类型
 * @param [callback, callback, callback]
 */
function discernUserAgent(isAndroid, isIos, isPc){
  var u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Macintosh') > -1) {
    if (isAndroid) { isAndroid() }
  } else if (u.indexOf('iPhone') > -1) {
    if (isIos) { isIos() }
  } else {
    if (isPc) { isPc() }
  }
}

export default discernUserAgent