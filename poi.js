//--------------------------------------------------------------------
//Program: Dillsboro - POI.js 
//Author: Scott Richmond, Scott Coffey, Justin Travis, 
//Photoswipe: Daniel Keener, Britt Cline, Mitch Odom, Todd Michael
//Date: 12/8/2011
//Description: Javascript file for the POI.htm page
//PhotoSwipe: Added 10/24/2012, Updated 4/1/2013
//--------------------------------------------------------------------

$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//Variables Page level in Scope
var poiID;
var categoryID;
var categoryTitle;
var lat_POI;
var long_POI;


//--------------------------------------------------------------------
// Name:  Document Ready Function
//--------------------------------------------------------------------
$(document).ready(function () {

    //Get incoming querystring values
    poiID = unescape(getQuerystring('qryPOI'));
    categoryID = unescape(getQuerystring('qryCatCode'));
    categoryTitle = unescape(getQuerystring('qryCatTitle'));
    lat_POI = unescape(getQuerystring('qryLat_POI'));
    long_POI = unescape(getQuerystring('qryLong_POI'));


    var categoryFileName = "Category_" + categoryID + ".js";
    var pathToCategoryDataFile = categoryFileName;

    //Get data from JSON object in Data_Categories file
    $.ajax({
        type: "GET",
        url: pathToCategoryDataFile,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success_GetAllLocations_CallbackFunction,
        error: error_GetAllLocations_CallbackFunction
    });

    //$('a[id|=icon-back]').attr('href', 'poiList.html?qryCatCode=' + categoryID + '&qryCatTitle=' + categoryTitle);
});


//--------------------------------------------------------------------
// Ajax Callback Functions
//--------------------------------------------------------------------

//----------------------------------------------------------------
// Name:  success_GetAllLocations_CallbackFunction
// Description: Function that runs after the retrieval of the JSON
// object via the Ajax request
//---------------------------------------------------------------- 
function success_GetAllLocations_CallbackFunction(parRetrievedData) {

    console.log("Inside success_GetAllLocations()");

    //Retrieve the incoming POI ID from the querystring
    var poiID = getQuerystring('qryPOI');
   console.log("poiID = " + poiID);
    
    //Loop through the retrieved array of POI objects to get chosen POI info
    for (arrayIndex = 0; arrayIndex < parRetrievedData.length; arrayIndex++) {
    
    var currentPOIID = parRetrievedData[arrayIndex].POI_ID;
   // console.log("currentPOIID = " + currentPOIID);
    
    //Get info from desired POI
    if (currentPOIID == poiID) {
        // console.log("chosen POI = " + currentPOIID);

            var lat = parRetrievedData[arrayIndex].POI_Latitude;
            var long = parRetrievedData[arrayIndex].POI_Longitude;
            var title = parRetrievedData[arrayIndex].POI_Title;
            var desc = parRetrievedData[arrayIndex].POI_Description;
            var image1 = parRetrievedData[arrayIndex].POI_Image1;
            var image2 = parRetrievedData[arrayIndex].POI_Image2;
            var image3 = parRetrievedData[arrayIndex].POI_Image3;
            var image4 = parRetrievedData[arrayIndex].POI_Image4;
            var image5 = parRetrievedData[arrayIndex].POI_Image5;
            var image6 = parRetrievedData[arrayIndex].POI_Image6;
            var address1 = parRetrievedData[arrayIndex].POI_Address1;
            var address2 = parRetrievedData[arrayIndex].POI_Address2;
            var city = parRetrievedData[arrayIndex].POI_City;
            var state = parRetrievedData[arrayIndex].POI_State;
            var zip = parRetrievedData[arrayIndex].POI_ZipCode;
            var phone = parRetrievedData[arrayIndex].POI_Phone;
            var url = parRetrievedData[arrayIndex].POI_URL;
            var cat = parRetrievedData[arrayIndex].POI_Category;
            var petFriendly = parRetrievedData[arrayIndex].POI_PetFriendly;
            var imageDesc1 = parRetrievedData[arrayIndex].POI_Image1_Desc;
            var imageDesc2 = parRetrievedData[arrayIndex].POI_Image2_Desc;
            var imageDesc3 = parRetrievedData[arrayIndex].POI_Image3_Desc;
            var imageDesc4 = parRetrievedData[arrayIndex].POI_Image4_Desc;
            var imageDesc5 = parRetrievedData[arrayIndex].POI_Image5_Desc;
            var imageDesc6 = parRetrievedData[arrayIndex].POI_Image6_Desc;
            break;
        }
    }
    var categoryTitle = unescape(getQuerystring('qryCatTitle'));
    var categoryID = unescape(getQuerystring('qryCatCode'));
  
        console.log("Inside = " + url);
//    console.log("CategoryID = " + categoryID);
//    console.log("CategoryTitle = " + categoryTitle);

        //Add link to buttons on POI.htm
        var buttonQuerystring = '?qryPOI=' + poiID +
                        '&qryCatCode=' + categoryID +
                        '&qryCatTitle=' + categoryTitle +
                        '&qryLat_POI=' + lat_POI +
                        '&qryLong_POI=' + long_POI;

        //$('a[id|=MapDirections]').attr('href', 'MapDirections.html' + buttonQuerystring);
        $('a[id|=icon-directions]').attr('href', 'ListDirections.html' + buttonQuerystring);

    //Add the title to the header and the info area
    $('#placeTitle').text(title);
    $('#top-left #placeAddress1').text(address1);
    $('#top-left #placeCity').text(city + ', ');
    $('#top-left #placeState').text(state + '  ');
    $('#top-left #placeZip').text(zip);
    $('#top-left #placePhone').html('<a href="tel:' + phone + ' " >' + phone + "</a>");
    $('#top-left #placeURL').html('<a href="' + url + ' " target="_blank">Website</a>');
    $('#desc').html(desc);

    //add if the poi is pet friendly
    if (petFriendly == true) {
        $('#petFriendly').text("We are Pet Friendly!");
    }

    //Display POI Info
    $('input[name|=q]').attr('value', [lat, long]);

    var imageQueryString = 'Display_Image.htm?qryPOI=' + poiID +
                            '&qryCatCode=' + categoryID +
                            '&qryCatTitle=' + categoryTitle +
                            '&qryLat_POI=' + lat_POI +
                            '&qryLong_POI=' + long_POI +
                            '&qryImgFileName=';

    //Build and display first image (if any)
    //This assumes that if we don't have an image1 we don't have any images at all.
    if (image1 != "") {
        $('ul[id|=Gallery] li[id|=1]').html('<a rel="external" id="image1"  href="Images/' + image1 + '"><img id="mainImage" src="Images/' + image1 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('span[id|=mainImage]').html('<img id="main" alt="" src="Images/' + "no-image.jpg" + '" />');

        $('ul[id|=Gallery] li[id|=1]').hide();
    }
    //Build and display second image (if any)
    if (image2 != "") {
        $('ul[id|=Gallery] li[id|=2]').html('<a rel="external" href="Images/' + image2 + '"><img class="extra" src="Images/' + image2 + '" /></a>');
        $('#Gallery').show();
    }
    else {
        $('ul[id|=Gallery] li[id|=2]').hide();
    }

    //Build and display third image (if any)
    if (image3 != "") {
        $('ul[id|=Gallery] li[id|=3]').html('<a rel="external" href="Images/' + image3 + '"><img class="extra" src="Images/' + image3 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=3]').hide();
    }

    //Build and display the fourth image (if any)
    if (image4 != "") {
        $('ul[id|=Gallery] li[id|=4]').html('<a rel="external" href="Images/' + image4 + '"><img class="extra" src="Images/' + image4 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=4]').hide();
    }

    //Build and display the fifth image (if any)
    if (image5 != "") {
        $('ul[id|=Gallery] li[id|=5]').html('<a rel="external" href="Images/' + image5 + '"><img class="extra" src="Images/' + image5 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=5]').hide();
    }

    //Build and display sixth image (if any)
    if (image6 != "") {
        $('ul[id|=Gallery] li[id|=6]').html('<a rel="external" href="Images/' + image6 + '"><img class="extra" src="Images/' + image6 + '" /></a>');
    }
    else {
        $('ul[id|=Gallery] li[id|=6]').hide();
    }

    //Photoswipe function
    var myPhotoSwipe = $("#Gallery a").photoSwipe({ enableMouseWheel: false, enableKeyboard: false });
}

//----------------------------------------------------------------
// Name:  error_GetAllLocations_CallbackFunction
// Description: Function that runs after the failure to retrieve 
// of the JSON object via the Ajax request
//----------------------------------------------------------------
function error_GetAllLocations_CallbackFunction(parXMLHttpRequestObject) {

    //If the info can not be used from the Data_POI.js file, display an error
    alert("Unable to reach server. Please try again later.");
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