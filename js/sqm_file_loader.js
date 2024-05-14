/*	sqm_file_loader.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	loads data from files provided by the user
	used by the SQMManager to create in memory sqm datasets */

class SQMFileLoader {
	// read the contents of the file and return it as a string
	static #readFile(file) {
		return new Promise((resolve,reject) => {
			var fileReader = new FileReader();
			fileReader.onload = () => { resolve(fileReader.result) };
			fileReader.onerror = reject;
			return fileReader.readAsText(file);
		});
	}
	
	// read in an array of filenames and return as a string
	static loadFiles(fileList) {
		const files = _.values(fileList);
		return this.#loadFiles(files,"");
	}
	
	static #loadFiles(files,theText) {
		if (files.length == 1) {
			return SQMFileLoader.#readFile(files.pop())
			.then((text) => {
				return text + theText;
			});
		} else {
			const nextFile = files.pop();
			return SQMFileLoader.#readFile(nextFile)
			.then((text) => {
				return SQMFileLoader.#loadFiles(files,text + theText);
			});
		}
	}
	
	// parse the csv data using the papaparse library
	static parseCsvData(dataText) {
		var delimiter = "";
		const index = dataText.indexOf("# UTC");
		if (index >= 0) {
			// a community standard file e.g. output by PySQM
			const endIndex = dataText.indexOf('\n',index);
			const header =
				dataText.substring(index,endIndex+1).replace("# UTC","UTC").split(", ").join(";");
			dataText = header + dataText;
			// force the delimiter to be a semicolon for these files
			delimiter = ';';
		}
		// parse the data
		const parsed = Papa.parse(dataText,
			{
				delimiter: delimiter,
				header: false,
				dynamicTyping: true,
				comments: "#",
				skipEmptyLines: true
			}
		);
		// the header row is the first row in the parsed object
		const headers = parsed.data.shift();
		return { headers: headers, data: parsed.data, errors: parsed.errors };
	}
	
	// parse the data filtering based on column header
	static parseData(dataText) {
		const parsed = SQMFileLoader.parseCsvData(dataText);
		if (sqmConfig.debug) {
			if (parsed.errors.length > 0) {
				console.log("Errors parsing csv file");
			}
			console.log(parsed);
		}
		// iterate through the headers looking for which columns we care about
		const indices = {};
		_.keys(parsed.headers).forEach((key) => {
			const header = parsed.headers[key].toLowerCase();
			if (header.includes("local")) {
				if (header.includes("date")) {
					if (header.includes("time")) {
						// local datetime
						indices.datetime = key;
					} else {
						// local date
						indices.date = key;
					}
				} else {
					if (header.includes("time")) {
						// local time
						indices.time = key;
					}
				}
			} else if (header.includes("utc")) {
				if (header.includes("date")) {
					if (header.includes("time")) {
						indices.utcdatetime = key;
					} else {
						indices.utcdate = key;
					}
				} else {
					if (header.includes("time")) {
						indices.utctime = key;
					}
				}
			} else if ((header.includes("msas")) && (!header.includes("msas_avg"))) {
				// msas value
				indices.reading = key;
			} else if ((header.includes("latitude")) || (header.includes("lat"))) {
				if (!header.includes("galactic")) {
					// latitude
					indices.latitude = key;
				}
			} else if ((header.includes("longitude")) || (header.includes("long"))) {
				if (!header.includes("galactic")) {
					// longitude
					indices.longitude = key;
				}
			} else if ((header.includes("elevation")) || (header.includes("elev"))) {
				indices.elevation = key;
			}
		});
		if (!indices.reading) {
			throw new Error("Could not parse data file");
		}
		if ((!indices.datetime) && ((!indices.date) || (!indices.time))) {
			throw new Error("Could not parse data file");
		}
		// create the lat/long/elev object for this data
		const position = {};
		if ((indices.latitude != null) && (indices.longitude != null)) {
			position.latitude = parsed.data[0][indices.latitude];
			position.longitude = parsed.data[0][indices.longitude];
			if (indices.elevation != null) {
				position.elevation = parsed.data[0][indices.elevation];
			}
		} else {
			const index = dataText.indexOf("Position");
			const colonIndex = dataText.indexOf(":",index);
			const endIndex = dataText.indexOf("\n",colonIndex);
			const string = dataText.substring(colonIndex+1,endIndex).trim();
			var parts = string.split(", ");
			if (parts.length < 2) {
				parts = string.split(",");
			}
			if (parts.length < 2) {
				parts = string.split(";");
			}
			if (parts.length >= 2) {
				position.latitude = parseFloat(parts[0]);
				position.longitude = parseFloat(parts[1]);
				if (parts.length > 2) {
					position.elevation = parseFloat(parts[3]);
				}
			}
		}
		const timezone = getNearestTimezone(position.latitude,position.longitude);
		position.time_zone_id = timezone.id;
		position.time_zone_name = timezone.name;
		// iterate through the rows of parsed data, storing them indexed by date string
		const dataByDate = {};
		const rawByDate = {};
		if (indices.datetime) {
			parsed.data.forEach((dataEntry) => {
				const datetime = Date.parse(dataEntry[indices.datetime]);
				const datetimeStr = SQMDate.formatServerDatetime(datetime);
				const night = SQMDate.nightOf(datetime);
				if (!dataByDate[night]) {
					dataByDate[night] = {};
					rawByDate[night] = {};
				}
				dataByDate[night][datetimeStr] = dataEntry[indices.reading];
				rawByDate[night][datetimeStr] = {};
				_.keys(parsed.headers).forEach((key) => {
					rawByDate[night][datetimeStr][parsed.headers[key]] = dataEntry[key];
				});
			});
		} else {
			parsed.data.forEach((dataEntry) => {
				const datetime = Date.parse(dataEntry[indices.date]+" "+dataEntry[indices.time]);
				const datetimeStr = SQMDate.formatServerDatetime(datetime);
				const night = SQMDate.nightOf(datetime);
				if (!dataByDate[night]) {
					dataByDate[night] = {};
					rawByDate[night] = {};
				}
				dataByDate[night][datetimeStr] = dataEntry[indices.reading];
				rawByDate[night][datetimeStr] = {};
				_.keys(parsed.headers).forEach((key) => {
					rawByDate[night][datetimeStr][parsed.headers[key]] = dataEntry[key];
				});
			});
		}
		return { data: dataByDate, raw: rawByDate, position: position };
	}
}