//--------------------------------------------------------------------
//Program: Sylva Tour - Main.js 
//Author: Kyra Huffsmith
//Date: 11/4/2015
//Description: Javascript for all client-side pages in app. Allows for
//             quick javascript changes to be made across application.
//--------------------------------------------------------------------

$(document).ready(function () {
    $('.nav-bar').hide();
    $('.togglenav').click(function () {
        $('.shownav').toggle();
        $('.hidenav').toggle();
        $('.nav-bar').slideToggle();
    });

    $('a#icon-back').click(function () {
        parent.history.back();
        return false;
    });
});