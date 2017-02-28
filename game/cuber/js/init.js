define(function(require, exports, module){
	function initBox(){
		var wp = $("#gameland");
		var dftbox = wp.find(".cube-0");
		var initRotate = {
			x : -45,
			y : -45
		};
		dftbox.on("mousedown", function(ev){
			var oEvent = ev||event;
			var dx = oEvent.clientX;
			var dy = oEvent.clientY;
			var ix = initRotate.y;
			var iy = initRotate.x;
			document.onmousemove = function(ev)
			{
				var oEvent = ev || event;
				initRotate.x = dy - oEvent.clientY + iy;
				initRotate.y = oEvent.clientX - dx + ix;
				dftbox.get(0).style.transform = 'perspective(800px) ' + 
				'rotateX(' + initRotate.x + 'deg) ' + 
				'rotateY(' + initRotate.y + 'deg)';
			};
			document.onmouseup = function()
			{
				document.onmousemove = null;
				document.onmouseup = null;
			};
			return false;
		});
	}
	initBox();

	module.exports = initBox;

});