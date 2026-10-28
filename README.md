# Colorado Elk and Mule Deer Winter Habitat Overlap

## Project Overview

This project uses Leaflet and GeoJSON to create an interactive web map comparing elk and mule deer winter concentration areas across Colorado's Northwest Region. The goal is to identify locations where the two species share winter habitat and calculate the approximate area of overlap.

## Datasets

**Elk Winter Concentration Areas**

The first dataset contains elk winter concentration areas in Colorado, obtained from Colorado Parks and Wildlife. These areas represent locations where elk tend to concentrate during the winter months. 

**Mule Deer Winter Concentration Areas**

The second dataset contains mule deer winter concentration areas from the CPW, as well. These areas identify locations where mule deer concentrate during winter. 

## Spatial Analysis

I used Turf.js to calculate intersections between elk and mule deer winter concentration polygons. Elk habitat is displayed in green, mule deer habitat in orange, and overlapping areas in purple.

The analysis produced a preliminary estimate of **7,299.27 square kilometers of overlapping habitat**. This number represents the sum of calculated polygon intersections and may include some double-counting where polygons overlap within the datasets.

Purple markers identify individual polygon intersections. Clicking a marker displays the estimated area of that intersection in square kilometers.

## How to Use the Map

Open the website and use the layer control in the upper-right corner to turn habitat layers on or off. Switch between street and satellite basemaps to explore the landscape. Click the purple markers to view the estimated area of individual habitat intersections.

## Data Sources

Elk Winter Concentration Areas (2026), ArcGIS MapServer Layer 29:

https://gisdnr.state.co.us/arcgis/rest/services/ECMC_Public/High_Priority_Habitat_2026/MapServer/29

Mule Deer Winter Concentration Areas (2026), ArcGIS MapServer Layer 37:

https://gisdnr.state.co.us/arcgis/rest/services/ECMC_Public/High_Priority_Habitat_2026/MapServer/37
