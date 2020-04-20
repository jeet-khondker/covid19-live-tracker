window.onload = () => {
    var context = new AudioContext();

    document.querySelector(".countries-list-container").style.display = "none";
    const input = document.querySelector("#country-input");
    input.addEventListener("input", searchCountry);
}

function noScroll() {
    window.scrollTo(0, 0);
}

var map;
var covidData;
var markers = [];
var infoWindow;
let infos = [];

/****************************************
   FUNCTION : GOOGLE MAP INITIALIZATION
 ****************************************/
async function initMap() {

    let response = await axios.get("https://corona.lmao.ninja/v2/countries");

    covidData = response.data;

    displayCovidVirusCountries(covidData);

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

    infoWindow = new google.maps.InfoWindow();

    showCovidMarkers(covidData);

}

/************************************
   FUNCTION : DISPLAY COUNTRY LISTS
 ************************************/
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

/****************************************
   FUNCTION : SHOW MARKERS IN GOOGLE MAP
 ****************************************/
function showCovidMarkers(newCovidData) {
    newCovidData.map((one, index) => {

        var latlng = new google.maps.LatLng(
            one["countryInfo"]["lat"],
            one["countryInfo"]["long"]
        );

        let lastUpdated = new Date(one["updated"]).toLocaleDateString("en");
        let country = one["country"];
        let cases = one["cases"];
        let deaths = one["deaths"];
        let recovered = one["recovered"];
        let id = one["countryInfo"]["_id"];
        let iso2 = one["countryInfo"]["iso2"];
        
        createCovidMarker(latlng, lastUpdated, country, cases, deaths, recovered, id, iso2);
    })
}

/****************************************
   FUNCTION : GOOGLE MAP MARKER CREATION
 ****************************************/
function createCovidMarker(latlng, lastUpdated, country, cases, deaths, recovered, id, iso2) {
    let html = 
    `
        <div class="covid-info-country-container">
            <div class="info-main-container">
                <div class="info-country">
                    ${country}
                </div>
                <div class="info-last-updated">
                    <span>Last Updated:&nbsp;</span>${lastUpdated}
                </div>
            </div>
            <div class="info-secondary-container">
                <div class="info-cases">Cases:&nbsp;${cases}</div>
                <div class="info-recovered">Recovered:&nbsp;${recovered}</div>
                <div class="info-death">Deaths:&nbsp;${deaths}</div>
            </div>
        </div>
    `

    infos[iso2] = html;

    var icon = {
        url: "image/marker-corona.png",
        scaledSize: new google.maps.Size(50, 50)
    }

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: iso2 + '',
        icon: icon,
        abc: "ahihi"
    });

    google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });

    markers.push(marker);
}

/****************************
   FUNCTION : CLICK COUNTRY
 ****************************/
function clickCountry(index) {
    document.getElementById("country-input").value = '';
    document.querySelector(".countries-list-container").style.display = "none";
    
    var key = index.toString();
    let selectedMarker = markers.find(one => one.label.toLowerCase() === index.toLowerCase())
    infoWindow.setContent(infos[key]);
    infoWindow.open(map, selectedMarker);
    
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

    let oldIndex = []
    
    let countriesResult = covidData.filter((one, index) => {
        if (one["country"].toLowerCase().includes(countryName.toLowerCase())) {
            oldIndex.push(index);
            return true;
        }
    })

    countriesResult.map((one, index) => {
        one["index"] = oldIndex[index];
    })

    displayCovidVirusCountries(countriesResult);
}

/************************************************
   FUNCTION : PLAY BACKGROUND PRECAUTION MESSAGE
 ************************************************/
function playMsg() {
    document.querySelector("#msg").play();
}

var audio = document.getElementById("msg");
audio.volume = 0.08;

