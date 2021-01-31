// document ready statement to make sure the page fully loads before running this code.
$(document).ready(function () {
  // initialize foundation plugin.
  $(document).foundation();

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
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "/" + dd + "/" + yyyy;

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
        async: true,
        crossDomain: true,
        url:
          "https://livescore-football.p.rapidapi.com/soccer/news-list?page=1",
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "ff0210cd47msh983c81cf4ee3a53p1bc6d3jsn78402c8c5e1a",
          "x-rapidapi-host": "livescore-football.p.rapidapi.com",
        },
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
        var newHeadlineLink = $("<a>")
          .attr({ href: storedHeadlineData[i].url, target: "_blank" })
          .text(storedHeadlineData[i].text);
        newHeadline.append(newHeadlineLink);
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
  var teamSearch = "Real_Madrid"; // $("#teamSearchBtn").val();

  //Calls left cell of main container
  function getTeamOverview() {
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
      // console.log(response);

      // Grabs team ID to use as the parameter for another AJAX call
      var teamID = response.api.teams[0].team_id;
      // Stores the team logo url, the team name, country of origin, and founding date
      var logo = response.api.teams[0].logo;
      var name = response.api.teams[0].name;
      var founding = response.api.teams[0].founded;
      var country = response.api.teams[0].country;
      var stadium = response.api.teams[0].venue_name;
      var stadiumCap = response.api.teams[0].venue_capacity;

      var cardLeftMain = $("<div>")
        .addClass("card card-left-main")
        .appendTo($(".cell-left-main"));

      var teamLogo = $("<img style='width:75px; height:75px'>")
        .addClass("team-logo")
        .attr("src", logo)
        .appendTo(cardLeftMain);

      var teamName = $("<h5>")
        .addClass("team-name")
        .text(name)
        .appendTo(cardLeftMain);

      var foundingDate = $("<p>")
        .addClass("founding-date")
        .text("Founded :" + founding)
        .appendTo(cardLeftMain);

      var teamCountry = $("<p>")
        .addClass("team-country")
        .text("Country :" + country)
        .appendTo(cardLeftMain);

      var teamStadium = $("<p>")
        .addClass("team-stadium")
        .text("Stadium: " + stadium)
        .appendTo(cardLeftMain);

      var teamStadiumCap = $("<p>")
        .addClass("team-stadium-cap")
        .text("Capacity: " + stadiumCap)
        .appendTo(cardLeftMain);

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
          //   console.log(response);

          // Creates a card and card title to be placed in the center column of main container
          var cardCenterMain = $("<div>")
            .addClass("card card-center-main")
            .appendTo($(".cell-center-main"));

          // stores api response for the list of titles a team has won
          var titles = response.api.leagues;
          // Tracks the number of title and cup wins in order to count and display the total
          var titleWins = 0;
          var cupWins = 0;

          for (var i = 0; i < titles.length; i++) {
            if (titles[i].type == "League") {
              titleWins++;
            } else if (titles[i].type == "Cup") {
              cupWins++;
            }
          }
          console.log(titleWins, cupWins);
          var leagueTitles = $("<h5>")
            .addClass("titles-list")
            .text("Total League Titles: " + titleWins)
            .appendTo($(".card-center-main"));
          var cupTitles = $("<h5>")
            .addClass("titles-list")
            .text("Total Cup Titles: " + cupWins)
            .appendTo($(".card-center-main"));
        });
      }
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
          console.log(response);

          var startingLineupCard = $("<div>")
            .addClass("card card-right-main")
            .appendTo($(".cell-right-main"));

          var lineupHeader = $("<h5>")
            .addClass("starting-lineup-header")
            .text("Starting Lineup:")
            .appendTo(startingLineupCard);

          var name = $("<p style='display: inline-block'>")
            .addClass("name-column")
            .appendTo(startingLineupCard);
          var position = $("<p style='display: inline-block'>")
            .addClass("position-column")
            .appendTo(startingLineupCard);
          var age = $("<p style='display: inline-block'>")
            .addClass("age-column")
            .appendTo(startingLineupCard);

          var startingLineup = response.api.players;

          for (var i = 0; i < 11; i++) {
            var playerName = startingLineup[i].player_name;
            var playerPosition = startingLineup[i].position;
            var playerAge = startingLineup[i].age;
            var playerInfoCol = $("<p>")
              .text(
                playerName + " " + "(" + playerAge + ")" + ", " + playerPosition
              )
              .appendTo(name);
          }
        });
      }
      getStartingLineup();
      getTeamWinsLineups();
    });
  }

  getTeamOverview();
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
  // **
  // **  <end> statistics section js code <end>
  // **
  // ************************************************************************************
  // ************************************************************************************
  // ************************************************************************************
});
