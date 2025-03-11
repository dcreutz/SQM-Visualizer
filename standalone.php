<?php
/*	standalone.php
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

//	Creates the standalone.php file meant for distribution
?>
<?php include('php/head.php'); ?>
<script type="text/javascript">
/*
	Edit the configuration options if desired.
*/
var sqmConfig = {
	/*	the title to display */
	title: "SQM Visualizer",
	/*	which twilight type to use when requesting nightly data
		options are 'civil', 'nautical' or 'astronomical' */
	twilightType: 'civil',
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
	/*	whether to take milky way location into account */
	milkyWay: true,
	/*	galactic latitude cutoff to display and filter out if milkyWay is true */
	milkyWayCutoff: 2.5,
	/*	whether to show the sun, moon, mean r^2, MW information in the popup that appears
		when hovering over a point in the chart (touching a point on mobile)
		
		if working with a large number of stations, setting these to false will make the 
		interface cleaner */
	hoverTextSun: true,
	hoverTextMoon: true,
	hoverTextR2: true,
	hoverTextMW: true,
};
</script>

<!--
<?php include("build/LICENSES");
?>
-->
<style type="text/css">
<?php include("contrib/flatpickr/flatpickr.min.css"); ?>
</style>
<style>
<?php include('build/sqm_visualizer.min.css'); ?>
</style>
<script type="text/javascript">
var sqmConfig;
if (!sqmConfig) {
	sqmCOnfig = {};
}
sqmConfig.fetchUrl = false;
sqmConfig.loadInBackground = false;
sqmConfig.showLatitudeLongitude = true;
<?php include('build/sqm_visualizer_contrib.min.js'); ?>
</script>
<!-- standalone.php -->
<?php include('php/copyright.php'); ?>
<?php include('php/main.php'); ?>
<?php include('php/foot.php'); ?>
