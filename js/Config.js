// js/Config.js

define(function (require, exports, module) {
	
	module.exports = {

		status : {
			open : "open",
			closed : "closed",
			end : "end",
			start : "start",
			progress : "progress",
			isOut : 'out',
			isIn : 'in'
		},

		direction : {
			up : 'up',
			down : 'down',
			left : 'left',
			right : 'right'
		},

		animationType : 'fade',

		animation : {
			slide : 'slide',
			fade : 'fade'
		},

		interval : 3000,
		speed : 1500
	};

});