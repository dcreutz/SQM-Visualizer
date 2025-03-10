/*	sqm_data_in_memory.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	represents sqm readings stored in memory, loaded by SQMFileLoader */

class SQMDataInMemory {
	#allData; // all readings
	#rawData; // raw csv attrbiutes
	#bestData; // best nightly readings
	#position; // lat/long/elev
	#name; // display name of sqm
	#sqmId;
	
	constructor(name) {
		this.#sqmId = name;
		this.#name = name;
		this.#allData = {};
		this.#rawData = {};
		this.#bestData = {};
	}
	
	// create the actual object
	constructFrom(fileList) {
		// load the files
		return SQMFileLoader.loadFiles(fileList)
		.then((theText) => {
			// parse the files
			const parsed = SQMFileLoader.parseData(theText);
			if (!parsed) {
				throw new Error("Could not parse data");
			}
			if (parsed.name) {
				this.#name = parsed.name;
			}
			const data = parsed.data;
			const position = parsed.position;
			this.#position = position;
			const sortedNights = _.keys(data).sort();
			// compute best reading per night
			sortedNights.forEach((night) => {
				this.#allData[night] = {};
				this.#rawData[night] = {};
				const bestReading = _.max(_.values(data[night]));
				const bestDatetime = _.keys(data[night]).find((d) => data[night][d] == bestReading);
				this.#bestData[night] = {
					datetime: bestDatetime,
					reading: bestReading,
					numReadings: _.values(data[night]).length,
					raw: parsed.raw[night][bestDatetime]
				};
				const sortedDatetimes = _.keys(data[night]).sort();
				sortedDatetimes.forEach((datetime) => {
					this.#allData[night][datetime] = data[night][datetime];
					this.#rawData[night][datetime] = parsed.raw[night][datetime];
				});
			});
		});
	}

	// return all readings in the given time range
	getAllReadings(startDatetime,endDatetime) {
		const startDate = SQMDate.nightOf(SQMDate.parseServerDatetime(startDatetime));
		const endDate = SQMDate.nightOf(SQMDate.parseServerDatetime(endDatetime));
		const result = {};
		_.keys(this.#allData).forEach((night) => {
			if ((startDate <= night) && (night <= endDate)) {
				_.keys(this.#allData[night]).forEach((datetime) => {
					if ((startDatetime <= datetime) && (datetime <= endDatetime)) {
						result[datetime] = {
							reading: this.#allData[night][datetime],
							raw: this.#rawData[night][datetime]
						};
					}
				});
			}
		});
		return {
			type: 'all_readings',
			startDatetime: startDatetime,
			endDatetime: endDatetime,
			readings: result
		};
	}
	
	// return best nightly readings in the given time range
	getBestReadings(startDatetime = null,endDatetime = null) {
		var startDate;
		var endDate;
		if (!startDatetime) {
			startDate = _.min(_.keys(this.#bestData));
			endDate = _.max(_.keys(this.#bestData));
		} else {
			startDate = SQMDate.nightOf(SQMDate.parseServerDatetime(startDatetime));
			endDate = SQMDate.nightOf(SQMDate.parseServerDatetime(endDatetime));
		}
		const readings = {};
		_.keys(this.#bestData).forEach((night) => {
			if ((startDate <= night) && (night <= endDate)) {
				readings[this.#bestData[night].datetime] = {
					reading: this.#bestData[night].reading,
					number_of_readings: this.#bestData[night].numReadings,
					date: night,
					raw: this.#bestData[night].raw
				};
			}
		});
		return {
			type: 'best_nightly_readings',
			startDatetime: startDate,
			endDatetime: endDate,
			readings: readings
		};
	}
	
	// respond to a request the same way the backend would
	processRequest(request) {
		if (request.queries) {
			const response = {};
			_.keys(request.queries).forEach((queryId) => {
				response[queryId] = this.processRequest(request.queries[queryId]);
			});
			return response;
		}
		switch (request.type) {
			case 'readings_range':
				return this.readingsRange();
			case 'daily':
				const start = SQMDate.parseServerDate(request.date);
				start.setTime(12,0,0);
				const end = dateFns.addDays(start,1);
				return this.getAllReadings(
					SQMDate.formatServerDatetime(start),
					SQMDate.formatServerDatetime(end)
				);
			case 'nightly':
				const { sunset: sunset, sunrise: sunrise } =
					SQMSunUtils.sunsetSunriseForNight(request.date,
						this.#position.latitude,
						this.#position.longitude,
						this.#sqmId
					);
				return this.getAllReadings(sunset,sunrise);
			case 'all_readings':
				return this.getAllReadings(request.start,request.end);
			case 'best_nightly_readings':
				return this.getBestReadings(request.start,request.end);
		}
	}
	
	// return sqm info as the backend would
	sqmInfo() {
		return {
			name: this.#name,
			latitude: this.#position.latitude,
			longitude: this.#position.longitude,
			time_zone_id: this.#position.time_zone_id,
			time_zone_name: this.#position.time_zone_name
		};
	}
	
	earliestDatetime() {
		return _.min(_.keys(this.#allData[_.min(_.keys(this.#allData))]));
	}	
	
	latestDatetime() {
		return _.max(_.keys(this.#allData[_.max(_.keys(this.#allData))]));
	}
	
	latestReading() {
		return this.#allData[_.max(_.keys(this.#allData))][this.latestDatetime()];
	}
	
	readingsRange() {
		const readings = {};
		const earliestDatetime = this.earliestDatetime();
		const latestDatetime = this.latestDatetime();
		const startDate = SQMDate.nightOf(SQMDate.parseServerDatetime(earliestDatetime));
		const endDate = SQMDate.nightOf(SQMDate.parseServerDatetime(latestDatetime));
		readings[earliestDatetime] = this.#allData[startDate][earliestDatetime];
		readings[latestDatetime] = this.#allData[endDate][latestDatetime];
		return {
			startDatetime: earliestDatetime,
			endDatetime: latestDatetime,
			readings: readings
		};
	}
	
	allDailyReadings() {
		return this.#allData;
	}

	getTimezoneOffset(date) {
		var dateString = SQMDate.formatServerDate(date);
		if (!this.#rawData[dateString]) {
			const keys = _.keys(this.#rawData);
			if (keys.length == 0) {
				return date.getTimezoneOffset();
			}
			dateString = keys[keys.length-1];
		}
		const rawreading = _.values(this.#rawData[dateString])[0];
		const readingdate = SQMDate.parseServerDatetime(_.keys(this.#rawData[dateString])[0]);
		const utcDate = SQMReadings.utcDate(rawreading);
		if (utcDate) {
			return dateFns.differenceInMinutes(utcDate,readingdate);
		} else {
			return date.getTimezoneOffset();
		}
	}
}