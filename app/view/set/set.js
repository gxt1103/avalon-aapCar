let utils = require("../../source/js/utils");
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isAlert: false,
	alertInfo: "",
	answer: function() {
		if (this.isLogined) {
			window.location.href = "answer.html";
		} else {
			window.location.href = "sign.html?next=set.html";
		}
	},
	about: function() {
		if (this.isLogined) {
			window.location.href = "about.html";
		} else {
			window.location.href = "sign.html?next=set.html";
		}
	},
	loginOut: function() {
		if (this.isLogined) {
			$.cookie("userId", null, {
				path: "/"
			});
			this.isLogined = false;
		} else {
			window.location.href = "sign.html?next=set.html";
		}
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
					_this.alertInfo = rsp.errmsg;
					_this.isAlert = true;
					setTimeout(function() {
						_this.isAlert = false;
					}, 1000);
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