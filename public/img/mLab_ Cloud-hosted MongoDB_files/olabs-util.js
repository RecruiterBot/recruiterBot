/******************************************************************************
* olabs-util.js
*
* William Shulman
*
* 09.18.2010
*/

/******************************************************************************
 * getUrlParams
 */
function getUrlParams() {
    var result = {};

    var startIndex = window.location.href.indexOf('?') + 1;
    if (startIndex > 0) {
        var params = window.location.href.slice(startIndex).split('&');
        if (params && params != "") {
            for(var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                result[param[0]] = param[1];
            }
        }
    }
    return(result);
}

/******************************************************************************
 * serializeUrlParams
 */
function serializeUrlParams(params) {
    var result = "?";
    var first = true;
    if (params) {
        for (param in params) {
            if (!first) {
                result += "&";
            }
            result += param + "=" + params[param];
            first = false;
        }
    }
    return(result);
}

// This function used to use XDomainRequest in IE when available, but that was not sending cookies with requests,
// causing IE-specific bugs
function getJson(url, success, error) {
  $.get(url, null, null, "json").success(success).error(error);
}


// Returns true if the given database name is ill-advised because it will make future migrations more difficult
function isIllAdvisedDbName(name) {
  if(name && name.length && name.length >= 5) {
    name = name.toLowerCase();
    if(name.indexOf("production") >= 0) {
      return true;
    }
    if(name.indexOf("-prod") === (name.length-5) ||
      name.indexOf("_prod") === (name.length-5)) {
      return true;
    }
  }
  return false;
}

function compareVersions(v0, v1) {
  var parts0 = v0.split(".");
  var parts1 = v1.split(".");
  var i = 0;
  while(i < parts0.length && i < parts1.length) {
    if(parts0[i] > parts1[i]) {
      return 1;
    } else if(parts0[i] < parts1[i]) {
      return -1;
    }
    i++;
  }
  if(parts0.length > parts1.length) {
    return 1;
  } else if(parts0.length < parts1.length) {
    return -1;
  } else {
    return 0;
  }
}
