let utils = require("../../source/js/utils");
let scrollTimes, placeSearch, times, nextval;
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isAlert: false,
	isAddress: false,
	isSelectDate: false,
	isShow: false,
	alertInfo: "",
	title: "设置地址",
	workTime: "09:00",
	homeTime: "18:00",
	mapList: [],
	currentLng: "",
	currentLat: "",
	addressType: "",
	homeLat: "",
	homeLng: "",
	homeName: "请设置",
	homeAddress: "请设置",
	companyLat: "",
	companyLng: "",
	companyName: "请设置",
	companyAddress: "请设置",
	nick: "",
	userType: "",
	hasCar: false,
	hasDriversLicense: false,
	selectHour: [],
	selectMin: [],
	currentHour: "",
	currentMin: "",
	currentType:"",
	locationMap: function() {
		var _this = this;
		var mapObj = new AMap.Map('iCenter');
		mapObj.plugin('AMap.Geolocation', function() {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：无穷大
				maximumAge: 0, //定位结果缓存0毫秒，默认：0
				convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: true, //显示定位按钮，默认：true
				buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
				showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			});
			mapObj.addControl(geolocation);
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', function(data) {
				_this.currentLng = data.position.getLng();
				_this.currentLat = data.position.getLat();
			}); //返回定位信息
			AMap.event.addListener(geolocation, 'error', function(data) {
				console.log(data.message);
			}); //返回定位出错信息
		});
	},
	slectAddress: function(val) {
		this.isAddress = true;
		this.addressType = val;
		if (val == "0") {
			this.title = "家";
		} else {
			this.title = "公司";
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
		var vals;
		var _this = this;
		times = setInterval(function() {
			vals = $(event.target).val();
			vals = vals.replace(/^\s+/, '').replace(/\s+$/, '');
			if (vals != '' && vals != nextval) {
				if (_this.addressType == "0") {
					placeSearch.searchNearBy(vals, [_this.currentLng, _this.currentLat], 5000, function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							_this.mapList.removeAll();
							_this.mapList.pushArray(result.poiList.pois);
						}
					});
				} else {
					placeSearch.search(vals, function(status, result) {
						if (status === 'complete' && result.info === 'OK') {
							_this.mapList.removeAll();
							_this.mapList.pushArray(result.poiList.pois);
						}
					});
				}
			}
			nextval = vals;
		}, 100);

	},
	searchBlur: function() {
		clearInterval(times);
	},
	confirmAddress: function() {
		var _this = this;
		var locations = $(".address-list").find(".active").attr("data-location");
		var names = $(".address-list").find(".active").attr("data-name");
		var address = $(".address-list").find(".active").attr("data-address");

		if (this.addressType == "0") {
			_this.homeLat = locations.substr(locations.indexOf(",") + 1, locations.length);
			_this.homeLng = locations.substr(0, locations.indexOf(","));
			_this.homeName = names;
			_this.homeAddress = address;
		} else {
			_this.companyLat = locations.substr(locations.indexOf(",") + 1, locations.length);
			_this.companyLng = locations.substr(0, locations.indexOf(","));
			_this.companyName = names;
			_this.companyAddress = address;
		}
		_this.mapList.removeAll();
		_this.title = "设置地址";
		_this.isAddress = false;
	},
	closeAddress: function() {
		this.title = "设置地址";
		this.isAddress = false;
	},
	selectDime: function(val) {
		var _this = this;
		if (_this.selectHour.length == 0) {
			for (var i = 0; i < 24; i++) {
				var mm = i + 1;
				var parms = {
					types: mm,
					names: mm + "时"
				};
				_this.selectHour.push(parms);
			}
		}
		if (_this.selectMin.length == 0) {
			for (var i = 0; i < 60; i++) {
				var min = i;
				var minText = i;
				if (minText < 10) {
					minText = "0" + minText + "分";
				} else {
					minText = minText + "分";
				}
				var parms = {
					types: min,
					names: minText
				};
				_this.selectMin.push(parms);
			}
		}
		var dateTime = new Date();
		var hours = dateTime.getHours() - 1;
		var mins = dateTime.getMinutes();
		_this.isSelectDate = true;
		var scrollHour = new iScroll("select_hour", {
			snap: "li",
			vScrollbar: false,
			fixedScrollbar: true,
			onScrollEnd: function() {
				var index = parseInt((this.y / 60) * (-1));
				_this.currentHour = _this.selectHour[index].types;
			}
		});
		scrollHour.refresh();
		scrollHour.scrollTo(0, hours * 60, 100, true);
		var scrollMin = new iScroll("select_min", {
			snap: "li",
			vScrollbar: false,
			fixedScrollbar: true,
			onScrollEnd: function() {
				var index = parseInt((this.y / 60) * (-1));
				_this.currentMin = _this.selectMin[index].types;
			}
		});
		scrollMin.refresh();
		scrollMin.scrollTo(0, mins * 60, 100, true);
		_this.isSelectDate = true;
		_this.isShow = true;
		_this.currentType = val;

	},
	confirmDate: function() {
		var _this = this;
		var val;
		var hours = _this.currentHour;
		var mins = _this.currentMin;
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (mins < 10) {
			mins = "0" + mins;
		}
		val = hours + ":" + mins;
		if (_this.currentType == 0) {
			_this.workTime = val;
		} else {
			_this.homeTime = val;
		}
		_this.isSelectDate = false;
		_this.isShow = false;
	},
	cancelDate: function() {
		var _this = this;
		_this.isSelectDate = false;
		_this.isShow = false;
		_this.currentHour = "";
		_this.currentMin = "";
	},
	submitInfo: function() {
		var _this = this;
		var userId = $.cookie("userId");
		if (!userId) {
			window.location.href = "sign.html?next=answer.html";
		}
		var data = {
			userid: userId,
			nick: _this.nick,
			userType: _this.userType,
			hasCar: _this.hasCar,
			hasDriversLicense: _this.hasDriversLicense,
			homeLat: _this.homeLat,
			homeLng: _this.homeLng,
			homeName: _this.homeName,
			homeAddress: _this.homeAddress,
			homeRange: 5000,
			companyLat: _this.companyLat,
			companyLng: _this.companyLng,
			companyName: _this.companyName,
			companyAddress: _this.companyAddress,
			companyRange: 5000,
			workStartTime: _this.workTime,
			workEndTime: _this.homeTime
		};
		var updateUrl = "http://maomap.com/Api/userinfo/update/?output=jsonp";
		utils.post(updateUrl, data, function(data) {
			if (data.errno == 0) {
				_this.popInfo("更新成功", function() {
					window.location.href = "personal.html";
				});
			} else {
				_this.popInfo(data.errmsg);
			}
		});
	},
	popInfo: function(text, callback) {
		var _this = this;
		_this.alertInfo = text;
		_this.isAlert = true;
		setTimeout(function() {
			_this.isAlert = false;
			if (callback) {
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
					_this.nick = data.data.nick
					_this.userType = data.data.userType;
					if (data.data.hasCar == 0) {
						_this.hasCar = false;
					} else {
						_this.hasCar = true;
					}
					if (data.data.hasDriversLicense == 0) {
						_this.hasDriversLicense = false;
					} else {
						_this.hasDriversLicense = true;
					}
					if (data.data.homeName) {
						_this.homeName = data.data.homeName;
					}
					if (data.data.homeAddress) {
						_this.homeAddress = data.data.homeAddress;
					}
					if (data.data.companyName) {
						_this.companyName = data.data.companyName;
					}
					if (data.data.companyAddress) {
						_this.companyAddress = data.data.companyAddress;
					}
					_this.workTime = data.data.workStartTime;
					_this.homeTime = data.data.workEndTime;
				} else {
					_this.alertInfo(data.errmsg, function() {
						window.location.href = "index.html";
					});
				}
			});

		} else {
			_this.isLogined = false;
			window.location.href = "sign.html?next=address.html";
		}
		_this.locationMap();
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