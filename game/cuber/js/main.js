define(function(require, exports, module){
	require('jquery');

	(function($){
		

		var game = {};
		game.setDft = function(config){
			this.dft = {
				wp : '#gameland',
				cube : 'cube',
				face : 'face',
				cubeDefult : 'cube-0',
				color : ['red', 'green', 'brown', 'orange', 'brown', 'gold',
					'gray', 'black'],
				opacity : '1',
				perspective : '800',
				size : 100, //方块大小
				initRotate : {
					x : -45,
					y : -45
				}
			};
			game.dft = $.extend(game.dft, config);
		}

		game.init = function(config){
			this.setDft(config);
			var $playground = $(game.dft.wp);
			var $cubeDefult = $('<div></div>').addClass(game.dft.cube + ' ' + game.dft.cubeDefult);

			$cubeDefult.appendTo($playground);

			var $cube0 = createCube(game.dft.cube);
			addAxis($cube0, {x : 0, y : 0, z : 0 });
			$cube0.appendTo($cubeDefult);

			var $cubes = $('.' + game.dft.cube);

			$playground.on('click', '.' + game.dft.cube, function(e){
				e.stopPropagation();
				e.preventDefault();

				var _this = $(this);
				var thisAxis = getAxis(_this);
				var face = _this.find(e.target);
				var facePos = getFacePos(face);
				var newCube = createCube(game.dft.cube);
				var newAxis = moveCube(newCube, thisAxis, facePos);
				addAxis(newCube, newAxis);
				newCube.appendTo($cubeDefult);
			});

			$cubeDefult.on("mousedown", function(ev){
				var oEvent = ev||event;
				var dx = oEvent.clientX;
				var dy = oEvent.clientY;
				var ix = game.dft.initRotate.y;
				var iy = game.dft.initRotate.x;
				document.onmousemove = function(ev)
				{
					var oEvent = ev || event;
					game.dft.initRotate.x = dy - oEvent.clientY + iy;
					game.dft.initRotate.y = oEvent.clientX - dx + ix;
					$cubeDefult.get(0).style.transform = 'perspective(800px) ' + 
					'rotateX(' + game.dft.initRotate.x + 'deg) ' + 
					'rotateY(' + game.dft.initRotate.y + 'deg)';
				};
				document.onmouseup = function()
				{
					document.onmousemove = null;
					document.onmouseup = null;
				};
				return false;
			});
		}

		var createCube = function(cls){
			var ele = $('<div></div>').addClass(cls);
			createFace('front').appendTo(ele);
			createFace('back').appendTo(ele);
			createFace('top').appendTo(ele);
			createFace('bottom').appendTo(ele);
			createFace('left').appendTo(ele);
			createFace('right').appendTo(ele);
			return ele;
		}

		var createFace = function(pos){
			return $('<span></span>').addClass(game.dft.face + ' ' + pos);
		}

		var addAxis = function(ele, obj){
			ele.attr("data-x", obj.x);
			ele.attr("data-y", obj.y);
			ele.attr("data-z", obj.z);
		}

		var getAxis = function(ele){
			return {
				x : ele.data("x"),
				y : ele.data("y"),
				z : ele.data("z")
			}
		}

		var getFacePos = function(face){
			if(face.hasClass('top')){
				return 'top';
			}else if(face.hasClass('bottom')){
				return 'bottom';
			}else if(face.hasClass('front')){
				return 'front';
			}else if(face.hasClass('back')){
				return 'back';
			}else if(face.hasClass('left')){
				return 'left';
			}else if(face.hasClass('right')){
				return 'right';
			}else{
				return false;
			}
		}

		var moveCube = function(cube, fAxis, pos){
			var translate = {
				x : game.dft.size * fAxis.x,
				y : game.dft.size * fAxis.y,
				z : game.dft.size * fAxis.z,
			};
			var sonAxis = fAxis;
			switch(pos){
				case 'top':
					translate.y -= game.dft.size;
					sonAxis.y--;
					break;
				case 'bottom':
					translate.y += game.dft.size;
					sonAxis.y++;
					break;
				case 'front':
					translate.z += game.dft.size;
					sonAxis.z++;
					break;
				case 'back':
					translate.z -= game.dft.size;
					sonAxis.z--;
					break;
				case 'left':
					translate.x -= game.dft.size;
					sonAxis.x--;
					break;
				case 'right':
					translate.x += game.dft.size;
					sonAxis.x++;
					break;
			}
			cube.css({ 
				'transform' : 'translate3d(' + 
					translate.x + 'px, ' + 
					translate.y + 'px, ' + 
					translate.z + 'px)' 
			});
			return sonAxis;
		}

		module.exports = game;

	})(jQuery)

});