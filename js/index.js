var map;
var covidData;

async function initMap() {

    let response = await axios.get("https://corona.lmao.ninja/v2/countries");

    covidData = response.data;

    console.log(covidData);

    var bangladesh = {
        lat: 23.6850, 
        lng: 90.3563
    };
    

    map = new google.maps.Map(document.getElementById('map'), {
        center: bangladesh,
        zoom: 11,
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

