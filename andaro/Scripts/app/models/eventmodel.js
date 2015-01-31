/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.EventModel = Backbone.Model.extend({

    initialize: function () {
        this.marker = new MapMarkerModel();
    }

});

