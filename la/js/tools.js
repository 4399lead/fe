var Tools = {
    template : function(tmpl, json){
        if (typeof tmpl !== "string" || typeof json !== "object") return "";

        return tmpl.replace(/\@{([a-zA-Z_0-9\-]*)\}/g, function (all, key) {
            return typeof json[key] !== "undefined" ? json[key] : ""
        });
    }
};