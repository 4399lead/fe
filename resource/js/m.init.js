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

    /*文档*/
    var docSource = $("#j-doc-template").html();
    var docTemplate = Handlebars.compile(docSource);
    var docTpl =  docTemplate(_mData);
    $("#j-doc").html(docTpl);

    /*项目构建*/
    var projectSource = $("#j-project-template").html();
    var projectTemplate = Handlebars.compile(projectSource);
    var projectTpl =  projectTemplate(_mData);
    $("#j-project").html(projectTpl);


});
