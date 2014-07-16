/*
* 介绍页模块列表
* */
define(function(require,exports,module){
    var jquery = require('jquery');
    var handlebars = require('handlebars');
    var _mData = require('./m.data.js');

    /*通用模块*/
    var htmlSource = $("#j-html-template").html();
    var htmlTemplate = Handlebars.compile(htmlSource);
    var htmlTpl =  htmlTemplate(_mData);
    $("#j-html").html(htmlTpl);

    /*js插件*/
    var jsSource = $("#j-js-template").html();
    var jsTemplate = Handlebars.compile(jsSource);
    var jsTpl =  jsTemplate(_mData);
    $("#j-js").html(jsTpl);
	
	/*工具插件*/
    var toolSource = $("#j-tool-template").html();
    var toolTemplate = Handlebars.compile(toolSource);
    var toolTpl =  toolTemplate(_mData);
    $("#j-tool").html(toolTpl);

    /*
    function pageScroll(hash,target){
        if(!hash){
            hash = "#project";
        }
        var _hashScrollTop = $(hash).offset().top;
        $('html,body').animate({
            scrollTop : _hashScrollTop+"px"
        },500,function(){
            var _target = target.parent('li');
            _target.addClass('cur');
            _target.siblings().removeClass('cur')
        });
    }
    $("#j-step").bind('click',function(e){
        var _hash = $(e.target).attr('href');
        pageScroll(_hash, $(e.target));
    });

    $(function(){
        var _hash = window.location.hash;
        var _selector = $("#j-step").find('a');
        function getIndex(){
            for(var i= 0,len=_selector.length;i<len;i++){
                var _current = _selector.eq(i).attr('href');
                if(_current == _hash){
                    return i;
                }
            }
        }
        var _index = getIndex();
        pageScroll(_hash,_selector.eq(_index));
    })*/

});
