//--------------------------------------------------------------------
// Program: poiList_CurrentPosition.js
// Date:
// Description: 
//
//  startCurrentPositionWatcher
//      cb_UpdateCurrentPosition   => callback function!
//          drawCurrentPositionMarker or displayListOfPOIs
//      cb_UpdateCurrentPosition_Error      
//---------------------------------------------------------------------

//--------------------------------------------------------------------
// Name: startCurrentPositionWatcher
//--------------------------------------------------------------------
function startCurrentPositionWatcher() {

    debugPrint("Inside startCurrentPositionWatcher function");

    //Check that browser supports geolocation
    //If it doesn't, display message and stop any more current position code from running
    if (!navigator.geolocation) {
        $("#divDisplay").hide();
        $("#divError").show();
        $("#divError").html("Geolocation information not available!");
        return;
    }

    //Get current position -- whenever position changes -- 
    //and pass it to callback function
    navigator.geolocation.watchPosition(cb_UpdateCurrentPosition,
                                        cb_UpdateCurrentPosition_Error,
                                        {
                                            enableHighAccuracy: true,
                                            maximumAge: 5000 //Retrieve new info if older than 5 seconds 
                                        }
                                        );
}

//-------------------------------------------------------------------------------
// Name: cb_UpdateCurrentPosition
//-------------------------------------------------------------------------------
function cb_UpdateCurrentPosition(positionObject) {

    debugPrint("");
    debugPrint("******************************************");
    debugPrint("Inside cb_UpdateCurrentPosition function");
    debugPrint("mapListPageInfo.CurrentPageView = " + mapListPageInfo.CurrentPageView);

    //Update current position global
    mapListPageInfo.PositionWatcherStarted = true;
    mapListPageInfo.GeoLocationAvailable = true;
    mapListPageInfo.CurrentPosition_Lat = positionObject.coords.latitude;
    mapListPageInfo.CurrentPosition_Long = positionObject.coords.longitude;
    mapListPageInfo.CurrentPosition_Accuracy = positionObject.coords.accuracy;

    debugPrint("mapListPageInfo object = ");
    console.dir(mapListPageInfo);

    //Draw or redraw current position marker
    if (mapListPageInfo.CurrentPageView === "MAP") {
        drawCurrentPositionMarker();
    }
    else {
        displayListOfPOIs();
    }

}


//-------------------------------------------------------------------------------
// Name:            cb_UpdateCurrentPosition_Error
// Description:     Callback function: 
//-------------------------------------------------------------------------------
function cb_UpdateCurrentPosition_Error(err) {

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

    $("#divDisplay").hide();
    $("#divError").show();
    $("#divError").html(errorMessage);
}
