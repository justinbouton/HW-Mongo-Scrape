 // SAVE ARTICLE
  $(document).on("click", ".saveArticle", function(event) {
    
    $(this).hide()
    // Grab the data-id, title, paragraph and link associated with the article from the submit button
    let data = {}
    data.title = $("#title").text()
    data.paragraph = $("#paragraph").text()
    data.link = $("#link").attr('href')

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/save/",
      data: data
    })
  })


// DELETE ARTICLE
$(document).on("click", "#deleteArticle", function() {

  let thisId = $(this).attr("data-id");

  // Delete request     
  $.ajax({
      method: "DELETE",
      dataType: "json",
      url: "/delete/" + thisId
    }) .then(function(data) {
      location.reload()
    })
});
  

// GET ARTICLE NOTE BY ID


// UPDATE ARTICLE NOTE BY ID
// Whenever someone clicks a p tag
$(document).on("click", ".cards", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<br /><input id='titleinput' name='title' placeholder='title'>");
      // A textarea to add a new note body
      $("#notes").append("<br /><textarea id='bodyinput' name='body' placeholder='Notes'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<br /><button data-dismiss='modal' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// NAV active button
$(function() {
    var page = window.location.pathname;

    $('.nav-link').filter(function(){
       return $(this).attr('href').indexOf(page) !== -1
    }).removeClass("text-white bg-dark").addClass("text-dark bg-white");  
});