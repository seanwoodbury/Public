//--------------------------------------------------------------------
//Program: Dillsboro - MapDirections.js
//Author: Scott Richmond, Scott Coffey, Justin Travis
//Date: 12/8/2011
//Description: Javascript file for the MapDirections.htm page
//---------------------------------------------------------------------
//--------------------------------------------------------------------
//Program: Directions_Map.js
//Date: 3/13/12
//Description: Draws Map directions from current location to POI
//
//Functions:
//      DrawScreen
//          DrawMap
//          GetCurrentPosition
//              cb_GetCurrentPosition
//                  getDirections
//                      displayDirectionsOnMap
//
// Assumptions:
//  1. Using getCurrentPosition here assuming that the phone has already
//      retrieved position on List and/or Map pages.   
//        
//---------------------------------------------------------------------
$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//Variables page-level in scope
var map;

var WANT_MAP_DIRECTIONS = true;

$('#poi_map').live('pageinit', function (event) {

    $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    $(window).resize(function () {
        $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    });
});
$('#poi_map').live('pageshow', function (event) {

    //Draw initial map
    DrawMap();

    DrawScreen();

    $("#divMapCanvas").fadeIn()

    google.maps.event.trigger(map, 'resize');
});

//--------------------------------------------------------------------
// Name: DrawMap
//--------------------------------------------------------------------
function DrawMap() {

    //Starting center for map: Dillboro Center 
    var startingLatitude = 35.369523;
    var startingLongitude = -83.249044;

    debugPrint("Inside DrawMap()");

    //Coordinates for center of map (Dillsboro)
    var mapCenterCoordinates = new google.maps.LatLng(startingLatitude, startingLongitude);

    //Setting some map options, including controls
    var mapOptions = {
        zoom: 16,
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
}



////Old code
////Variables page-level in scope

//var map, myLatlng;
//var directionsService;
//var directionsDisplay; 
//var currentPositionMarker;
//var currentPositionAccuracyCircle;
//var poiLat;
//var poiLong;
//var place = "";

////-------------------------------------------------------------------------------
//// Name:            ready
//// Description:     jQuery function that runs once everything is loaded
////-------------------------------------------------------------------------------

////Dillboro Center Latitude & Longitude coordinates
//var latitude = 35.369523;
//var longitude = -83.249044;
//var map;

//$('#poi_map').live('pageshow', function (event) {

//    //Draw the map with POI markers and current position marker
//    DrawScreen(latitude, longitude);
//});

////--------------------------------------------------------------------
//// Name: DrawScreen
////--------------------------------------------------------------------
//function DrawScreen(parLatitude, parLongitude) {

//    //Create and display map
//    DrawMap(parLatitude, parLongitude);
//    
//    //Make Ajax call to read from Category POI JSON data file into an array of POI objects
//    LoadCategoryData();
//}

////--------------------------------------------------------------------
//// Name: DrawMap
////--------------------------------------------------------------------
//function DrawMap(parLattitude, parLongitude) {

//    //Coordinates for center of map (Dillsboro)
//    var mapCenterCoordinates = new google.maps.LatLng(parLattitude, parLongitude);

//    //Setting some map options, including controls
//    var mapOptions = {
//        zoom: 16,
//        center: mapCenterCoordinates,
//        mapTypeControl: true,
//        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
//        navigationControl: true,
//        navigationControlOptions: { style: google.maps.NavigationControlStyle.SMALL },
//        mapTypeId: google.maps.MapTypeId.ROADMAP,
//        backgroundColor: "#dddddd"      
//    };

//    //Create and display map
//    map = new google.maps.Map(document.getElementById("divMapCanvas"), mapOptions);
//}

////========================================================================================
//// ------------------------------ POI MARKER FUNCTIONS -----------------------------------
////========================================================================================

////--------------------------------------------------------------------
//// Name: LoadCategoryData
////--------------------------------------------------------------------
//function LoadCategoryData() {
//    var poiID = getQuerystring('qryPOI');
//    var categoryCode = getQuerystring('qryCatCode');

//    //Get and display title on map
//    var categoryTitle = unescape(getQuerystring('qryCatTitle'));
//    $.trim(categoryTitle);
//    var titleDisplay = 'Map of ' + categoryTitle;
//    $("#maptitle").append(titleDisplay);

//    //Add list directions to Turn By Turn Directions Button
//    $('a[id|=ListDirections]').attr('href', 'ListDirections.htm?qryPOI=' + poiID + '&qryCatCode='
//        + categoryCode + '&qryCatTitle=' + categoryTitle);
//    $('a[id|=MapDirections]').attr('href', 'MapDirections.htm?qryPOI=' + poiID + '&qryCatCode='
//                                + categoryCode + '&qryCatTitle=' + categoryTitle);
//    $('a[id=BackBut]').attr('href', 'POI.htm?qryPOI=' + poiID + '&qryCatCode=' + categoryCode + "&qryCatTitle=" + categoryTitle);
//    var categoryFileName = "Category_" + categoryCode + ".js";
//    var fileURL = "Data_Categories/" + categoryFileName;

//    //Read JSON file
//    $.ajax({
//        type: "GET",
//        url: fileURL,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: cb_AddPOIMarkersToMap,
//        error: cb_AddPOIMarkersToMap_Error
//    });
//}

////--------------------------------------------------------------------
//// Name: cb_AddPOIMarkersToMap
////--------------------------------------------------------------------
//function cb_AddPOIMarkersToMap(parRetrievedDataArray) {

//    //Retrieve the incoming POI ID from the querystring
//    var poiID = getQuerystring('qryPOI');
//    console.log("poiID = " + poiID);

//    //Loop through the array to assign object properties to local variables
//    for (var i = 0; i < parRetrievedDataArray.length; i++) {

//        var currentPOIID = parRetrievedDataArray[i].POI_ID;
//        console.log("currentPOIID = " + currentPOIID);

//        //Get info from desired POI
//        if (currentPOIID == poiID) {
//            console.log("chosen POI = " + currentPOIID);

//            var lat = parRetrievedDataArray[i].POI_Latitude;
//            var long = parRetrievedDataArray[i].POI_Longitude;
//            var title = parRetrievedDataArray[i].POI_Title;
//            var infoWindowImage = parRetrievedDataArray[i].POI_Image1;
//            var address1 = parRetrievedDataArray[i].POI_Address1;
//            var city = parRetrievedDataArray[i].POI_City;
//            var state = parRetrievedDataArray[i].POI_State;
//            var zip = parRetrievedDataArray[i].POI_ZipCode;
//            var phone = parRetrievedDataArray[i].POI_Phone;
//                 
//        }
//    
//            //Add Latitude and Longitude to global poiLat, poiLong
//            poiLat = lat;
//            poiLong = long;

//            //Make Ajax call to setup and start Current Position watcher and marker
//            StartCurrentPositionWatcher();

//            //Add new marker
//           var newMarker = AddMarker(lat, long, title, "info.png");
//            
//            //Add infoWindow to new marker
//           AddInfoWindowToMarker(newMarker, poiID, title, infoWindowImage, address1, city, state, zip, phone);

//       }
//} 
////--------------------------------------------------------------------
//// Name: AddMarker
////--------------------------------------------------------------------
//function AddMarker(parLat, parLong, parTitle, parIcon) {

//    var coords = new google.maps.LatLng(parLat, parLong);
//    var marker;

//    //Custom icon
//    if (parIcon != "") {

//        var pathToIconFile = "Images/" + parIcon;
//        marker = new google.maps.Marker({
//            position: coords,
//            map: map,
//            icon: pathToIconFile,
//            title: parTitle
//        });
//    }
//    //Default icon
//    else {
//        marker = new google.maps.Marker({
//            position: coords,
//            map: map,
//            title: parTitle
//        });
//    }
//   
//    
//    return marker;
//}

////--------------------------------------------------------------------
//// Name: AddInfoWindowToMarker
////--------------------------------------------------------------------
//function AddInfoWindowToMarker(parMarker, parID, parTitle, parDisplayImage, parAddress1, parCity,
//                                parState, parZip, parPhone) {

//    //Add infoWindo to new marker
//    var categoryTitle = getQuerystring('qryCatTitle');
//    var categoryCode = getQuerystring('qryCatCode');
//    var url = "POI.htm?qryPOI=" + parID + "&qryCatCode=" + categoryCode + "&qryCatTitle=" + categoryTitle;

//    if (parDisplayImage === "") {
//        var infoWindowContent = '<a rel="external" href="' + url + '">' +
//                                    '<img class="infoWindow" src="Images/' + "no-image.jpg " + '" />' +
//                                    parTitle + '</a>' + '<br />' + parAddress1 + '<br />' + parCity + ", " + parState +
//                                     " " + parZip + '<br />' + '<a href="tel:' + parPhone + ' ">' + parPhone + "</a>";
//    }
//    else {
//        var imageFileWithPath = "Images/" + parDisplayImage;
//        var infoWindowContent = '<a rel="external" href="' + url + '">' +
//                                    '<img class="infoWindow" src="' + imageFileWithPath + '" />' +
//                                     parTitle + '</a>' + '<br />' + parAddress1 + '<br />' + parCity + ", " + parState +
//                                     " " + parZip + '<br />' + '<a href="tel:' + parPhone + ' ">' + parPhone + "</a>";
//    }

//    //Set content of infoWindow
//    var infoWindow = new google.maps.InfoWindow({ content: infoWindowContent });

//    //Add event handler to display infoWindo when user clicks on marker
//    google.maps.event.addListener(parMarker, 'click',
//                                        function () {
//                                            infoWindow.open(map, parMarker);
//                                        });
//}


////--------------------------------------------------------------------
//// Name: cb_AddPOIMarkersToMap_Error
////--------------------------------------------------------------------
//function cb_AddPOIMarkersToMap_Error(parXMLHttpRequestObject) {

//    //If unable to receive information from the JSON Object, display an error message
//    alert("Unable to load Map data. Please try again later.");
//}


////========================================================================================
//// --------------------------- CURRENT POSITION FUNCTIONS --------------------------------
////========================================================================================

////--------------------------------------------------------------------
//// Name: StartCurrentPositionWatcher
////--------------------------------------------------------------------
//function StartCurrentPositionWatcher() {

//    //Check that browser supports geolocation
//    //If it doesn't, display message and stop any more current position code from running
//    if (!navigator.geolocation) {
//        alert("GeoLocation info not available");
//        return;
//    }

//    //Get current position -- whenever position changes -- 
//    //and pass it to callback function
//    navigator.geolocation.watchPosition(cb_UpdateCurrentPositionMarker,
//                                        cb_UpdateCurrentPositionMarker_Error,
//                                        {
//                                            enableHighAccuracy: true,
//                                            maximumAge: 1000 //Retrieve new info if older than 5 seconds 
//                                        }
//                                        );
//}

////-------------------------------------------------------------------------------
//// Name: cb_UpdateCurrentPositionMarker
////-------------------------------------------------------------------------------
//function cb_UpdateCurrentPositionMarker(positionObject) {

//    var lat = positionObject.coords.latitude;
//    var long = positionObject.coords.longitude;
//    myLatlng = new google.maps.LatLng(lat, long);
//    var accuracy = positionObject.coords.accuracy;
//    debugPrint("Current location: (" + lat + ", " + long + "), " +
//                "Accuracy: " + accuracy + " meters");

//    //Clear old marker (if exists)
//    if (currentPositionMarker) {
//        currentPositionMarker.setMap(null);
//    }

//    //Add marker to map
//    currentPositionMarker = AddMarker(lat, long, "Current Position", "user.png");

//    var displayContent = place + "</br>" + "Accuracy:  " + accuracy + " meters.";

//    //Set content of infoWindow
//    var infoWindow = new google.maps.InfoWindow({ content: displayContent });

//    //Add event handler to display infoWindo when user clicks on marker
//    google.maps.event.addListener(currentPositionMarker, 'click',
//                                        function () {
//                                            infoWindow.open(map, currentPositionMarker);
//                                        });

//    var currentLocation_LatLng = new google.maps.LatLng(lat, long);
//    // Construct the circle 
//    var currentPositionAccuracyCircleOptions = {
//        strokeColor: "#3399FF",
//        strokeOpacity: 0.7,
//        strokeWeight: 1,
//        fillColor: "#CCFFFF",
//        fillOpacity: 0.35,
//        map: map,
//        center: currentLocation_LatLng,
//        radius: accuracy
//    }

//    //Clear old circle (if exists)
//    if (currentPositionAccuracyCircle) {
//        currentPositionAccuracyCircle.setMap(null);
//    }
//    getDirections(lat, long);
//    currentPositionAccuracyCircle = new google.maps.Circle(currentPositionAccuracyCircleOptions);
//}
////-------------------------------------------------------------------------------
//// Name:            cb_UpdateCurrentPositionMarker_Error
//// Description:     Callback function: 
////-------------------------------------------------------------------------------
//function cb_UpdateCurrentPositionMarker_Error(err) {

//    var errorMessage;

//    if (err.code == 1) {
//        errorMessage = "You chose not to share your location info.";
//    }
//    else if (err.code == 2) {
//        errorMessage = "Location information currently unavailable!";
//    }
//    else if (err.code == 3) {
//        errorMessage = "Timed out waiting to receive location information!";
//    }
//    else {
//        errorMessage = "Unknown error occured";
//    }
//}

//// ---------------------------------------------------------------------------------------
//// name: DebugPrint(parMessage)
//// ---------------------------------------------------------------------------------------
//function debugPrint(parMessage) {

//    if (window.console) {
//        console.log(parMessage);
//    }
//}

////========================================================================================
//// ------------------------------ GET DIRECTION FUNCTIONS -----------------------------------
////========================================================================================

////---------------------------------------------------------------
//// Name: getDirections(currentPosition_Lat, currentPosition_Long)
////---------------------------------------------------------------
//function getDirections(currentPosition_Lat, currentPosition_Long) {

//    directionsService = new google.maps.DirectionsService();
//    var start = new google.maps.LatLng(currentPosition_Lat, currentPosition_Long);
//    var end = new google.maps.LatLng(poiLat, poiLong);
//    console.log('getDirections currentLat = ' + currentPosition_Lat);
//    console.log('getDirections currentLong = ' + currentPosition_Long);
//    console.log('getDirections poiLat = ' + poiLat);
//    console.log('getDirections poiLong = ' + poiLong);
//    //Build directions request object
//    var request = {
//        origin: start,
//        destination: end,
//        travelMode: google.maps.DirectionsTravelMode.DRIVING
//        //travelMode: google.maps.DirectionsTravelMode.WALKING
//    };

//    //Pass request object to Directions Service
//    directionsService.route(request, function (response, status) {
//        if (status == google.maps.DirectionsStatus.OK) {
//            displayDirectionsOnMap(response);
//        }
//        else {
//            alert("Sorry, unable to get directions.");
//        }
//    });
//}

////---------------------------------------------------------------
//// Name: displayDirectionsOnMap(directionResult)
////---------------------------------------------------------------
//function displayDirectionsOnMap(directionResult) {

//    //Create DirectionsRenderer object
//    directionsDisplay = new google.maps.DirectionsRenderer();
//    
//    //Remove default google markers from map
//    directionsDisplay.suppressMarkers = true;

//    //Bind the DirectionsRenderer object to map
//    directionsDisplay.setMap(map);

//    //Draw directions on the map
//    directionsDisplay.setDirections(directionResult);

//    debugPrintStepProperties(directionResult);
//}

////---------------------------------------------------------------
//// Name: debugPrintStepProperties(directionResult)
////---------------------------------------------------------------    
//function debugPrintStepProperties(directionResult) {

//    if (directionResult) {
//        console.log("ROUTE INSTRUCTIONS");
//        var myRoute = directionResult.routes[0].legs[0];
//        place = directionResult.routes[0].legs[0].start_address;
//        
//        for (var i = 0; i < myRoute.steps.length; i++) {
//        
//            var currentStep = myRoute.steps[i];
//            console.log("Step " + (i + 1));
//            console.dir(currentStep);
//        }
//    }
//}

////--------------------------------------------------------------------
//// Name:  getQuerystring Function
//// Description: gets the value equal to "poi" in the url and returns 
//// an integer. Additional info about this function can be viewed at
//// http://www.bloggingdeveloper.com/post/javascript-querystring-parse
//// Get-QueryString-with-Client-Side-JavaScript.aspx
////--------------------------------------------------------------------
//function getQuerystring(key, default_) {
//    if (default_ === null) default_ = "";
//    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
//    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
//    var qs = regex.exec(window.location.href);
//    if (qs === null) {
//        return default_;
//    } else {
//        return qs[1];
//    }
//}
