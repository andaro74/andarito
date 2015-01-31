/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.PaginationView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('pagination'));
        this.model.on('reset', this.render, this);
        _.bindAll(this, 'render');
    },

    render: function () {
        $(this.el).html(this.template());
        if (this.model.models.length > 1) {
            _.each(this.model.models, function (pageModel) {
                var pageView = new PageView({ model: pageModel });
                $('ul', this.el).append(pageView.render().el);
            }, this);
        }
        return this;
    }
});

window.PageView = Backbone.View.extend({

    tagName: 'li',

    initialize: function () {
        _.bindAll(this, 'render');
    },

    render: function () {
        var newanchor = $('<a/>').attr('href', this.model.get('urlref')).text(this.model.get('number'));
        $(this.el).append(newanchor);
        if (this.model.get('selected') == true)
            $(this.el).addClass('active');

        return this;
    }

});