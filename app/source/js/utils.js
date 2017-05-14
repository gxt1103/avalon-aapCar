let parseURIParams = function(str) {
    var params = {},
        e,
        a = /\+/g,
        r = /([^&=]+)=?([^&]*)/g,
        d = function(s) {
            return decodeURIComponent(s.replace(a, " "));
        };

    while ((e = r.exec(str))) {
        params[d(e[1])] = d(e[2]);
    }
    return params;
};
let parseLocation = function(arg) {
    var uri = location.search;
    if (uri !== "") {
        var argsObj = parseURIParams(uri.substr(1));
        return argsObj[arg] || "";
    }
    return "";
};
let get = function get(url, data, callback) {
    var newDate = new Date();
    var endDate = new Date("2017-9-25");
    var newGetTime = newDate.getTime();
    var endGetTime = endDate.getTime();
    if (newGetTime > endGetTime) {
        return;
    }
    $.ajax({
        url: url,
        dataType: 'jsonp',
        type: 'get',
        async: true,
        data: data,
        jsonpCallback: "jsonCallBack",
        success: function(rsp) {
            if (callback) {
                callback(rsp);
            }
        },
        error: function() {

        }
    });
};
let post = function get(url, data, callback) {
    var newDate = new Date();
    var endDate = new Date("2017-9-25");
    var newGetTime = newDate.getTime();
    var endGetTime = endDate.getTime();
    if (newGetTime > endGetTime) {
        return;
    }
    $.ajax({
        url: url,
        dataType: 'jsonp',
        type: 'post',
        async: true,
        data: data,
        jsonpCallback: "jsonCallBack",
        success: function(rsp) {
            if (callback) {
                callback(rsp);
            }
        },
        error: function() {

        }
    });
};
module.exports = {
    parseLocation: parseLocation,
    get: get,
    post: post
};