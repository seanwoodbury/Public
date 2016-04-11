//--------------------------------------------------------------------
//Program: Dillsboro - ListDirections.js 
//Author: Scott Richmond, Scott Coffey, Justin Travis
//Date: 12/8/2011
//Description: Javascript file for the ListDirections.htm page
//--------------------------------------------------------------------

//
//Functions:
//      DrawScreen
//      
//          GetCurrentPosition
//              cb_GetCurrentPosition
//                  getDirections
//                      displayDirectionsTurnByTurn
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
var WANT_MAP_DIRECTIONS = false;
//--------------------------------------------------------------------
// Name:  Document Ready Function
//--------------------------------------------------------------------
$(document).ready(function () {
    DrawScreen();
});


//Start Old Code
//$('#map_result').live('pageshow', function (event) {

//    DrawScreen();
//});


////Variables Page level in scope
//var poiLat="";
//var poiLong = "";
//var directionsService = new google.maps.DirectionsService();
//var directionsDisplay = new google.maps.DirectionsRenderer();

////--------------------------------------------------------------------
//// Name:  Document Ready Function
////--------------------------------------------------------------------
//$.extend($.mobile, {
//    hashListeningEnabled: false
//});

//$(document).ready(function () {

//    var categoryID = getQuerystring('qryCatCode');
//    var poiID = getQuerystring('qryPOI');
//    var categoryTitle = getQuerystring('qryCatTitle');

//    //Add href info to Map Direction Button
//    $('a[id|=ListDirections]').attr('href', 'ListDirections.htm?qryPOI=' + poiID + '&qryCatCode='
//                                + categoryID + '&qryCatTitle=' + categoryTitle);
//    $('a[id|=MapDirections]').attr('href', 'MapDirections.htm?qryPOI=' + poiID
//        + '&qryCatCode=' + categoryID + '&qryCatTitle=' + categoryTitle);
//    $('a[id|=BackBut]').attr('href', "POI.htm?qryPOI=" + poiID + "&qryCatCode=" + categoryID + "&qryCatTitle=" + categoryTitle);



//    var categoryFileName = "Category_" + categoryID + ".js";
//    var pathToCategoryDataFile = "Data_Categories/" + categoryFileName;

//    //Get data from JSON object in Data_Categories file
//    $.ajax({
//        type: "GET",
//        url: pathToCategoryDataFile,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: success_GetAllLocations_CallbackFunction,
//        error: error_GetAllLocations_CallbackFunction
//    });
//    console.log("Inside documentReady()");

//});

////--------------------------------------------------------------------
//// Ajax Callback Functions
////--------------------------------------------------------------------

////----------------------------------------------------------------
//// Name:  success_GetAllLocations_CallbackFunction
//// Description: Function that runs after the retrieval of the JSON
//// object via the Ajax request
////---------------------------------------------------------------- 
//function success_GetAllLocations_CallbackFunction(parRetrievedData) {

//    //Retrieve the incoming POI ID from the querystring
//    var poiID = getQuerystring('qryPOI');
//    console.log("poiID = " + poiID);
//    
//    //Loop through the retrieved array of POI objects to get chosen POI info
//    for (arrayIndex = 0; arrayIndex < parRetrievedData.length; arrayIndex++) {
//    
//    var currentPOIID = parRetrievedData[arrayIndex].POI_ID;
//    console.log("currentPOIID = " + currentPOIID);
//    
//    //Get info from desired POI
//    if (currentPOIID == poiID) {
//        console.log("chosen POI = " + currentPOIID);

//            var lat = parRetrievedData[arrayIndex].POI_Latitude;
//            var long = parRetrievedData[arrayIndex].POI_Longitude;
//            var title = parRetrievedData[arrayIndex].POI_Title;
//            break;
//        }       
//    }
//        poiLat = lat;
//        poiLong = long;

//        //Make Ajax call to setup and start Current Position watcher and marker
//        StartCurrentPositionWatcher();
//}
////----------------------------------------------------------------
//// Name:  error_GetAllLocations_CallbackFunction
//// Description: Function that runs after the failure to retrieve 
//// of the JSON object via the Ajax request
////----------------------------------------------------------------
//function error_GetAllLocations_CallbackFunction(parXMLHttpRequestObject) {

//    //If the info can not be used from the Data_POI.js file, display an error
//    alert("Unable to reach server. Please try again later.");
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
//    navigator.geolocation.watchPosition(cb_RetrieveCurrentPosition_Success,
//                                        cb_RetrieveCurrentPosition_Error,
//                                        {
//                                            enableHighAccuracy: true,
//                                            maximumAge: 1000 //Retrieve new info if older than 5 second 
//                                        }
//                                        );
//                                    
//      console.log("Inside StartCurrentPositionWatcher()");
//}
////---------------------------------------------------------------------------
//// Name: cb_RetrieveCurrentPosition_Success
////---------------------------------------------------------------------------
//function cb_RetrieveCurrentPosition_Success(positionObject) {

//    var currentLatitude = positionObject.coords.latitude;
//    var currentLongitude = positionObject.coords.longitude;

//    console.log("Inside cb_RetrieveCurrentPosition_Success()");

//    //Get and display directions 
//    getDirections(currentLatitude, currentLongitude);
//}

////-------------------------------------------------------------------------------
//// Name:            cb_RetrieveCurrentPosition_Error
//// Description:     Callback function: 
////-------------------------------------------------------------------------------
//function cb_RetrieveCurrentPosition_Error(err) {

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

//    console.log("Error message:  " + errorMessage);
//} 


////=================================================================================
//// -------------------- GET AND DISPLAY DIRECTION FUNCTIONS -----------------------
////=================================================================================

////---------------------------------------------------------------
//// Name: getDirections(currentPosition_Lat, currentPosition_Long)
////---------------------------------------------------------------
//function getDirections(currentPosition_Lat, currentPosition_Long) {

// //   var directionsService = new google.maps.DirectionsService();
//    var start = new google.maps.LatLng(currentPosition_Lat, currentPosition_Long);
//    var end = new google.maps.LatLng(poiLat, poiLong); //POI in Dillsboro

//    //Build directions request object
//    var request = {
//        origin: start,
//        destination: end,
//        travelMode: google.maps.DirectionsTravelMode.DRIVING
//        //travelMode: google.maps.DirectionsTravelMode.WALKING
//    };
//    console.log("Inside getDirections()");

//    //Pass request object to Directions Service
//    directionsService.route(request, function (response, status) {
//        if (status == google.maps.DirectionsStatus.OK) {
//            displayDirectionsWithList(response);
//        }
//        else {
//            alert("Sorry, unable to get directions.");
//        }
//    });

//}

////---------------------------------------------------------------
//// Name: displayDirectionsWithList(directionResult)
////---------------------------------------------------------------

//function displayDirectionsWithList(directionResult) {

//    //Create DirectionsRenderer object

//    directionsDisplay.setPanel(document.getElementById("directionsPanel"));
//    console.log("InsideDisplayDirectionsWithList1()");
//    
//    //Draw directions on the map
//    directionsDisplay.setDirections(directionResult);
//    console.log("InsideDisplayDirectionsWithList2()");

//   // debugPrintStepProperties(directionResult);
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