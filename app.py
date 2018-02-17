# import necessary libraries
import numpy as np

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

import pandas as pd

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
    data=pd.read_csv("DataSources/traffic_data_clean.csv")
    return(jsonify(data.to_dict()))    

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

#@TODO: route that filters data by incident type
@app.route("/data/<incident_type>")
def data_by_incident_type(incident_type):
    #figure this out
    # data=pd.read_csv("DataSources/traffic_data_clean.csv")
    #return(jsonify(data.to_dict()))  
    return None

#@TODO: route that filters data by incident type and date
@app.route("/data/<start>")
def data_by_start_date(start):
    #figure this out
    # data=pd.read_csv("DataSources/traffic_data_clean.csv")
    #return(jsonify(data.to_dict()))  
    return None

@app.route("/data/<start>/<end>")
def data_by_start_and_end_date(start,end):
    #figure this out
    # data=pd.read_csv("DataSources/traffic_data_clean.csv")
    #return(jsonify(data.to_dict()))  
    return None

if __name__ == "__main__":
    app.run(debug=True)
    raise NotImplementedError()
