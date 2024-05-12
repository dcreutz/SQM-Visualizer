/*	sqm_load_in_background.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */
	
/*	loads data from the server in the background and caches it
	increases responsiveness of the web application at the expense of more server traffic */
	
/*	upon creation, first loads the best nightly readings for all selected sqms
	then loads data month by month until it has all of it
	uses blocking requests to the server */

class SQMLoadInBackground {
	// keyed by date string, contains readings noon to noon
	#dailyReadings;
	// keyed by date string, contains best nightly readings
	#bestReadings;
	// true/fale if best nightly have been loaded
	#hasBestReadings;
	// cached readings time range
	#readingsRange;
	
	// for polling for new data
	#interval;
	
	// helper function to filter readings by sqmId
	#filterSqmIds(sqmIds,readings) {
		if (readings && sqmIds) {
			const response = {};
			sqmIds.forEach((sqmId) => {
				response[sqmId] = readings[sqmId];
			});
			return response;
		}
		return readings;
	}
	
	// attempts to respond to the given request using loaded data
	// returns false if said data has not yet been loaded (or does not exist)
	handleRequest(request) {
		var response;
		switch (request.type) {
			case 'readings_range':
				response = this.#filterSqmIds(request.sqm_ids,this.#readingsRange);
				if (response) {
					response.type = 'readings_range';
				}
				return response;
			case 'daily':
				response = this.#filterSqmIds(request.sqm_ids,this.#dailyReadings[request.date]);
				if (response) {
					response.type = 'all_readings';
				}
				return response;
			case 'nightly':
				// compute sunset and sunrise for the requested night
				const sunsetSunrises = SQMSunUtils.sunsetSunrisesForNight(
					request.date, sqmManager.sqmInfosFor(request.sqm_ids)
				);
				const allReadings = {};
				var hasReadings = true;
				// filter the daily readings to be those in sunset to sunrise range
				request.sqm_ids.forEach((sqmId) => {
					const readings = this.#allReadings(
						sunsetSunrises[sqmId].sunset,
						sunsetSunrises[sqmId].sunrise,
						[sqmId]
					);
					if (readings) {
						allReadings[sqmId] = readings[sqmId];
					} else {
						hasReadings = false;
					}
				});
				if (!hasReadings) {
					return false;
				}
				allReadings.type = 'all_readings';
				return allReadings;
			case 'best_nightly_readings':
				if (this.#hasBestReadings) {
					return this.#bestReadingsInRange(
						request.start,request.end,
						this.#filterSqmIds(request.sqm_ids,this.#bestReadings)
					);
				}
				return false;
			case 'all_readings':
				return this.#allReadings(request.start,request.end,request.sqm_ids);
		}
		return false;
	}
	
	// returns the best nightly readings in the given range from the given readings
	#bestReadingsInRange(start,end,readings) {
		const response = {};
		_.keys(readings).forEach((sqmId) => {
			response[sqmId] = this.#bestReadingsForSqm(start,end,readings[sqmId]);
		});
		response.type = 'best_nightly_readings';
		return response;
	}
	
	// returns the best nightly readings from the readings for a given sqm
	#bestReadingsForSqm(start,end,readings) {
		const startDatetime = (start==null ? readings.startDatetime : start);
		const endDatetime = (end==null ? readings.endDatetime : end);
		const startDate = SQMDate.formatServerDate(startDatetime);
		const endDate = SQMDate.formatServerDate(endDatetime);
		const response = {
			type: readings.type,
			startDatetime: startDatetime,
			endDatetime: endDatetime,
			readings: {}
		};
		_.keys(readings.readings).forEach((datetime) => {
			if ((readings.readings[datetime].date >= startDate) &&
					(readings.readings[datetime].date <= endDate)) {
				response.readings[datetime] =
					SQMLoadInBackground.#duplicate(readings.readings[datetime]);
			}
		});
		response.type = 'best_nightly_readings';
		return response;
	}
	
	static #duplicate(reading) {
		const result = {};
		_.keys(reading).forEach((key) => {
			result[key] = reading[key];
		});
		return result;
	}
	
	// return all readings in the given time range for the given sqms
	#allReadings(start,end,sqmIds) {
		const startDate = SQMDate.nightOf(SQMDate.parseServerDatetime(start));
		const endDate = SQMDate.nightOf(SQMDate.parseServerDatetime(end));
		if ((this.#dailyReadings[startDate]) && (this.#dailyReadings[endDate])) {
			const response = {};
			sqmIds.forEach((sqmId) => {
				response[sqmId] = {
					type: 'all_readings',
					startDatetime: start,
					endDatetime: end,
					readings: {}
				};
			});
			SQMDate.daysBetween(startDate,endDate).map((date) => {
				sqmIds.forEach((sqmId) => {
					_.keys(this.#dailyReadings[date][sqmId].readings).forEach((datetime) => {
						if ((start <= datetime) && (end >= datetime)) {
							response[sqmId].readings[datetime] =
								SQMLoadInBackground.#duplicate(
									this.#dailyReadings[date][sqmId].readings[datetime]
								);
						}
					});
				});
			});
			response.type = 'all_readings';
			return response;
		}
		return false;
	}
	
	// request best nightly data in the background
	#makeBestQuery() {
		if (sqmConfig.debug) {
			console.log("Background loading best");
		}
		const queries = {
			best: { type: 'best_nightly_readings' }
		};
		if (!this.#isDestroyed) {
			return sqmManager.backgroundRequest({ queries: queries })
			.then((response) => {
				this.#bestReadings = response.best;
				this.#hasBestReadings = true;
				if (sqmConfig.debug) {
					console.log("Background loaded best");
				}
			});
		} else {
			return new Promise((resolve,reject) => { resolve() });
		}
	}
	
	// background requests a single day of data
	#queryDay(dateStr) {
		if (!this.#isDestroyed) {
			return sqmManager.backgroundRequest({ type: 'daily', date: dateStr })
					.then((response) => {
				this.#dailyReadings[dateString] = response;
			});
		} else {
			return new Promise((resolve,reject) => { resolve() });
		}
	}

	// chain together the requests for each day of data in a month
	#queryBlockByDay(dateStrings) {
		var chain = Promise.resolve();
		dateStrings.forEach((dateString) => {
			chain = chain.then(() => this.#queryDay(dateString));
		});
		return chain;
	}
	
	// send background requests for a month's data
	// either day by day or all at once depending on config.js options
	#queryBlock(month) {
		if (sqmConfig.debug) {
			console.log("Background loading for month " + month);
		}
		const dates = SQMDate.daysInMonthOf(month);
		const dateStrings = dates.map((date) => SQMDate.formatServerDate(date));
		if (sqmConfig.loadInBackgroundUnit == 'day') {
			return this.#queryBlockByDay(dateStrings);
		}
		const queries = {};
		dateStrings.forEach((dateString) => {
			queries[dateString] = {
				type: 'daily', date: dateString
			};
		});
		if (!this.#isDestroyed) {
			return sqmManager.backgroundRequest({ queries: queries })
			.then((response) => {
				if (sqmConfig.debug) {
					console.log("Background loaded month " + month);
				}
				dateStrings.map((dateString) => {
					this.#dailyReadings[dateString] = response[dateString];
				});
			});
		} else {
			return new Promise((resolve,reject) => { resolve() });
		}
	}

	// chains together the monthly queries so they run in serial
	#createPromiseChain(months) {
		const startingTime = new Date();
		if (sqmConfig.debug) {
			console.log("Background loading beginning");
		}
		var chain = Promise.resolve();
		chain = chain.then(() => this.#makeBestQuery());
		months.forEach((month) => {
			chain = chain.then(() => this.#queryBlock(month));
		});
		chain = chain.then(() => {
			if (sqmConfig.debug) {
				console.log("Background loading complete");
				const endingTime = new Date();
				const seconds = (endingTime - startingTime) / 1000;
				console.log(seconds + " seconds");
			}
			if (!this.#isDestroyed) {
				this.#startPolling();
			}
		});
		return chain;
	}
	
	#isDestroyed;

	// construct a background loader starting from the given datetime
	constructor(earliestDatetime) {
		this.#dailyReadings = {};
		this.#bestReadings = {};
		this.#hasBestReadings = false;
		this.#readingsRange = false;
		this.#isDestroyed = false;
		const months = SQMDate.monthsBetween(
			earliestDatetime,SQMDate.formatServerDatetime(new Date())
		);
		SQMRequest.setBackgroundLoader(this);
		this.#createPromiseChain(months)
		.catch((error) => {
			SQMManager.silentErrorHandler(error,"Something went wrong with background loading");
		});
	}
	
	// set up polling to check for new data in the background
	#startPolling() {
		this.#stopPolling();
		this.#interval = setInterval(
			SQMLoadInBackground.staticCheckForNewReadings.bind(null,this),
			Math.round(sqmConfig.pollingInterval*0.9)
		);
	}
		
	#stopPolling() {
		if (this.#interval) {
			clearInterval(this.#interval);
		}
	}
	
	// static method for the callback
	static staticCheckForNewReadings(instance) {
		if (instance) {
			instance.checkForNewReadings();
		}
	}
	
	destroy() {
		this.#stopPolling();
		this.#isDestroyed = true;
	}
	
	// actually check for new readings
	checkForNewReadings() {
		if (sqmConfig.debug) {
			console.log("Checking for new readings");
		}
		const dateObject = new Date();
		const today = SQMDate.nightOf(dateObject);
		const request = {
			queries: {
				readingsRange: { type: 'readings_range' },
				today: { type: 'daily', date: today },
				best: { type: 'best_nightly_readings' }
			}
		};
		sqmManager.backgroundRequest(request).then((response) => {
			this.#readingsRange = response.readingsRange;
			this.#bestReadings = response.best;
			this.#dailyReadings[today] = response.today;
		}).catch((error) => {
			SQMManager.silentErrorHandler(error,"Something went wrong checking for new readings");
		});
	}
}