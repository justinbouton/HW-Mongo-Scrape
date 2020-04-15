 // SAVE ARTICLE
  $(document).on("click", ".saveArticle", function(event) {
    
    // Hide save button once clicked.
    $(this).hide()
    
    // Grab the title, paragraph and link associated with the article.
    let data = {}
    data.title = $("#title").text()
    data.paragraph = $("#paragraph").text()
    data.link = $("#link").attr('href')

    // Run a POST request to save Article data.
    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/save/",
      data: data
    })
  })


// DELETE ARTICLE
$(document).on("click", ".deleteArticle", function() {

  let thisId = $(this).attr("data-id");

  // Run a Delete request to delete the article.
  $.ajax({
      method: "DELETE",
      dataType: "json",
      url: "/delete/" + thisId
    }) .then(function(data) {
      location.reload()
    })
}); 

// GET NOTE BY ARTICLE ID
$(document).on("click", ".noteArticle", function() {

  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Note
  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
  window.location.replace("/note/" + thisId);
});

// SAVE NOTE BY ARTICLE ID
$(document).on("click", ".saveNote", function(e) {
  e.preventDefault()
  
  let thisId = $(this).attr("data-id");

  let data = {}

  data.title = $("#noteTitleInput").val()
  data.body = $("#noteComments").val()

  // Run POST request
  $.ajax({
    method: "POST",
    url: "/note/" + thisId,
    data: data
  }).then(function(response) {
    location.reload()
  })

})


// DELETE NOTE BY NOTE ID
$(document).on("click", ".deleteNote", function() {

  let thisId = $(this).attr("data-id");

  // Run a Delete request to delete the article.
  $.ajax({
      method: "DELETE",
      dataType: "json",
      url: "/note/" + thisId
    }) .then(function(data) {
      location.reload()
    })
}); 



// NAV active button
$(function() {
    var page = window.location.pathname;

    $('.nav-link').filter(function(){
       return $(this).attr('href').indexOf(page) !== -1
    }).removeClass("text-white bg-dark").addClass("text-dark bg-white");  
});