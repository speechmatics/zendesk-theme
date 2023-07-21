// File: assets/announcements.js
$(document).ready(function () {
  var articleId = '17168203514001'; // Replace with the actual ID of the internal article

  // Fetch the article content using Zendesk API
  $.ajax({
    url: '/api/v2/help_center/articles/' + articleId + '.json',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      $('#announcementContent').html(data.article.body);
    },
    error: function () {
      console.log('Failed to load announcements content.');
    }
  });
});
