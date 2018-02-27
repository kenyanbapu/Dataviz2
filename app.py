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
    return render_template("index.html")

# This route returns all the damn data
@app.route("/data")
def data():
    output=pd.read_csv("DataSources/traffic_data_clean.csv")
    json = output.reset_index(drop=True).to_json(orient="records")
    return(json)  

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

#This route filters data by incident type
#It casts everything to uppercase so that the input is not case sensitive (e.g., /data/crash urgent)
#note that it's ok for the route to have spaces in it: 'http://localhost:5000/data/crash urgent' autocorrects the space so that it's http://localhost:5000/data/crash%20urgent, and it works ~~~
@app.route("/data/<incident_type>")
def data_by_incident_type(incident_type):
    data=pd.read_csv("DataSources/traffic_data_clean.csv")
    incident_type_lookup=incident_type.upper()
    for i in range(0,len(data)):
        data['Issue Reported'].replace(to_replace=data['Issue Reported'].iloc[i],value=data['Issue Reported'].iloc[i].upper(),inplace=True)

    output=data[data['Issue Reported']==incident_type_lookup]
    json = output.reset_index(drop=True).to_json(orient="records")
    return(json)

#pass in start date in the format YYYYMMDD e.g. 20180101
@app.route("/api/v1.0/<start>")
def data_by_start_date(start):
    data=pd.read_csv("DataSources/traffic_data_clean.csv")
    output=data[data['Published Date as Integer']>int(start)]
    return(jsonify(output.to_dict()))

@app.route("/api/v1.0/<start>/<end>")
def data_by_start_and_end_date(start,end):
    data=pd.read_csv("DataSources/traffic_data_clean.csv")
    output=data[(data['Published Date as Integer']>=int(start)) & (data['Published Date as Integer']<=int(end))]
    return(jsonify(output.to_dict()))

#Ideally we would have the route set up so that start date, end date, and incident type are all optional parameters
#but idk how to do that and I am done working tonight
#sry y'all (Emily)

if __name__ == "__main__":
    app.run(debug=True)
    raise NotImplementedError()
