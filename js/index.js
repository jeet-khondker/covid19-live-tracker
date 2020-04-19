var map;
var covidData;

async function initMap() {

    let response = await axios.get("https://corona.lmao.ninja/v2/countries");

    covidData = response.data;





    var tokyo = {
        lat: 35.6762, 
        lng: 139.6503
    };

    map = new google.maps.Map(document.getElementById('map'), {
        center: tokyo,
        zoom: 11,
        mapTypeId: "roadmap",
        zoomControl: false,
    });


}

