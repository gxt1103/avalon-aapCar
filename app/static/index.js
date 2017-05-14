import 'avalon2';
import './lib/swipe';
import './lib/tap';
import './lib/jquery';
import './lib/date';
import './lib/iscroll';

avalon.filters.formTime = function(time) {
	time = time.replace(/-/g, ':').replace(' ', ':');
	time = time.split(':');
	var times = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
	var weeks = new Array("日", "一", "二", "三", "四", "五", "六");
	var days = times.getDay();
	var weekDay = "周" + weeks[days];
	var hours = times.getHours();
	var minutes = times.getMinutes();
	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	var dateTime = times.getMonth() + 1 + "月" + times.getDate() + "日（" + weekDay + "）" + " " + hours + ":" + minutes;
	return dateTime;
};