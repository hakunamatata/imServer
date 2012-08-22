

(function ($, scope) {
    var grow_animate,
        options = {
            scrollStep: 80,
            animateDelay: 250,
            scaleRate: 1.5
        }

    $.fn.grow = function () {
        var oriSize = parseInt(this.css('fontSize'));
        return this.each(function (i, e) {
            $(e).mouseover(grow_animate($(e), oriSize * options.scaleRate)).mouseout(grow_animate($(e), oriSize));
        });
    };

    grow_animate = function (that, size) {
        return function () {
            that.animate({
                fontSize: size
            }, options.animateDelay);
        }
    };

    var clearSelect;
    $.fn.asMenu = function () {
        var that = this;
        this.click(function () {
            var temp = $(this).attr('data-jade'),
                cName = $(this)[0].className;

            if (!cName) {
                clearSelect(that);
                $(this.parentNode).addClass('dif');
                if (temp) {
                    mainScrollWindow.render({
                        url: '/jade/imadmin/' + temp + '.jade'
                    });
                }
            };
        });
		return this;
    };

    clearSelect = function (that) {
        if (lastScrollWindow) lastScrollWindow .removeAll();
        that.each(function () {
            $(this.parentNode).removeClass('dif');
        });
    }




    var 
    	Class,
    	swTemp = [
    		"<div class='subwindow'>",
    			"<div class='subg' onclick='lastScrollWindow.close()'></div>",
    			"<div class='submain'>",
					"<div class='submaincontent'></div>",
    			"</div>",
    		"</div>"
    	].join(''),
    	submainContent,



	Class = function (parent) {
	    var klass = function () {
	        this.init.apply(this, arguments);
	    };
	    if (parent) {
	        var subclass = function () { };
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

        init: function (that) {

            if (typeof that === 'string') {

                this.context = $(that);

                this.context.attr('data-dep', 0);

                this.parentWindow = this;

                this.id = 'mainWindow';

                scope.mainScrollWindow = this;

            } else {

                this.parentWindow = that;

                var frame = $(swTemp),
					submain = frame.find('.submain'),
					parentDepth = this.parentWindow.depth();
                submain.find('.submaincontent').html(submainContent);

                frame[0].id = this.parentWindow.context.attr('id') + '_sub';
                this.id = this.parentWindow.id + "_sub";
                submain.css('margin-left', options.scrollStep * parentDepth);
                frame.appendTo(this.parentWindow.context);
                submain.animate({
                    'opacity': 1,
                    'margin-left': options.scrollStep * ++parentDepth
                }, options.animateDelay);

                this.context = frame;

                this.context.attr('data-dep', parentDepth)

            }

            scope.lastScrollWindow = this;

        },

        create: function (opts) {
            var that = this;
            if (opts)
                if (typeof opts[0] === 'undefined') {
                    $.get(opts.url, function (data) {
                        submainContent = data;
                        return new $scrollWindow(that);
                    });
                } else {
                    submainContent = opts[0].innerHTML;
                    return new $scrollWindow(that);
                }

        },

        close: function () {

            var that = this,
				sub_main = that.context.find('.submain');
            sub_main.animate({
                'opacity': 0,
                'margin-left': this.parentWindow.depth() * options.scrollStep
            }, options.animateDelay, function () {
                that.remove();
            });

            scope.lastScrollWindow = this.parentWindow;
        },

        depth: function () {
            return parseInt(this.context.attr('data-dep'));
        },

        render: function (opts) {
            var context = this.context[0];
            if (opts)
                if (typeof opts[0] === 'undefined') {
                    $.get(opts.url, function (data) {
                        $(context).find('.submaincontent').html(data);
                    });
                } else {
                    $(context).find('.submaincontent').html(opts[0].innerHTML);
                }
        },
        remove: function () {
            lastScrollWindow = this.parentWindow;
            this.context.remove();
            delete this;
        },

        removeAll: function () {
            var that = this;
            while (that.id != 'mainWindow') {
                console.log(this);

                that.remove();
                that = that.parentWindow;
            };
        }
    });

    scope.scrollWindow = $scrollWindow;


    /**
    *
    *	用户页面基本操作
    *
    */

    var userInterface = {
    
    	init: function(){
    	    $('li a').grow().asMenu()[0].click();
    	},

        documentPublish: function () {
            var title = $('#title').val(),
				category = $('#category').val();

            if (!editor) throw "文档编辑器('Ueditor')加载失败";

            $.post('/user/addoc', {
                title: title,
                category: category,
                content: editor.getContent()
            }, function (res) {
                if (!res.err) {
                    alert(res.responseText);
                }
            });
        },
        
        projectPost: function(){
        	$.post('/user/addProject',{
        		projName: $('#projectName').val()
        	}, function(res){
        		if(!res.err){
        			alert(res.responseText);
        		};
        		
        	})
        },

        exit: function () {
            location.href = '/exit';
        },

        logout: function () {
            location.href = '/logout';
        },
        
        menus: function(){
        	return $('li a');
        },
        
        inputButtonCall: function(that, callback){
        	var script = new Function('userInterface.' + callback ),
        		text = $($(that).siblings()[0]);
        		button = $($(that).siblings()[1]);
        		
        	text.show();
        	text.animate({
        		width:150
        	},500, function(){
        		text.val('');
        		$(that).hide();
        		$(button).show();
        		
        	});

        }


    }
    scope.userInterface = userInterface;

})(jQuery, window);


$(document).ready(function () {
    new scrollWindow('.ScrollWindowMain');
	userInterface.init();
});
