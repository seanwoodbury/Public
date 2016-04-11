//--------------------------------------------------------------------
//Program: Dillsboro - ListDirections.js 
//Author: Scott Richmond, Scott Coffey, Justin Travis
//Date: 12/8/2011
//Description: Javascript file for the ListDirections.htm page
//--------------------------------------------------------------------

//--------------------------------------------------------------------
//Program: Directions.js
//Date: 3/13/12
//Description: Draws Map directions from current location to POI
//
//Functions:
//      DrawScreen
//          GetCurrentPosition
//              cb_GetCurrentPosition
//                  getDirections
//                      displayDirectionsOnMap or displayDirectionsTurnByTurn
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

var lat_POI;
var long_POI;

//--------------------------------------------------------------------
// Name: DrawScreen
//--------------------------------------------------------------------
function DrawScreen() {

    debugPrint("Inside DrawScreen()");

    //================================================
    //Hardcoded for testing
    //    poiLat = 35.369552;
    //    poiLong = -83.25075;
    //============================================


    //Get incoming querystring values
    var categoryCode = $.trim(unescape(getQuerystring('qryCatCode')));
    var categoryTitle = $.trim(unescape(getQuerystring('qryCatTitle')));
    var poiID = unescape(getQuerystring('qryPOI'));
    lat_POI = unescape(getQuerystring('qryLat_POI'));
    long_POI = unescape(getQuerystring('qryLong_POI'));

    //Build querystring for Map Directions, Turn By Turn and Back Buttons
    var buttonQuerystring = '?qryPOI=' + poiID +
                            '&qryCatCode=' + categoryCode +
                            '&qryCatTitle=' + categoryTitle +
                            '&qryLat_POI=' + lat_POI +
                            '&qryLong_POI=' + long_POI;

    $('a[id|=icon-directions]').attr('href', 'ListDirections.html' + buttonQuerystring);
    $('a[id|=icon-map]').attr('href', 'MapDirections.html' + buttonQuerystring);
    //$('a[id=icon-back]').attr('href', 'POI.htm' + buttonQuerystring);


    //Draw initial map
    //DrawMap();

    //Get current position and display map directions
    GetCurrentPosition();

}

//========================================================================================
// --------------------------- CURRENT POSITION FUNCTIONS --------------------------------
//========================================================================================

//--------------------------------------------------------------------
// Name: GetCurrentPosition
//--------------------------------------------------------------------
function GetCurrentPosition() {

    debugPrint("Inside GetCurrentPosition()");

    //Check that browser supports geolocation
    //If it doesn't, display message and stop any more current position code from running
    if (!navigator.geolocation) {
        alert("GeoLocation info not available");
        return;
    }

    //Get current position -- but only once! -- and pass it to callback function
    navigator.geolocation.getCurrentPosition(cb_GetCurrentPosition,
                                            cb_GetCurrentPosition_Error,
                                            {
                                                enableHighAccuracy: true,
                                                maximumAge: 1000 //Retrieve new info if older than 5 seconds 
                                            }
                                            );

}

//-------------------------------------------------------------------------------
// Name: cb_GetCurrentPosition
//-------------------------------------------------------------------------------
function cb_GetCurrentPosition(positionObject) {

    debugPrint("Inside cb_GetCurrentPosition()");

    var currentLat = positionObject.coords.latitude;
    var currentLong = positionObject.coords.longitude;
    myLatlng = new google.maps.LatLng(currentLat, currentLong);
    var accuracy = positionObject.coords.accuracy;
    debugPrint("Current location: (" + currentLat + ", " + currentLong + "), " +
                "Accuracy: " + accuracy + " meters");

    //Start the directions drawing process
    getDirections(currentLat, currentLong);
}

//-------------------------------------------------------------------------------
// Name:            cb_GetCurrentPosition_Error
// Description:     Callback function: 
//-------------------------------------------------------------------------------
function cb_GetCurrentPosition_Error(err) {

    debugPrint("Inside cb_GetCurrentPosition_Error()");

    var errorMessage;

    if (err.code == 1) {
        errorMessage = "You chose not to share your location info.";
    }
    else if (err.code == 2) {
        errorMessage = "Location information currently unavailable!";
    }
    else if (err.code == 3) {
        errorMessage = "Timed out waiting to receive location information!";
    }
    else {
        errorMessage = "Unknown error occured";
    }
}

// ---------------------------------------------------------------------------------------
// name: DebugPrint(parMessage)
// ---------------------------------------------------------------------------------------
function debugPrint(parMessage) {

    if (window.console) {
        console.log(parMessage);
    }
}

//========================================================================================
// ------------------------------ DIRECTIONS FUNCTIONS -----------------------------------
//========================================================================================

//---------------------------------------------------------------
// Name: getDirections(currentPosition_Lat, currentPosition_Long)
//---------------------------------------------------------------
function getDirections(currentPosition_Lat, currentPosition_Long) {

    debugPrint("Inside getDirections()");

    directionsService = new google.maps.DirectionsService();
    var start = new google.maps.LatLng(currentPosition_Lat, currentPosition_Long);
    var end = new google.maps.LatLng(lat_POI, long_POI);
    //    var end = new google.maps.LatLng(poiLat, poiLong);
    console.log('getDirections currentLat = ' + currentPosition_Lat);
    console.log('getDirections currentLong = ' + currentPosition_Long);
    console.log('getDirections poiLat = ' + lat_POI);
    console.log('getDirections poiLong = ' + long_POI);

    //Build directions request object
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
        //travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    //Pass request object to Directions Service
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            displayDirections(response);
            //displayDirectionsOnMap(response);
        }
        else {
            alert("Sorry, unable to get directions.");
        }
    });

    //Add POI and current location markers
    //var currentLocationMarker = AddMarker(currentPosition_Lat, currentPosition_Long, "", "CurrentPosition.png");
    //var POIMarker = AddMarker(poiLat, poiLong, "", "info.png");

}

//---------------------------------------------------------------
// name: displayDirections
//---------------------------------------------------------------
function displayDirections(parDirectionResult) {

    if (WANT_MAP_DIRECTIONS) {
        displayDirectionsOnMap(parDirectionResult)
    }
    else {
        displayDirectionsTurnByTurn(parDirectionResult)
    }

}

//---------------------------------------------------------------
// Name: displayDirectionsTurnByTurn(directionResult)
//---------------------------------------------------------------

function displayDirectionsTurnByTurn(directionResult) {

    //Create DirectionsRenderer object
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
    console.log("InsideDisplayDirectionsWithList1()");

    //Draw directions on the map
    directionsDisplay.setDirections(directionResult);
    console.log("InsideDisplayDirectionsWithList2()");

    // debugPrintStepProperties(directionResult);
}

//---------------------------------------------------------------
// Name: displayDirectionsOnMap(directionResult)
//---------------------------------------------------------------
function displayDirectionsOnMap(directionResult) {

    debugPrint("Inside displayDirectionsOnMap()");

    //Create DirectionsRenderer object
    directionsDisplay = new google.maps.DirectionsRenderer();

    //Remove default google markers from map
    //directionsDisplay.suppressMarkers = true;

    //Bind the DirectionsRenderer object to map
    directionsDisplay.setMap(map);

    //Draw directions on the map
    directionsDisplay.setDirections(directionResult);

    //debugPrintStepProperties(directionResult);
}

//========================================================================================
// ------------------------------ POI MARKER FUNCTIONS -----------------------------------
//========================================================================================

////--------------------------------------------------------------------
//// Name: AddMarker
////--------------------------------------------------------------------
//function AddMarker(parLat, parLong, parTitle, parIcon) {

//    debugPrint("Inside AddMarker()");

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

// ---------------------------------------------------------------------------------------
// name: DebugPrint(parMessage)
// ---------------------------------------------------------------------------------------
function debugPrint(parMessage) {

    if (window.console) {
        console.log(parMessage);
    }
}

//--------------------------------------------------------------------
// Name:  getQuerystring Function
// Description: gets the value equal to "poi" in the url and returns 
// an integer. Additional info about this function can be viewed at
// http://www.bloggingdeveloper.com/post/javascript-querystring-parse
// Get-QueryString-with-Client-Side-JavaScript.aspx
//--------------------------------------------------------------------
function getQuerystring(key, default_) {
    if (default_ === null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs === null) {
        return default_;
    } else {
        return qs[1];
    }
}
