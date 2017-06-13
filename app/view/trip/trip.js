// 我的行程 s
let utils = require("../../source/js/utils");

let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isDone: false,
	isAlert: false,
	alertInfo: "",
	page: 1,
	pagesize: 5,
	listData: [],
	readyLoad: function(page) {
		var _this = this;
		var userId = $.cookie("userId");
		var url = "http://maomap.com/Api/line/myalllines/?output=jsonp";
		var _this = this;
		if (page) {
			_this.page = page;
		}
		var data = {
			page: _this.page,
			pagesize: _this.pagesize,
			userid: userId
		};
		if (_this.timeError) {
			data.date = _this.timeError
		}
		utils.get(url, data, function(data){
			if (data.errno == 0) {
					if (data.data.list.length > 0) {
						_this.isDone = false;
						if (page) {
							_this.listData.removeAll();
							_this.listData.pushArray(data.data.list);
						} else {
							_this.listData.pushArray(data.data.list);
						}
					} else {
						_this.isDone = true;
					}
				} else {
					_this.listData.removeAll();
					_this.alertInfo = data.errmsg;
					_this.isAlert = true;
					setTimeout(function() {
						_this.isAlert = false;
					}, 1000);
				}
		});

		//判断是否登录
		if (userId) {
			_this.isLogined = true;
		} else {
			_this.isLogined = false;
		}
	},
	
	upData: function() {
		if (!this.isDone) {
			this.page = this.page + 1;
			this.readyLoad();
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
	// window.addEventListener("resize", function(){
	// 	$("html").css("font-size", fontSize);
	// }, false);
	vm.readyLoad();
});