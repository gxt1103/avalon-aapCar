let utils = require("../../source/js/utils");
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isAlert: false,
	alertInfo: "",
	content: "",
	score: "",
	selectStar: function(val) {
		$(".start").find("i").removeClass("active");
		for (var i = 0; i < val; i++) {
			$(".start").find("i").eq(i).addClass("active");
		}
		this.score = val * 20;
	},
	submitInfo: function() {
		var _this = this;
		var userId = $.cookie("userId");
		var answerUrl = "http://maomap.com/Api/feed/feedback/?output=jsonp";
		if(!userId){
			window.location.href = "sign.html?next=answer.html";
		}
		if (_this.score == "") {
			_this.popInfo("请选择评分");
			return;
		}
		if (_this.content == "") {
			_this.popInfo("请填写意见");
			return;
		}
		if (_this.content.length > 144) {
			_this.popInfo("填写意见超过144个字符啦");
			return;
		}
		var data = {
			userid: userId,
			score: _this.score,
			feedback: _this.content
		};
		utils.post(answerUrl, data, function(data) {
			if (data.errno == 0) {
				_this.popInfo("吐槽成功", function(){
					window.location.href = "set.html";
				});
			} else {
				_this.popInfo(rsp.errmsg);
			}
		});
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