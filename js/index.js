window.onload = () => {
    var context = new AudioContext();

    document.querySelector(".countries-list-container").style.display = "none";
    const inputCountry = document.querySelector("#country-input");
    inputCountry.addEventListener("input", searchCountry);
}

var map;
var covidData;

/****************************************
   FUNCTION : GOOGLE MAP INITIALIZATION
 ****************************************/
async function initMap() {

    let response = await axios.get("https://corona.lmao.ninja/v2/countries");

    covidData = response.data;

    // console.log(covidData);

    var bangladesh = {
        lat: 23.6850, 
        lng: 90.3563
    };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: bangladesh,
        zoom: 5,
        mapTypeId: "roadmap",
        zoomControl: false,
        styles: customGMapStyles,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandline: "greedy"
    });

    google.maps.event.addListenerOnce(map, "tilesloaded", function () {
        // When page is loaded do below only for the first time
        document.querySelector(".loader-container").remove();
    });

}

/****************************
   FUNCTION : SEARCH COUNTRY
 ****************************/
function searchCountry() {
    let countryName = document.getElementById("country-input").value;

    if (countryName) {
        document.querySelector(".countries-list-container").style.display = "flex";
    } else {
        document.querySelector(".countries-list-container").style.display = "none";
    }

    // console.log(countryName)
}

function playMsg() {
    document.querySelector("#msg").play();
}

var audio = document.getElementById("msg");
audio.volume = 0.08;

