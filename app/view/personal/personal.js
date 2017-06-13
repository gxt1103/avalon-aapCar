//发布行程
let utils = require("../../source/js/utils");
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isAlert: false,
	alertInfo:"",
	userName: "",
	tel:"",
	personalInfo: function(){
		if(this.isLogined){
			window.location.href = "personalInfo.html";
		}else{
			window.location.href = "sign.html?next=personal.html";
		}
	},
	login: function(){
		if(!this.isLogined){
			window.location.href = "sign.html?next=personal.html";
		}
	},
	selectAddress: function(){
		if(this.isLogined){
			window.location.href = "address.html";
		}else{
			window.location.href = "sign.html?next=personal.html";
		}
	},
	selectTrap: function(){
		if(this.isLogined){
			window.location.href = "trip.html";
		}else{
			window.location.href = "sign.html?next=personal.html";
		}
	},
	bindAccount: function(){
		if(this.isLogined){

		}else{
			window.location.href = "sign.html?next=personal.html";
		}
	},
	set: function(){
		if(this.isLogined){
			window.location.href = "set.html";
		}else{
			window.location.href = "sign.html?next=personal.html";
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
					_this.userName = data.data.nick;
					_this.tel = data.data.phone;
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
	vm.readyLoad();
});