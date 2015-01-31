/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.MapModel = Backbone.Model.extend({

    initialize: function () {
    },

    //Location is default to third street promenade Santa Monica
    defaults: {
        lat: 34.017089,
        lng: -118.49642,
        zoom: 12
    }

});

window.MapMarkerModel = Backbone.Model.extend({

    defaults: {
        latitude: 34.017089,
        longitude: -118.49642,
        order:1,
        centralLocation:false,
        setCenter: false,
        description:'',
        foreignid:1 //Represent the event id or any other external id that is associated with the marker.
    }

});

