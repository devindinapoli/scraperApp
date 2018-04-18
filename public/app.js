// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    $("#articles").empty();
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p data-id='" +  data[i]._id + "'>" + "<img src=" + data[i].image + "><br>" + "<a href='https://gamespot.com" + data[i].link + "'</a>" + data[i].title + "</p>");
    }
  });