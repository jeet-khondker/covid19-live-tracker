window.onload = () => {
    var context = new AudioContext();

    document.querySelector(".countries-list-container").style.display = "none";
    const input = document.querySelector("#country-input");
    input.addEventListener("input", searchCountry);
}

var map;
var covidData;

/****************************************
   FUNCTION : GOOGLE MAP INITIALIZATION
 ****************************************/
async function initMap() {

    let response = await axios.get("https://corona.lmao.ninja/v2/countries");

    covidData = response.data;

    displayCovidVirusCountries(covidData);

    console.log(covidData);

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

function displayCovidVirusCountries(countries) {
    let countriesHtml = '';
    
    countries.map((one, index) => {
        countriesHtml += 
        `
            <div id="${one['countryInfo']['_id']}" class="country-container" onclick="clickCountry('${one['countryInfo']['iso2']}')">
                <div class="country-info-container">
                    <div class="country-name">
                        <span>${one['country']}</span>
                        <span></span>
                    </div>
                    <div class="boundary"></div>
                </div>
                <div class="country-flag-container">
                    <div class="country-flag">
                        <img src="${one['countryInfo']['flag']}" width="20px" height="20px"></img>
                    </div>
                </div>
            </div>
        `
    })

    document.querySelector(".countries-list").innerHTML = countriesHtml;
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

    let oldIndex = []
    
    let countriesRessult = covidData.filter((one, index) => {
        if (one["country"].toLowerCase().includes(countryName.toLowerCase())) {
            oldIndex.push(index);
            return true;
        }
    })

    countriesRessult.map((one, index) => {
        one["index"] = oldIndex[index];
    })

    console.log(countriesRessult);
    
    displayCovidVirusCountries(countriesRessult);
}

/************************************************
   FUNCTION : PLAY BACKGROUND PRECAUTION MESSAGE
 ************************************************/
function playMsg() {
    document.querySelector("#msg").play();
}

var audio = document.getElementById("msg");
audio.volume = 0.08;

