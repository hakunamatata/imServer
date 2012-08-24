

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
        if (lastScrollWindow) lastScrollWindow.removeAll();
        that.each(function () {
            $(this.parentNode).removeClass('dif');
        });
    }

    //    /**
    //    *   表单转为JSON
    //    */
    //    var sequ;
    //    $.fn.table2Json = function () {
    //        var th = this.find('th'),
    //            properties = sequ(th),

    //            tr = this.find('tr'),
    //            serial = [];

    //        for (var i = 1; i < tr.length; i++) {
    //            var obj = {},
    //                td = $(tr[i]).find('td');
    //            for (var j = 0; j < td.length; j++) {
    //                var str;
    //                switch (properties[j].ctrl) {
    //                    case 'radio':
    //                        str = $(td[j]).find('input:radio')[0].checked
    //                        break;
    //                    default:
    //                        str = $(td[j]).text();
    //                        break;
    //                }

    //                // type 类型可能有：String, Number, Date, Boolean, Float
    //                switch (properties[j].type) {
    //                    case 'String':
    //                        obj[properties[j].prop] = str;
    //                        break;

    //                    case 'Number':
    //                        obj[properties[j].prop] = parseInt(str);
    //                        break;

    //                    case 'Float':
    //                        obj[properties[j].prop] = parseFloat(str);
    //                        break;

    //                    case 'Boolean':
    //                        obj[properties[j].prop] = str === 'true' ? true : str === 'false' ? false : Boolean(str);
    //                        break;

    //                    case 'Date':
    //                        obj[properties[j].prop] = new Date(parseInt(str));
    //                        break;
    //                }
    //            }
    //            serial.splice(i - 1, 1, obj);
    //        }
    //        return serial;
    //    };


    //    sequ = function (that) {
    //        var q = [];
    //        that.each(function (i, e) {
    //            q.splice(i, 1, {
    //                prop: $(e).attr('data-name'),
    //                type: $(e).attr('data-type'),
    //                ctrl: $(e).attr('data-ctrl')
    //            });
    //        });
    //        return q;
    //    };

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
    *   函数优化
    *
    */

    //    Date.prototype.format = function (str) {
    //        str = Replace(str, "yyyy", this.getFullYear());
    //        str = Replace(str, "MM", this.getMonth());
    //        str = Replace(str, "dd", this.getDay());
    //    }

    /**
    *
    *	用户页面基本操作
    *
    */

    var userInterface = {

        // 初始化
        init: function () {
            var menus = $('li a').grow().asMenu();
            $(menus[0]).click();
        },

        // 发布文档
        documentPublish: function () {
            var that = this,
            	title = $('#title').val(),
				category = $('#category').val();

            if (!editor) throw "文档编辑器('Ueditor')加载失败";

            $.post('/user/addoc', {
                title: title,
                category: category,
                content: editor.getContent()
            }, function (res) {
                if (!res.err) {
                    lastScrollWindow.remove();
                    that.getDocuments();
                }
            });
        },

        // 添加项目
        projectPost: function () {
            var that = this;
            $.post('/user/addProject', {
                projName: $('#projectName').val()
            }, function (res) {
                $('#projectTable').html(res);
            })
        },

        projectDefault: function (that) {
            var text = $('.projectName', $(that).parent()).text();
            $.post('/user/projectDefault', {
                projName: text
            }, function (res) {
                $('#projectTable').html(res);
            })
        },

        // 获取文档
        getDocuments: function () {
            $.get('/user/getdocuments', function (temp) {
                $('#documentTable').html(temp);
            })
        },

        exit: function () {
            location.href = '/exit';
        },

        logout: function () {
            location.href = '/logout';
        },

        inputButtonCall: function (that, callback) {
            var text = $($(that).siblings()[0]);
            button = $($(that).siblings()[1]);

            text.show();
            text.animate({
                width: 150
            }, 500, function () {
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
