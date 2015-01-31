/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.SearchMapView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('search-map-container'));
        _.bindAll(this, 'render');
    },

    render: function () {
        $(this.el).html(this.template());

        var mapModel = new MapModel();
        this.mapView = new MapView({ model: mapModel });
        $('#search-map', this.el).html(this.mapView.render().el);
        this.mapView.show();


        this.pageCollection = new PageCollection();
        this.paginationView = new PaginationView({ model: this.pageCollection });

        var formmodel = new SearchFormModel();
        this.searchFormView = new SearchFormView({ model: formmodel, mapView: this.mapView, pageCollection: this.pageCollection });

        $('#search-criteria', this.el).html(this.searchFormView.render().el);

        this.paginationView = new PaginationView({ model: this.searchFormView.options.pageCollection });
        $('#paging', this.el).html(this.paginationView.render().el);


        return this;
    }

});