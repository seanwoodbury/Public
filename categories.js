//--------------------------------------------------------------------
//Program: Sylva Tour - Categories.js
//Programmers: Kyra Huffsmith
//Description: Javascript file for the Index.html page
//--------------------------------------------------------------------

$(document).bind("mobileinit", function () {
    $.mobile.ajaxEnabled = false;
    $.mobile.pushStateEnabled = false;
});

//--------------------------------------------------------------------
// Name:  documentReady function
// Description: Get the current Category List
//--------------------------------------------------------------------

$(document).ready(function() {
   // put all your jQuery goodness in here.
    //Get Category list info
    getListOfCategories();
});

//--------------------------------------------------------------------
// Name:  getListOfTours function
// Description: Get data from the Data_POI.js file
//--------------------------------------------------------------------
function getListOfCategories() {
    $.ajax({
        type: "GET",
        url: "ListOfCategories.js",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: success_GetCategoryList_CallbackFunction,
        error: error_GetCategoryList_CallbackFunction
    });
}

//--------------------------------------------------------------------
// Name:  Ajax Callbacks
//--------------------------------------------------------------------

//----------------------------------------------------------------
// Name:  success_GetCategoryList_CallbackFunction
// Description: Function that runs after the retrieval of the JSON
// object via the Ajax request
//----------------------------------------------------------------
function success_GetCategoryList_CallbackFunction(parRetrievedData) {

    var sortedArray = parRetrievedData; 

//   sortedArray = sortArrayByTitle(parRetrievedData);

    //Display sorted array
    displayArray(sortedArray);
}

//----------------------------------------------------------------
// Name:  error_GetCategoryListt_CallbackFunction
// Description: Function that runs after the failure to retrieve 
// of the JSON object via the Ajax request
//----------------------------------------------------------------
function error_GetCategoryList_CallbackFunction(parXMLHttpRequestObject) {

    //If the info can not be used from the Data_POI.js file, display an error
    alert("Unable to reach server. Please try again later.");
}

//--------------------------------------------------------------------
// Name: sortArrayByTitle
// Description: Sorts the array by the Titles of the POIs
//(NOTE: This was taken out so that Promotions would stay that the top of 
//the Index List...as per request from client)
//--------------------------------------------------------------------
//function sortArrayByTitle(parArrayToSort) {

//    //Sort the array by distance from the user
//    var sortedArray = parArrayToSort.sort(
//                        function (a, b) {
//                            var firstCategory = a.CategoryName.toLowerCase;
//                            var secondCategory = b.CategoryName.toLowerCase;
//                            if (firstCategory < secondCategory) { return -1 }
//                            if (firstCategory > secondCategory) { return 1 }
//                            return 0;
//                        }
//     );
//    return sortedArray;
//}

//--------------------------------------------------------------------
// Name: displayArray
// Description: Display the locations by distance from the user
//(if available), or by title (if not available)
//--------------------------------------------------------------------
function displayArray(parArray) {

    //Local variables
    var arrayIndex = 0;
    var display = "";

    //Loop through the array to assign object properties to local variables
    while (arrayIndex < parArray.length) {
        var catCode = parArray[arrayIndex].CategoryCode;
        var catTitle = parArray[arrayIndex].CategoryName;

        display += '<li id="' + catTitle.replace(/\s+/g, '') + '" ><a href="poiList.html?qryCatCode=' + catCode + '&qryCatTitle=' + catTitle + '" rel="external">' +
            '<img src="Images/' + catTitle + '.png" class="ui-li-icon"><span>' + catTitle + "</span></a></li>";

        //Move to the next row of data for the next location
        arrayIndex++;
    }

    //Display all items in the array
    $("#lstCategories").append(display).listview("refresh");

}
