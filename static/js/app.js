
function init() {
    getData();
    buildDropdown();
    BuildPieChart();
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
}

function BuildPieChart() {
    console.log("Pie Chart")
    Plotly.d3.json('/api/v1.1/pie/', function(error, data) {
        console.log("Pie Data" + data);
        if (error) return console.warn(error);

       labels=[]
       values=[]
       for (i = 0; i < 9; i++) {
           labels.push(data['Issue Reported'][i].toString())
           values.push(+data['Num Incidents'][i])
       };

        var pieData = [{
            values: values,
            labels: labels,
            type: 'pie'
        }];

         var pieLayout = {
                            margin: { t: 0, l: 0 }
                        };        
        
        var PIE = document.getElementById('pie');
        Plotly.plot(PIE, pieData, pieLayout);
       
    });

};

buildDropdown()
     
function optionChanged(incident_type) {
    console.log(incident_type)
    // Use a request to grab the json data needed for all charts
    Plotly.d3.json("/api/v1.1/", function(error, data) {
        if (error) return console.warn(error);
        var userOption = []
        data.reduce(function(all, x, index) {
            if (x['Issue Reported'].toLowerCase() == incident_type.toLowerCase()) {
                userOption.push(x);
            }
            return userOption;
        })
    buildMapdiv(userOption)
    console.log(reduceDate(userOption))
    console.log(reduceTime(userOption))
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
        })
        
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
            
        })
    
    }

function buildMapdiv(data) {
    d3.select("#mapid").remove();
    d3.select("#mapContainer").html('<div id="mapid" class="map" style="width: 100%; height: 500px; border: 3px solid #AAA;"></div>');
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
    

    var mymap = L.map('mapid').setView([30.27, -97.74], 10);
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
