const DEVICE_TYPE = 'mobile';  // browser or mobile

var map = null;
var map_canvas = null;
var loader = null;
var latitude = 48.1481600;
var longitude = 17.1067400;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        switch (DEVICE_TYPE) {
            case 'mobile':
                document.addEventListener('deviceready', this.onDeviceReady, false);
                break;
            case 'browser':
                this.onDeviceReady();
                break;
            default:
                this.onDeviceReady();
                break;
        }
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        onLoad();
    }
};

// on load
function onLoad() {
    // set height map canvas
    map_canvas = $("#map-canvas");
    map_canvas.height($(window).height() - 80);

    // loader
    loader = $(".loader");
    loader.show();

    // get position
    getPosition();
}
// get position
function getPosition () {
    if (navigator.geolocation) {
        var options = {timeout: 4000};
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
    else {
        loader.hide();
    }
}

// onSuccess Callback
function onSuccess(position) {
    if (position.coords.latitude)
        latitude = position.coords.latitude;

    if (position.coords.longitude)
        longitude = position.coords.longitude;

    initializeMap(latitude, longitude, 'Moja poloha s presnostou ' + position.coords.accuracy + 'm.');
}

// onError Callback
function onError(error) {
    switch(error.code){
        case 0:
            alert("There was an error while retrieving your location. Additional details: " + error.message);
            break;
        // PERMISSION_DENIED
        case 1:
            alert("The user opted not to share his or her location.");
            break;
        // POSITION_UNAVAILABLE
        case 2:
            alert("The application was unable to determine your location. Additional details: " + error.message);
            break;
        // TIMEOUT
        case 3:
            alert("The application timed out before retrieving the location.");
            break;
    }

    // check internet conection
    if (navigator.onLine === true) {
        // default position
        initializeMap(latitude, longitude, 'Bratislava');
    }
    else {
        loader.hide();
    }

}

// google map initialize
function initializeMap(lat, long, message) {
    if (!lat || !long) {
        document.getElementById('map-canvas').style.display = "none";
    }
    else {
        var myLatlng = new google.maps.LatLng(lat, long);
        var mapOptions = {
            zoom: 14,
            center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: message,
            visible: true
        });

        map_canvas.show();
        loader.hide();
    }
}