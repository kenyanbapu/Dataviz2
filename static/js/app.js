
function init() {
    getData();
    buildDropdown();
    // buildMapdiv();
    // buildCharts();
}

init()

function getData() {
    // Use a request to grab the entire data set
    console.log("get data starting")
    Plotly.d3.json("/api/v1.1/", function(error, data) {
        if (error) return console.warn(error);
        console.log(data)
        // need to set timeout conditional on data loading
        buildMapdiv(data)
        console.log(reduceDate(data));
        console.log(reduceTime(data));
    });
}


function buildDropdown() {
    var selDataset = document.getElementById("selDataset");

    Plotly.d3.json('/incident_types', function(error, data){
        if (error) return console.warn(error);
        for (i = 0; i < data.length; i++) {
                    IncidentType=data[i]
                    var selDatasetItem = document.createElement("option");
                    selDatasetItem.text=IncidentType;
                    selDatasetItem.value=IncidentType;
                    selDataset.appendChild(selDatasetItem);
                }
    });

    var selDateStart = document.getElementById("selDateStart");
    
    Plotly.d3.json('/dates', function(error, data){
        if (error) return console.warn(error);
        for (i = 0; i < data.length; i++) {
                    DateID=data[i]
                    var selDatasetItem = document.createElement("option");
                    selDatasetItem.text=DateID;
                    selDatasetItem.value=DateID;
                    selDateStart.appendChild(selDatasetItem);
                    //selDateEnd.appendChild(selDatasetItem);
                }
        })
    
    var selDateEnd = document.getElementById("selDateEnd");

    Plotly.d3.json('/dates', function(error, data){
        if (error) return console.warn(error);
        for (i = 0; i < data.length; i++) {
                    DateID=data[i]
                    var selDatasetItem = document.createElement("option");
                    selDatasetItem.text=DateID;
                    selDatasetItem.value=DateID;
                    selDateEnd.appendChild(selDatasetItem);
                }            
    }
)}

buildDropdown()

function buildMap() {
    var selDataset = document.getElementById("selDataset");


    Plotly.d3.json('/api/v1.1', function(error, data){
        console.log(data)

                })
    };
    
    /*
    var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],

        view: new ol.View({
            center: ol.proj.fromLonLat([-97.7, 30.26]),
            zoom: 10})})
*/
        

function optionChanged(incident_type) {
    console.log(incident_type)
    // Use a request to grab the json data needed for all charts
    Plotly.d3.json("/api/v1.1/", function(error, data) {
        if (error) return console.warn(error);
        var test = []
        data.reduce(function(all, x, index) {
            if (x['Issue Reported'].toLowerCase() == incident_type.toLowerCase()) {
                test.push(x);
            }
            return test;
        })

    console.log(reduceDate(test))
    console.log(reduceTime(test))



    })
};

    function reduceDate (arr) {
        return arr.reduce(function(dateArray, x) {
            var dateString = new Date(x['Published Date']).toISOString().slice(0, 10)
            if (dateArray[dateString] !== undefined) {
                dateArray[dateString].push(x)
            } else {
                dateArray[dateString] = [x]
            }

            return dateArray
        }, {})
        
    }

    function reduceTime (arr) {
        return arr.reduce(function(timeArray, x) {
            var timeString = new Date(x['Published Date']).toISOString().slice(11,13)
            if (timeArray[timeString] !== undefined) {
                timeArray[timeString].push(x)
            } else {
                timeArray[timeString] = [x]
            }
            return timeArray
            
        }, {})
    
    }



function clearMap(data) {
    L.map(mymap.remove())
    buildMapdiv(data);
}

function buildMapdiv(data) {
    console.log("Testing Container Build")
    d3.select("#mapContainer").html('<div id="mapid" class="map" style="width: 800px; height: 600px; border: 1px solid #AAA;"></div>');
    buildMap(data);

}

function buildMap(data) {

    console.log(selDataset)
    console.log("Testing Container Build pt2")
    var lat = []
    var lon = []
    var incident = []
    
    for (i = 0; i < data.length; i++) { 
        lat.push(data[i].Latitude);
        lon.push(data[i].Longitude);
        incident.push(data[i]["Issue Reported"])}
    

    var mymap = L.map('mapid').setView([30.27, -97.74], 9.5);
    console.log(lat)
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    // Creating a new marker cluster group
    var markers = L.markerClusterGroup();

    // Loop through our data...
    for (var i = 0; i < lat.length; i++) {
        if (lat[i] > 0 && -98 > lon[i] > -88) {
        markers.addLayer(L.marker([lat[i], lon[i]])
            .bindPopup(incident[i]));}
    }
    
    // Add our marker cluster layer to the map
    mymap.addLayer(markers);
}



// google.charts.load('current', {packages: ['corechart', 'line']});
// google.charts.setOnLoadCallback(drawCurveTypes);

function drawCurveTypes() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Dogs');
    data.addColumn('number', 'Cats');

    data.addRows([
    [0, 0, 0],    [1, 10, 5],   [2, 23, 15],  [3, 17, 9],   [4, 18, 10],  [5, 9, 5],
    [6, 11, 3],   [7, 27, 19],  [8, 33, 25],  [9, 40, 32],  [10, 32, 24], [11, 35, 27],
    [12, 30, 22], [13, 40, 32], [14, 42, 34], [15, 47, 39], [16, 44, 36], [17, 48, 40],
    [18, 52, 44], [19, 54, 46], [20, 42, 34], [21, 55, 47], [22, 56, 48], [23, 57, 49],
    [24, 60, 52], [25, 50, 42], [26, 52, 44], [27, 51, 43], [28, 49, 41], [29, 53, 45],
    [30, 55, 47], [31, 60, 52], [32, 61, 53], [33, 59, 51], [34, 62, 54], [35, 65, 57],
    [36, 62, 54], [37, 58, 50], [38, 55, 47], [39, 61, 53], [40, 64, 56], [41, 65, 57],
    [42, 63, 55], [43, 66, 58], [44, 67, 59], [45, 69, 61], [46, 69, 61], [47, 70, 62],
    [48, 72, 64], [49, 68, 60], [50, 66, 58], [51, 65, 57], [52, 67, 59], [53, 70, 62],
    [54, 71, 63], [55, 72, 64], [56, 73, 65], [57, 75, 67], [58, 70, 62], [59, 68, 60],
    [60, 64, 56], [61, 60, 52], [62, 65, 57], [63, 67, 59], [64, 68, 60], [65, 69, 61],
    [66, 70, 62], [67, 72, 64], [68, 75, 67], [69, 80, 72]
    ]);

    var options = {
    hAxis: {
        title: 'Time'
    },
    vAxis: {
        title: 'Popularity'
    },
    series: {
        1: {curveType: 'function'}
    }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

// drawCurveTypes();


