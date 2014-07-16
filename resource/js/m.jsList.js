/*
* 介绍页模块列表
* */
define(function(require,exports,module){
    var jquery = require('jquery');
    var handlebars = require('handlebars');
    var _mjsList = require('./m.javascript.js');

    /*通用模块*/
    var htmlSource = $("#j-jslist-template").html();
    var htmlTemplate = Handlebars.compile(htmlSource);
    var htmlTpl =  htmlTemplate(_mjsList);
    $("#j-jslist").html(htmlTpl);
});
