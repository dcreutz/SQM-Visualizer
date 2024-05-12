<?php
	/*	config.php
		SQM Data Retriever
		(c) 2024 Darren Creutz */
		
	/*	SQM Data Retriever configuration options */

	/*	directory relative to index.php containing sqm data files
		
		if using data from a single station, data files should be placed in this directory
		if using data from multiple stations, each station should have a subdirectory of its files
		stations will be identitifed internally by the names of the subdirectories
		
		if a file named .info is placed in the directory with the data files formatted as
			Name: <name>
			Latitude: <latitude>
			Longitude: <longitude>
			Elevation: <elevation>
		then this information will be used to describe the sqm station
		
		if no such file exists, the data files will be parsed looking for the same information
		creating such files is recommended as naming a station from data files is unreliable */
	$data_directory = "data";
	
	/*	directory relative to index.php to use for cacheing
		
		set to null to not cache best reading data
		if cache_directory is not writeable no cacheing will occur */
	$cache_directory = "cache";
	
	/*	whether data files should be trusted to be named including YYYY-MM or YYYY-MM-DD
		and trusted to have the data in chronological order and end in newline characters
	
		this option should only be used without cacheing and may result in unexpected behavior
		if combined with cacheing 
		
		options are true, false or 'only if not cacheing' 
		'only if not cacheing' is the preferred choice */
	$trust_files = 'only if not cacheing';
	
	/*	whether to override the default script timeout when running
	
		this should be set to true when cacheing since the first pass can take significant time
		if there are large datasets and regression analysis is being performed */
	$extended_time = true;
	
	/*	allowed memory limit
		on some shared hosting, this value may not be modifiable */
	$sqm_memory_limit_if_cacheing = '256M';
	$sqm_memory_limit_if_not_cacheing = '512M';
	
	/*	whether the backend should add sun and moon location information to the data
		
		options are true, false or 'only if cacheing'
		'only if cacheing' is the preferred choice as this can take time */	
	$add_sun_moon_info = 'only if cacheing';
	
	/*	whether to perform linear regression on the data to attempt to determine cloudiness
	
		options are true, false or 'only if cacheing'
		'only if cacheing' is preferred as this takes significant time */
	$perform_regression_analysis = 'only if cacheing';
	
	/*	time range in minutes for regression analysis
	
		data over this period of time will be used in the linear regression */
	$regression_time_range = 60;
	
	/*	time range in minutes for regression averaging
	
		mean r^2 will be computed over this time period */
	$regression_averaging_time_range = 20;
	
	/*	shift in minutes past sunset/before sunrise to compute mean R^2 values for
		if using twilight type other than astronomical, this is necessary since the sun setting
		causes R^2 values to fluctuate not due to clouds */
	$regression_time_shift = 60;
	
	/*	if regression is performed, data requests will receive both the complete data and
		the data filtered by cloudiness and sun and moon location
		
		filter_mean_r_squared is the r^2 value declared to be cloudy, any reading with a larger
		mean r^2 will be filtered
		
		filter_sun_elevation will filter out data when the sun is at or above that elevation
		
		filter_moon_elevation and filter_moon_illumination determine filtering based on the moon
		readings when the moon is at or above that elevation and has illumination at or above
		the given value will be filtered */
	$filter_mean_r_squared = 0.04;
	$filter_sun_elevation = -12;
	$filter_moon_elevation = -10;
	$filter_moon_illumination = 0.1;
		
	/*	whether to clear the cache if an error occurs
		recommended to be true since cache corruption due to process termination before
		completion is the most likely source of errors
		
		note: the cache is only cleared if the process has the cache lock for obvious reasons */
	$clear_cache_on_errors = true;
	
	/*	whether to log recoverable errors in the web server error log */
	$logging_enabled = true;
	
	/*	turning on debugging will log errors to the error log
		it will also disable the global error handler meaning that errors in the backend
		may not be properly reported to the front end
		
		this option should not be used except in development */
	$debug = false;
?>