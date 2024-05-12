/*	config.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

const sqmConfig = {
	/*	error message to display to the end user */
	userErrorMessage: "Something went wrong retrieving requested data, try reloading the page.\n\nIf this is the first run, this is likely due to the cache still being built.\n\nIf the problem persists, try clearing the cache.",
	
	/*	the title to display */
	title: "SQM Visualizer",
	
	/*	what query should be executed by default when a user first accesses the page
	
		options are 'most recent', 'tonight', 'six months', 'all time'
		where the difference between most recent and tonight is that most recent will return the
		most recent evening's readings of those evening which have readings */
	initialQuery: 'most recent',
	
	/*	which twilight type to use when requesting nightly data
		options are 'civil', 'nautical' or 'astronomical' */
	twilightType: 'nautical',
	
	/*	whether higher msas values appear at the bottom of the individual readings chart */
	nightlyAxisDescending: true,
	
	/*	whether higher msas values appear at the bottom of the best nightly readings chart */
	bestReadingAxisDescening: false,
	
	/*	set the default display options, all of which can be overridden on a per session basis
		using options in the context (right-click) menu */
	showLegend: true, 				// names of sqm stations
	showKey: true, 					// color coding key
	showBestReading: true,			// display best reading below title
	showLatestReading: false,		// display latest reading at bottom of page
	showStats: false,				// display mean, median, etc
	showBinning: false,				// display the bar chart
	
	/*	should the latitude and longitude of the station(s) be shown */
	showLatitudeLongitude: true,
	
	/*	set this to the directory path of the data files if you wish to let the end user view
		your raw data files directly; set to false or unset to disable this */
	dataFilesLink: 'data',
	
	/*	whether to show the about link in the bottom right corner */
	showAboutLink: true,
	
	/*	if a reading is below this, it will be ignored */
	badDataCutoff: 10.0,
	
	/*	best nightly readings will be ignored if there were less than this many readings that night
		this is most useful when filtering by sun moon clouds since it throws out best nightly
		readings for nights which were cloudy or overwhelmingly moon illuminated */
	minReadingsPerNight: 40,
	
	/*	whether cloudy data and sun moon clouds data should be displayed by default
		set to false to filter on these by default
		note that setting to false runs the risk of no data being displayed even on nights when
		readings were taken */
	showCloudyByDefault: true,
	showSunMoonCloudsByDefault: true,
	
	/*	whether to use color and transparency to indicate solar and lunar illumination
		and cloudiess */
	colorizeData: true,
	
	/*	the mean r^2 value below which the sky is considered clear
		points with mean r^2 below this will be drawn opaque if below this value */
	cloudyCutoff: 0.04,
	
	/*	the mean r^2 value above which the sky is considered extremely cloudy
		points with values above this range will be drawn at 20% opacity
		points between these two values will be drawn at scaled opacity acccordingly */
	cloudyMax: 0.1,
	
	/*	the solar altitude cutoffs for coloring points from yellow to orange to dark orange */
	sunAltitudeCutoffs: [ -12, -15, -18 ],
	
	/*	readings when the moon is below the first value in elevation will be considered free
		of interference from the moon
		readings when the moon is above the second value will be considered to be fully effected
		by the moon illumination
		readings with moon altitude in between will be considered to be effected by the moon
		illumination scaled by where in the range the moon's altitude is */
	moonAltitudeCutoffs: [ -10, 30 ],
	
	/*	readings with moon illumination above this value after compsenating for the moon's
		alittude will be filtered out when filter sun moon clouds is selected */
	moonIlluminationCutoff: 0.1,
	
	/*	whether to show the sun, moon, mean r^2 information in the popup that appears
		when hovering over a point in the chart (touching a point on mobile)
		
		if working with a large number of stations, setting these to false will make the 
		interface cleaner */
	hoverTextSun: true,
	hoverTextMoon: true,
	hoverTextR2: true,
	
	/*	how frequently in minutes to check for new data
		pollingInterval reruns the latest user query
		latestPollingInterval looks for updated latest reading
		infoPollingInterval checks for new latest readings and new stations
		
		set to 0 to disable polling */
	pollingInterval: 2,
	latestPollingInterval: 2,
	infoPollingInterval: 15,
	
	/*	whether the visualizer should load all data in the background after the initial query
		if set to true, data is requested first for best nightl;y readings then for all readings
		
		loadInBackgroundUnit specifies the blocks of time to load data in
		options are 'day' or 'month' */
	loadInBackground: true,
	loadInBackgroundUnit: 'month',
	
	/*	if more than five stations' data is in the data directory, this option allows for only
		enabling some of them by default and creating a dropdown allowing the user to enable or
		disable specific stations
		
		set enabledSqms to true to enable all sqms
		set enabledSqms to an array of subdirectories to only enable those
		
		set showSqmsDropdown to true to show the dropdown menu
		set showSqmsDropdown to false to not show the dropdown
		set showSqmsDropdown to null or unset to show only if enabledSqms is not true */
	enabledSqms: true,
	showSqmsDropdown: null,
	
	/*	if multiple sqm stations' data is in the data directory, this option specifies which 
		station(s) data should be displayed by default
		
		to specify multiple stations, give an array of strings
		
		each string should be the name of a subdirectory of the data directory
		
		do not set this option (or set it to null) if there is only one station's data
		as in that case, the default will be to use that data */
	defaultSqm: null,
	
	/*	whether to force the chart to use axis labels only at actual data points
		enabling this will most likely lead to unequally spaced time labels
		not recommended */
	forceTicksFromData: false,
	
	/*	configuration for how dates and times should be displayed to the user
	
		controlsDatetimeFormats is the format used in the user input controls
		displayDatetimeFormats is the format to use when displaying dates in e.g. the title
		filenameDatetimeFormats is the format to use when saving files
		
		valid values are exactly those accepted by dateFns
		https://date-fns.org/v1.30.1/docs/format */
	controlsDatetimeFormats: {
		datetime: 'YYYY-MM-DD HH:mm',
		date: 'YYYY-MM-DD',
		month: 'MMM YYYY'
	},
	
	displayDatetimeFormats: {
		datetime: 'h:mma D MMM YYYY',
		date: 'D MMM YYYY',
		month: 'MMM YYYY'
	},
	
	filenameDatetimeFormats: {
		datetime: 'YYYYMMDDHHmmss',
		date: 'YYYYMMDD'
	},
	
	/*	configuration for how dates and times on the x axis should be displayed
	
		valid values are those accepted by chartjs
		https://www.chartjs.org/docs/latest/axes/cartesian/time.html */
	chartTimeFormat: 'HH:mm',
	chartDateFormat: 'yyyy-MM-dd',
	
	/*	hexadecimal colors to use for distinguishing datasets
		applied first to default sqms then alphabetically */
	colorScheme: ["#3e95cd", "#7f7f7f", "#e27c7c", "#a86464", "#6d4b4b", "#503f3f", 
				  "#333333", "#3c4e4b", "#466964", "#599e94", "#6cd4c5" ],
	
	/*	this connects the visualizer to the backend SQM Data Retriever
	
		set fetchUrl to false to not attempt to connect to a backend
		if set to false, the user will be prompted to load their own data files each time */
	fetchUrl: 'sqm.php',
	
	/*	these should only be changed if using a different backend */
	serverDatetimeFormats: {
		date: 'YYYY-MM-DD',
		time: 'HH:mm:ss',
		datetime: 'YYYY-MM-DD HH:mm:ss',
		month: 'YYYY-MM'
	},
}