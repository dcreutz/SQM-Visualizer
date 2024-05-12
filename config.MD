### SQM Visualizer Configuration

The SQM Visualizer can be configured by editing the file config.js in the same directory as index.php.  The backend can be configured by editing the file config.php in the same directory.

The standalone version does not have configuration options (though in principle one could edit the html file to add any configuration options desired to the sqmConfig object defined in it).

All options, and in fact the config.js file itself, are optional and will default sensibly if not specified.

The config.js and config.php files for the examples are located in the examples directory of the source tree.

## config.js

config.js defines the sqmConfig object whose properties configure how the SQM Visualizer behaves.

### User error message

The userErrorMessage property defines the text string to display to the end user if something goes wrong with the web application.  The default message suggests reloading the page and clearing the cache; if the installation of the application is for public use, removing the wording about the cache and possibly adding contact information for support is recommended.

### Title

The title property defines the page (window) title.  The default is 'SQM Visualizer'.

### Initial query

initialQuery defines what request to make when the application is first accessed.  Valid options are 'most recent' (the default), 'tonight', 'six months' or 'all time'.

Most recent gives the most recent night during which readings were taken; tonight gives the most recent night regardless of whether readings were taken.

### Twilight type

twilightType specifies which type of twilight to use.  Options are 'civil', 'nautical' and 'astronomical'.

### Axis orientation

By default, when showing all readings in a given night, the vertical axis is oriented with larger values at the bottom and when showing best nightly readings, the vertical axis is oriented with larger msas values at the top.

nightlyAxisDescending and bestReadingAxisDescending control this behavior with true being larger msas values at the bottom and false putting them at the top.

### Default display options

Various properties of the display can be configured to show or not by default (the user may use the right-click menu to change these settings on a per-site-visit basis).

showLegend determines if the legend (list of all SQMs) should show at the bottom of the chart; showKey determines if the key (indicating how the colorization works) should show; showBestReading whether the best reading in the given range should be displayed below the chart title; showLatestReading whether the most recent reading should be shown; showStats whether the statistics box should be shown; and showBinning whether the bar chart should be shown.

### Latitude and longitude

showLatitudeLongitude determines whether the latitude and longitude of the SQM stations should be displayed when the legend is hovered over.  For the privacy conscious, if the station is located at a personal property then this can be set to false.

### Data files

Set dataFilesLink to the url of the data files if you want to allow the user to view/download your raw data files.  Set it to false or null to disable this.

### About link

Set aboutLink to false to disable the About... context menu item.

### Filtering

The visualizer can filter out readings determined to be bad data in two ways.  badDataCutoff specifies a value for which any reading below that will be discarded.  minReadingsPerNight is the minimum number of readings that must be taken during a nightly interval in order for the best reading of that night to be considered valid (otherwise that day will be skipped in best nightly displays).

The visualizer can also filter by cloudiness (mean $r^2$) and sun and moon information.  Setting showCloudyByDefault to false will have it not display cloudy data (unless the user overrides this from the context menu) and setting showSunMoonCloudsByDefault to false will filter on all three.

### Colorization (sun, moon and clouds)

If colorizeData is true, the visualizer will use color and transparency to display information in the chart.

Cloudiness is indicated by transparency; readings with mean $r^2$ below cloudyCutoff will be opqaue and those over cloudyMax at 20% opacity with readings in between having opacity scaled linearly.

Sun altitude is indicated by hues of orange and sunAltitudeCutoffs specify the three altitudes (in degrees) at which the hues should be used.

Moon altitude and illumination are indicated by black to white with white meaning the moon is in the sky and has significant illumination.  moonAltitudeCutoffs indicate values (in degrees) below which the moon should be considered to not affect the readings (regardless of its illumination) and above which the moon is considered fully in the sky.  moonIlluminationCutoff gives the illumination value above which the moon is considered to be affecting the readings.  The illumination value is computed as the product of the lunar illumination (fraction of lunar surface area illuminated) times the fraction of the way the moon is between the alitude cutoffs.

hoverTextSun, hoverTextMoon and hoverTextR2 determine whether the values should be displayed when the user hovers over a data point.

### Polling for new data

The visualizer can poll the server for new and updated data to allow real-time display.  pollingInterval is the time interval in minutes after which the currently displayed data should be checked for updates; latestPollingInterval is the time interval in minutes to check for new readings; and infoPollingInterval is the time interval in minnutes to check for added and removed sqm stations.

Any or all of these can be set to 0 or null to disable that polling.

### Load data in background

The visualizer can, after loading the initial query, begin loading all available data from the server in the background and cache it in the web browser memory to dramatically speed up response time.  Set loadInBackground to false to disable this feature.  loadInBackgroundUnit specifies what time interval to load data from; options are 'month' and 'day'.

The downside to the background loading feature is that the server load is higher and more bandwidth is used; the upside is dramatically enhanced performance.

### Enabled and default SQMs

These options can (and should) be ignored if working with only one SQM station's data.

Set enabledSqms to true to enable all SQMs in the data directory (enable meaning their data is loaded); alternatively, set it to an array of subdirectory names to enable only those sqms.

Set showSqmsDropdown to force the visualizer to present a dropdown list of the SQMs which the user can use to enable and disable them.  Set showSqmsDropdown to null (the default) to show the dropdown only if enabledSqms is not set to true.

Set defaultSqms to the name of an SQM or an array of names (names meaning the names of the subdirectories in the data directory) to make their data visible by default (and all others' data invisible by default).

### Force ticks from data

If forceTicksFromData is set to true, the chart will always use only actual data readings as labels.  This can result in undesirable behavior as it can lead to unequally spaced (in time) labels.

### Date and time formats

The visualizer displays dates and times using the configuration options controlsDatetimeFormats (for input controls such as the nightly date picker), displayDatetimeFormats (for e.g. the title of the chart) and filenameDatetimeFormats (for the file name to use if the user asks to save the chart as an image).  All three variables must be a key value object with keys datetime, date and month and values being [valid dateFns formats](https://date-fns.org/v1.30.1/docs/format).

Due to third party coding choices, chartDateFormat and chartTimeFormat, which specify how the labels in the chart should be displayed, must be [valid chartjs formats](https://www.chartjs.org/docs/latest/axes/cartesian/time.html), which unfortunately are not the same as those of dateFns.

### Color scheme

colorScheme is an array of hexadecimal colors, e.g. '#3e85cd', which determine the colors of the lines in the time chart and bars in the bar chart.  The SQM stations, ordered first by defaultSqms then alphabetically for the remainder, are assigned colors from the array (with looping back to the start in the event more SQMs than colors are specified).

### Fetch URL

This section should be ignored unless you installed the SQM Data Retriever before installing the SQM Visualizer (a practice which is not recommended and should be uncommon).

If, for some reason, you have installed the SQM Data Retriever in a nonstandard location, fetchURL
specifies the URL of the sqm.php file for the retriever.

If you are using a different backend than the SQM Data Retriever (of which the author is unaware of any existing), fetchUrl can be set to its url.

### Server date and time formats

This section should be ignored unless you are using a different backend than the SQM Data Retriever (of which the author is unaware of any existing).

serverDatetimeFormats specifies how the backend returns date and time information.

## config.php

The SQM Data Retriever backend is configured by editing the config.php file in the same directory as sqm.php.  See the [SQM Data Retriever configuration instructions](https://github.com/dcreutz/SQM-Data-Retriever/blob/main/config.MD).