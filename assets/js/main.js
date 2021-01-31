// document ready statement to make sure the page fully loads before running this code.
$(document).ready(function () {

    // global variables
    var today;
    var refreshData = false;
    var storedHeadlineData = [];

    // initialize foundation plugin.
    $(document).foundation();

    // initial function calls.
    initialDateLogic();
    buildHeadlineSection();

    // function to do initial date logic work.
    function initialDateLogic() {
        // get current date and make into format of mm/dd/yyyy.
        today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        // get stored date from localStorage.
        var savedDate = localStorage.getItem("savedDate");

        // compare current date and date in local storage to see if we need to refresh the data on the page.
        if (today != savedDate) {
            refreshData = true;
        }
    }

    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <start> headline section js code <start>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************

    function buildHeadlineSection() {
        // check refreshData boolean - this will tell us if we have to call the API or use data from local storage.
        // var refreshData = true; // DEBUG - REMOVE WHEN GOING LIVE (uncomment this to force use of livescore API).
        console.log("refreshData: " + refreshData); //DEBUG - REMOVE WHEN GOING LIVE.
        if (refreshData) {
            // refresh true therefore we will call the livescore API and pull new data.
            callLivescoreApi();
        }
        else {
            // refresh false therefore we will use the saved headline data from local storage.
            // call function to render headline data to the screen.
            renderHeadlineData();
        }

        // store headline data into local storage.
        function storeHeadlineDataInLocalStorage(headlineText, headlineUrl) {
            var newHeadlineDetails = {
                text: headlineText,
                url: headlineUrl,
            };
            // Get existing stored details
            if (localStorage.getItem("headlineData") != null) {
                storedHeadlineData = JSON.parse(localStorage.getItem("headlineData"));
            }

            storedHeadlineData.push(newHeadlineDetails);
            localStorage.setItem("headlineData", JSON.stringify(storedHeadlineData));
        }

        // get headline data from local storage.
        function getHeadlineDataFromLocalStorage() {
            storedHeadlineData = JSON.parse(localStorage.getItem("headlineData"));
        }

        // function to call the livescore API.
        function callLivescoreApi() {
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
                console.log("**** livescore API used ****"); //DEBUG - REMOVE WHEN GOING LIVE.
                // as we are pulling new data to display update the saved date in local storage to todays date.
                localStorage.setItem("savedDate", today);
                // clear out old headline data from local storage before loading new data.
                localStorage.removeItem("headlineData");
                // loop thru response data 10 times to get top 10 headlines and then store in local storage.
                for (var i = 0; i < 10; i++) {
                    var urlText = response.data[i].title;
                    var urlLink = response.data[i].url;
                    // call function to store data to local storage.
                    storeHeadlineDataInLocalStorage(urlText, urlLink);
                }
                // call function to render headline data to the screen.
                renderHeadlineData();
            });
        }
        // render headline data to the screen.
        function renderHeadlineData() {
            // call function to get headline data from local storage.
            getHeadlineDataFromLocalStorage();
            // loop round local storage headline data and build elements to screen.
            for (let i = 0; i < storedHeadlineData.length; i++) {
                var newHeadline = $("<li>").addClass("headline");
                var newHeadlineLink = $("<a>").attr({ href: storedHeadlineData[i].url, target: "_blank" }).text(storedHeadlineData[i].text);
                newHeadline.append(newHeadlineLink)
                $(".headline-section").append(newHeadline);
            }
        }

    }
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