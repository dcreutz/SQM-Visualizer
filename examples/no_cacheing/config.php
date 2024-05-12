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
	
	/*	whether data files should be trusted to be named including YYYY-MM or YYYY-MM-DD
		and trusted to have the data in chronological order and end in newline characters
	
		this option should only be used without cacheing and may result in unexpected behavior
		if combined with cacheing 
		
		options are true, false or 'only if not cacheing' 
		'only if not cacheing' is the preferred choice */
	$trust_files = true;
?>