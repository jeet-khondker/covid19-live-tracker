var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.6762, lng: 139.6503},
    zoom: 8
});
}