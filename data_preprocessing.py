import pandas as pd

data=pd.read_csv("DataSources/traffic_data.csv")

#filter out any null date values
data=data[data['Published Date'].notnull()]

dates=data['Published Date']

dates_as_string=[]
dates_as_datetime=[]

for date in dates:
    try:
        date_as_string=date.split(" ")[0]
        dates_as_string.append(date_as_string)
        dates_as_datetime.append(datetime.strptime(date_as_string,'%m/%d/%Y'))
    except AttributeError:
        dates_as_string.append(None)
        dates_as_datetime.append(None)

data['Published Date as String']=dates_as_string
data['Published Date as DateTime']=dates_as_datetime

data.to_csv("DataSources/traffic_data_clean.csv")