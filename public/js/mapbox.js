const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 
'pk.eyJ1Ijoic3VtaXRwYWJsYSIsImEiOiJja256MWhpbHAwMTYzMm92cmVrbWF2czVtIn0.aSuxhBXNdVmp83m8JrSXXA';


var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sumitpabla/cknz3xcnh05ux17rwjxzids6z',
    // center: 0,
    // zoom: 10,
    // interactive: false
    scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map);

    new mapboxgl.Popup({
        offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

    bounds.extend(loc.coordinates);
})

map.fitBounds(bounds, {
    padding: {
    top: 200,
    bottom:250,
    left:100,
    right:100
}})