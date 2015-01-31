/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.EventsCollection = Backbone.Collection.extend({

    model: EventModel,

    initialize: function () {
        this.searchmodel = new SearchFormModel();
        this.eventKey = 'jGq64kjKRvQ2N4tc';
        _.bindAll(this, 'processResults', 'dateConversion', 'timeFormated');
        this.pageCollection = new PageCollection();
        this.searchmodel = new SearchFormModel();
    },


    search: function () {

        var totaldaterange;

        //remove from the list the existing events. For every event removed there will be an action on the view which is remove the map marker.
        while (this.models.length > 0) {
            var event = this.at(this.models.length - 1);
            this.remove(event);
        }

        if (this.searchmodel.get('fromdate') != "") {
            var date1 = $.datepicker.parseDate("mm/dd/yy", this.searchmodel.get('fromdate'));
            totaldaterange = $.datepicker.formatDate("yymmdd00", date1);

            if (this.searchmodel.get('todate') != "") {
                var date2 = $.datepicker.parseDate("mm/dd/yy", this.searchmodel.get('todate'));
                totaldaterange += "-" + $.datepicker.formatDate("yymmdd00", date2);
            }
        }

        var objQuery =
            {
                location: this.searchmodel.get('lat') + "," + this.searchmodel.get('lng'),
                keywords: this.searchmodel.get('searchcriteria'),
                within: this.searchmodel.get('distance'),
                page_size: this.searchmodel.get('page_size'),
                page_number: this.searchmodel.get('page_number'),
                app_key: this.eventKey
            };

        objQuery.date = totaldaterange;
        var self = this;
        $.ajax({
            url: 'http://api.eventful.com/json/events/search',
            data: $.param(objQuery),
            type: 'get',
            dataType: 'jsonp',
            crossDomain: 'true',
            success: function (data) {
                if (this.debug) console.log("search success: " + data.length);
                var eventResults = self.processResults(data);
                self.page_count = data.page_count;
                self.page_number = data.page_number;
                self.total_items = data.total_items;

                self.reset(eventResults);

                //Fill out the pager
                self.pageCollection.page_count = data.page_count;
                self.pageCollection.page_number = data.page_number;
                self.pageCollection.total_items = data.total_items;
                self.pageCollection.pager_for = 'events';
                self.pageCollection.pager_limit = 5;
                self.pageCollection.loadPages();
            },
            error: function (XMLHttpRequest, status, error) {
                if (this.debug) console.log("There was an error on the search function: " + error);
            }

        });
    },

    processResults: function (data) {
        var events = data['events'];
        if (events == undefined)
            return false;
        var evResult = events.event;

        if (evResult.length == undefined) {
            evResult = new Array();
            evResult.push(events);
        }
        var evArray = new Array();
        for (var i = 0; i < evResult.length; i++) {
            var ev = (evResult.length===1)? evResult[i].event : evResult[i];
            var Eventful =
            {
                venue_id: ev.venue_id,
                title: ev.title,
                venue_name: ev.venue_name,
                venue_url: ev.venue_url,
                latitude: ev.latitude,
                longitude: ev.longitude,
                description: ev.description,
                venue_address: ev.venue_address,
                url: ev.url,
                order: i + 1
            }

            if ((ev.image != undefined) && (ev.image.medium != undefined))
                Eventful.medium_image = ev.image.medium;

            if ((ev.image != undefined) && (ev.image.thumb != undefined))
                Eventful.thumb_image = ev.image.thumb;

            if (ev.start_time != undefined) {
                Eventful.start_datetime = this.dateConversion(ev.start_time);
                Eventful.start_time = this.timeFormated(Eventful.start_datetime);
            }
            else {
                Eventful.start_datetime = null;
                Eventful.start_time = null;
            }

            if (ev.stop_time != undefined) {
                Eventful.stop_datetime = this.dateConversion(ev.stop_time);
                Eventful.stop_time = this.timeFormated(Eventful.stop_datetime);
            }
            else {
                Eventful.stop_datetime = null;
                Eventful.stop_time = null;
            }

            Eventful.order_img = "../Content/images/maps/number_" + Eventful.order + ".png";

            evArray.push(Eventful);

        }
        return evArray;
    },

    dateConversion: function (event_datetime) {
        var ev_date_time = event_datetime.split(' ');
        var ev_date = ev_date_time[0].split('-')
        var ev_time = ev_date_time[1].split(':');
        var event_date = new Date(ev_date[0], ev_date[1] - 1, ev_date[2], ev_time[0], ev_time[1], ev_time[2]);
        return event_date;
    },

    timeFormated: function (d) {
        var a_p = "";
        var timeResult = "";
        var curr_hour = d.getHours();
        if (curr_hour < 12) {
            a_p = "AM";
        }
        else {
            a_p = "PM";
        }
        if (curr_hour == 0) {
            curr_hour = 12;
        }
        if (curr_hour > 12) {
            curr_hour = curr_hour - 12;
        }

        var curr_min = d.getMinutes();

        curr_min = curr_min + "";

        if (curr_min.length == 1) {
            curr_min = "0" + curr_min;
        }

        timeResult = (curr_hour + ":" + curr_min + " " + a_p);
        return timeResult;
    }

});