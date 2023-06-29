/**
 * Load the Main Page (index.html) libraries.
 */
define(["require", "config"], function() {
    require(['options'], function(options){
        const jsModules = [
            'polyfill',
            'menu',
            'searchAutocomplete',
            'webhelp',
            'codeblock',
            'wh-sticky',
            'top-menu',
            'search-init',
            'context-help',
            'template-module-loader',
            'bootstrap'
        ];
        if(!options.getBoolean("webhelp.custom.search.engine.enabled")) {
            jsModules.push('searchAutocomplete');
        } 
        require(jsModules);
    });
});
