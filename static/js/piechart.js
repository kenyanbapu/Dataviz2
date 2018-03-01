function BuildPieChart(url) {

    Plotly.d3.json(url, function(error, data) {
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

BuildPieChart('/api/v1.1/pie/')

//BuildPieChart('/api/v1.1/pie/?start=20180101&end=20180101')

//@TODO: once we have the dropdown working, set this up to pass in dates from the dropdown
//BuildPieChart('/api/v1.1/pie/?start=20180101&end=20180101')

