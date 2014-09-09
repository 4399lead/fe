/**
 * ks.LazyLoad.js
 */
define(function(require,exports,module){

    function LazyLoad(ctg){
        //填充
        this._filling=0;
        this.setting = $.extend({
            id : "j-comment-box",
            type : "textarea",
            callback : function(){}
        },ctg);
        this.init();
    }

    LazyLoad.prototype={
        GetId:function(id){
            return typeof id =="string" ? document.getElementById(id) : id;
        },
        GetPosTop:function(){
            var that=this,
                _obj=that.GetId(that.setting.id),
                _top=0;
            while( _obj ){
                _top += _obj.offsetTop;
                _obj = _obj.offsetParent;
            }
            return _top;
        },
        getStyle:function(ele,pro){
            var _ele = ele;
            var _style = ele.currentStyle || document.defaultView.getComputedStyle(ele,null);
            var _value = _style[pro];
            return _value;
        },
        lazyContent:function(callback){
            var that=this,
                _clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
                _scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                _offsetTop = that.GetPosTop( that.setting.id ),
                _obj = that.GetId( that.setting.id );
            var _height = that.getStyle( _obj,'height');
            var _v = _offsetTop-_scrollTop;

            if( that._filling==1){
                return;
            }
            if( that._filling==0){
                if(  _v >=0 && _v< _clientHeight ){
                    var _cid = ( that.setting.cid === " " ) ? that.GetId( that.setting.id ) : that.GetId( that.setting.cid );
                    if( that.setting.type == "textarea"){
                        var _textarea=_cid.getElementsByTagName('textarea')[0].value;
                        var _dv=document.createElement('div');
                        _dv.innerHTML=_textarea;
                        _cid.appendChild(_dv);
                    }else{
                        //console.log('textarea');
                        //alert('xxx');
                    }
                    that._filling=1;
                    if( Object.prototype.toString.call(callback)=='[object Function]'){
                        callback();
                        //console.log('callback');
                    }
                }
            }

        },
        addEvent:function(target,type,handle){
            if(target.addEventListener){
                target.addEventListener(type,handle,false);
            }else if( target.attachEvent){
                target.attachEvent('on'+type,handle);
            }else{
                target["on"+type]=handle;
            }
        },
        init:function(){
            var that=this;
            //that.lazyContent(that.setting.callback);
            if( that._filling==0 ){
                /*that.addEvent(window,'scroll',function(){
                    that.lazyContent(that.setting.callback);
                })*/
                $(window).unbind('scroll.lazyLoad').bind('scroll.lazyLoad',function(){
                    that.lazyContent(that.setting.callback);
                });
            }
        }
    };
    module.exports = LazyLoad;
});
