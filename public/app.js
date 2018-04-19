// Grab the articles as a json
$.getJSON("/articles", function(data) {
  $("#articles").empty();

  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<div class='col l4 articleInfo'<p data-id='" +
        data[i]._id +
        "'>" +
        "<img src=" +
        data[i].image +
        ">" +
        "<a href='" +
        data[i].link +
        "'</a>" +
        data[i].title +
        "</p></div>"
    );
  }
}); 


