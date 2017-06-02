//发布行程
let utils = require("../../source/js/utils");

let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isCar: false,
	isPhoto: false,
	isType: false,
	isAlert: false,
	alertInfo: "",
	userName: "",
	sex: "保密",
	sexType:0,
	carType: "随机拼车",
	userType: 2,
	currentType: 1,
	types:[],
	sexArray:[{
		value:0,
		text:"保密"
	},{
		value:1,
		text:"男"
	},{
		value:2,
		text:"女"
	}],
	carArray:[{
		value:1,
		text:"固定拼车"
	},{
		value:2,
		text:"随机拼车"
	}],
	selectSex: function(){
		this.types.removeAll();
		this.types.pushArray(this.sexArray);
		this.isType = true;
		this.currentType = 1;
	},
	selectCar: function(){
		this.types.removeAll();
		this.types.pushArray(this.carArray);
		this.isType = true;
		this.currentType = 2;
	},
	selectType: function(arg){
		if(this.currentType == 1){
			this.sexType = arg.value;
			this.sex = arg.text;
		}else{
			this.userType = arg.value;
			this.carType = arg.text;
		}
		this.isType = false;
	},
	alertInfos: function(val, callback) {
		var _this = this;
		_this.alertInfo = val;
		_this.isAlert = true;
		setTimeout(function() {
			_this.isAlert = false;
			if (callback) {
				callback();
			}
		}, 1000);
	},
	updateInfo: function(){
		var _this = this;
		var userId = $.cookie("userId");
		var editUrl = "http://maomap.com/Api/userinfo/update/?output=jsonp";
		var data = {
			nick: _this.userName,
			sex: _this.sexType,
			userType: _this.userType,
			hasCar: _this.isCar,
			hasDriversLicense: _this.isPhoto,
			userid: userId
		};
		utils.post(editUrl, data, function(data) {
				if (data.errno == 0) {
					_this.alertInfos("信息修改成功", function(){
						window.location.href = "personal.html";
					});
				} else {
					_this.alertInfos(data.errmsg);
				}
			});
	},
	readyLoad: function() {
		var _this = this;
		var types = utils.parseLocation("type");
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
					if(data.data.hasCar == 0){
						_this.isCar = false;
					}else{
						_this.isCar = true;
					}
					if(data.data.hasDriversLicense == 0){
						_this.isPhoto = false;
					}else{
						_this.isPhoto = true;
					}
					for(var i=0;i<_this.sexArray.length;i++){
						if(_this.sexArray[i].value == data.data.sex){
							_this.sex = _this.sexArray[i].text;
						}
					}
					for(var i=0;i<_this.carArray.length;i++){
						if(_this.carArray[i].value == data.data.userType){
							_this.carType = _this.carArray[i].text;
						}
					}
				} else {
					_this.alertInfo(data.errmsg, function(){
						window.location.href = "index.html";
					});
				}
			});

		} else {
			_this.isLogined = false;
			window.location.href = "index.html";
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