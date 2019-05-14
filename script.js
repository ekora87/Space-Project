'use strict';

 $(document).ready(function () {
        $('input[id$=tbDate]').datepicker({
          dateFormat: 'yy-mm-dd'
        });
    });

function getDogImage(input) {
  fetch(`https://api.nasa.gov/planetary/apod?date=${input}&api_key=G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb`)
    .then(response => response.json())
    .then(responseJson => 
      displayResults(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

function displayResults(responseJson) {
  console.log(responseJson);
  //replace the existing image with the new one

  $('.image-container').append(
    `<h3>Title: ${responseJson.title}</h3><h4>Date: ${responseJson.date}</h4><p>${responseJson.explanation}</p><img src="${responseJson.hdurl}" class="image">`
  )



}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('.image-container').empty();
    let date = $('#tbDate').val();
    getDogImage(date);
  });
}



$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
});