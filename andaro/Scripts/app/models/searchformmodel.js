/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.SearchFormModel = Backbone.Model.extend({

    initialize: function () {
        var today = new Date(); //today's date
        var todayDate = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
        this.set({ fromdate: todayDate, todate: todayDate });

    },

    defaults: {
        location: 'Santa Monica',
        searchcriteria: 'music',
        distance: 8,
        lat: 34.017089,
        lng: -118.49642,
        page_size: 20,
        page_number: 1
    }

});