let utils = require("../../source/js/utils");
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isAlert: false,
	alertInfo: "",
	selectInfo: function(arg){
		var _this= this;
		_this.copyText(arg.text, function(){
			_this.popInfo(arg.title+"复制成功");
		});
	},
	copyText: function(str, callback){
		 var save = function(e){
	        e.clipboardData.setData('text/plain', str);
	        e.preventDefault();
	    }
	    document.addEventListener('copy', save);
	    document.execCommand('copy');
	    document.removeEventListener('copy',save);
	    if(callback){
	    	callback();
	    }
	},
	popInfo: function(text, callback) {
		var _this = this;
		_this.alertInfo = text;
		_this.isAlert = true;
		setTimeout(function() {
			_this.isAlert = false;
			if(callback){
				callback();
			}
		}, 1000);
	},
	readyLoad: function() {
		var _this = this;
		//判断是否登录
		var loginUrl = "http://maomap.com/Api/userinfo/fetchuserinfo/?output=jsonp";
		var userId = $.cookie("userId");
		if (userId) {
			var data = {
				userid: userId
			};
			utils.get(loginUrl, data, function(data) {
				if (data.errno == 0) {
					_this.isLogined = true;
				} else {
					_this.popInfo(rsp.errmsg);
				}
			});

		} else {
			_this.isLogined = false;
		}
	}

});

vm.$watch("onReady", function() {
	var headerHeight = $("header").height();
	var windowHeight = $(window).height();
	// var clientWidth = $(window).width();
	// var fontSize = 50 * ((clientWidth >= 750 ? 750 : clientWidth) / 320) + 'px';
	$("section").css({
		"height": windowHeight - headerHeight,
		"margin-top": headerHeight
	});
	vm.readyLoad();
});