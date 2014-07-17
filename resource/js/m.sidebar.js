/*
* 前端通用模块侧栏
* */
define(function(require,exports,module){
    var jquery = require('jquery');
    var _mData = require('./m.data.js');

    var JKS = JKS || {};
    JKS.html = function(tag){
        var _html = '<div class="jks_title">';
        _html += '<a href="/" class="logo">JKS<span>通用模块</span></a>';
        _html += '</div>';
        _html += '<div class="jks_list">';
        _html += '<ul class="m_plugin_list">';
        for( var m in _mData.html){
            var _data = _mData.html[m];
            var _tag = _data['curTag'] == tag ? "cur" : "";
            _html +='<li class='+_tag+'><a href="'+_data['href']+'">'+_data['title']+'</a></li>';
        }
        _html += '</ul>';
        _html += '</div>';
        $("#j-m-sidebar").html(_html);
    };
    JKS.js = function(){
        var _html = '<div class="jks_title">';
        _html += '<a href="/" class="logo">JKS<span>js组件</span></a>';
        _html += '</div>';
        _html += '<div class="jks_list">';
        _html += '<ul class="m_plugin_list">';
        for( var m in _mData.js){
            var _data = _mData.js[m];
            //var _tag = _data['curTag'] == tag ? "cur" : "";
            _html +='<li><a href="#js'+m+'">'+_data['title']+'</a></li>';
        }
        _html += '</ul>';
        _html += '</div>';
        $("#j-m-sidebar").html(_html);
    };
    module.exports = JKS;
});
