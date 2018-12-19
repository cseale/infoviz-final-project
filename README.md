# infoviz-final-project
Data Vizualisation 2018 InfoViz Final Project
# Set up
1. install Elasticsearch https://www.elastic.co/downloads/elasticsearch
1. start Elasticsearch
1. `npm install` - installs dependencies
1. `npm run build` - build frontend
1. `npm run load` - dumps the data in ES
1. `npm run start` - starts the frontend and backend servers
1. Load [http://localhost](http://localhost)
1. Adjust your zoom to 60%-80%

Note that this will run the server as a daemon. To close it run `npm run delete`.

To restart the server run `npm run reload`.

## Deploy cheat sheet
* `nohup ./ngrok http 8080 &`
* `ssh -L 4040:localhost:4040 mihai_b_voicescu@35.204.242.56`

# Deliverables
* Screencast(`Screencast.mov`) also available [here](https://www.dropbox.com/s/5txknfkv54fp1ww/Final_one.mov?dl=0).
* Report(`Data_Visualization_InfoVis.pdf`)
