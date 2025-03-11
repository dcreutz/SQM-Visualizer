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
	
	/*	update cache from command line only
	
		set to true to not load new data into the cache except using the command line utility
		only enable this if you have configured a cron job or equivalent to update the cache */
	$update_cache_cli_only = true;
	
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
	
	/*	if images are available, such as those produced by https://github.com/AllskyTeam/allsky
		then the backend is able to determine which image is closest to each reading and
		return that information along with the data
		
		use_images determines whether images should be considered
		options are true, false and 'only if cacheing'
		'only if cacheing' is preferred as this takes significant time
		
		image_directory is the directory containing the images
		
		image_directory_url is the url of the image directory
		
		images must have the date and time stamp of when they were taken
		
		image_name_prefix_length is how many characters appear in the file names before
		the datetime stamp
		
		image_name_suffix_length is how many characters appear after the datetime stamp
		
		image_name_format is the datetime format of the datetime stamp
		valid values are those accepted by
		https://www.php.net/manual/en/datetime.createfromformat.php
		
		for example, if using the allsky software, images are named like
			image-20240303175102.jpg
		so prefix length is 6, suffix length is 4
		format is YmdHis corresponding to Year Month Day Hour Minute Second */
	$use_images = 'only if cacheing';
	$image_directory = "images";
	$image_directory_url = "images";
	$image_name_format = "YmdHis";
	$image_name_prefix_length = 6;
	$image_name_suffix_length = 4;
	
	/*	the maximum length of time in seconds between when the image was taken and when the
		reading was taken for which the backend will consider pairing them
		if multiple images are within this time span of a reading, the closest will be used */
	$image_time_frame = 1200;
	
	/*	the backend can automatically create resized images such as thumbnails and attach them
		to the data
		
		***NOTE*** the 'gd' php module must be installed for resizing to work
		
		resize_images determines whether resizing is attempted, values are true or false
		
		resized_directory is the directory to save the resized images in
		it must be writeable for resizing to be enabled
		
		resized_widths is an array of name => width pairs governing the resizing
		each image will be resized to each of the widths specified
		the resized image for a given name will be saved with the same name (and relative path)
		as the original image file but in the subdirectory of the resized directory
		which has the given name */
	$resize_images = true;
	$resized_directory = "resized_images";
	$resized_directory_url = "resized_images";
	$resized_widths = array(
		'display_image'=>800,
		'thumbnail'=>200
	);
	
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