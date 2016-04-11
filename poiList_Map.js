//--------------------------------------------------------------------
// Program: poiList_Map.js
// Date:
// Description: Javascript file for the Map.htm page
//
//  initializeMap
//      addMarkersToMap()
//          AddMarker()
//          AddInfoWindowToMarker()
//      drawCurrentPositionMarker()
//---------------------------------------------------------------------

//---------------------------------------------------------------
//ioS 5 Fix
//---------------------------------------------------------------
var myCurrentPositionHandle;
$(window).unload(function () {
    window.navigator.geolocation.clearWatch(myCurrentPositionHandle);
});

//--------------------------------------------------------------------
// Name: initializeMap
//--------------------------------------------------------------------
function initializeMap(parLattitude, parLongitude) {

    debugPrint("Inside initializeMap function");

    //Coordinates for center of map (Dillsboro)
    var mapCenterCoordinates = new google.maps.LatLng(parLattitude, parLongitude);

    //Setting some map options, including controls
    var mapOptions = {
//        zoom: 9,
        zoom: 12,
        center: mapCenterCoordinates,
        mapTypeControl: true,
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        navigationControl: true,
        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        backgroundColor: "#dddddd"
    };

    //Create and display map
    map = new google.maps.Map(document.getElementById("divMapCanvas"), mapOptions);
    //$.mobile.pageContainer.trigger("create");

    //Add markers
    addMarkersToMap();

    //Show current position
    //drawCurrentPositionMarker();

   // $("#divMapCanvas").hide();

   
}

//--------------------------------------------------------------------
// Name: addMarkersToMap()
//--------------------------------------------------------------------
function addMarkersToMap() {

    var arrayOfMarkerData = mapListPageInfo.ArrayOfPOIData;

    //Loop through the array to assign object properties to local variables
    for (var i = 0; i < arrayOfMarkerData.length; i++) {
        var poiID = arrayOfMarkerData[i].POI_ID;
        var lat = arrayOfMarkerData[i].POI_Latitude;
        var long = arrayOfMarkerData[i].POI_Longitude;
        var title = arrayOfMarkerData[i].POI_Title;
        var infoWindowImage = arrayOfMarkerData[i].POI_Image1;
        var address1 = arrayOfMarkerData[i].POI_Address1;
        var city = arrayOfMarkerData[i].POI_City;
        var state = arrayOfMarkerData[i].POI_State;
        var zip = arrayOfMarkerData[i].POI_ZipCode;
        var phone = arrayOfMarkerData[i].POI_Phone;
        var cat = arrayOfMarkerData[i].POI_Category;

        //Add new marker
        var newMarker = AddMarker(lat, long, title, "info.png");

        //Add infoWindow to new marker
        AddInfoWindowToMarker(newMarker, poiID, lat, long, title, infoWindowImage, address1, city, state, zip, phone);
    }
}

//--------------------------------------------------------------------
// Name: AddMarker
//--------------------------------------------------------------------
function AddMarker(parLat, parLong, parTitle, parIcon) {

    var coords = new google.maps.LatLng(parLat, parLong);
    var marker;

    //Custom icon
    if (parIcon != "") {

        var pathToIconFile = "Images/" + parIcon;
        marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: pathToIconFile,
            title: parTitle
        });
    }
    //Default icon
    else {
        marker = new google.maps.Marker({
            position: coords,
            map: map,
            title: parTitle
        });
    }

    return marker;
}

//--------------------------------------------------------------------
// Name: AddInfoWindowToMarker
//--------------------------------------------------------------------
function AddInfoWindowToMarker(parMarker, parID, parLat, parLong, parTitle, parDisplayImage, parAddress1, parCity,
                                parState, parZip, parPhone) {

    //Add infoWindo to new marker
    var categoryTitle = unescape(getQuerystring('qryCatTitle'));
    var categoryCode = unescape(getQuerystring('qryCatCode'));

    var url = "POI.htm?qryPOI=" + parID +
                      "&qryCatCode=" + categoryCode +
                      "&qryCatTitle=" + categoryTitle +
                      "&qryLat_POI=" + parLat +
                      "&qryLong_POI=" + parLong;     

    if (parDisplayImage === "") {
        var infoWindowContent = '<a rel="external" href="' + url + '">' +
                                    '<img class="infoWindow" src="Images/' + "no-image.jpg " + '" />' +
                                    parTitle + '</a>' + '<br />' + parAddress1 + '<br />' + parCity + ", " + parState +
                                     " " + parZip + '<br />' + '<a href="tel:' + parPhone + ' ">' + parPhone + "</a>";
    }
    else {
        var imageFileWithPath = "Images/" + parDisplayImage;
        var infoWindowContent = '<a rel="external" href="' + url + '">' +
                                    '<img class="infoWindow" src="' + imageFileWithPath + '" />' +
                                     parTitle + '</a>' + '<br />' + parAddress1 + '<br />' + parCity + ", " + parState +
                                     " " + parZip + '<br />' + '<a href="tel:' + parPhone + ' ">' + parPhone + "</a>";
    }

    //Set content of infoWindow
    var infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });

    //Add event handler to display infoWindo when user clicks on marker
    google.maps.event.addListener(parMarker, 'click',
                                        function () {
                                            infoWindow.open(map, parMarker);
                                        });
}

//-------------------------------------------------------------------------------
// name:  drawCurrentPositionMarker
//-------------------------------------------------------------------------------
function drawCurrentPositionMarker() {

    debugPrint("** Inside drawCurrentPositionMarker function");

     var myLatlng, directionsDisplay;
    var currentLat, currentLong, accuracy;
    var currentPositionMarker;
    var currentPositionAccuracyCircle;

    currentLat = mapListPageInfo.CurrentPosition_Lat;
    currentLong = mapListPageInfo.CurrentPosition_Long;

    myLatlng = new google.maps.LatLng(currentLat, currentLong);
    accuracy = mapListPageInfo.CurrentPosition_Accuracy;
    //myLatlng = new google.maps.LatLng(positionObject.coords.latitude, positionObject.coords.longitude);
    //var accuracy = positionObject.coords.accuracy;
    debugPrint("Current location: (" + currentLat + ", " + currentLong + "), " +
                "Accuracy: " + accuracy + " meters");

    //Clear old marker (if exists)
    if (currentPositionMarker) {
        currentPositionMarker.setMap(null);
    }

    //Add marker to map
    currentPositionMarker = AddMarker(currentLat, currentLong, "Current Position", "pin_red.png");

    var displayContent = "Accuracy:  " + accuracy + " meters.";

    //Set content of infoWindow
    var infoWindow = new google.maps.InfoWindow({ content: displayContent });

    //Add event handler to display infoWindo when user clicks on marker
    google.maps.event.addListener(currentPositionMarker, 'click',
                                        function () {
                                            infoWindow.open(map, currentPositionMarker);
                                        });

    var currentLocation_LatLng = new google.maps.LatLng(currentLat, currentLong);
    //var currentLocation_LatLng = new google.maps.LatLng(lat, long);
    // getDirections(lat, long);
    // Construct the circle 
    var currentPositionAccuracyCircleOptions = {
        strokeColor: "#3399FF",
        strokeOpacity: 0.7,
        strokeWeight: 1,
        fillColor: "#CCFFFF",
        fillOpacity: 0.35,
        map: map,
        center: currentLocation_LatLng,
        radius: accuracy

    }

    //Clear old circle (if exists)
    if (currentPositionAccuracyCircle) {
        currentPositionAccuracyCircle.setMap(null);
    }
    currentPositionAccuracyCircle = new google.maps.Circle(currentPositionAccuracyCircleOptions);

}
