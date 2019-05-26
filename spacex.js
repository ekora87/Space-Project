'use strict';
let local = localStorage.getItem('index');
let slideIndex = 1;
const apiKey = 'AIzaSyDXusl38haaZY6PfuJdEuBb-bpdFkceYYg'; 
const searchURL = 'https://www.googleapis.com/youtube/v3/search';
let missionName = "";

function classToggle() {
  $('.Navbar__Link-toggle').click(function() {
      $('.drop-down-nav').toggleClass('Navbar__ToggleShow');
  });
}

function getMissionPatch() {
    fetch('https://api.spacexdata.com/v3/launches')
    .then(response => response.json())
    .then(responseJson => displayMissionPatch(responseJson));
  }
  
function displayMissionPatch(responseJson) {
    for (let i=0; i < responseJson.length; i++ ){
      if (responseJson[i].links.mission_patch !== null) {
        $('.mission').append(`<a href="mission.html"><div class="mission-container" id="${responseJson[i].flight_number - 1}"><h3 class="flight-number">Flight Number ${responseJson[i].flight_number}</h3><h4 class="mission-name">${responseJson[i].mission_name}</h4><img src="${responseJson[i].links.mission_patch}" class="mission-patch" alt="${responseJson[i].mission_name} mission patch"></div></a>`);
        }
    }
}
 

  function watchMissionPatch() {
    $('.mission').on('click', '.mission-container', function() {
        let num = $(this).attr('id');
        $('.mission').hide();
        local = localStorage.setItem('index', num);
    });  
  }
 
  function getIndividualMission(local) {
    fetch('https://api.spacexdata.com/v3/launches')
    .then(response => response.json())
    .then(responseJson => displayMissionDetail(responseJson[parseInt(local)]));
  }
  
  function displayMissionDetail(responseJson) {
    missionName = responseJson.mission_name;
    let imageCount = responseJson.links.flickr_images.length;

    if ((responseJson.launch_success == null) || (responseJson.rocket.first_stage.cores[0].land_success == null) || (responseJson.details == null)) {
      responseJson.launch_success = "False";
      responseJson.rocket.first_stage.cores[0].land_success = "False";
      responseJson.details = "None";
    }
    $('.individual-mission').prepend(`<img src="${responseJson.links.mission_patch_small}" alt="${missionName} mission patch"><div class="mission-details">
    <h3 class="name">${responseJson.mission_name}</h3>
    <ul><li><span class="bold-text">Flight Numer:</span> ${responseJson.flight_number}</li>
    <li><span class="bold-text">Launch Year:</span> ${responseJson.launch_year}</li>
    <li><span class="bold-text">Launch Date:</span> ${responseJson.launch_date_local}</li>
    <li><span class="bold-text">Rocket Name:</span> ${responseJson.rocket.rocket_name}</li>
    <li><span class="bold-text">Launch Site:</span> ${responseJson.launch_site.site_name_long}</li>
    <li><span class="bold-text">Launch Success:</span> ${responseJson.launch_success}</li>
    <li><span class="bold-text">Land Success:</span> ${responseJson.rocket.first_stage.cores[0].land_success}</li>
    <li><span class="bold-text">Details:</span> ${responseJson.details}</li>
    </ul></div>`);

    if (imageCount > 0) {
        $('.mission-images').append(`
        <div class="slide-control">
        <a class="prev" onclick="plusSlides(-1)">PREV</a>
        <span class="numbertext"></span>
        <a class="next" onclick="plusSlides(1)">NEXT</a>
        </div>`);
        
        for (let i=0; i < imageCount; i++) {
          $('.mission-images').append(`
          <div class="mySlides fade">
          <img class="images" src="${responseJson.links.flickr_images[i]}" alt="mission images">
          </div>`);
        }
        showSlides(slideIndex);
        $('#m-images').removeClass('hidden');
      }
    watchForm();
  }
  
function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
      slideIndex = 1;
      n = 1;
    }    
  if (n < 1) {
      slideIndex = slides.length;
      n = slides.length;
    }
  for (let i =0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }

slides[slideIndex - 1].style.display = "block";  
$('.numbertext').text(`${n}/${slides.length}`);
}

//Youtube API Script
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('.youtube-link').click(function() {
    $(this).attr('href', `https://www.youtube.com/results?search_query=${missionName}`);
  });
  $('#results-list').empty();
  // iterate through the items array
  for (let i = 0; i < responseJson.items.length; i++){
    // for each video object in the items 
    //array, add a list item to the results 
    //list with the video title, description,
    //and thumbnail
    $('#results-list').append(
      `<div class="video"><li><h3>${responseJson.items[i].snippet.title}</h3>
      <p>${responseJson.items[i].snippet.description}</p>
      <a href="https://www.youtube.com/watch?v=${responseJson.items[i].id.videoId}" target="_blank"><img class="video-link" src='${responseJson.items[i].snippet.thumbnails.medium.url}'></a>
      </li></div>`
    )};
    $('#results').removeClass('hidden');
};

function getYouTubeVideos(query, maxResults=10) {
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults,
    type: 'video'
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    getYouTubeVideos("spaceX " + missionName, 2);
}
  
  $(function() {
    classToggle();
    getMissionPatch();
    watchMissionPatch();
    getIndividualMission(local);
    showSlides(slideIndex);
  })