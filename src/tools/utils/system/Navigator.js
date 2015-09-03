function Navigator() {}
export default Navigator;

var userAgent;
var userAgentVersion;
Navigator.IE = "IE";
Navigator.NS = "NS";
Navigator.IOS = "IOS";

function detectUserAgent() {
  if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){ //test for MSIE x.x;
    userAgent='IE';
    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
    if(userAgentVersion<9) return null;
  } else if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
    userAgent='FIREFOX';
    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
  } else if (navigator.userAgent.match(/Chrome/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
    userAgent='CHROME';
    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
  } else if (/Mozilla[\/\s](\d+\.\d+)/.test(navigator.userAgent) || navigator.userAgent.match(/Mozilla/) != null){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
    userAgent='MOZILLA';
    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
  } else if (navigator.userAgent.match(/Safari/) != null){ //test for MSIE x.x;
    userAgent='Safari';
    userAgentVersion=Number(RegExp.$1); // capture x.x portion and store as a number
  } else if(navigator.userAgent.match(/iPad/i) != null){
    userAgent='IOS';
  } else if(navigator.userAgent.match(/iPhone/i) != null){
    userAgent='IOS';
  }
}

Navigator.getUserAgent = function() {
  detectUserAgent();
  return userAgent;
};
Navigator.getUserAgentVersion = function() {
  detectUserAgent();
  return userAgentVersion;
};
