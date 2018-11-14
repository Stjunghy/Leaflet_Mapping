var quakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var platesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"


function Size_marker(magnitude) {return magnitude * 4;};
var quakes = new L.LayerGroup();

d3.json(quakesURL, function (geoJson) {
    L.geoJSON(geoJson.features, {pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: Size_marker(geoJsonPoint.properties.mag) });},
        style: function (geoJsonFeature) {
            return {fillColor: Pallette(geoJsonFeature.properties.mag),fillOpacity: 0.9,weight: 0.3,color: 'black'}},
        onEachFeature: function (feature, layer) {
            layer.bindPopup("</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");}
    }).addTo(quakes);Mapmaker(quakes);});

var pBoundary = new L.LayerGroup();

d3.json(platesURL, function (geoJson) {
    L.geoJSON(geoJson.features, {
        style: function (geoJsonFeature) {
            return {weight: 4,color: 'lime'}},
    }).addTo(pBoundary);})

function Pallette(magnitude) {
    if (magnitude > 5) {return 'crimson'
    } else if (magnitude > 4) {
        return 'brown'
    } else if (magnitude > 3) {
        return 'darkorange'
    } else if (magnitude > 2) {
        return 'gold'
    } else if (magnitude > 1) {
        return 'olive'
    } else {
        return 'teal'
    }};

function Mapmaker() {

    var Contrasty = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 16,id: 'mapbox.high-contrast',accessToken: 'pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA'
    });

    var SMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 16,id: 'mapbox.streets',accessToken: 'pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA'
    });
	
    var darkMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 68,id: 'mapbox.dark',accessToken: 'pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA'
    });

    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 16,id: 'mapbox.satellite',accessToken: 'pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA'});


    var baseLayers = {"Contrast": Contrasty,"Out": SMap,"Dark": darkMap,"Satellite": satellite};
    var overlays = {"Earthquakes":quakes,"Plate Boundaries": pBoundary,};
    var mymap = L.map('mymap', {center: [40, -99],zoom: 4.3,layers: [SMap, quakes, pBoundary]});

    L.control.layers(baseLayers, overlays).addTo(mymap);
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 1, 2, 3, 4, 5],
            labels = [];
        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + Pallette(magnitude[i] + 1) + '"></i> ' +
                magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(mymap);
}