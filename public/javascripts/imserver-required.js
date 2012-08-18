

(function ($, scope) { 
    var grow_animate;    	
    	
    $.fn.grow = function(){
        var oriSize = parseInt(this.css('fontSize').match(/[0-9]+/));
        return this.each(function(i , e){
            $(e).mouseover(grow_animate($(e), oriSize * 1.6, 'up')).mouseout(grow_animate($(e), oriSize, 'down' ));
        });
    };
            	
    grow_animate = function(that, size, method){
    	return function(){
        	that.animate({
            	fontSize: size
            });
        }
	};
			
	
	
	var 
    	Class,
    	swTemp = [
    		"<div class='subwindow'>",
    			"<div class='subg' onclick='lastScrollWindow.close()'></div>",
    			"<div class='submain'>",
    				"<span onclick='lastScrollWindow.create()'>x</span>",
					"<div class='submaincontent'></div>",
    			"</div>",
    		"</div>"
    	].join(''),
    	submainContent,
    	options = {
    		scrollStep: 100
    	}
    	
    	
	Class = function (parent) {
	    var klass = function () {
	        this.init.apply(this, arguments);
	    };
		if(parent){
			var subclass = function(){};
			subclass.prototype = parent.prototype;
			klass.prototype = new subclass;
		};		
	    klass.prototype.init = function () { };
	    klass.fn = klass.prototype;
	    klass.fn.parent = klass;
	    klass._super = klass.__proto__;
	    klass.extend = function (obj) {
	        var extended = obj.exnteded;
	        for (var i in obj)
	            klass.fn[i] = obj[i];
	        if (extended) extended(klass);
	    };
	    return klass;
	};
	
	var $scrollWindow = new Class;
	
	$scrollWindow.extend({
	
		init: function(that){
			
			if(typeof that === 'string'){
			
				this.context = $(that);
			
				this.context.attr('data-dep', 0);
				
				this.parentWindow = this;
			
			
			} else {
				
				this.parentWindow = that;

				var frame = $(swTemp),
					submain = frame.find('.submain'),
					parentDepth = this.parentWindow.depth();
					submain.find('.submaincontent').html(submainContent);
				frame[0].id=this.parentWindow.context.attr('id') + '_sub';
				submain.css('margin-left', options.scrollStep * parentDepth);
				frame.appendTo(this.parentWindow.context);
				submain.animate({
					'opacity': 1,
					'margin-left': options.scrollStep * ++parentDepth
				});
				
				this.context = frame;
				
				this.context.attr('data-dep', parentDepth)

			}
			
			scope.lastScrollWindow = this;
			
		},
		
		create: function(opts){
		
			if(opts)
				if(typeof opts[0] === 'undefined'){
					$.get(opts.url, function(data){
						submainContent = data;
					});
				} else {
					submainContent = opts[0].innerHTML;
				}
			return new $scrollWindow(this);
		},
		
		close: function(){
			
			var that = this,
				sub_main = that.context.find('.submain');
				sub_main.animate({
					'opacity': 0,
					'margin-left': this.parentWindow.depth() * options.scrollStep
				},500, function(){
					that.context.remove();
					delete that;
				});
				
			scope.lastScrollWindow = this.parentWindow;
		},
		
		depth: function(){
			return parseInt(this.context.attr('data-dep'));
		}
	});
		
	scope.scrollWindow = $scrollWindow;
			
})(jQuery, window);



