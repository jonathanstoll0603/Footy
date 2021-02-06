// document ready statement to make sure the page fully loads before running this code.
$(document).ready(function () {
    // initialize foundation plugin.
    $(document).foundation();
  
    // global variables
    var today;
    var today_YYYYMMDD;
    var refreshData = false;
    var storedHeadlineData = [];
    var liveScoreApiKey = "f3f1e57634mshb683402bb676480p196c9fjsn78dfd0c55f8f";
  
    // initialize foundation plugin.
    $(document).foundation();
  
    // initial function calls.
    initialDateLogic();
    getTickerData();
    buildHeadlineSection();
  
    // function to do initial date logic work.
    function initialDateLogic() {
      // get current date and make into format of mm/dd/yyyy.
      today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      today = mm + "/" + dd + "/" + yyyy;
      today_YYYYMMDD = yyyy + mm + dd;
  
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
      } else {
        // refresh false therefore we will use the saved headline data from local storage.
        // call function to render headline data to the screen.
        renderHeadlineData();
      }
  
      // store headline data into local storage.
      function storeHeadlineDataInLocalStorage(headlineText, headlineUrl, headlineImage) {
        var newHeadlineDetails = {
          text: headlineText,
          url: headlineUrl,
          image: headlineImage,
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
          async: true,
          crossDomain: true,
          url:
            "https://livescore-football.p.rapidapi.com/soccer/news-list?page=1",
          method: "GET",
          headers: {
            "x-rapidapi-key": liveScoreApiKey,
            "x-rapidapi-host": "livescore-football.p.rapidapi.com",
          },
        };
  
        // call livescore api.
        $.ajax(livescoreParams).done(function (response) {
          console.log("**** livescore (headlines) API used ****"); //DEBUG - REMOVE WHEN GOING LIVE.
          // as we are pulling new data to display update the saved date in local storage to todays date.
          localStorage.setItem("savedDate", today);
          // clear out old headline data from local storage before loading new data.
          localStorage.removeItem("headlineData");
          // loop thru response data 10 times to get top 10 headlines and then store in local storage.
          for (var i = 0; i < 14; i++) {
            var urlText = response.data[i].title;
            var urlLink = response.data[i].url;
            var urlImage = response.data[i].image;
            // call function to store data to local storage.
            storeHeadlineDataInLocalStorage(urlText, urlLink, urlImage);
          }
          // call function to render headline data to the screen.
          renderHeadlineData();
        });
      }
      // render headline data to the screen.
      function renderHeadlineData() {
        // call function to get headline data from local storage.
        getHeadlineDataFromLocalStorage();
        var nth = 0;
        $(".orbit-container li").empty();
        // loop round local storage headline data and build elements to screen.
        for (let i = 0; i < storedHeadlineData.length; i++) {
          if (i < 4) {
            var orbitURL = storedHeadlineData[i].url;
            var orbitImgSrc = storedHeadlineData[i].image;
            var orbitFigcaptionText = storedHeadlineData[i].text;
            var orbitFigureTag = $("<figure>").addClass("orbit-figure");
            var orbitATag = $("<a>").attr({ href: orbitURL, target: "_blank" });
            var orbitImgTag = $("<img>").addClass("orbit-image").attr({ src: orbitImgSrc, alt: "alt text" });
            var orbitFigcaptionTag = $("<figcaption>").addClass("orbit-caption").text(orbitFigcaptionText);
            orbitATag.append(orbitImgTag, orbitFigcaptionTag);
            orbitFigureTag.append(orbitATag);
            nth = nth + 1;
            $(".orbit-container li:nth-child(" + nth + ")").append(orbitFigureTag);
          }
          else {
            var newHeadline = $("<li>").addClass("headline");
            var newHeadlineLink = $("<a>")
              .attr({ href: storedHeadlineData[i].url, target: "_blank" })
              .text(storedHeadlineData[i].text);
            newHeadline.append(newHeadlineLink);
            $(".headline-section").append(newHeadline);
          }
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
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **
    // **  <start> statistics section js code <start>
    // **
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // Stores the value of the teamSearchBtn input by user and places it inside url
    //
    //Global Variable
    var teamSearch = $("#search-value").val();
    var savedSearches = [];
    var searchList = $(".history");
  
  
    // Local Storage for usuer input
  
    function saveSearch() {
  
  
      localStorage.setItem("search-value", teamSearch);
      console.log(saveSearch);
    }
    function renderPastSearchHistory() {
  
      var lastSearch = localStorage.getItem("search-value");
      console.log(lastSearch);
  
  
    }
  
    $("#search-button").on("click", function () {
      teamSearch = $("#search-value").val();
  
     getTeamOverview(teamSearch);
     //saveSearch();
     $("#search-value").val("");
  
   })
  
   $(".statistics").click(function() {
  
    // clear old data and recall getTeamOverview function
    $("#main-content").empty();
    $(".card-top-main").empty();
    getTeamOverview(teamSearch);
  
   })
  
    //Calls left cell of main container
    function getTeamOverview(teamSearch) {
      // setup ajax livescore api parameters.
      const searchTeamInfo = {
        async: true,
        crossDomain: true,
        url:
          "https://api-football-v1.p.rapidapi.com/v2/teams/search/" + teamSearch,
        method: "GET",
        headers: {
          "x-rapidapi-key": "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
          "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
        },
      };
  
      $.ajax(searchTeamInfo).done(function (response) {
  
        // Clears all old content that may be present within the main content container
        $("#main-content").empty();
  
        // Grabs team ID to use as the parameter for another AJAX call
        var teamID = response.api.teams[0].team_id;
        // Stores the team logo url, the team name, country of origin, and founding date
        var logo = response.api.teams[0].logo;
        var name = response.api.teams[0].name;
        var founding = response.api.teams[0].founded;
        var country = response.api.teams[0].country;
        var stadium = response.api.teams[0].venue_name;
        var stadiumCap = response.api.teams[0].venue_capacity;
  
        // Dynamically Adds in the div containers and sections for the statistics api
        var topDivider = $("<div>")
        .addClass("card-divider divL small-12")
        .attr("id", "top-divider")
        .appendTo($("#main-content"));
        var topLeftCard = $("<div>")
          .addClass("card-section small-6 secL")
          .attr("id", "top-left-card")
          .appendTo($("#main-content"));
      
        var topRightCard = $("<div>")
          .addClass("card-section small-6 secR")
          .attr("id", "top-right-card")
          .appendTo($("#main-content"));
      
        var bottomDivider = $("<div>")
          .addClass("card-divider divM small-12")
          .attr("id", "bottom-divider")
          .appendTo($("#main-content"));
      
        var bottomLeftCard = $("<div>")
          .addClass("card-section small-6 secM")
          .attr("id", "bottom-left-card")
          .appendTo($("#main-content"));
      
        var bottomRightCard = $("<div>")
          .addClass("card-section small-6 secN")
          .attr("id", "bottom-right-card")
          .appendTo($("#main-content"));
  
        var teamName = $("<h3>")
          .addClass("team-name")
          .text(name)
          .appendTo($(".divL"));
  
        var teamLogo = $("<img style='width:45px; height:45px'>")
          .addClass("team-logo")
          .attr("src", logo)
          .appendTo($(".team-name"));
  
        var overview = $("<p style='font-size: 18px'>")
          .addClass("overview")
          .text("Overview")
          .appendTo(".secL");
  
        var foundingDate = $("<p style='font-size: 12px'>")
          .addClass("founding-date")
          .text("Founded: " + founding)
          .appendTo($(".secL"));
  
        var teamCountry = $("<p style='font-size: 12px'>")
          .addClass("team-country")
          .text("Country: " + country)
          .appendTo($(".secL"));
  
        var teamStadium = $("<p style='font-size: 12px'>")
          .addClass("team-stadium")
          .text("Stadium: " + stadium)
          .appendTo($(".secL"));
  
        var teamStadiumCap = $("<p style='font-size: 12px'>")
          .addClass("team-stadium-cap")
          .text("Capacity: " + stadiumCap)
          .appendTo($(".secL"));
  
        // Gets current team wins and lineups
        function getTeamWinsLineups() {
          const searchTeamStats = {
            async: true,
            crossDomain: true,
            url:
              "https://api-football-v1.p.rapidapi.com/v2/leagues/team/" + teamID,
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            },
          };
  
          $.ajax(searchTeamStats).done(function (response) {
            console.log(response);
  
            // stores api response for the list of titles a team has won
            var titles = response.api.leagues;
            // Tracks the number of title and cup wins in order to count and display the total
            var titleWins = 0;
            var cupWins = 0;
  
            // loops through total tital wins and adds +1 depeding on if it was a league title or cup title
            for (var i = 0; i < titles.length; i++) {
              if (titles[i].type == "League") {
                titleWins++;
              } else if (titles[i].type == "Cup") {
                cupWins++;
              }
            }
            // Appends titles won (league and cup)
            var Titles = $("<p style='font-size: 18px'>")
              .addClass("titles")
              .text("Trophies")
              .appendTo($(".secR"));
  
            var leagueTitles = $("<p style='font-size: 12px'>")
              .addClass("league-titles")
              .text("League Titles: " + titleWins)
              .appendTo($(".secR"));
  
            var cupTitles = $("<p style='font-size: 12px'>")
              .addClass("cup-list")
              .text("Cup Titles: " + cupWins)
              .appendTo($(".secR"));
          });
        }
        // function that gets the starting lineup of a club
        function getStartingLineup() {
          var currentSeason = 2019; // Could use new Date() for teams with up to date lineups.. until then use 2019
          const searchTeamStats = {
            async: true,
            crossDomain: true,
            url:
              "https://api-football-v1.p.rapidapi.com/v2/players/squad/" +
              teamID +
              "/" +
              currentSeason,
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            },
          };
  
          $.ajax(searchTeamStats).done(function (response) {
  
            // Lineup header appended to divR
            var lineupHeader = $("<p style='font-size: 18px'>")
              .addClass("lineup-header")
              .text("Current Lineup")
              .appendTo($(".secN"));
  
            // object shortcut variable
            var startingLineup = response.api.players;
            // loops 11 times to get the starting 11 players
            for (var i = 0; i < 11; i++) {
              var playerName = startingLineup[i].player_name;
              var playerPosition = startingLineup[i].position;
              var playerAge = startingLineup[i].age;
              var playerInfoCol = $("<p style='font-size: 12px'>")
                .addClass("lineup-col")
                .text(
                  playerName + ", " + playerPosition
                )
                .appendTo($(".secN"));
            }
          });
        }
  
        // Function that retrieves upcoming fixture information
        function getUpcomingFixtures() {
          const upcomingFixtures = {
            async: true,
            crossDomain: true,
            url:
              "https://api-football-v1.p.rapidapi.com/v2/fixtures/team/" +
              teamID,
            method: "GET",
            headers: {
              "x-rapidapi-key":
                "a62afeb123msh75f0a7b08cdeb06p120e70jsn9ea6adc294d7",
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            },
          };
  
          $.ajax(upcomingFixtures).done(function (response) {
  
            // object shortcut variable
            var fixtures = response.api.fixtures;
            // Count variable that will limit the number of responses returned
            var count = 0;
  
            // Returns "Upcoming Fixtures headline"
            var futureHeadline = $("<p style='font-size: 18px'>")
              .addClass("matchups")
              .text("Upcoming Matchups")
              .appendTo($(".secM"));
  
            // Returns 5 values
            for (var k = 0; k < fixtures.length; k++) {
  
              // If the match status is not FT (full time)
              if (fixtures[k].statusShort == "NS" || fixtures[k].statusShort == "TBD") {
                // Limit 5 results
                if (count < 5) {
  
                  // Stores variables for home team, away team, logos, match date, and match type
                  var homeTeam = fixtures[k].homeTeam.team_name;
                  var homeLogo = fixtures[k].homeTeam.logo;
                  var awayTeam = fixtures[k].awayTeam.team_name;
                  var awayLogo = fixtures[k].awayTeam.logo;
                  var matchDate = fixtures[k].event_date;
                  var matchType = fixtures[k].league.name;
                  console.log(matchDate)
  
                  var type = $("<p style='font-size: 12px'>")
                    .addClass("match-type")
                    .text(matchType)
                    .appendTo(".secM");
  
                  var logoHome = $("<img style='display: inline'>")
                    .addClass("logo-home")
                    .attr("src", homeLogo)
                    .appendTo(".secM");
  
                  var home = $("<p style='font-size: 12px; display: inline'>")
                    .addClass("home-team")
                    .text(homeTeam + " Vs. ")
                    .appendTo(".secM");
  
                  var away = $("<p style='font-size: 12px; display: inline'>")
                    .addClass("away-team")
                    .text(awayTeam)
                    .appendTo(".secM");
  
                  var logoAway = $("<img style='display: inline'>")
                    .addClass("logo-away")
                    .attr("src", awayLogo)
                    .appendTo(".secM");
  
                  // Formats date as YYYY-MM-DD
                  date = new Date(matchDate)
                  year = date.getFullYear();
                  dt = date.getDate();
                  month = date.getMonth() + 1;
  
                  if (dt < 10) {
                    dt = '0' + dt;
                  }
                  if (month < 10) {
                    month = '0' + month;
                  }
  
                  var date = $("<p style='font-size: 12px'>")
                    .addClass("match-date")
                    .appendTo(".secM")
                    .text(year + "-" + month + "-" + dt);
                  // increases count by 1
                  count++
                }
              }
            }
          })
        }
        getStartingLineup();
        getTeamWinsLineups();
        getUpcomingFixtures();
      });
    }
  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **
    // **  <end> statistics section js code <end>
    // **
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <start> populate ticker with data <start>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
  
    function getTickerData() {
      if (refreshData) {
        // refresh true therefore we will call the livescore API and pull new data for the ticker.
        callTickerApi();
      } else {
        // refresh false therefore we will use the saved ticker data from local storage.
        // call function to render ticker data to the screen.
        var storedTickerData = getTickerDataFromLocalStorage();
        renderTickerData(storedTickerData);
      }
  
      function callTickerApi() {
  
        const tickerSettings = {
          "async": true,
          "crossDomain": true,
          "url": "https://livescore-football.p.rapidapi.com/soccer/matches-by-date?date=" + today_YYYYMMDD,
          "method": "GET",
          "headers": {
            "x-rapidapi-key": "ff0210cd47msh983c81cf4ee3a53p1bc6d3jsn78402c8c5e1a",
            "x-rapidapi-host": "livescore-football.p.rapidapi.com"
          }
        };
  
        $.ajax(tickerSettings).done(function (response) {
          console.log("**** livescore (ticker) API used ****"); //DEBUG - REMOVE WHEN GOING LIVE.
          storeTickerDataInLocalStorage(response);
          renderTickerData(response);
        });
      }
  
      // store ticker data into local storage.
      function storeTickerDataInLocalStorage(tickerData) {
        localStorage.setItem("tickerData", JSON.stringify(tickerData));
      }
  
      // retrieve ticker data from local storage.
      function getTickerDataFromLocalStorage() {
        return JSON.parse(localStorage.getItem("tickerData"));
      }
  
      // render ticker data to the screen.
      function renderTickerData(tickerData) {
        var dateData = $("<li>").css({ 'color': 'aqua', 'font-weight': 'bold' }).text("Latest Games For " + today);
        $(".marquee-content-items").append(dateData);
        for (var i = 0; i < 5; i++) {
          var leagueName = tickerData.data[i].league_name;
          var leagueCountry = tickerData.data[i].country_name;
          var leagueData = $("<li>").css({ 'color': 'black', 'font-weight': 'bold' }).text(leagueName + " (" + leagueCountry + "):");
          $(".marquee-content-items").append(leagueData);
          for (var j = 0; j < tickerData.data[i].matches.length; j++) {
            var homeTeamName = tickerData.data[i].matches[j].team_1.name;
            if (tickerData.data[i].matches[j].status === "FT") {
              var scoreText = " " + tickerData.data[i].matches[j].score.full_time.team_1 + " - " + tickerData.data[i].matches[j].score.full_time.team_2 + " ";
            }
            else {
              var scoreText = " v ";
            }
            var awayTeamName = tickerData.data[i].matches[j].team_2.name;
            var gameData = $("<li>").text(homeTeamName + scoreText + awayTeamName);
            $(".marquee-content-items").append(gameData);
          }
        }
        let options = {
          duration: 200000
        }
        // initialize marquee plugin.
        $('.simple-marquee-container').SimpleMarquee(options);
      }
    }
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <end> populate ticker with data <end>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
  
  
    // ************************************************************************************
    // ************************************************************************************
    // ************************************************************************************
    // **  
    // **  <start> GIF Button <start>
    // **  
    // ************************************************************************************
    // ************************************************************************************
    // ***************************************************************************
    // ************************************************************************************
  
  
    $(".gifs").on("click", function () {
  
      $("#main-content").empty();
      $(".card-top-main").empty();
  
      var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + "soccer " +
        teamSearch + "&api_key=dc6zaTOxFJmzC&limit=10";
      console.log("this works")
  
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function (response) {
          var results = response.data;
  
          for (var i = 0; i < results.length; i++) {
            var gifDiv = $("<div style='display: block'>");
  
            var personImage = $("<img>");
            personImage.addClass("gif-img");
            personImage.attr("src", results[i].images.fixed_height.url);
  
            gifDiv.prepend(personImage);
  
            $("#main-content").prepend(gifDiv);
          }
        });
    });

  //Videos

  $(".videos-play").on("click", function () {

    $("#main-content").empty();
    $(".card-top-main").empty();

    //  teamSearch = $("#search-value").val();
    const teamVideos = {
      "async": true,
      "crossDomain": true,
      "url": "https://free-football-soccer-videos1.p.rapidapi.com/v1/",
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "aeabad8553msh11cb2e7ac9c5193p124085jsnee00adb6b2ab",
        "x-rapidapi-host": "free-football-soccer-videos1.p.rapidapi.com"
      }
    };

    $.ajax(teamVideos).then(function (response) {





      // var results = response.;




      for (var i = 0; i < response.length; i++) {


        if (response[i].side1.name == teamSearch || response[i].side2.name == teamSearch) {


          var videoDiv = $("<div>");




          




          videoDiv.append(response[i].embed);



          $(".card-top-main").append(videoDiv);





        }




      }


    });


  });


});










