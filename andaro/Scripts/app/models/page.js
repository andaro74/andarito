/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.PageModel = Backbone.Model.extend({

    defaults:{
        number:1,
        selected: true,
        urlref:'events/page1'
    }

});