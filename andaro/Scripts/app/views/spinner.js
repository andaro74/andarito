/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />


window.SpinnerView = Backbone.View.extend({

    tagName: 'div',

    initialize: function () {
        this.template = _.template(tpl.get('spinner-container'));
        _.bindAll(this, 'render');
    },

    render: function () {
        this.spinnerPluginView = new SpinnerPluginView();

        $(this.el).html(this.template());
        $("#spinner-content", this.el).html(this.spinnerPluginView.render().el);
        return this;
    },

    start: function () {
        this.spinnerPluginView.spinner.start();
    },

    stop: function () {
        this.spinnerPluginView.spinner.stop();
    }

});

window.SpinnerPluginView = Backbone.View.extend({
    tagName: 'div',

    initialize: function () {
        this.spinnermodel = new SpinnerModel();
        _.bindAll(this, 'render', 'start', 'stop');
    },

    render: function () {
        this.spinner = new Spinner(this.spinnermodel).spin($(this.el)[0]);
        return this;
    },

    start: function () {
        this.spinner.start();
    },

    stop: function () {
        this.spinner.stop();
    }

});