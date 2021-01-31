// document ready statement to make sure the page fully loads before running this code.
$(document).ready(function () {

    // initialize foundation plugin.
    $(document).foundation();

    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <start> headline section js code <start>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************

    // setup ajax livescore api parameters.
    const livescoreParams = {
        "async": true,
        "crossDomain": true,
        "url": "https://livescore-football.p.rapidapi.com/soccer/news-list?page=1",
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "ff0210cd47msh983c81cf4ee3a53p1bc6d3jsn78402c8c5e1a",
            "x-rapidapi-host": "livescore-football.p.rapidapi.com"
        }
    };

    // call livescore api.
    $.ajax(livescoreParams).done(function (response) {
        console.log("liveScore data:");
        for (var i = 0; i < 10; i++) {
            var urlText = response.data[i].title;
            var urlLink = response.data[i].url;
            var newHeadline = $("<li>").addClass("headline");
            var newHeadlineLink = $("<a>").attr({ href: urlLink, target: "_blank" }).text(urlText);
            newHeadline.append(newHeadlineLink)
            $(".headline-section").append(newHeadline);
        }
    });

    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <end> headline section js code <end>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************

});