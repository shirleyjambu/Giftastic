// Variables
var arrTopics = ['Tulip', 'Daffodil', 'Rose'];
var arrFavs = [];

// Function
function loadButtons() {
  $("#buttons").empty();
  arrTopics.forEach(function (topic) {
    $("#buttons").append(createButton(topic));
  });
}

function createButton(text) {

  var $btn = $("<input>");
  $btn.attr("type", "button");
  $btn.attr("id", text);
  $btn.attr("value", text);
  $btn.addClass("btn btn-secondary");
  return $btn;

}

function getImages(sText) {
  //set the Query URL
  var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=" + sText;
  console.log(queryURL);
  //Ajax call with queryurl
  $.ajax({
      url: queryURL,
      method: "GET"
    })
    .then(function (response) {
      console.log(response);
      var results = response.data;
      var $gifTable = $("<table class='imgTable'>");

      results.forEach(function (gif) {
        var $tRow = $("<tr>");
        var $gif = $("<td class='imgTd'>");
        var $gifDetails = $("<td class='imgTd'>");
        //var $dlBtn = createButton("Download");  
        var rating = gif.rating.toUpperCase();
        var title = gif.title;
        var stillUrl = gif.images.fixed_height_still.url;
        var animateUrl = gif.images.fixed_height.url;

        $gif.append(`<img mode='still' src=${stillUrl} still-url=${stillUrl} animate-url=${animateUrl}/>`);

        $gifDetails
          .append(`<p><strong>Rating :</strong> ${rating}</p>`)
          .append(`<p><strong>Title  :</strong> ${title}</p>`)
          .append(`<p><a href='${animateUrl}' target='new' download>Download</a></p>`)
          .append(`<p><button class="btn btn-secondary" onclick="savetoFav('${animateUrl}')">Add to Favs</button></p>`);

        $tRow.append($gif, $gifDetails);
        $gifTable.append($tRow);

        $("#images").prepend($gifTable);
      });


    })
    .catch(
      function (response) {
        $("#images").text("Unexpected Error");
      }
    );
};

//Save to localStorage
function savetoFav(url) {
  localStorage.setItem("url", url);
  console.log("url" + url);
  $("#favs").append(`<img src='${url}' />`);
  arrFavs.push(url);
  localStorage.setItem("favs", JSON.stringify(arrFavs));
}

//On load, display images set in localStorage
function getFavs() {
  var url = "";
  if (localStorage.getItem("favs")) {
    arrFavs = JSON.parse(localStorage.getItem("favs"));
    for (var i = 0; i < arrFavs.length; i++) {
      url = arrFavs[i];
      $("#favs").append(`<img src='${url}' />`);
    }
  } else {
    $("#favs").text("");
  }

};

// Changes the mode of image, to animate the images
function changeMode($image) {
  var mode = $image.attr("mode");
  var sUrl = $image.attr("still-url");
  var aUrl = $image.attr("animate-url");
  if (mode === "still") {
    $image.attr("mode", "animate");
    $image.attr("src", aUrl);
  } else {
    $image.attr("mode", "still");
    $image.attr("src", sUrl);
  }
}

// Event handlers
$(document).ready(function () {

  // Read the array and load buttons
  loadButtons();

  //Load Favorite images
  getFavs();

  // Get images from API, on click of button
  $(document).on("click", ".btn", function () {
    var iTxt = $(this).attr("id");
    getImages(iTxt);
  });

  // Switch mode on click of image
  $(document).on("click", "img", function () {
    changeMode($(this));
  });

  // On click of Add movie
  $("#add-topic").on("click", function (event) {

    event.preventDefault();

    // Write code to grab the text the user types into the input field
    var topicEntered = $("#topic-input").val().trim();
    if (topicEntered) {
      $("#topic-input").val("");
      // Write code to add the new movie into the movies array
      arrTopics.push(topicEntered);
      // The loadButtons function is called, rendering the list of movie buttons
      loadButtons();
    } else {
      $("#message").text("Please enter topic.")
    }

  });

  //On click of Clear Favorites
  $("#clear-favs").on("click", function () {
    event.preventDefault();
    localStorage.removeItem("favs");
    $("#favs").empty();
  });

});