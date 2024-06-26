# Sky Quality Meter (SQM) Visualizer user guide

Contributed by Alan Creutz.

This document describes the functions/features of the SQM Visualizer, how to access each feature, and how to navigate around the display. The SQM Visualizer works with data from a Unihedron SQM Device in the 'International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' [format](https://darksky.org/app/uploads/bsk-pdf-manager/47_SKYGLOW_DEFINITIONS.PDF) and files in the format output by the Unihedron software feature 'sun-moon-mw-clouds'.

The SQM Visualizer can display “live data” being captured to a computer that both stores the captured data and runs the SQM Visualizer as a web application, in essentially real time.  In addition, without “real time” data, the SQM Visualizer will display historical data that may be loaded periodically (e.g., daily, monthly, or at some other frequency).  Thus, a user can transfer data from the station’s local computer to a central server via FTP, manual file transfer with USB sticks, or other mechanisms.

The Sky Quality Meter (SQM) captures and records data on how dark the sky is by recording msas (magnitudes per arc second squared) values; the SQM Visualizer presents this data for user information and analysis, providing a variety of perspectives.  This brief user guide explains the features of the SQM Visualizer and how to access them.  While there are many algorithms used to interpret the data to make it easily visualized by users, the SQM Visualizer is not intended for scientific research.  To that end, the actual data files can be accessed independently (with appropriate access to the computer storing the data; the SQM Visualizer application can also be configured to make the raw data files available for download) and analyzed by researchers and others interested in deeper perspectives, or using different assumptions and algorithms, than those incorporated in the SQM Visualizer.

## Main display

Upon launching the SQM Visualizer, the user is presented with a graph showing the most recent set of SQM readings.  Depending on the time of day, the graph presents either data from “yesterday”, or data from today since evening nautical twilight (this can be configured to be civil or astronomical twilight).  (Prior to today’s twilight, the data shown is that for yesterday.)  The SQM Visualizer will update the graph in real time as new data is downloaded from the Unihedron device.

While there are number of configuration options that can tweak the specifics of the display for individual implementations, the default configuration presents nightly data with the best (darkest/highest msas) readings at the bottom of the graph and the readings for the brightest sky at the top.  Since readings typically run from evening twilight into the night (ending at morning twilight), the readings presented generally look like a broad valley, rapidly moving towards the best readings at the bottom of the graph, running through the night, and then moving upwards as the sun rises in the morning.  By default, when presenting best nightly readings over a time range, the vertical axis is oriented with the darkest readings at the top.

The graph consists of a line with circles representing each data point.  The colors and shading of the line and circles provide information about the conditions of the sky (e.g., moon above the horizon, estimated cloud cover [as calculated by algorithms within the SQM Visualizer], etc.).  The SQM Visualizer can display multiple reporting stations (as described below).  Each reporting station is displayed with a different color.

For each station, there are a variety of color/shading options that may appear (again, this is assuming the default configuration as many values are configurable):

* Solid dark lines and circles indicate that the readings exist, that there is no interference from the moon, sun, or clouds, and the data can be presumed to be valid.
* Yellow/orange circles indicate that the sun is within 18 degrees of the horizon, and therefore can be presumed to have an influence on the level of darkness.
* Lines and circles that are “ghosts” (i.e., faint) indicate that it is significantly cloudy (as calculated by algorithms within the SQM Visualizer) and any data should not be considered to represent clear-sky darkness values.
* Circles that are neither yellow nor solid indicate that the moon is above the horizon.  These circles may run from faint to deep gray, indicating the intensity of the moon’s probable interference (a combination of altitude and phase of the moon).  The darker the circle, the less moon interference is present.  (Note: the level of moon interference is calculated from information on moon altitude and phase and is not itself measured.)

Since the SQM Visualizer can show multiple stations at one time, each station is assigned a specific color (blue, gray, orange, etc.).  Depending on the specific configuration of your implementation, the default station for your implementation is deep blue.  As additional stations are identified for display, the SQM Visualizer will assign additional colors.  A legend below the graphical display provides the color associated with each displayed station; placing the cursor over a station (equivalently, clicking on it when on a touch screen device) in the legend shows it’s latitude, longitude, and local time zone (and elevation if that is specified in the data files).   

The top section of the display shows general information and allows the user to request specific time (in the station’s time zone) intervals for display.  While the default view is “tonight” (or “yesterday” if it is prior to twilight), the user may request a specific night.  In addition, the user may view the “best reading” (i.e., the darkest reading) for each night for any month, each night for the past six months, or for “all” (all data recorded for the selected stations).   

Using the “Custom” button, the user may define any specific time interval by defining a start and end date/time.  The “Custom” button also allows the user to request either all reading during the custom interval or the best nightly readings during the custom interval.  The user must click the “Load” button to actually view the data for a custom interval.  If the user changes the interval or which data to select, the user must again press the “Load” button to update the graph.

Note that at any time, the user can return to “Tonight” (displaying either tonight’s current data, or data for “yesterday” if it is before twilight) using the “Tonight” button.

Below the row of time interval selection options, is the period being displayed, and the best reading within the displayed interval and the date/time of the first occurrence of that reading during the period.

Below the graph is the legend showing the colors for each displayed station, and below that the latest reading among all selected SQM stations.

## Options menu

Clicking with the right mouse button (press and hold on touch screen devices) anywhere on the graph opens an options menu.  The options are:

* Open graph in new tab – which displays the current graph as an image in a new tab
* Save graph as image – which downloads the current graph image as a .png file to your default download folder
* Show/hide statistics – which adds a row above the graph displaying statistics for the time interval displayed on the graph; for each station selected for display, statistics shown are: name of station; mean msas value; median msas value; number of data readings; and best (highest msas) reading with date/time of it’s first occurrence
* Show/hide bar chart – which displays a bar chart below the data display providing an aggregate view of the data readings for the displayed interval
* Hide/show best reading – which removes the display of the best reading during the time interval that appears above the graph
* Hide/show latest reading – which removes the display of the last reading that appears below the graphical display
* Exclude/include sun, moon, clouds data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by the sun, moon, or clouds; this results in gaps in the graph and shows data points only when the sky is dark and presumed to be clear
* Exclude/include clouds data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by clouds (but does not remove sun or moon influenced data)
* Axis minimum – which sets the minimum msas reading to be included on the vertical axis (note that the minimum cannot be set lower than the bad daat cutoff specified in the configuration file, the default cutoff is 10.0)
* Axis maximum – which sets the maximum msas reading to be included on the vertical axis
* Reverse vertical axis – which reverses the direction of the vertical axis
* Hide/show legend – which removes the legend below the graph showing the color codes and geographical data for the (possibly multiple) SQM stations displayed on the graph
* Hide/show key – which removes the key below the graph legend describing the colorization based on sun, moon and clouds
* Add local data – which allows the user to load files of SQM data from their own device; for each dataset uploaded, the name of the station is Uploaded, Uploaded2, etc.  (Note that this data does not persist past the current session of the SQM Visualizer and is not uploaded to the server.)
* View data files – which allows the user to view the raw data files
* About... – which shows information about the SQM Visualizer software

Note that on mobile devices with small screens, some options are disabled in order to keep the menu small enough to be completely visible.

## Detailed information for a reading

If you hover over a specific data point (equivalently, click on a data point on touch screen devices), information appears related to that data point:

* Date/time of the reading
* Moon status at the time of the reading
* Sun status at the time of the reading
* Mean $r^2$, a technical value used in calculating the estimated cloud cover; in general a higher $r^2$ suggests a more cloudy sky
* Name of the SQM station that associated the data point
* Image thumbnail (if images are attached to the data)

Clicking on a data point, when in all readings mode, will show a larger version of the image taken at that time.  Clicking on a data point, when in best nightly readings mode, will take the user to that night's data; while hovering over a point in best nightly mode, an additional options menu option View image allows the user to see the full size image for that data point.  (On touch screen devices, clicking the thumbnail will bring up the larger image.)

## Selecting datasets

Clicking on an SQM dataset in the legend will show or hide that dataset's readings.  SQMs which have names displayed with strikethrough have their data hidden from view.

## Swiping / arrow buttons

If the user swipes right or left on a touch screen device (equivalently on a nontouch device, if the user clicks the left or right arrow buttons above the graph), the data displayed will shift one night (one month if viewing best nightly readings) forward or backward in time.

## Grid view

The “grid” button in the top center brings up a grid of six nights graphs (alternatively, six months graphs when in best nightly mode) allowing for quick visual comparison.  Clicking on a graph takes the user to the full-size version of that graph.  Left and right arrow buttons (equivalently swiping on mobile) shifts the grid three nights (or three months).