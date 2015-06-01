define(function(require,exports,module){
    require("../css/codelight/prettify.css");
    require("../css/codelight/prettify.js");
    require("../css/codelight/lang-css.js");
    $(function(){
        prettyPrint();
    });
});
