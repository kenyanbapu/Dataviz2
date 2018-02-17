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

data=pd.read_csv("DataSources/traffic_data.csv")

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# This route returns all the damn data
@app.route("/data")
def data():
    data=pd.read_csv("DataSources/traffic_data.csv")
    return(jsonify(data.to_dict()))    

# This route returns a list of all distinct incident types (for filtering)
@app.route("/incident_types")
def incident_types():
    data=pd.read_csv("DataSources/traffic_data.csv")
    incident_types=data['Issue Reported'].unique().tolist()
    return(jsonify(incident_types))    

if __name__ == "__main__":
    app.run(debug=True)
    raise NotImplementedError()
