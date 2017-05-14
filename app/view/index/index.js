//拼车list页面
let utils = require("../../source/js/utils");

let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isType: false,
	isDone: false,
	isPublish: false,
	isAlert: false,
	alertInfo: "",
	typeName: "全部类型",
	mode: "全部",
	timeName: "全部日期",
	lineType: "100000",
	needType: "0",
	timeError: "",
	currentName: "",
	currentStatus: "1",
	page: 1,
	pagesize: 5,
	selectData: [],
	listData: [],
	typeData: [{
		types: "100000",
		names: "全部类型",
		subName: "所有行程"
	}, {
		types: "1",
		names: "上班",
		subName: "去公司"
	}, {
		types: "2",
		names: "下班",
		subName: "回家"
	}, {
		types: "0",
		names: "实时",
		subName: "实时行程"
	}, {
		types: "10",
		names: "免费",
		subName: "当代活雷锋"
	}],
	modeData: [{
		types: "0",
		names: "全部",
		subName: ""
	}, {
		types: "2",
		names: "车找人",
		subName: "车主"
	}, {
		types: "1",
		names: "人找车",
		subName: "乘客"
	}],
	selectType: function(event) {
		this.isType = !this.isType;
		this.currentName = this.typeName;
		this.currentStatus = "1";
		this.selectData.removeAll();
		this.selectData.pushArray(this.typeData);
		if (this.isType) {
			$(".header-list").removeClass("header-active");
			$(event.target).addClass("header-active");
		} else {
			$(".header-list").removeClass("header-active");
			$(event.target).removeClass("header-active");
		}
		$("body").css("overflow","hidden");
	},
	selectMode: function() {
		this.isType = !this.isType;
		this.currentName = this.mode;
		this.currentStatus = "2";
		this.selectData.removeAll();
		this.selectData.pushArray(this.modeData);
		if (this.isType) {
			$(".header-list").removeClass("header-active");
			$(event.target).addClass("header-active");
		} else {
			$(".header-list").removeClass("header-active");
			$(event.target).removeClass("header-active");
		}
		$("body").css("overflow","hidden");
	},
	selectTime: function() {
		var timeData = [{
			names: "全部日期",
			subName: "",
			types: ""
		}];
		for (var i = 0; i < 31; i++) {
			var firstName, secondName;
			var date = new Date();
			date.setDate(date.getDate() + i);
			// if (i == 0) {
			// 	firstName = "今天";
			// } else if (i == 1) {
			// 	firstName = "明天";
			// } else if (i == 2) {
			// 	firstName = "后天";
			// } else {
			var month = date.getMonth() + 1;
			var day = date.getDate();
			firstName = month + '月' + day + "日";
			// }
			var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
			var days = date.getDay();
			var secondName = "周" + weeks[days];
			var times = {
				names: firstName,
				subName: secondName,
				types: date.getFullYear() + "-" + month + "-" + day
			};
			timeData.push(times);
		}
		this.isType = !this.isType;
		this.currentName = this.timeName;
		this.currentStatus = "3";
		this.selectData.removeAll();
		this.selectData.pushArray(timeData);
		if (this.isType) {
			$(".header-list").removeClass("header-active");
			$(event.target).addClass("header-active");
		} else {
			$(".header-list").removeClass("header-active");
			$(event.target).removeClass("header-active");
		}
		$("body").css("overflow","hidden");
	},
	selectSub: function(val) {
		var current = this.currentStatus;
		if (current == "1") {
			this.typeName = val.names;
			this.lineType = val.types;
		} else if (current == "2") {
			this.mode = val.names;
			this.needType = val.types;
		} else {
			this.timeName = val.names;
			this.timeError = val.types;
		}
		this.isType = false;
		$(".header-list").removeClass("header-active");
		this.readyLoad(1);
		$("body").removeAttr("style");
	},
	closeWindow: function(){
		this.isType = false;
		$("body").removeAttr("style");
	},
	readyLoad: function(page) {
		var _this = this;
		var url = "http://maomap.com/Api/line/linelist/?output=jsonp";
		var _this = this;
		if (page) {
			_this.page = page;
		}
		var data = {
			page: _this.page,
			pagesize: _this.pagesize,
			lineType: _this.lineType,
			needType: _this.needType
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
		var userId = $.cookie("userId");
		if (userId) {
			_this.isLogined = true;
		}else{
			_this.isLogined = false;
		}
	},
	publishInfo: function() {
		this.isPublish = true;
		this.isType = false;
	},
	closePublish: function() {
		this.isPublish = false;
	},
	upData: function() {
		if (!this.isDone) {
			this.page = this.page + 1;
			this.readyLoad();
		}
	},
	publish: function(val) {
		if(this.isLogined){
			window.location.href = "publish.html?type=" + val;
		}else{
			window.location.href = "sign.html?next=publish.html?type=" + val;
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