//历史记录模块
/*
    key 历史记录存储的key
    max_length 最多存储的记录数
    unique 历史记录是否去重，传false 不进行去重；其他值去重，如果存储的记录是基础数据类型 为空，如果存的是对象，传用来判断对象唯一的filed，如id
*/

window.La = window.La || {};

La.history = (function(){

    function history(key, max_length, unique){
        this.max_length = max_length || 5;
        this.key = key;

        if(unique === false){
            this.unique = false;
        } else {
            this.unique = true;
            this.verify_field = (typeof unique === 'string' && unique) ? unique : "";
        }
    }

    history.prototype = {
        get : function(){
            var history = [];

            try{
                history = JSON.parse(window.localStorage[this.key] || '[]');
            }catch(e){

            }

            return history;
        },

        add : function(value){
            var history = [],
                new_history = [];

            try{
                history = JSON.parse(window.localStorage[this.key] || '[]');

                //是否需要判断去重
                if(this.unique){
                    
                    new_history.push(value);
                    //设置了去重的key 
                    if(this.verify_field){
                        for(var i = 0; i < history.length; i++){
                            if(history[i][this.verify_field] != info[this.verify_field]){
                                new_history.push(history[i]);
                            }
                            
                        }
                    } else {
                        for(var i = 0; i < history.length; i++){
                            if(history[i] != value){
                                new_history.push(history[i]);
                            }
                        }
                    }
                } else {
                    history.unshift(value);
                    new_history = history;
                }

                
                new_history = new_history.slice(0, this.max_length);
                window.localStorage[this.key] = JSON.stringify(new_history);
            }catch(e){

            }
        },

        del : function(index){
            try{
                var history = JSON.parse(window.localStorage[this.key] || '[]');
                history.splice(index, 1);
                window.localStorage[this.key] = JSON.stringify(history);
            }catch(e){

            }
        },

        clear : function(){
            try{
                window.localStorage[this.key] = '[]';
            }catch(e){

            }
        }
    }

    return history;
})();