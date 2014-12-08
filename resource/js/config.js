seajs.config({
    /*base: "./release/lib/", */  
    alias: {
        "jquery": "jquery/jquery-1.10.2.min.js",
        "handlebars":"handlebars/handlebars-v1.1.0.js"
    },
	map: [
    [ /^(.*\/resource\/.*\.(?:css|js))(?:.*)$/i, '$1?20131111' ]
  ]
});
