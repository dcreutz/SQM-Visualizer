/*	config.js
	SQM Visualizer
	(c) 2024 Darren Creutz */

const sqmConfig = {
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
	showLatitudeLongitude: false,
	
	/*	how frequently in minutes to check for new data
		pollingInterval reruns the latest user query
		latestPollingInterval looks for updated latest reading
		infoPollingInterval checks for new latest readings and new stations
		
		set to 0 to disable polling */
	pollingInterval: 0,
	latestPollingInterval: 0,
	infoPollingInterval: 0,
	
	/*	whether the visualizer should load all data in the background after the initial query
		if set to true, data is requested first for best nightl;y readings then for all readings
		
		loadInBackgroundUnit specifies the blocks of time to load data in
		options are 'day' or 'month' */
	loadInBackground: true,
	loadInBackgroundUnit: 'month',
	
	/*	if a reading is below this, it will be ignored */
	badDataCutoff: 10.0,
	
	/*	best nightly readings will be ignored if there were less than this many readings that night
		this is most useful when filtering by sun moon clouds since it throws out best nightly
		readings for nights which were cloudy or overwhelmingly moon illuminated */
	minReadingsPerNight: 40,
	
	/*	set this to the directory path of the data files if you wish to let the end user view
		your raw data files directly; set to false or unset to disable this */
	dataFilesLink: false,
	
	/*	whether to show the about link in the bottom right corner */
	showAboutLink: true,
	
	/*	this connects the visualizer to the backend SQM Data Retriever
	
		set fetchUrl to false to not attempt to connect to a backend
		if set to false, the user will be prompted to load their own data files each time */
	fetchUrl: 'sqm.php',
}