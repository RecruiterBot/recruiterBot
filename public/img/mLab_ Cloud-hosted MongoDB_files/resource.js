/******************************************************************************
 * class Resource
 *
 * This class serves as a client for the REST API --
 * focused on a specific single resource --
 * within the mongolab web app.
 */
var Resource = function (rHost, rPath, rKey) {
    this.host = rHost;
    this.resourcePath = rPath + "?apiKey=" + rKey;
    this.mOptions = null;

    this.get = function (view) {
        var path = this.resourcePath;

        if (view != null) {
            path += '&view=' + view;
        }

        var request = makeXmlHttpRequest("GET", this.host, path);
        request.send(null);
        var result = request.responseText;

        return(result);
    };

    this.post = function (data) {
        var request = makeXmlHttpRequest("POST", this.host, this.resourcePath);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(data);
        var result = request.responseText;
        return(result);
    };

    this.put = function (data) {
        var request = makeXmlHttpRequest("PUT", this.host, this.resourcePath);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(data);
        var result = request.responseText;
        return(result);
    };

    this.remove = function () {
        var request = makeXmlHttpRequest("DELETE", this.host, this.resourcePath);
        request.send(null);
        var result = request.responseText;
        return(result);
    };

    this.options = function () {
        if (this.mOptions == null) {
            var request = makeXmlHttpRequest("OPTIONS", this.host, this.resourcePath);
            request.send(null);
            var headerString = request.getResponseHeader("Allow");
            var header = headerString.split(", ");
            this.mOptions = header;
        }

        return(this.mOptions);
    };

    function makeXmlHttpRequest(method, host, path) {
        var request = new XMLHttpRequest();
        request.open(method, host + path, false);
        return(request);
    }

};
