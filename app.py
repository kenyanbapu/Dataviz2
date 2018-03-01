# import libraries
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import pandas as pd

from datetime import datetime

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("Protofrontend.html") 

# This route returns a list of all distinct incident types (for filtering)
@app.route("/incident_types")
def incident_types():
    data=pd.read_csv("DataSources/traffic_data_clean.csv")
    incident_types_raw=data['Issue Reported'].unique().tolist()
    #normalize the case so that it looks more reasonable
    incident_types=[]
    for row in incident_types_raw:
        incident_types.append(row.title())
    return(jsonify(incident_types))    

@app.route("/api/v1.1/")
def get_data():
    start = request.args.get('start', default = 00000000, type = int)
    end = request.args.get('end', default = 99999999, type = int)
    incident_type = request.args.get('type', default = '*', type = str)
    incident_type_lookup=incident_type.upper()
    if incident_type=='*':
        df=pd.read_csv("DataSources/traffic_data_clean.csv")
        output = df.dropna()  
        json = output.reset_index(drop=True).to_json(orient="records")
        return(json)  
    else:
        df =pd.read_csv("DataSources/traffic_data_clean.csv")
        data = df.dropna()
        for i in range(0,len(data)):
            data['Issue Reported'].replace(to_replace=data['Issue Reported'].iloc[i],value=data['Issue Reported'].iloc[i].upper(),inplace=True)
        data=data[data['Issue Reported']==incident_type_lookup]
        output=data[(data['Published Date as Integer']>=int(start)) & (data['Published Date as Integer']<=int(end))]
        json = output.reset_index(drop=True).to_json(orient="records")
        return(json)  

#This is a route just for populating the pie chart.
#It shows the top 10 incident types
@app.route("/api/v1.1/pie/")
def pieChartData():
    start = request.args.get('start', default = 00000000, type = int)
    end = request.args.get('end', default = 99999999, type = int)
    
    data=pd.read_csv("DataSources/traffic_data_clean.csv")

    df=data[(data['Published Date as Integer']>=int(start)) & (data['Published Date as Integer']<=int(end))]
    
    #return top 10 incidents with counts within the date range
    top10=df[['Location','Issue Reported']].groupby(['Issue Reported']).count().sort_values('Location',ascending=False)[:10].reset_index().rename(columns={'Location':'Num Incidents'})
    
    return(jsonify(top10.to_dict()))

if __name__ == "__main__":
    app.run(debug=True)
    raise NotImplementedError()