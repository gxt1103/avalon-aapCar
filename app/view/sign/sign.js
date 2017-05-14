//发布行程
let utils = require("../../source/js/utils");
let vm = avalon.define({
	$id: "carApp",
	title: "快速登录",
	userName: "",
	code: "",
	isAlert: false,
	isClick: false,
	alertInfo: "",
	getCode: function(event) {
		var _this = this;
		if ($(".J-Send").hasClass("disabled")) {
			return;
		}
		if (!(/^(1[34578]\d{9})$/.test(_this.userName))) {
			_this.alertInfo = "请填写正确的手机号码";
			_this.isAlert = true;
			setTimeout(function() {
				_this.isAlert = false;
			}, 2000);
			return;
		}
		$(".J-Send").addClass("disabled");
		var url = "http://maomap.com/Api/userinfo/fetchCode/?output=jsonp";
		var data = {
			phone: _this.userName,
			type: 0
		};
		utils.get(url, data, function(data) {
			if (data.errno == 0) {
				var count = 120;
				var countTime;
				countTime = setInterval(function() {
					count--;
					if (count == 0) {
						$(".J-Send").removeClass("disabled");
						$(".J-Send").html("获取验证码");
						clearInterval(countTime);
					} else {
						$(".J-Send").html(count + "s");
					}
				}, 1000)
			} else {
				$(".J-Send").removeClass("disabled");
			}
		});

	},
	keyVerify: function() {
		var _this = this;
		if (/^(1[34578]\d{9})$/.test(_this.userName)) {
			if (_this.code.length >= 4) {
				_this.isClick = true;
			}else{
				_this.isClick = false;
			}
		}else{
			_this.isClick = false;
		}
	},
	login: function(event) {
		var _this = this;
		if ($(event.target).hasClass("disabled")) {
			return;
		}
		var next = utils.parseLocation("next");
		var url = "http://maomap.com/Api/userinfo/login/?output=jsonp";
		var data = {
			uid: _this.userName,
			logintoken: _this.code,
			type: 1
		};
		utils.get(url, data, function(data) {
			if (data.errno == 0) {
				var userId = data.data.userid;
				$.cookie("userId", userId, {
					path: "/"
				});
				if (next) {
					location.href = next;
				} else {
					location.href = "index.html";
				}
			} else {
				_this.alertInfo = data.errmsg;
				_this.isAlert = true;
				setTimeout(function() {
					_this.isAlert = false;
				}, 2000);
			}
		});

	},
	readyLoad: function() {

	}

});

vm.$watch("onReady", function() {
	var headerHeight = $("header").height();
	var footerHeight = $("footer").height();
	var windowHeight = $(window).height();
	// var clientWidth = $(window).width();
	// var fontSize = 50 * ((clientWidth >= 750 ? 750 : clientWidth) / 320) + 'px';
	$("section").css({
		"height": windowHeight - headerHeight - footerHeight,
		"margin-top": headerHeight
	});
	// window.addEventListener("resize", function(){
	// 	$("html").css("font-size", fontSize);
	// }, false);

});