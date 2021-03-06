//发布行程
let utils = require("../../source/js/utils");
let scrollTimes, placeSearch, times, nextval;
let vm = avalon.define({
	$id: "carApp",
	isLogined: false,
	isNormal: false,
	isSelectType: false,
	isSelectTime: false,
	isAddress: false,
	isAlert: false,
	isCalendar: false,
	isSelectDate: false,
	alertInfo: "",
	addressType: "",
	mode: "",
	modeType: "",
	timeName: "请设置",
	serviceTime: [],
	title: "",
	tel: "",
	start: "",
	end: "",
	requires: "+/-5分钟",
	timeType: "1",
	remark: "",
	types: "",
	currentVal: 2,
	returnUrl: "index.html",
	mapList: [],
	timeArray: [],
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
	selectHour: [],
	selectMin: [],
	currentHour: "",
	currentMin: "",
	isOften: false,
	startLat: "",
	startLng: "",
	startName: "",
	startAddress: "",
	endLat: "",
	endLng: "",
	endName: "",
	endAddress: "",
	currentLng: "",
	currentLat: "",
	sessionid: "",
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
				_this.timeType = _this.selectTime[index].types;
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
	confirmDate: function() {
		var _this = this;
		_this.serviceTime.removeAll();
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
		if (_this.timeArray.length > 1) {
			for (var i = 0; i < _this.timeArray.length; i++) {
				var datestr = _this.timeArray[i] + " " + val;
				_this.serviceTime.push(datestr);
			}
			_this.timeName = "多个日期" + val;
		} else {
			var dates = _this.timeArray[0] + " " + val;
			_this.serviceTime.push(dates);
			var times = new Date(_this.timeArray[0]);
			var months = times.getMonth() + 1;
			var days = times.getDate();
			if (months < 10) {
				months = "0" + months;
			}
			if (days < 10) {
				days = "0" + days;
			}
			_this.timeName = months + "月" + days + "日" + val;
		}
		_this.isSelectDate = false;
		$("#calendar_screen").hide();
	},
	cancelDate: function() {
		var _this = this;
		_this.isSelectDate = false;
		_this.currentHour = "";
		_this.currentMin = "";
		$("#calendar_screen").hide();
	},
	selectType: function(val) {
		if (val == "1") {
			this.mode = "找车";
		} else {
			this.mode = "找人";
		}
		this.modeType = val;
		this.isSelectType = false;
	},
	showRelative: function() {
		$("footer").css("position", "relative");
	},
	hideRelative: function() {
		$("footer").removeAttr("style");
	},
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
			this.title = "出发地";
		} else {
			this.title = "目的地";
		}
		var headerHeight = $("header").height();
		var footerHeight = $(".address-search").height();
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
					placeSearch.searchNearBy(vals, [_this.currentLng, _this.currentLat], 1000, function(status, result) {
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
			_this.startLat = locations.substr(locations.indexOf(",") + 1, locations.length);
			_this.startLng = locations.substr(0, locations.indexOf(","));
			_this.startName = names;
			_this.startAddress = address;
			_this.start = names;
		} else {
			_this.endLat = locations.substr(locations.indexOf(",") + 1, locations.length);
			_this.endLng = locations.substr(0, locations.indexOf(","));
			_this.endName = names;
			_this.endAddress = address;
			_this.end = names;
		}
		_this.mapList.removeAll();
		_this.baseTitle();
		_this.isAddress = false;
	},
	closeAddress: function() {
		this.baseTitle();
		this.isAddress = false;
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
	publishInfo: function() {
		var _this = this;
		if (_this.serviceTime.length == 0) {
			_this.alertInfo("请选择出发时间");
			return;
		}
		if (_this.startLat == "") {
			_this.alertInfo("请选择出发地");
			return;
		}
		if (_this.endLat == "") {
			_this.alertInfo("请选择目的地");
			return;
		}
		if (_this.modeType == "") {
			_this.alertInfo("请选择类型");
			return;
		}
		var serviceTime = _this.serviceTime;
		serviceTime = serviceTime.toString();
		var data = {
			sessionid: _this.sessionid,
			phone: _this.tel,
			serviceTime: serviceTime,
			timeError: _this.timeType,
			validTime: 30,
			isOften: _this.isNormal,
			lineType: _this.types,
			reqType: _this.modeType,
			timeType: 0,
			startLat: _this.startLat,
			startLng: _this.startLng,
			startName: _this.startName,
			startAddress: _this.startAddress,
			startRange: 1000,
			endLat: _this.endLat,
			endLng: _this.endLng,
			endName: _this.endName,
			endAddress: _this.endAddress,
			endRange: 1000,
			remark: _this.remark
		};
		var publishUrl = "http://maomap.com/Api/line/publish/?output=jsonp";
		utils.post(publishUrl, data, function(data) {
			if (data.errno == 0) {
				_this.alertInfos("发布路线成功", function() {
					window.location.href = "index.html";
				});
			} else {
				_this.alertInfos(data.errmsg);
			}
		});
	},
	baseTitle: function() {
		var _this = this;
		var types = utils.parseLocation("type");
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
					_this.tel = data.data.phone
					_this.sessionid = data.data.userid;
				} else {
					_this.alertInfo(data.errmsg, function() {
						window.location.href = "index.html";
					});
				}
			});

		} else {
			_this.isLogined = false;
			window.location.href = "index.html";
		}
		_this.baseTitle();
		_this.locationMap();
		$("#select_out_time").focus(function() {
			_this.isCalendar = true;
		});
		$("#select_out_time").datepicker({
			dateFormat: "yy-mm-dd",
			numberOfMonths: 12,
			showButtonPanel: true,
			showMonthAfterYear: true,
			closeText: "确定",
			currentText: "取消",
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			onSelect: function(dateText, ins) {
				if (_this.timeArray.indexOf(dateText) == -1) {
					_this.timeArray.push(dateText);
				} else {
					_this.timeArray.splice(_this.timeArray.indexOf(dateText), 1);
				}
			},
			onConfirm: function() {
				// $("#dateshadow").show();
				// $("#datePage").show();
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
				$("#calendar_screen").show();
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
			}
		});

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