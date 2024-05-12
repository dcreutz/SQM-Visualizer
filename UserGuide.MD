# Sky Quality Meter (SQM) Visualizer user guide

Contributed by Alan Creutz.

This document describes the function/features of the web-based SQM Visualizer, how to access each feature, and how to navigate around the Display. The SQM Visualizer works with data from a Unihedron SQM Device in the 'International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' [format](https://darksky.org/app/uploads/bsk-pdf-manager/47_SKYGLOW_DEFINITIONS.PDF) and files in the format output by the Unihedron software feature 'sun-moon-mw-clouds'.

The SQM Visualizer can display “live data” being captured to a computer that both stores the captured data and runs the SQM Visualizer as a web application, in essentially real time.  In addition, without “real time” data, the SQM Visualizer will display historical data that may be loaded periodically (e.g., daily, monthly, or at some other frequently).  Thus, a user can transfer data from the station’s local computer to a central server via FTP, manual file transfer with USB sticks, or other mechanisms.

The Sky Quality Meter (SQM) captures and records data on how dark the sky is; the SQM Visualizer presents this data for user information and analysis, providing a variety of perspectives.  This brief user guide explains the features of the SQM Visualizer and how to access them.  While there are many algorithms used to interpret the data to make it easily visualized by users, the SQM Visualizer is not intended for scientific research.  To that end, the actual data files can be accessed independently (with appropriate access to the computer storing the data; configurably from the SQM Visualizer application) and analyzed by researchers and others interested in deeper perspectives, or using different assumptions and algorithms, than those incorporated in the SQM Visualizer.

## Main display

Upon launching the SQM Visualizer, the user is presented with a graph showing the most recent set of SQM readings.  Depending on the time of day, the graph presents either data from “yesterday”, or data from today since evening nautical twilight (when the sun is 15 degrees below the horizon; optionally this can be configured to be civil or astronomical twilight).  (Prior to today’s civil twilight, the data shown is that for yesterday.}  The SQM Visualizer will update the graph in real time as new data is downloaded from the Unihedron device.

While there are number of configuration options that can tweak the specifics of the display for individual implementations, the default configuration presents the data with the best readings at the bottom of the graph and the readings for the brightest sky at the top.  Since readings typically run from evening civil twilight into the night (ending at morning civil twilight), the readings presented generally look like a broad valley, rapidly moving towards the best readings at the bottom of the graph, running through the night, and then moving upwards as the sun rises in the morning.

The graph consists of a line with circles representing each downloaded data point.  The colors and shading of the line and circles provide information about the conditions of the sky (e.g., moon above the horizon, estimated cloud cover [as calculated by algorithms within the SQM Visualizer], etc.).  The SQM Visualizer can display multiple reporting stations (as described below).  Each reporting station is displayed with a different color.

For each station, there are a variety of color/shading options that may appear:

* Solid dark lines and circles indicate that the readings exist, that there is no interference from the moon, sun, or clouds, and the data can be presumed to be valid.
* Yellow/orange circles indicate that the sun is within 12º of the horizon, and therefore can be presumed to have an influence on the level of darkness.
* Lines and circles that are “ghosts” (i.e., faint) indicate that it is significantly cloudy (as calculated by algorithms with the SQM Visualizer) and any data should not be considered to represent clear-sky darkness values.
* Circles that are neither yellow nor solid indicate that the moon is above the horizon.  These circles may run from faint to deep gray, indicating the intensity of the moon’s probable interference (a combination of altitude and phase of the moon).  The darker the circle, the less moon interference is present.  (Note: the level of moon interference is calculated from information on moon altitude and phase and is not itself measured.)

Since the SQM Visualizer can show multiple stations at one time, each station is assigned a specific color (blue, red, green, etc.).  Depending on the specific configuration of your implementation, the default station for your implementation is Deep Blue.  As additional stations are identified for display, the SQM Visualizer will assign additional colors.  A legend below the graphical display provides the color associated with each displayed station, along with it’s Latitude, Longitude, and Local Time Zone (and Elevation if that is specified in the data files).   

The top section of the display shows general information and allows the user to request specific time (in the station’s time zone) intervals for display.  While the default view is “tonight” (or “yesterday” if it is prior to civil twilight), the user may request a specific night.  In addition, the user may view the “best reading” (i.e., the darkest reading) for each night for any month, each night for the past six months, or for “all time” (all data recorded for the selected stations).   

Using the “Customize” button, the user may define any specific time interval by defining a start and end date/time.  The “Customize” button also allows the user to request either all reading during the custom interval or the best nightly readings during the custom interval.  The user must click the “Load” button to actually view the data for a custom interval.  If the user changes the interval or which data to select, the user must again press the “Load” button to update the graph.

Note that at any time, the user can return to “Tonight” (displaying either tonight’s current data, or data for “yesterday” if it is before civil twilight) using the “Tonight” button.

Below the row of time interval selection options, is the period being displayed, and the best reading within the displayed interval and the date/time of the FIRST occurrence of that reading during the period.

Below the graph is the legend showing the colors for each displayed station, and below that the Latest Reading among all selected SQM stations.

## Options menu

Clicking with the right mouse button anywhere in the graphical display area opens an Options Menu.  The options are:

* Display Image in Separate Tab – which displays the current graph as an image in a new tab
* Save Image – which downloads the current graph image as a .png file to your default download folder
* Show/Hide Statistics – which adds a row above the graph displaying statistics for the time interval displayed on the graph:  For each station selected for display, statistics shown are: Name of Station; Mean SQM value; Median SQM value; Number of Data Readings; and Best Reading with date/time of it’s first occurrence
* Show/Hide bar chart – which displays a bar chart below the data display providing an aggregate view of the data readings for each interval
* Hide/Show best reading – which removes the display of the best reading during the time interval that appears above the graphical displayed
* Hide/Show latest reading – which removes the display of the last reading that appears below the graphical display
* Exclude/Include sun, moon, clouds data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by the sun, moon, or clouds; this results in gaps in the graph and shows data points only when the sky is dark and presumed to be clear
* Exclude/Include clouds data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by clouds (but does not remove sun or moon influenced data)
* Axis minimum – which sets the minimum SQM reading to be included on the Y-axis
* Axis maximum – which sets the maximum SQM reading to be included on the Y-axis
* Reverse Y axis – which reverses the direction of the Y-axis
* Hide/Show legend – which removes the legend below the graph showing the color codes and geographical data for the (possibly multiple) SQM stations displayed on the graph
* Load SQM data – which allows the user to load a separate datafile of SQM data not established as a standard station.  This data must be structured in a precisely defined way documented elsewhere.  For each dataset uploaded, the name of the station is Upload1, Upload2, etc.  Note that this data does not persist past the current session of the SQM Visualizer

## Detailed information for a reading

If you hover over a specific data point, a pop-up window appears that displays the following information relating the specific data point:

* Click for image (discussed below)
* Date/Time of the Reading
* Moon status at the time of the reading
* Sun status at the time of the reading
* Mean $r^2$, a technical value used in calculating the estimated cloud d\cover; in general a higher r2 suggests a more cloudy sky
* Name of the SQM station that associated the datapoint

The top option, “Click for image” allows the user to see an image of the sky as taken by an installed all-sky camera.  The image shown will be the one taken at the time nearest to the time of the reading.  If there are no available images or the closest in time is more than 20 minutes (configurable) from the time of the reading, no image will be shown.