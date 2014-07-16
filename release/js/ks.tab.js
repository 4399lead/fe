/**
 * @description    : tab切换组件 ue.tab
 * @author         : chenxizhong@4399.net
 * @change details : 2012-12-21 created by czonechan
 * @parameter      : 
 * @details        :
 */
 define(function(require,exports,module){
     var noop = function(){};

     function ctor(options){
         var defaults = {
             tab : $(),//tab选项对象
             defaultIndex : 0,//默认显示的选项
             tabCurrentClass : "",//当前选项的class
             only : true,//是否只能有一个tab是可见的
             content : $(),//tab内容对象
             trigger : "click",//触发tab切换的事件类型
             beforeSwitch : noop,//切换之前回调函数
             afterSwitch : noop,//切换之后回调函数
             beforeShow : noop,//显示之前回调函数
             afterShow : noop//显示之后回调函数
         };

         this.options = options = $.extend(defaults, options);
         this.init();
     }

     ctor.prototype = {
         init : function(){
             var _this = this,
                 options = this.options;

             this.switchTab(options.defaultIndex);
             this.showContent(options.defaultIndex);

             options.tab.bind(options.trigger, function(){
                 var index = options.tab.index($(this)),
                     is_open = $(this).hasClass("cur");

                 _this.switchTab(index, is_open);
                 _this.showContent(index, is_open);
                 return false;
             })
         },

         switchTab : function(index, is_open){
             var _this = this,
                 options = this.options;

             if(index < 0) return;
             options.beforeSwitch.call(this, index, is_open);
             if (options.only){
                 options.tab.removeClass(options.tabCurrentClass);
                 options.tab.eq(index).addClass(options.tabCurrentClass);
             } else {
                 if (is_open){
                     options.tab.eq(index).removeClass(options.tabCurrentClass);
                 } else {
                     options.tab.eq(index).addClass(options.tabCurrentClass);
                 }
             }

             options.afterSwitch.call(this, index, is_open);
         },

         showContent : function(index, is_open){
             var _this = this,
                 options = this.options;
             if(index < 0) return;

             options.beforeShow.call(this, index, is_open);
             if (options.only){
                 options.content.hide();
                 options.content.eq(index).show();
             } else {
                 if (is_open){
                     options.content.eq(index).hide();
                 } else {
                     options.content.eq(index).show();
                 }
             }
             options.afterShow.call(this, index, is_open);
         }
     }
     module.exports = ctor;
 });
