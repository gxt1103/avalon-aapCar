/* 
 * 日期插件
 * 滑动选取日期（年，月，日）
 * V1.1
 */
(function($) {
    $.fn.date = function(options, Ycallback, Ncallback) {
        //插件默认选项
        var that = $(this);
        var docType = $(this).is('input');
        var datetime = false;
        var nowdate = new Date();
        var indexY = 1,
            indexM = 1,
            indexD = 1;
        var indexH = 1,
            indexI = 1,
            indexS = 0;
        var initY = parseInt((nowdate.getYear() + "").substr(1, 2));
        var initM = parseInt(nowdate.getMonth() + "") + 1;
        var initD = parseInt(nowdate.getDate() + "");
        var initH = parseInt(nowdate.getHours());
        var initI = parseInt(nowdate.getMinutes());
        var initS = parseInt(nowdate.getYear());
        var yearScroll = null,
            monthScroll = null,
            dayScroll = null;
        var HourScroll = null,
            MinuteScroll = null,
            SecondScroll = null;
        $.fn.date.defaultOptions = {
                beginyear: 2000, //日期--年--份开始
                endyear: 2080, //日期--年--份结束
                beginmonth: 1, //日期--月--份结束
                endmonth: 12, //日期--月--份结束
                beginday: 1, //日期--日--份结束
                endday: 31, //日期--日--份结束
                beginhour: 1,
                endhour: 24,
                beginminute: 0,
                endminute: 11,
                curdate: false, //打开日期是否定位到当前日期
                theme: "date", //控件样式（1：日期，2：日期+时间）
                mode: null, //操作模式（滑动模式）
                event: "click", //打开日期插件默认方式为点击后后弹出日期 
                show: true,
                isShow: false
            }
            //用户选项覆盖插件默认选项   
        var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
        if (opts.theme === "datetime") {
            datetime = true;
        }
        if(!opts.isShow){
            if (!opts.show) {
                that.unbind('click');
            }
            /*www.sucaijiayuan.com*/
            else {
                //绑定事件（默认事件为获取焦点）
                that.bind(opts.event, function() {
                    createUL(); //动态生成控件显示的日期
                    init_iScrll(); //初始化iscrll
                    extendOptions(); //显示控件
                    that.blur();
                    // if (datetime) {
                    //     showdatetime();
                    //     refreshTime();
                    // }
                    // refreshDate();
                    if (opts.theme === "date") {
                        refreshDate();
                    } else if (opts.theme === "time") {
                        showTime();
                        refreshTime();
                    } else {
                        showdatetime();
                        refreshTime();
                        refreshDate();
                    }
                    bindButton();
                })
            }
        }else{
            createUL(); //动态生成控件显示的日期
            init_iScrll(); //初始化iscrll
            // extendOptions(); //显示控件
            that.blur();
            // if (datetime) {
            //     showdatetime();
            //     refreshTime();
            // }
            // refreshDate();
            if (opts.theme === "date") {
                refreshDate();
            } else if (opts.theme === "time") {
                showTime();
                refreshTime();
            } else {
                showdatetime();
                refreshTime();
                refreshDate();
            }
            bindButton();
        }
        

        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();

            // resetInitDete();
            yearScroll.scrollTo(0, initY * 40, 100, true);
            monthScroll.scrollTo(0, initM * 40 - 40, 100, true);
            dayScroll.scrollTo(0, initD * 40 - 40, 100, true);
        }

        function refreshTime() {
            HourScroll.refresh();
            MinuteScroll.refresh();
            // SecondScroll.refresh();
            // if(initH>12){    //判断当前时间是上午还是下午
            //      SecondScroll.scrollTo(0, initD*40-40, 100, true);   //显示“下午”
            //      initH=initH-12-1;
            // }
            HourScroll.scrollTo(0, initH * 40 - 40, 100, true);
            MinuteScroll.scrollTo(0, initI * 40, 100, true);
            // initH = parseInt(nowdate.getHours());
        }

        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }

        function resetInitDete() {
            if (opts.curdate) {
                return false;
            } else if (that.val() === "") {
                return false;
            }
            initY = parseInt(that.val().substr(2, 2));
            initM = parseInt(that.val().substr(5, 2));
            initD = parseInt(that.val().substr(8, 2));
        }

        function bindButton() {
            resetIndex();
            $("#dateconfirm").unbind('click').click(function() {
                var datestr = "";
                // var years = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                // var month = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
                // var days = $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
                // var time = years + "-" + month + "-" + days;

                // datestr = time;

                // if (datetime) {

                //     var hours = $("#Hourwrapper ul li:eq(" + indexH + ")").html();
                //     var minutes = $("#Minutewrapper ul li:eq(" + indexI + ")").html();
                //     datestr += " " + hours.substr(0, hours.length - 1) + ":" + minutes.substr(0, minutes.length - 1);
                //     indexS = 0;
                // }

                if (opts.theme === "date") {
                    var years = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                    var month = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
                    var days = $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
                    var time = years + "-" + month + "-" + days;
                    // time = time.replace(/-/g, ':').replace(' ', ':');
                    // time = time.split(':');

                    datestr = time;
                } else if (opts.theme === "time") {
                    var hoursHtml = $("#Hourwrapper ul li:eq(" + indexH + ")").html();
                    var minutesHtml = $("#Minutewrapper ul li:eq(" + indexI + ")").html();
                    var hours = hoursHtml.substr(0, hoursHtml.length - 1);
                    var minutes = minutesHtml.substr(0, minutesHtml.length - 1);
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    // if (minutes < 10) {
                    //     minutes = "0" + minutes;
                    // }
                    datestr += hours + ":" + minutes;
                    indexS = 0;
                } else {
                    var years = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                    var month = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
                    var days = $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
                    var time = years + "-" + month + "-" + days;
                    // time = time.replace(/-/g, ':').replace(' ', ':');
                    // time = time.split(':');

                    datestr = time;
                    var hours = $("#Hourwrapper ul li:eq(" + indexH + ")").html();
                    var minutes = $("#Minutewrapper ul li:eq(" + indexI + ")").html();
                    datestr += " " + hours.substr(0, hours.length - 1) + ":" + minutes.substr(0, minutes.length - 1);
                    indexS = 0;
                }

                if (Ycallback === undefined) {
                    if (docType) {
                        that.val(datestr);
                    } else {
                        that.html(datestr);
                    }
                } else {
                    Ycallback(datestr);
                }
                if(opts.isShow){
                    $("#datePage").hide();
                    $("#dateshadow").hide();
                }else{
                    $("#datePage").remove();
                    $("#dateshadow").remove();
                }
                
            });
            $("#datecancle").click(function() {
                $("#datePage").hide();
                $("#dateshadow").hide();
                // Ncallback(false);
            });
        }

        function extendOptions() {
            $("#datePage").show();
            $("#dateshadow").show();
        }
        //日期滑动
        function init_iScrll() {
            var strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
            var strM = $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1)
            yearScroll = new iScroll("yearwrapper", {
                snap: "li",
                vScrollbar: false,
                fixedScrollbar: true,
                onScrollEnd: function() {
                    indexY = (this.y / 40) * (-1) + 1;
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }
            });
            monthScroll = new iScroll("monthwrapper", {
                snap: "li",
                vScrollbar: false,
                fixedScrollbar: true,
                onScrollEnd: function() {
                    indexM = (this.y / 40) * (-1) + 1;
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                }
            });
            dayScroll = new iScroll("daywrapper", {
                snap: "li",
                vScrollbar: false,
                fixedScrollbar: true,
                onScrollEnd: function() {
                    indexD = (this.y / 40) * (-1) + 1;
                }
            });
        }

        function showdatetime() {
            init_iScroll_datetime();
            addTimeStyle();
            $("#datescroll_datetime").show();
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
            // $("#Secondwrapper ul").html(createSECOND_UL());
        }

        function showTime() {
            init_iScroll_datetime();
            addTimeStyles();
            $("#datescroll").hide();
            $("#datescroll_datetime").show();
            $("#Hourwrapper ul").html(createHOURS_UL());
            $("#Minutewrapper ul").html(createMINUTE_UL());
        }
        //日期+时间滑动
        function init_iScroll_datetime() {
            HourScroll = new iScroll("Hourwrapper", {
                snap: "li",
                vScrollbar: false,
                fixedScrollbar: true,
                onScrollEnd: function() {
                    indexH = Math.round((this.y / 40) * (-1)) + 1;
                    HourScroll.refresh();
                }
            })
            MinuteScroll = new iScroll("Minutewrapper", {
                    snap: "li",
                    vScrollbar: false,
                    fixedScrollbar: true,
                    onScrollEnd: function() {
                        indexI = Math.round((this.y / 40) * (-1)) + 1;
                        HourScroll.refresh();
                    }
                })
                // SecondScroll = new iScroll("Secondwrapper",{snap:"li",vScrollbar:false,
                //     onScrollEnd:function () {
                //         indexS = Math.round((this.y/40)*(-1));
                //         HourScroll.refresh();
                // }})
        }

        function checkdays(year, month) {
            var new_year = year; //取当前的年份        
            var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）        
            if (month > 12) //如果当前大于12月，则年份转到下一年        
            {
                new_month -= 12; //月份减        
                new_year++; //年份增        
            }
            var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天        
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期    
        }

        function createUL() {
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            $("#monthwrapper ul").html(createMONTH_UL());
            $("#daywrapper ul").html(createDAY_UL());
        }

        function CreateDateUI() {
            var str = '' +
                '<div id="dateshadow"></div>' +
                '<div id="datePage" class="page">' +
                '<div>' +
                '<div id="datetitle"><h1>请选择日期</h1></div>' +
                '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
                '<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>' +
                '<div id="datescroll">' +
                '<div id="yearwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="monthwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="daywrapper">' +
                '<ul></ul>' +
                '</div>' +
                '</div>' +
                '<div id="datescroll_datetime">' +
                '<div id="Hourwrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="Minutewrapper">' +
                '<ul></ul>' +
                '</div>' +
                // '<div id="Secondwrapper">'+
                //     '<ul></ul>'+
                // '</div>'+
                '</div>' +
                '</div>' +
                '<div id="dateFooter">' +
                '<div id="setcancle">' +
                '<ul>' +
                '<li id="dateconfirm">确定</li>' +
                '<li id="datecancle">取消</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>'
            $("body").append(str);
        }

        function addTimeStyle() {
            $("#datePage").css("height", "380px");
            $("#datePage").css("top", "60px");
            $("#yearwrapper").css("position", "absolute");
            $("#yearwrapper").css("bottom", "200px");
            $("#monthwrapper").css("position", "absolute");
            $("#monthwrapper").css("bottom", "200px");
            $("#daywrapper").css("position", "absolute");
            $("#daywrapper").css("bottom", "200px");
        }

        function addTimeStyles() {
            $("#datePage").css("height", "240px");
            $("#datePage").css("top", "60px");
            $("#timemark").hide();
            $("#Hourwrapper, #Minutewrapper").css({
                "top": "60px",
                "bottom": "60px"
            });
        }
        //创建 --年-- 列表
        function createYEAR_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + '年</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --月-- 列表
        function createMONTH_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + '月</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --日-- 列表
        function createDAY_UL() {
            $("#daywrapper ul").html("");
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginday; i <= opts.endday; i++) {
                str += '<li>' + i + '日</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --时-- 列表
        function createHOURS_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginhour; i <= opts.endhour; i++) {
                str += '<li>' + i + '时</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --分-- 列表
        function createMINUTE_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginminute; i <= opts.endminute; i++) {
                var minutes = i * 5;
                if (minutes < 10) {
                    minutes = "0" + minutes
                }
                str += '<li>' + minutes + '分</li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
        //创建 --分-- 列表
        function createSECOND_UL() {
            var str = "<li>&nbsp;</li>";
            str += "<li>上午</li><li>下午</li>"
            return str + "<li>&nbsp;</li>";;
        }
    }
})(jQuery);