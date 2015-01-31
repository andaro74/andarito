/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

var AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "events/page:page": "searchevent"
    },

    initialize: function () {
        /* this.navigationView = new NavigationView();
        $('.container').html(this.navigationView.render().el);*/
    },

    home: function () {
        this.searchmapView = new SearchMapView();
        $('#body-container').html(this.searchmapView.render().el);
        this.searchmapView.searchFormView.loadevents();
    },

    searchevent: function (page) {
        this.searchmapView.searchFormView.eventsCollection.searchmodel.set('page_number', page);
        this.searchmapView.searchFormView.loadevents();
    }

});

tpl.loadTemplates(['search-form', 'event-list', 'event-list-item', 'event-list-item-image', 'map-container', 'search-map-container', 'navigation-header', 'pagination', 'mark-event-content', 'spinner-container'],
    function () {
        app = new AppRouter();
        Backbone.history.start();
    });