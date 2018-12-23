// Variables
var arrTopics = ['Tulip','Daffodil','Rose'];


// Function
function loadButtons(){
  $("#buttons").empty();
  arrTopics.forEach(function(topic){
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
        results.forEach(function(gif) {
        var $gifDiv= $("<div class='d-flex'>");  
        var $gif = $("<div class='p-2 flex-item flex-fill'>"); 
        var $gifDetails = $("<div class='p-2 flex-item flex-fill'>"); 
        //var $dlBtn = createButton("Download");  
        var rating = gif.rating.toUpperCase();
        var title = gif.title;
       // var displayname = gif.user.display_name?gif.user.display_name:"NONE";  
        var stillUrl = gif.images.fixed_height_still.url;
        var animateUrl = gif.images.fixed_height.url;
        
        $gif.append(`<img mode='still' src=${stillUrl} still-url=${stillUrl} animate-url=${animateUrl}/>`);

        $gifDetails
        .append(`<p>Rating : ${rating}</p>`)
        .append(`<p>Title  : ${title}</p>`);
        //.append(`<p><a href=${animateUrl} download>Download</a>`);

        $gifDiv.append($gif,$gifDetails);

        $("#images").prepend($gifDiv);
      });
      
 
    })
    .catch(
      function(response){
        $("#images").text("Unexpected Error");
      }
    );

  };
  
function changeMode($image){
  var mode = $image.attr("mode");
  var sUrl = $image.attr("still-url");
  var aUrl = $image.attr("animate-url");
  if(mode === "still"){
    $image.attr("mode","animate");
    $image.attr("src",aUrl);
  }else{
    $image.attr("mode","still");
    $image.attr("src",sUrl);
  }
}

// Event handlers
$(document).ready(function(){

  // Read the array and load buttons
  loadButtons();

  // Get images from API, on click of button
  $(document).on("click",".btn",function(){
    var iTxt = $(this).attr("id"); 
    getImages(iTxt);
  });

  // Switch mode on click of image
  $(document).on("click","img",function(){
    changeMode($(this));
  });

  // On click of Add movie
  $("#add-topic").on("click", function(event) {
    
    event.preventDefault();

    // Write code to grab the text the user types into the input field
    var topicEntered = $("#topic-input").val().trim();
    if(topicEntered){
      $("#topic-input").empty();
      // Write code to add the new movie into the movies array
      arrTopics.push(topicEntered);
      // The loadButtons function is called, rendering the list of movie buttons
      loadButtons();
    }else{
      $("#message").text("Please enter topic.")
    }
    
    
    
  });

});