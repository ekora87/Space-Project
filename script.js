'use strict';

const apiKey = 'G67zW65ua8xJ4UGvo22EtNsV5zpufrS1LYIDNgUb';
let nameRover = '';
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

  $('.apod-container').append(
    `<h3>Title: ${responseJson.title}</h3><h4>Date: ${responseJson.date}</h4><p>${responseJson.explanation}</p><img src="${responseJson.hdurl}" class="image">`
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
    let pick = roverClick();
    alert(pick);
    $('.mars-image-container').empty();
    let date = $('#tbDate').val();
    getMarsRoverImage(pick, date);
    
  });
}

const roverName = ['curiosity', 'opportunity', 'spirit'];
const url = 'https://api.nasa.gov/mars-photos/api/v1/manifests/';

function getEachRoverManifest() { 
  var obj = {};
  for (let i=0; i<roverName.length; i++) {
    const manifestURL = url + roverName[i] + '?' + "api_key=" + apiKey;
    fetch(manifestURL)
    .then(response => response.json())
    .then(responseJson => displayRoverManifests(responseJson))
    .catch(error => alert('Something went wrong. Try again later.'));
  }
}

function displayRoverManifests(responseJson) {
  let roverName = responseJson.photo_manifest.name.toLowerCase();
  let roverImage = '';
  if (roverName == 'curiosity') {
    
    // $('.rover-container').attr('id', 'curiosity');
    roverImage = 'https://cdn.mos.cms.futurecdn.net/izXa9hiiSTbnNtwSp2ixKC.jpg';
    
    //$('.dot').addClass('green');
    
    //details = "Curiosity is a car-sized rover designed to explore the crater Gale on Mars as part of NASA's Mars Science Laboratory mission (MSL).[3] Curiosity was launched from Cape Canaveral on November 26, 2011, at 15:02 UTC and landed on Aeolis Palus inside Gale on Mars on August 6, 2012, 05:17 UTC.[7][8][13] The Bradbury Landing site was less than 2.4 km (1.5 mi) from the center of the rover's touchdown target after a 560 million km (350 million mi) journey.[9][14] The rover's goals include an investigation of the Martian climate and geology; assessment of whether the selected field site inside Gale has ever offered environmental conditions favorable for microbial life, including investigation of the role of water; and planetary habitability studies in preparation for human exploration.[15][16]";
  } else if (roverName === 'opportunity') {
    
    roverImage = 'https://pressfrom.info/upload/images/real/2018/10/30/nasa-is-still-holding-out-hope-for-the-mars-opportunity-rover__141568_.jpg?content=1';
    //renderRoverToDom(responseJson);
    //$('.dot').removeClass('green');
    // $('.dot').css('background-color', 'red');
    //details = "Opportunity, also known as MER-B (Mars Exploration Rover – B) or MER-1, and nicknamed Oppy, is a robotic rover that was active on Mars from 2004 until the middle of 2018.[2] Launched on July 7, 2003, as part of NASA's Mars Exploration Rover program, it landed in Meridiani Planum on January 25, 2004, three weeks after its twin Spirit (MER-A) touched down on the other side of the planet.[10] With a planned 90-sol duration of activity (slightly more than 90 Earth days), Spirit functioned until it got stuck in 2009 and ceased communications in 2010, while Opportunity was able to stay operational for 5111 sols after landing, maintaining its power and key systems through continual recharging of its batteries using solar power, and hibernating during events such as dust storms to save power. This careful operation allowed Opportunity to exceed its operating plan by 14 years, 46 days (in Earth time), 55 times its designed lifespan. By June 10, 2018, when it last contacted NASA,[11][12] the rover had traveled a distance of 45.16 kilometers (28.06 miles).[7]";
  } else if (roverName === 'spirit') {
    
    roverImage = 'https://solarsystem.nasa.gov/system/content_pages/main_images/1068_rover2-1.jpg';
    //renderRoverToDom(responseJson);
    //$('.dot').removeClass('green');
    // $('.dot').css('background-color', 'red');
    //details = "Spirit, also known as MER-A (Mars Exploration Rover – A) or MER-2, is a robotic rover on Mars, active from 2004 to 2010.[2] It was one of two rovers of NASA's Mars Exploration Rover Mission. It landed successfully within the impact crater Gusev on Mars at 04:35 Ground UTC on January 4, 2004, three weeks before its twin, Opportunity (MER-B), which landed on the other side of the planet. Its name was chosen through a NASA-sponsored student essay competition. The rover became stuck in a sand trap in late 2009 at an angle that hampered recharging of its batteries; its last communication with Earth was sent on March 22, 2010.";
  }

  $('.individual-rover').append(`<div class="rover-container">
  <h4 class="name">${responseJson.photo_manifest.name}</h4>
  <p class="status">Status: ${responseJson.photo_manifest.status}</p>
  <img class="rover-image" src=${roverImage}>
  <ul>
  <li>Date Landed: ${responseJson.photo_manifest.landing_date}</li>
  <li>Launch Date: ${responseJson.photo_manifest.launch_date}</li>
  <li>Max Date: ${responseJson.photo_manifest.max_date}</li>
  <li>Max Sol: ${responseJson.photo_manifest.max_sol}</li>
  <li>Total Photos: ${responseJson.photo_manifest.total_photos}</li></<ul></div>`);
}

function roverClick() {
  $('.individual-rover').on('click', '.rover-container', function() {
     nameRover = $(this).children('h4').text();
  })
  return nameRover;
}

// function displayAPOD() {
//   $('main').append(`<div class="container">
//   <h1>Astronomy Picture of the Day</h1>
//   <div class="image-container"></div>
// </div>`);
// }

// function renderAPOD() {
//   $('#apod-btn').click(function() {
//     $('.container').empty();
//     displayAPOD();
//   });
// }

// function displayRover() {
//   $('main').append(`<div class="container">
//   <h1>Mars Rover Photos</h1>
//   <div class="mars-image-container"></div>
// </div>`);
// }

// function renderRover() {
//   $('#rovers-btn').click(function() {
//     $('.container').empty();
//     displayRover();
//   });
// }


$(function() {
  console.log('App loaded! Waiting for submit!');
  watchForm();
  watchMARSForm();
  getEachRoverManifest();
  roverClick();
  // renderAPOD();
  // renderRover();
});