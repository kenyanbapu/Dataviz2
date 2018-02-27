


function init() {
    buildDropdown();
    getData();
}

// Initialize the dashboard with the dropdown and the fully populated map
init();

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
        selDataset.addEventListener('change', e => clearMap(e.target.value))
    }
)}

function getData() {
    // Use a request to grab the entire data set
    Plotly.d3.json(`/data`, function(error, data) {
        if (error) return console.warn(error);
        console.log(data);
        buildMap2(data);
    });

};
function clearMap(data) {
    L.map(map.remove())
    buildMap1(data);
}
function buildMap1(data) {
    console.log("Testing Container Build")
    // d3.select("#mapContainer").append("div").html('<div id="map" class="map"></div>');
    buildMap2(data);

}

function buildMap2(data) {
    console.log("Testing Container Build pt2")
    var lat = []
    var lon = []
    var incident = []

    for (i = 0; i < data.length; i++) { 
        lat.push(data[i].Latitude);
        lon.push(data[i].Longitude);
        incident.push(data[i]["Issue Reported"]);
    }    
    var mymap = L.map('mapid').setView([30.27, -97.74], 9.5);
    
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
    for (i = 0; i < data.length; i++) {   
        L.marker([lat[i], lon[i]])
            .bindPopup(incident[i])
            .addTo(mymap);}

}

function optionChanged(incident_type) {
    console.log(incident_type)
    // Use a request to grab the json data needed for all charts
    Plotly.d3.json(`/data/${incident_type}`, function(error, incidentData) {
        if (error) return console.warn(error);
        console.log(incidentData);
        clearMap(incidentData);
        console.log(reduceDate(incidentData));
        console.log(reduceTime(incidentData));
    });

};

function reduceDate (arr) {
    var date = {};
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

