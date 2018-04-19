// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    $("#articles").empty();
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" +  data[i]._id + "'>" + data[i].link + data[i].title + "</p>");
    }
  });