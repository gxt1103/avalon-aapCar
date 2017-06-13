let utils = require("../../source/js/utils");

let vm = avalon.define({
	$id: "carApp",
	reqType: "",
	lineType: "",
	startName: "",
	startAddress: "",
	endName: "",
	endAddress: "",
	phone: "",
	remark: "",
	serviceTime: "",
	readyLoad: function() {
		var _this = this;
		var productId = utils.parseLocation("id");
		var prdouctUrl = "http://maomap.com/Api/line/detail/?output=jsonp";
		var data = {
			lineid: productId
		};
		var driving;
		var map = new AMap.Map("maps", {
	        resizeEnable: true,
	        center: [121.47, 31.23],//地图中心点
	        zoom: 11 //地图显示的缩放级别
	    });
		map.plugin(["AMap.ToolBar"], function() {
            map.addControl(new AMap.ToolBar({
            	liteStyle: true
            }));
        });
		utils.get(prdouctUrl, data, function(data) {
			_this.reqType = data.data.reqType;
			_this.lineType = data.data.lineType;
			_this.startName = data.data.startName;
			_this.startAddress = data.data.startAddress;
			_this.endName = data.data.endName;
			_this.endAddress = data.data.endAddress;
			_this.phone = data.data.phone;
			_this.remark = data.data.remark;
			_this.serviceTime = data.data.serviceTime;
			AMap.service('AMap.Driving', function() { //回调函数
				//实例化Driving
				driving = new AMap.Driving({
					city:"上海市",
					policy: AMap.DrivingPolicy.LEAST_TIME,
					map: map
				});
				//TODO: 使用driving对象调用驾车路径规划相关的功能
				driving.search([data.data.startLng, data.data.startLat], [data.data.endLng, data.data.endLat], function(status, result) {
					console.log(status)
				});
			});
			
		});

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
	$("#maps").css("height", windowHeight - headerHeight - $(".car-ul").height());
	vm.readyLoad();
});