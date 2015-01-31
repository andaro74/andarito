/// <reference path="../../jquery-1.7.2.js" />
/// <reference path="../../underscore.js" />
/// <reference path="../../backbone.js" />

window.MapView = Backbone.View.extend({

    initialize: function () {
        this.template = _.template(tpl.get('map-container'));
        _.bindAll(this, 'render', 'show', 'showMarker', 'removeMarker', 'addMarker', 'setCurrentMarker');
        this.marker = new MapMarkerModel();
        this.markerCollection = new MapMarkerCollection();
        this.markerCollection.bind('add', this.addMarker, this);
        this.markerCollection.bind('remove', this.removeMarker, this);
        this.markerArray = new Array();
        this.currentMarkerModel = new MapMarkerModel();
    },

    render: function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    show: function () {
        var myOptions = {
            zoom: this.model.get("zoom"),
            mapTypeId: google.maps.MapTypeId.ROADMAP,

            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            streetViewControl: false
        };
        this.map = new google.maps.Map($('#map-canvas', this.el)[0], myOptions);
        this.setCurrentMarker(this.currentMarkerModel);
    },


    setCurrentMarker: function (markerModel) {
        markerModel.set('centralLocation', true);
        markerModel.set('setCenter', true);
        if (this.currentMarkerView != undefined)
            this.currentMarkerView.marker.setMap(null);
        this.currentMarkerView = this.showMarker(markerModel);
    },

    showMarker: function (markerModel) {
        var markerView = new MarkerView({ model: markerModel, map: this.map });
        markerView.render();
        return markerView;
    },

    removeMarker: function (markerModel) {
        var markerViewToRemove = _.find(this.markerArray, function (markerView) {
            if (markerModel.id == markerView.marker.__gm_id)
                return markerView;
        });
        if (markerViewToRemove.marker != null)
            markerViewToRemove.marker.setMap(null);
        if (markerViewToRemove.ib != null)
            markerViewToRemove.ib.close();
    },

    addMarker: function (markerModel) {
        var markerView = new MarkerView({ model: markerModel, map: this.map });
        markerView.render();
        this.markerArray.push(markerView);
    }
});

window.MarkerView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render', 'showInfoBox', 'toggleBounce');
        this.map = this.options.map;
    },

    render: function () {
        var iconImg;
        var placeLoc = new google.maps.LatLng(this.model.get('latitude'), this.model.get('longitude'));
        if (this.model.get('centralLocation') === true)
            iconImg = '../../../Content/images/maps/star-3.png';
        else
            iconImg = '../../../Content/images/maps/number_' + this.model.get('order') + '.png';

        this.marker = new google.maps.Marker({ map: this.map, position: placeLoc, icon: iconImg, animation: google.maps.Animation.DROP });
        this.model.set('id', this.marker.__gm_id);

        if (this.model.get('setCenter') === true)
            this.map.setCenter(placeLoc);

        var myOptions = {
            content: document.createElement("div")
			, disableAutoPan: false
			, maxWidth: 0
			, pixelOffset: new google.maps.Size(-140, 0)
			, zIndex: null
			, boxStyle: {
			    background: "url('../../../Content/images/maps/tipbox.gif') no-repeat"
			  , opacity: 0.93
			  , width: "350px"
			}
			, closeBoxMargin: "2px"
			, closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif"
			, infoBoxClearance: new google.maps.Size(1, 1)
			, isHidden: false
			, pane: "floatPane"
			, enableEventPropagation: false
        };

        this.marker.setTitle = this.model.get('description');
        this.ib = new InfoBox(myOptions);
        self = this;
        google.maps.event.addListener(this.marker, "click", function () {
            
            self.showInfoBox(this);
            
        });

        return this;
    },

    showInfoBox: function (marker) {
        marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
        var boxText = document.createElement("div");
        boxText.innerHTML = marker.setTitle;
        this.ib.setContent(boxText);
        this.ib.open(this.map, marker);
    },

    toggleBounce: function (marker) {
        if (marker.getAnimation() != null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

});

