'use strict';

const apiKey = 'G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb';
let nameRover = '';
let roverDetail = '';

$(document).ready(function () {
  $('input[id$=tbDate]').datepicker({
    dateFormat: 'yy-mm-dd'
  });
});

function classToggle() {
  $('.Navbar__Link-toggle').click(function() {
      $('.drop-down-nav').toggleClass('Navbar__ToggleShow');
  });
}

function getAPODImage(input) {
  fetch(`https://api.nasa.gov/planetary/apod?date=${input}&api_key=G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb`)
    .then(response => response.json())
    .then(responseJson => 
      displayAPODResults(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
}

function displayAPODResults(responseJson) {
  $('.apod-container').append(
    `<h3>${responseJson.title}</h3><h4>Date: ${responseJson.date}</h4><p>${responseJson.explanation}</p><img src="${responseJson.hdurl}" class="image">`
  )
}

function watchForm() {
  $('.apod-form').submit(event => {
    event.preventDefault();
    $('.apod-container').empty();
    let date = $('#tbDate').val();
    getAPODImage(date);
  });
}

function getMarsRoverImage(name, input) {
  fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=${input}&api_key=G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb`)
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
  $('.mars-form').submit(event => {
    event.preventDefault();
    let pick = clickRoverPicture();
    $('.mars-image-container').empty();
    let date = $('#tbDate').val();
    getMarsRoverImage(pick, date);
  });
}

const url = 'https://api.nasa.gov/mars-photos/api/v1/manifests/';

function clickRoverPicture() {
  $('.rover-image').click(function() {
    nameRover = $(this).attr('id');
    if (nameRover === "curiosity") {
      $('#opportunity-div').addClass('hidden');
      $('#spirit-div').addClass('hidden');
    } else if (nameRover === "opportunity") {
      $('#curiosity-div').addClass('hidden');
      $('#spirit-div').addClass('hidden');
    } if (nameRover === "spirit") {
      $('#curiosity-div').addClass('hidden');
      $('#opportunity-div').addClass('hidden');
    }
    getEachRoverManifest(nameRover);
  })
  return nameRover;
}

function getEachRoverManifest(name) { 
    
    const manifestURL = url + name + '?' + "api_key=" + apiKey;
    fetch(manifestURL)
    .then(response => response.json())
    .then(responseJson => displayRoverManifests(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
  
}

function displayRoverManifests(responseJson) {
  let selectedRover = clickRoverPicture();
  if (selectedRover === 'curiosity') {
    $('.opportunity-date').addClass('hidden');
    $('.spirit-date').addClass('hidden');
    roverDetail = "Curiosity is a car-sized rover designed to explore the crater Gale on Mars as part of NASA's Mars Science Laboratory mission (MSL).Curiosity was launched from Cape Canaveral on November 26, 2011, at 15:02 UTC and landed on Aeolis Palus inside Gale on Mars on August 6, 2012, 05:17 UTC. The Bradbury Landing site was less than 2.4 km (1.5 mi) from the center of the rover's touchdown target after a 560 million km (350 million mi) journey. The rover's goals include an investigation of the Martian climate and geology; assessment of whether the selected field site inside Gale has ever offered environmental conditions favorable for microbial life, including investigation of the role of water; and planetary habitability studies in preparation for human exploration.";
  } else if (selectedRover === 'opportunity') {
    $('.curiosity-date').addClass('hidden');
    $('.spirit-date').addClass('hidden');
    roverDetail = "Opportunity, also known as MER-B (Mars Exploration Rover – B) or MER-1, and nicknamed Oppy, is a robotic rover that was active on Mars from 2004 until the middle of 2018. Launched on July 7, 2003, as part of NASA's Mars Exploration Rover program, it landed in Meridiani Planum on January 25, 2004, three weeks after its twin Spirit (MER-A) touched down on the other side of the planet. With a planned 90-sol duration of activity (slightly more than 90 Earth days), Spirit functioned until it got stuck in 2009 and ceased communications in 2010, while Opportunity was able to stay operational for 5111 sols after landing, maintaining its power and key systems through continual recharging of its batteries using solar power, and hibernating during events such as dust storms to save power. This careful operation allowed Opportunity to exceed its operating plan by 14 years, 46 days (in Earth time), 55 times its designed lifespan. By June 10, 2018, when it last contacted NASA, the rover had traveled a distance of 45.16 kilometers (28.06 miles). The Opportunity rover's final message to NASA from Mars was 'My battery is low and it's getting dark.'";    
  } else if (selectedRover === 'spirit') {
    $('.opportunity-date').addClass('hidden');
    $('.curiosity-date').addClass('hidden');
    roverDetail = "Spirit, also known as MER-A (Mars Exploration Rover – A) or MER-2, is a robotic rover on Mars, active from 2004 to 2010. It was one of two rovers of NASA's Mars Exploration Rover Mission. It landed successfully within the impact crater Gusev on Mars at 04:35 Ground UTC on January 4, 2004, three weeks before its twin, Opportunity (MER-B), which landed on the other side of the planet. Its name was chosen through a NASA-sponsored student essay competition. The rover became stuck in a sand trap in late 2009 at an angle that hampered recharging of its batteries; its last communication with Earth was sent on March 22, 2010.";
  }
  selectedRover = selectedRover + "-div";
  $('.date-section').removeClass('hidden');
  $('h2').addClass('hidden');
  $(`#${selectedRover}`).addClass('flex');
  $('.rover-header').addClass('right-border');
  $('.rover-image-container').css('width', '100%');
  $('.link').css('pointer-events', 'none');
  $(`#${selectedRover}`).css('opacity', '1');


  $(`#${selectedRover}`).append(`<div class="rover-container">
  <ul>
  <li><span class="bold-text">Date Landed:</span> ${responseJson.photo_manifest.landing_date}</li>
  <li><span class="bold-text">Launch Date:</span> ${responseJson.photo_manifest.launch_date}</li>
  <li><span class="bold-text">Max Date:</span> ${responseJson.photo_manifest.max_date}</li>
  <li><span class="bold-text">Max Sol:</span> ${responseJson.photo_manifest.max_sol}</li>
  <li><span class="bold-text">Total Photos:</span> ${responseJson.photo_manifest.total_photos}</li>
  <li><span class="bold-text">History:</span> ${roverDetail}</li>
  </<ul></div>`);
}

$(function() {
  classToggle();
  watchForm();
  watchMARSForm();
  clickRoverPicture();
});