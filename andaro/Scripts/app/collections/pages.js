/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.PageCollection = Backbone.Collection.extend({
    model: PageModel,

    initialize:function(){
      _.bindAll(this,'loadPages');  
    },

    defaults: {
        page_count:1,
        page_number:1,
        total_items:1,
        pager_for:'events',
        pager_limit:5
        
    },

     loadPages: function () {
         var pCol = new PageCollection();
         for (var i = 1; ((i <= this.page_count) && (i<=this.pager_limit)); i++) {
            var pageModel = new PageModel();
            pageModel.set('number', i);
            var urlref='#' + this.pager_for + '/' + 'page' + i; 
            pageModel.set('urlref', urlref );
                if (parseInt(this.page_number) === i)
                    pageModel.set('selected', true);
                else
                    pageModel.set('selected', false);

                pCol.add(pageModel);
            }
            this.reset(pCol.models);
    }

});

