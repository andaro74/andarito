/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.NavigationView = Backbone.View.extend({
    initialize: function () {
        this.template = _.template(tpl.get('navigation-header'));
        _.bindAll(this, 'render');
    },

    render: function () {
        $(this.el).html(this.template());
        return this;
    }

});