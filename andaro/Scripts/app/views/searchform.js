/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.SearchFormView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('search-form'));
        this.eventsCollection = new EventsCollection();
        this.eventViewListContainer = new EventViewListContainer({ model: this.eventsCollection, mapView: this.options.mapView });
        this.eventsCollection.searchmodel = this.model;
        this.eventsCollection.pageCollection = this.options.pageCollection;
        this.mapView = this.options.mapView;
        
        _.bindAll(this, 'render', 'submitsearch', 'loadevents', 'autocompleteChanged');
    },

    events:
    {
        "click #submit-search": "submitsearch"
    },

    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        $("#txtfromdate", this.el).datepicker();
        $("#txttodate", this.el).datepicker();


        this.autocomplete = new google.maps.places.Autocomplete($("#txtlocation", this.el)[0]);
        this.autocomplete.bindTo('bounds', this.mapView.map);
        google.maps.event.addListener(this.autocomplete, 'place_changed', this.autocompleteChanged);

        return this;
    },

    autocompleteChanged: function () {
        var markerModel = new MapMarkerModel();
        var place = this.autocomplete.getPlace();
        if (place.geometry === undefined) return;

        markerModel.set('latitude', place.geometry.location.lat());
        markerModel.set('longitude', place.geometry.location.lng());
        this.mapView.setCurrentMarker(markerModel);
        this.model.set('page_number', 1);
        this.loadevents();
    },

    submitsearch: function (e) {
        e.stopImmediatePropagation();
        this.model.set('page_number', 1);
        this.loadevents();
    },

    loadevents: function () {
        this.model.set('fromdate', $("#txtfromdate").val());
        this.model.set('todate', $("#txttodate").val());
        this.model.set('searchcriteria', $('#txtsearchcriteria').val());
        this.model.set('distance', parseFloat($('#ddldistance :selected').val()));
        this.model.set('lat', this.mapView.currentMarkerView.model.get('latitude'));
        this.model.set('lng', this.mapView.currentMarkerView.model.get('longitude'));


        this.eventsCollection.search();
        $(this.eventViewListContainer.render().el).insertAfter($('#search-map-container'));

        //this clears up the entry
        app.navigate("", { trigger: false, replace: true });

    }
});






