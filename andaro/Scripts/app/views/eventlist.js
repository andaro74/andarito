/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.EventViewListContainer = Backbone.View.extend({
    initialize: function () {
        this.template = _.template(tpl.get('event-list'));
        this.eventViewList = new EventViewList({ model: this.model, mapView:this.options.mapView });
        _.bindAll(this, 'render');
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        $('#thumbnails-container', this.el).html(this.eventViewList.render().el);
        return this;
    }


});


window.EventViewList = Backbone.View.extend({
    tagName: 'ul',
    className: 'thumbnails',

    initialize: function () {
        _.bindAll(this, 'render', 'markerContent');
        this.model.bind('reset', this.render, this);
        this.model.bind('remove', this.remove, this);
        this.mapView = this.options.mapView;
        this.spinnerView = new SpinnerView();
    },

    render: function () {
        $(this.el).empty();

        if (this.model.models.length ===0) {
            var renderView = this.spinnerView.render().el;
            $(this.el).append(renderView);
        }
        _.each(this.model.models, function (event) {

            var viewEvent = new EventView({ model: event, mapView: this.mapView });
            $(this.el).append(viewEvent.render().el);

            //Set the values of the marker
            event.marker.set('longitude', event.get('longitude'));
            event.marker.set('latitude', event.get('latitude'));
            event.marker.set('order', event.get('order'));
            event.marker.set('foreignid', event.cid);
            var markerEventContentView = new MarkEventContentView({ model: event });
            var markContent = markerEventContentView.render().el;
            var displayContent = $(markContent).html();

            event.marker.set('description', displayContent);
            this.mapView.markerCollection.add(event.marker);

        }, this);

        return this;
    },

    remove: function () {
        var m = this;

    },

    markerContent: function () {

    }

});

window.EventView = Backbone.View.extend({
    tagName: 'li',
    className: 'span3',

    initialize: function () {
        this.template = _.template(tpl.get('event-list-item'));
        _.bindAll(this, 'render', 'showModal', 'showMapInfoEvent');
        this.model.bind('remove', this.remove, this);
        this.mapView = this.options.mapView;
    },

    events:
    {
        "click #orderimgid": "showMapInfoEvent"
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        if (this.model.get('medium_image') != undefined) {
            this.eventViewThumbnail = new EventViewThumbnail({ model: this.model });
            $("#list-item-picture", this.el).html(this.eventViewThumbnail.render().el);
        }
        return this;
    },

    showModal: function (e) {
        e.stopImmediatePropagation();
        $('#description', this.el).modal();
    },

    showMapInfoEvent: function (e) {
        _.each(this.mapView.markerArray, function (markerView) {
            if (this.model.cid === markerView.model.get('foreignid')) {
                markerView.showInfoBox(markerView.marker);
            }
            else if (markerView.ib != undefined)
                markerView.ib.close();

        }, this);

    },

    remove: function (event) {
        this.mapView.markerCollection.remove(event.marker)
    }
});

window.EventViewThumbnail = Backbone.View.extend({
    initialize: function () {
        this.template = _.template(tpl.get('event-list-item-image'));
        _.bindAll(this, 'render');
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});


window.MarkEventContentView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('mark-event-content'));
        this.eventModel = this.options.eventModel;
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }


});