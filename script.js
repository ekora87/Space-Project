'use strict';

const apiKey = 'G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb';

$(document).ready(function () {
  $('input[id$=tbDate]').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

function getAPODImage(input) {
  fetch(`https://api.nasa.gov/planetary/apod?date=${input}&api_key=G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb`)
    .then(response => response.json())
    .then(responseJson => 
      displayAPODResults(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

function displayAPODResults(responseJson) {
  console.log(responseJson);
  //replace the existing image with the new one

  $('.image-container').append(
    `<h3>Title: ${responseJson.title}</h3><h4>Date: ${responseJson.date}</h4><p>${responseJson.explanation}</p><img src="${responseJson.hdurl}" class="image">`
  )
}

function watchForm() {
  $('.apod-form').submit(event => {
    event.preventDefault();
    $('.image-container').empty();
    let date = $('#tbDate').val();
    getAPODImage(date);
  });
}

function getMarsRoverImage(input) {
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${input}&api_key=G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb`)
  .then(response => response.json())
  .then(responseJson => displayMARSResults(responseJson.photos));
}

function displayMARSResults(responseJson){
  let same = '';
  for (let i=0; i<responseJson.length; i++) {
    if (responseJson[i].img_src !== same) {
      $('.mars-image-container').append(
        `<img src="${responseJson[i].img_src}" class="mars-image">`);
      same = responseJson[i].img_src;
    }
  }
}

function watchMARSForm() {
  $('.apod-form').submit(event => {
    event.preventDefault();
    $('.mars-image-container').empty();
    let date = $('#tbDate').val();
    getMarsRoverImage(date);
  });
}

function displayAPOD() {
  $('main').append(`<div class="container">
  <h1>Astronomy Picture of the Day</h1>
  <div class="image-container"></div>
</div>`);
}


function renderAPOD() {
  $('#apod-btn').click(function() {
    alert("click");
    displayAPOD();
  });
}


$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
  watchMARSForm();
  renderAPOD();
});