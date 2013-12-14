(function(window,undefined){

	var script_path = '';
	var scripts = document.getElementsByTagName("script");
	for ( var i = 0, l = scripts.length; i < l; i++ ) {
		if ( scripts.item(i).src.match(/snowflakes.js/) ) {
			script_path = scripts.item(i).src.split("snowflakes.js")[0];
			break;
		}
	}

	var flakes_path = script_path + '/img/';

	var canvas, ctx;

	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); };
	}

	(function() {
	    var vendors = ['webkit', 'moz'];
	    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	        var vp = vendors[i];
	        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
	                                   || window[vp+'CancelRequestAnimationFrame']);
	    }
	    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
	        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	        var lastTime = 0;
	        window.requestAnimationFrame = function(callback) {
	            var now = Date.now();
	            var nextTime = Math.max(lastTime + 16, now);
	            return setTimeout(function() { callback(lastTime = nextTime); },
	                              nextTime - now);
	        };
	        window.cancelAnimationFrame = clearTimeout;
	    }
	}());

	var init = function() {
		canvas = document.createElement("canvas");
		if ( !(canvas.getContext && canvas.getContext("2d")) ) {
			return;
		}
		ctx = canvas.getContext("2d");
		canvas.style.position = "fixed";
		canvas.style.width = "100%";
		canvas.style.height = "100vh";
		canvas.style.top = "0px";
		canvas.style.left = "0px";
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.pointerEvents = "none";
		//canvas.style.backgroundColor = "transparent";
		canvas.style.zIndex = "100000";
		document.body.appendChild(canvas);
		preloadFlakes();
		initFlakes();
		window.requestAnimationFrame(draw);
		console.log(canvas.width);
		console.log(canvas.height);
	}

	window.onresize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;	
	};

	var flakeImgs = [];

	var preloadFlakes = function(){
		for ( var i = 1; i < 2/*01*/; i++ ) {
			(function(i){
				var f = new Image();
				f.src = flakes_path + 'sniegparsla ('+i+').svg';
				flakeImgs.push(f);
			})(i);
		}
	};

	var flakes = [];

	var createFlake = function(first){
		first = first || false;
		var f = {
			x : Math.floor(Math.random()*canvas.width),
			y : first ? Math.floor(Math.random()*canvas.height) : 0,
			o : 0,
			flake : flakeImgs[Math.floor(Math.random()*flakeImgs.length)],
			sign : Math.random() > 0.5 ? 1 : -1,
			speed : 0.5 + Math.random(),
			amplitude : 10 + Math.random() * 3,
			size: 10 + Math.floor(Math.random() * 15)
		};
		f.o = f.x;
		return f;
	};

	var initFlakes = function(){
		for ( var i = 0; i < 100; i++ ) {
			flakes.push(createFlake(true));
		}
	};

	var updateFlakes = function() {
		for ( var i = 0, l = flakes.length; i < l; i++ ) {
			flakes[i].y += flakes[i].speed;
			flakes[i].x = flakes[i].o + flakes[i].sign * Math.sin(flakes[i].y/20) * flakes[i].amplitude;
			if ( flakes[i].y > canvas.height ) {
				flakes[i] = null;
				flakes[i] = createFlake();
			}
		}
	};

	var drawFlakes = function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for ( var i = 0, l = flakes.length; i < l; i++ ) {
			ctx.save();
			ctx.globalAlpha = (1 - flakes[i].y / canvas.height);
			//console.log(ctx.globalAlpha);
			ctx.drawImage(flakes[i].flake,flakes[i].x - flakes[i].size/2, flakes[i].y - flakes[i].size/2, flakes[i].size,flakes[i].size);
			ctx.restore();
		}
	};

	var draw = function(){
		updateFlakes();
		drawFlakes();
		window.requestAnimationFrame(draw);
	};

	var constr = function() {
		init();
	};



	window.snowflakes = constr;

})(this);