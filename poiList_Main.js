//--------------------------------------------------------------------
//Program: poiList_Main.js
//Date:
//Description: Javascript file for the MapList.htm page

//  List Page Init
//      startGettingData
//          loadCategoryPOIData - conditionally
//              cb_LoadCatData_Success   => callback function!
//                  drawPageHeader
//                  showListPage or showMapPage                 
//          startCurrentPositionWatcher - conditionally
//  Map Page Init
//      startGettingData
//          loadCategoryPOIData - conditionally
//              cb_LoadCatData_Success   => callback function!
//                  drawPageHeader
//                  showListPage or showMapPage
//          startCurrentPositionWatcher - conditionally
//  Map Page pageshow
//      addMarkersToMap  - conditionally
//      drawCurrentPositionMarker- conditionally

//  showMapPage()
//      drawPageHeader()
//      initializeMap()
//  showListPage()
//      drawPageHeader()
//      sortArrayByTitle()
//      displayListOfPOIs()
// ============================================================================
//---------------------------------------------------------------
//ioS 5 Fix
var myCurrentPositionHandle;
$(window).unload(function () {
    window.navigator.geolocation.clearWatch(myCurrentPositionHandle);
});
//---------------------------------------------------------------

//Global Variables
var map = null;

//Use object for some global variables
var mapListPageInfo = {};
    mapListPageInfo.MapCenter_Lat = 35.369403;
    mapListPageInfo.MapCenter_Long = -83.25079
    mapListPageInfo.ArrayOfPOIData = [];
    mapListPageInfo.POIDataIsLoaded = false;
    mapListPageInfo.GeoLocationAvailable = false;
    mapListPageInfo.PositionWatcherStarted = false;
    mapListPageInfo.CurrentPosition_Lat = null;
    mapListPageInfo.CurrentPosition_Long = null;
    mapListPageInfo.CurrentPosition_Accuracy = null;
    mapListPageInfo.CurrentPageView = "LIST";  //The List page will be shown first.
    mapListPageInfo.CategoryTitle = "";
    mapListPageInfo.CategoryCode = "";

//--------------------------------------------------------------------
// List Page Init
// This will run first -- The List page will be the first page shown!!
//--------------------------------------------------------------------
    $('#poi_list').live('pageinit', function (event) {

        debugPrint("=======================================");
        debugPrint("Inside poi_list pageinit event handler");
        debugPrint("=======================================");
        
        
        //alert("Inside List page init function");

        //Wire-up nav bar button event handlers
        $("#icon-map").on("click", showMapPage);
        //$("#List_ListNav").on("click", showListPage); //DON'T ADD EVENT HANDLER???

        //Update current page tracker: LIST view
        mapListPageInfo.CurrentPageView = "LIST";

        //Let's get started loading and retrieving info!
        startGettingData();

    });

//------------------------------------------------------------
// Map Page Init
//------------------------------------------------------------
    $('#poi_map').live('pageinit', function (event) {

    debugPrint("=======================================");
    debugPrint("Inside poi_map page init event handler");
    debugPrint("=======================================");
    
    //alert("Inside Map page init function");

    //Wire-up nav bar button event handlers
    //$("#Map_MapNav").on("click", showMapPage);  //DON'T ADD EVENT HANDLER???
    $("#icon-list").on("click", showListPage);

    //Update current page tracker: MAPT view
    mapListPageInfo.CurrentPageView = "MAP";

    //Let's get started loading and retrieving info!
    startGettingData();
    $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    $(window).resize(function () {
        $("#divMapCanvas").height($("#poi_map").height() - $(".ui-header").height() - $(".ui-footer").height());
    });
});


//------------------------------------------------------------
// Map Page pageshow
//------------------------------------------------------------
$('#poi_map').live('pageshow', function (event) {

    debugPrint("=======================================");
    debugPrint("Inside poi_map pageshow event handler");
    debugPrint("=======================================");

    //alert("Inside Map pageshow event handler");

    console.dir(map);
    if (map !== null) {

        $("#divMapCanvas").fadeIn()

        google.maps.event.trigger(map, 'resize');

//        //Add markers
//        addMarkersToMap();
        //Show current position
        drawCurrentPositionMarker();

        var mapCenterCoordinates = new google.maps.LatLng(mapListPageInfo.MapCenter_Lat,
                                                      mapListPageInfo.MapCenter_Long);

        map.setCenter(mapCenterCoordinates);
    }


});

//--------------------------------------------------------------------
// Name: startGettingData()
//--------------------------------------------------------------------
function startGettingData() {

    debugPrint("Inside startGettingData function");

    mapListPageInfo.CategoryTitle = unescape(getQuerystring('qryCatTitle'));
    mapListPageInfo.CategoryCode = $.trim(unescape(getQuerystring('qryCatCode')));

    //Make Ajax call to read from Category POI JSON data file into an array of POI objects
    if (!mapListPageInfo.POIDataIsLoaded) {
        loadCategoryPOIData();
    }

    //Make Ajax call to setup and start Current Position watcher and marker
    if (!mapListPageInfo.PositionWatcherStarted) {
        startCurrentPositionWatcher();
    }
}

//--------------------------------------------------------------------
// Name: showMapPage
//--------------------------------------------------------------------
function showMapPage() {

    debugPrint("Inside showMapPage function");

    //If it is already on the Map page, 
    // Don't do anything and stop right here
//    if (mapListPageInfo.CurrentPageView === "MAP")
//        return;

    //Otherwise, update the page view tracker and draw the page
     mapListPageInfo.CurrentPageView = "MAP"

    $.mobile.changePage("#poi_map", {
        transition: "flip"
    });

    drawPageHeader();

    initializeMap(mapListPageInfo.MapCenter_Lat, mapListPageInfo.MapCenter_Long); 
    
}

//--------------------------------------------------------------------
// Name: showListPage
//--------------------------------------------------------------------
function showListPage() {

    console.log("Inside showListPage");
    //debugPrint("Inside showListPage function");

    //If it is already on the List page, 
    // Don't do anything and stop right here
//    if (mapListPageInfo.CurrentPageView === "LIST")
//        return;

    //Otherwise, update the page vie tracker and draw the page
    mapListPageInfo.CurrentPageView = "LIST"
        
    $.mobile.changePage("#poi_list", {
        transition: "flip",
        reverse: true
    });

    //Draw top of page
    drawPageHeader();

    //Draw list of POIs
    //Initially, sort poi array by title and display
    sortArrayByTitle(mapListPageInfo.ArrayOfPOIData);
    displayListOfPOIs();
}

//--------------------------------------------------------------------
// Name: drawPageHeader
//--------------------------------------------------------------------
function drawPageHeader() {

    debugPrint("Inside drawPageHeader");
    console.dir(mapListPageInfo);
    
    var categoryTitle, categoryCode;

    categoryTitle = mapListPageInfo.CategoryTitle;
    categoryCode = mapListPageInfo.CategoryCode;

    console.log("categoryTitle = " + categoryTitle);

    //Set the page title and NavBar titles
    if(mapListPageInfo.CurrentPageView === "MAP") {
        $("#mapPageTitle").html(categoryTitle + ' Map');
    }
    else if(mapListPageInfo.CurrentPageView === "LIST"){
        $("#listPageTitle").html(categoryTitle);

        ///TODO - NOT WORKING!!!
//        $("#List_MapNav").
//            removeClass("ui-control-inactive").
//            addClass("ui-control-active").
//            button('refresh');
       
//        $("#List_ListNav").
//                removeClass("ui-control-inactive").
//                addClass("ui-control-inactive");
//        });
    }
}

//--------------------------------------------------------------------
// Name: loadCategoryPOIData
//--------------------------------------------------------------------
function loadCategoryPOIData() {

    debugPrint("Inside loadCategoryPOIData function");

    var categoryCode, fileURL;

    //Build url string
    categoryCode = getQuerystring('qryCatCode');
    fileURL = "Category_" + categoryCode + ".js";

    //Read JSON file
    $.ajax({
        type: "GET",
        url: fileURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: cb_LoadCatData_Success,
        error: cb_LoadCatData_Error
    });
}

//--------------------------------------------------------------------
// Name: cb_LoadCatData_Success
//--------------------------------------------------------------------
function cb_LoadCatData_Success(parRetrievedData) {

    debugPrint("");
    debugPrint("-----------------------------------------");
    debugPrint("Inside cb_LoadCatData_Success function");

    //Put retrieved data into global array and flag it as loaded
    mapListPageInfo.ArrayOfPOIData = parRetrievedData;
    mapListPageInfo.POIDataIsLoaded = true;
    console.dir(mapListPageInfo);

    debugPrint("mapListPageInfo.CurrentPageView = " + mapListPageInfo.CurrentPageView);
    
    //Draw top of page
    drawPageHeader();

    //Display either list or map page
    if (mapListPageInfo.CurrentPageView === "LIST") {
        showListPage();
    }
    else {
        showMapPage();
    }
}



//--------------------------------------------------------------------
// Name: cb_LoadCatData_Error
//--------------------------------------------------------------------
function cb_LoadCatData_Error(parXMLHttpRequestObject) {

    //If unable to receive information from the JSON Object, display an error message
    alert("Unable to load Map data. Please try again later.");
}


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
