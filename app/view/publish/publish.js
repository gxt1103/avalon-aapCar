//发布行程
let utils = require("../../source/js/utils");
let scrollTimes, placeSearch;
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isNormal: false,
	isSelectType: false,
	isSelectTime: false,
	isAddress: false,
	addressType: "",
	mode: "",
	timeName: "",
	title: "",
	tel: "",
	start: "",
	end: "",
	requires: "+/-5分钟",
	remark: "",
	types: "",
	currentVal: 2,
	returnUrl: "index.html",
	mapList: [],
	modeData: [{
		types: 2,
		names: "车找人",
		subName: "车主"
	}, {
		types: 1,
		names: "人找车",
		subName: "乘客"
	}],
	selectTime: [{
		types: "-1",
		names: "随时"
	}, {
		types: "0",
		names: "精准"
	}, {
		types: "1",
		names: "+/-5分钟"
	}, {
		types: "2",
		names: "+/-10分钟"
	}, {
		types: "3",
		names: "+/-15分钟"
	}, {
		types: "4",
		names: "+/-20分钟"
	}, {
		types: "5",
		names: "+/-25分钟"
	}, {
		types: "6",
		names: "+/-30分钟"
	}, {
		types: "7",
		names: "+/-45分钟"
	}, {
		types: "8",
		names: "+/-1小时"
	}, {
		types: "9",
		names: "+/-2小时"
	}],
	realTime: function() {
		var _this = this;
		_this.isSelectTime = true;
		scrollTimes = new iScroll("select_time", {
			snap: "li",
			vScrollbar: false,
			fixedScrollbar: true,
			onScrollEnd: function() {
				var index = parseInt((this.y / 60) * (-1));
				var selectVal = _this.selectTime[index].names;
				_this.requires = selectVal;
				_this.currentVal = index;
			}
		});
		scrollTimes.refresh();
		scrollTimes.scrollTo(0, _this.currentVal * 60, 100, true);
	},
	confirmSelect: function() {
		var _this = this;
		var translateY = $('#select_time').find("ul").css('transform').replace(/[^0-9\-,]/g, '').split(',')[5];
		translateY = translateY.replace(/\-/g, "");
		var lengthHeight = (_this.selectTime.length - 2) * 60 + 40;
		if (translateY > lengthHeight) {
			_this.requires = _this.selectTime[_this.selectTime.length - 1].names;
			_this.currentVal = _this.selectTime.length - 1;
		}
		this.isSelectTime = false;
	},
	selectMode: function() {
		this.isSelectType = true;
	},
	selectDime: function(event) {
		var _this = this;
		$(event.target).date({
			theme: "datetime"
		}, function(val) {
			_this.timeName = val;
		});
	},
	selectType: function(val) {
		if (val == "1") {
			this.mode = "找车";
		} else {
			this.mode = "找人";
		}
		this.isSelectType = false;
	},
	showRelative: function() {
		$("footer").css("position", "relative");
	},
	hideRelative: function() {
		$("footer").removeAttr("style");
	},

	slectAddress: function(val) {
		this.isAddress = true;
		this.addressType = val;
		if (val == "0") {
			this.title = "出发地";
		} else {
			this.title = "目的地";
		}
		var headerHeight = $("header").height();
		var footerHeight = $(".publish-address").height();
		var windowHeight = $(window).height();
		// var clientWidth = $(window).width();
		// var fontSize = 50 * ((clientWidth >= 750 ? 750 : clientWidth) / 320) + 'px';
		$(".address-list").css({
			"height": windowHeight - headerHeight - footerHeight
		});
		AMap.service('AMap.PlaceSearch', function() { //回调函数
			placeSearch = new AMap.PlaceSearch({ //构造地点查询类
				pageSize: 50,
				pageIndex: 1,
				type: "地名地址信息|商务住宅|公司企业|道路附属设施|金融保险服务|交通设施服务|科教文化服务|政府机构及社会团体|风景名胜|汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|通行设施",
				city: "上海" //城市
			});
		});
	},
	selectLi: function(event) {
		$(".address-list").find("li").removeClass("active");
		$(event.target).addClass("active");
	},
	searchList: function(event) {
		var vals = $(event.target).val();
		vals = vals.replace(/^\s+/,'').replace(/\s+$/,'');
		if (vals.length > 0) {
			placeSearch.search(vals, function(status, result) {
				console.log("status:" + status)
				console.log("result:" + result)
			})
		}
	},
	confirmAddress: function() {

	},
	closeAddress: function() {
		this.isAddress = false;
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
					_this.tel = data.data.phone
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
		_this.types = types;
		switch (types) {
			case "0":
				this.title = "实时";
				break;
			case "1":
				this.title = "上班";
				break;
			case "2":
				this.title = "下班";
				break;
			case "10":
				this.title = "免费";
				break;
			default:
				this.title = "免费";
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