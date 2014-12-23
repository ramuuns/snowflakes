(function(window,undefined){

	var script_path = '';
	var scripts = document.getElementsByTagName("script");
	for ( var i = 0, l = scripts.length; i < l; i++ ) {
		if ( scripts.item(i).src.match(/snowflakes(\.min)?.js/) ) {
			script_path = scripts.item(i).src.split("snowflakes.")[0];
			break;
		}
	}

	var flakes_path = script_path + '/img/';

	var canvas, ctx;
	var defaults = {
		amount: 250,
		nuclearMode : false,
		color: "#fff"
	};
	var options = {};

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
		preloadFlakes(function(){
			initFlakes();
			window.requestAnimationFrame(draw);
		});
	}

	window.onresize = function() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	};

	var flakeImgs = [];
	var flakes_to_load = 0;

	var preloadFlakes = function(cb){
		flakes_to_load = 200;
		for ( var i = 1; i < flakes_to_load + 1/*01*/; i++ ) {
			(function(i){
				var f = new Image();

				f.onload = function() {
					flakes_to_load--;
					var c = document.createElement("canvas");
					c.width = 50;
					c.height = 50;
					con = c.getContext("2d");
					con.drawImage(f,0,0,50,50);
					flakeImgs.push(c);
					if ( flakes_to_load === 0 ) {
						cb();
					}
				};
				f.src = flakes_path + 'sniegparsla ('+i+').svg';
			})(i);
		}
	};

	var flakes = [];

	var randomColor = function() {
		return "rgb("+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+","+Math.floor(Math.random()*256)+")";
	}

	var createFlake = function(first){
		first = first || false;
		var f = {
			x : Math.floor(Math.random()*canvas.width),
			y : first ? Math.floor(Math.random()*canvas.height) : 0,
			o : 0,
			flake : flakeImgs[Math.floor(Math.random()*flakeImgs.length)],
			sign : Math.random() > 0.5 ? 1 : -1,
			speed : 0.5 + Math.random(),
			amplitude : 10 + Math.random() * 4,
			size: 10 + Math.floor(Math.random() * 16),
			width:0,
			blink_variance : Math.random()*10,
			angle : Math.random() * Math.PI,
			spin : (Math.random() > 0.5 ? -1 : 1 ) * Math.random()*0.05
		};
		if ( options.nuclearMode || options.color !== defaults.color ) {
			var c = document.createElement("canvas");
			c.width = 50;
			c.height = 50;
			con = c.getContext("2d");
			con.drawImage(f.flake,0,0,50,50);

			con.fillStyle = options.nuclearMode ? randomColor() : options.color;
			con.globalCompositeOperation = "source-in";
			con.fillRect(0, 0, 50, 50);
			f.flake = c;
		}

		f.o = f.x;
		f.width = f.size * Math.random();
		return f;
	};

	var dir = 1;

	var initFlakes = function(){
		for ( var i = 0; i < options.amount; i++ ) {
			flakes.push(createFlake(true));
		}
	};

	var updateFlakes = function() {
		if ( Math.random() > 0.99 ) {
			dir = !dir ? (Math.random() > 0.5 ? -1 : 1) : 0;
		}
		for ( var i = 0, l = flakes.length; i < l; i++ ) {
			if ( flakes[i].size > 20 ) {
				flakes[i].o += dir*0.5;
			}
			flakes[i].y += flakes[i].speed * flakes[i].size/18 * flakes[i].size/18;
			flakes[i].x = flakes[i].o + flakes[i].sign * Math.sin(flakes[i].y/20) * flakes[i].amplitude;
			flakes[i].angle += flakes[i].spin;
			flakes[i].width = Math.abs(Math.sin(flakes[i].y/20)*flakes[i].size)
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
			ctx.globalAlpha = (1 - flakes[i].y / canvas.height) * (0.4 + 0.6*Math.abs(Math.sin(flakes[i].y/(20+flakes[i].blink_variance))));
			//console.log(ctx.globalAlpha);
			ctx.translate(flakes[i].x ,flakes[i].y);
			ctx.rotate(flakes[i].angle);
			ctx.drawImage(flakes[i].flake,-flakes[i].size/2, -flakes[i].width/2, flakes[i].size,flakes[i].width);

			//ctx.rotate(-flakes[i].angle);
			ctx.restore();
		}
	};

	var draw = function(){
		updateFlakes();
		drawFlakes();
		window.requestAnimationFrame(draw);
	};

	var constr = function(opts) {
		options.amount = opts && opts.amount && typeof opts.amount === typeof defaults.amount ? opts.amount : defaults.amount;
		options.nuclearMode = opts && opts.nuclearMode && typeof opts.nuclearMode === typeof defaults.nuclearMode ? opts.nuclearMode : defaults.nuclearMode;
		options.color = opts && opts.color && typeof opts.color === typeof defaults.color ? opts.color : defaults.color;
		init();
	};



	window.snowflakes = constr;

})(this);
