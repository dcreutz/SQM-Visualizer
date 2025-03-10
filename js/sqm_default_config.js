/*	sqm_default_config.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	sensible defaults for all config.js options
	sqm.js uses these to ensure every config option is set to something
	if an option is set in config.js, we use that
	if not, we use what is here */

const sqmDefaultConfig = {
	userErrorMessage: "Something went wrong retrieving requested data, try reloading the page.",
	title: "SQM Visualizer",
	enabledSqms: true,
	showSqmsDropdown: null,
	initialQuery: 'most recent',
	pollingInterval: 2,
	latestPollingInterval: 2,
	infoPollingInterval: 15,
	loadInBackground: true,
	loadInBackgroundUnit: 'month',
	showLegend: true,
	showKey: true,
	showBestReading: true,
	showLatestReading: false,
	showStats: false,
	showBinning: false,
	showLatitudeLongitude: false,
	defaultMinimumBound: 13,
	minReadingsPerNight: 40,
	badDataCutoff: 10.0,
	twilightType: 'civil',
	nightlyAxisDescending: true,
	bestReadingAxisDescening: false,
	showCloudyByDefault: true,
	showSunMoonCloudsByDefault: true,
	colorizeData: true,
	cloudyCutoff: 0.04,
	cloudyMax: 0.1,
	sunAltitudeCutoffs: [ -12, -15, -18 ],
	moonAltitudeCutoffs: [ -10, 30 ],
	moonIlluminationCutoff: 0.1,
	milkyWay: true,
	milkyWayCutoff: 2.5,
	dataFilesLink: false,
	showAboutLink: false,
	showUserGuideLink: true,
	forceTicksFromData: false,
	hoverTextSun: true,
	hoverTextMoon: true,
	hoverTextR2: true,
	hoverTextMW: true,
	chartDateFormat: 'yyyy-MM-dd',
	chartTimeFormat: 'HH:mm',
	colorScheme: ["#3e95cd", "#7f7f7f", "#e27c7c", "#a86464", "#6d4b4b", "#503f3f", 
				  "#333333", "#3c4e4b", "#466964", "#599e94", "#6cd4c5" ],
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
	fetchUrl: 'sqm.php',
	serverDatetimeFormats: {
		date: 'YYYY-MM-DD',
		time: 'HH:mm:ss',
		datetime: 'YYYY-MM-DD HH:mm:ss',
		month: 'YYYY-MM'
	},
	debug: false
}