/*	sqm_readings.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	object containing the actual readings to be displayed in the charts
	each sqm's readings for a given query are put in an SQMReadings object */

class SQMReadings {
	// readings is a key value array keyed by datetime with values being key array objects of
	// the data attributes for that datetime such as reading, sun_position, etc
	readings;
	#type; // all_readings or best_nightly_readings
	#sqmId;
	startDatetime;
	endDatetime;
	latestDatetime;
	#canFilter; // whether there are filtered readings
	#filteredR2; // readings filtered based on mean r^2
	#filteredSMC; // readings filtered based on sun, moon and r^2
	
	/*	construct an SQMReadings object
		
		sqmId: string
		response: response object from SQMRequest
		type: 'all_readings' or 'best_nightly_readings' */
	constructor(sqmId,response,type) {
		this.#sqmId = sqmId;
		this.readings = response.readings;
		this.#type = type;
		
		this.#computeTimes(response);
		
		this.readings = this.#cleanseReadings(this.readings,this.#type);
		// determine filtering
		this.#computeFiltered();
		// add in sun and moon info is not's already there
		this.#addSunMoonInfo(
			this.readings,
			sqmManager.availableSqmInfos[sqmId].latitude,
			sqmManager.availableSqmInfos[sqmId].longitude
		);
		// actually filter the readings
		this.#filterReadings();
	}
	
	/*	compute filtered versions of the readings if possible */
	#computeFiltered() {
		this.#canFilter = this.#canFilterClouds(this.readings);
		if (!this.#canFilter) {
			// if no mean r^2 values, look for r^2 in the raw csv data
			this.#pullInRawR2();
		}
		this.#canFilter = this.#canFilterClouds(this.readings);
		if (this.#canFilter) {
			// if we can filter, make sure all readings have a mean r^2 value
			this.#fixMeanR2(this.readings,this.#type);
		}
		this.#addDatetimeAttributes(this.readings);
	}
	
	/*	create the filtered readings */
	#filterReadings() {
		// create the filtered readings
		const filtered = this.#filter(this.readings);
		this.#filteredR2 = filtered.R2;
		this.#filteredSMC = filtered.SMC;
		// add sun and moon info to the filtered readings
		this.#addSunMoonInfo(
			this.#filteredR2,
			sqmManager.availableSqmInfos[this.#sqmId].latitude,
			sqmManager.availableSqmInfos[this.#sqmId].longitude
		);
		this.#addSunMoonInfo(
			this.#filteredSMC,
			sqmManager.availableSqmInfos[this.#sqmId].latitude,
			sqmManager.availableSqmInfos[this.#sqmId].longitude
		);
		// add a datetime attribute to each reading so we don't rely on the array keys
		this.#addDatetimeAttributes(this.#filteredR2);
		this.#addDatetimeAttributes(this.#filteredSMC);
	}
	
	/*	compute the starting and ending datetimes of the readings
	
		response: response object from SQMRequest */
	#computeTimes(response) {
		const datetimes = _.keys(response.readings);
		if (datetimes.length > 0) {
			this.latestDatetime = _.max(datetimes);
			this.startDatetime = response.startDatetime || _.min(datetimes);
			this.endDatetime = response.endDatetime || this.latestDatetime;
		} else {
			this.latestDatetime = null;
			this.startDatetime = response.startDatetime;
			this.endDatetime = response.endDatetime;
		}
	}
	
	/*	add new readings to this object
	
		newReadings: SQMReadings */
	addReadingsTo(newReadings) {
		// replace existing with new when both exist
		_.keys(newReadings.readings).forEach((datetime) => {
			this.readings[datetime] = newReadings.readings[datetime];
		});
		// recompute the start and end datetimes
		this.#computeTimes(newReadings);
		// recompute whether we can filter
		this.#computeFiltered();
		this.#filterReadings();
		// no need to add sun moon info nor datetimes since the newReadings object already
		// did that on construction
	}
	
	/*	remove readings with msas below the badDataCutoff or, in the case of best nightly,
		with less than the required minimum number of readings
		
		readings: a key value array of readings
		type: 'all_readings' or 'best_nightly_readings' */
	#cleanseReadings(readings,type) {
		const cleansed = {};
		if (sqmConfig.badDataCutoff) {
			_.keys(readings).forEach((datetime) => {
				if (readings[datetime].reading >= sqmConfig.badDataCutoff) {
					cleansed[datetime] = readings[datetime];
				}
			});
		} else {
			cleansed = readings;
		}
		if ((type == 'best_nightly_readings') && sqmConfig.minReadingsPerNight) {
			const cleansed2 = {};
			_.keys(cleansed).forEach((datetime) => {
				if (readings[datetime].number_of_readings >= sqmConfig.minReadingsPerNight) {
					cleansed2[datetime] = cleansed[datetime];
				}
			});
			return cleansed2;
		}
		return cleansed;
	}
	
	/*	if the raw csv data has ResidStdErr, use it */
	#pullInRawR2() {
		const aReading = _.values(this.readings).find((reading) => reading != null);
		if (aReading && aReading.raw && aReading.raw.ResidStdErr) {
			_.keys(this.readings).forEach((datetime) => {
				if (!isNaN(this.readings[datetime].raw.ResidStdErr)) {
					this.readings[datetime].mean_r_squared =
						this.readings[datetime].raw.ResidStdErr / 1000;
					// the SunMoonMWClouds algorithm multiplies RSE by 1000
				}
			});
		}
	}
	
	/*	copy mean_r_squared values from the first reading each night which has them
		to all previous readings that night and likewise at the end of the night
		
		readings: a key value array of readings
		type: 'all_readings' or 'best_nightly_readings' */
	#fixMeanR2 (readings,type) {
		if (type == 'all_readings') {
			const datetimes = _.keys(readings).sort();
			const firstNonNullIndex =
				datetimes.find((datetime) => readings[datetime].mean_r_squared != null);
			if (firstNonNullIndex) {
				const firstNonNullR2 = readings[firstNonNullIndex].mean_r_squared;
				const lastNonNullIndex =
					datetimes.toReversed()
						.find((datetime) => readings[datetime].mean_r_squared != null);
				const lastNonNullR2 = readings[lastNonNullIndex].mean_r_squared;
				datetimes.forEach((datetime) => {
					if (datetime < firstNonNullIndex) {
						readings[datetime].mean_r_squared = firstNonNullR2;
					}
					if (datetime > lastNonNullIndex) {
						readings[datetime].mean_r_squared = lastNonNullR2;
					}
				});
			}
		}
	}
	
	/*	add sun and moon information if not already present
	
		readings: a key value array of readings */
	#addSunMoonInfo(readings,latitude,longitude) {
		_.keys(readings).forEach((datetime) => {
			if (!readings[datetime].sun_position) {
				readings[datetime].sun_position =
					SQMSunMoonMWClouds.sunPosition(datetime,latitude,longitude);
			}
			if (!readings[datetime].moon_position) {
				readings[datetime].moon_position =
					SQMSunMoonMWClouds.moonPosition(datetime,latitude,longitude);
			}
			if (!readings[datetime].moon_illumination) {
				readings[datetime].moon_illumination =
					SQMSunMoonMWClouds.moonIllumination(datetime,latitude,longitude);
			}
		});
	}
	
	/*	add datetime attribute to each reading */
	#addDatetimeAttributes(readings) {
		_.keys(readings).forEach((datetime) => {
			if (!readings[datetime].datetime) {
				readings[datetime].datetime = datetime;
			}
		});
	}
	
	/*	determine if we can filter based on mean r^2 */
	#canFilterClouds(readings) {
		// if mean_r_squared is set at all, even to null, it means the backend thinks it
		// is performing r^2 computations (or that r^2 got pulled in from csv)
		return _.values(readings).some((reading) => reading.mean_r_squared !== undefined);
	}
	
	/*	filter a readings collection by mean r^2 */
	#filter(readings) {
		const filteredR2 = {};
		if (this.#canFilter) {
			_.keys(readings).forEach((datetime) => {
				if (readings[datetime].mean_r_squared <= sqmConfig.cloudyCutoff) {
					filteredR2[datetime] = readings[datetime];
				} else {
					if (readings[datetime].filtered_mean_r_squared) {
						filteredR2[readings[datetime].filtered_mean_r_squared.datetime] =
							readings[datetime].filtered_mean_r_squared;
					}
				}
			});
		}
		const filteredSMC = this.#filterSMC(_.keys(filteredR2).length > 0 ? filteredR2 : readings);
		return { R2: filteredR2, SMC: filteredSMC };
	}
	
	/*	filter a readings collection based on sun, moon and mean r^2 */
	#filterSMC(readings) {
		const filteredSMC = {};
		_.keys(readings).forEach((datetime) => {
			var filter = false;
			if (readings[datetime].sun_position.altitude*180/Math.PI >=
						sqmConfig.sunAltitudeCutoffs[2]) {
				filter = true;
			}
			// moonValue is 0.0 to 1.0 representing how much light the moon is likely putting out
			// computed as the moon illumination (0.0 to 1.0) times how far into the moon altitude
			// cutoff range the moon is
			const moonValue = readings[datetime].moon_illumination.fraction *
				(Math.min(
						readings[datetime].moon_position.altitude,
						sqmConfig.moonAltitudeCutoffs[1])
					 - sqmConfig.moonAltitudeCutoffs[0]) /
				(sqmConfig.moonAltitudeCutoffs[1] - sqmConfig.moonAltitudeCutoffs[0]);
			if (moonValue >= sqmConfig.moonIlluminationCutoff) {
				filter = true;
			}
			if (!filter) {
				filteredSMC[datetime] = readings[datetime];
			} else {
				if (readings[datetime].filtered_sun_moon_clouds) {
					filteredSMC[readings[datetime].filtered_sun_moon_clouds.datetime] =
						readings[datetime].filtered_sun_moon_clouds;
				}
			}
		});
		return filteredSMC;
	}
	
	allReadings() {
		return this.readings;
	}
	
	noCloudyReadings() {
		return this.#filteredR2;
	}
	
	noSunMoonCloudsReadings() {
		return this.#filteredSMC;
	}
	
	canFilterClouds() {
		return this.#canFilter;
	}
	
	canFilterSunMoonClouds() {
		return true; // we always have sun and moon information
	}
	
	/*	return a reading for a given datetime */
	reading(datetime) {
		if (this.readings[datetime]) {
			return this.readings[datetime];
		}
		if (this.#filteredR2[datetime]) {
			return this.#filteredR2[datetime];
		}
		if (this.#filteredSMC[datetime]) {
			return this.#filteredSMC[datetime];
		}
		return {};
	}
}

/*	represents a set of SQMReadings objects, one for each sqm */

class SQMReadingsSet {
	#readings;
	
	constructor(response,type) {
		this.#readings = {};
		_.keys(response).forEach((sqmId) => {
			this.#readings[sqmId] = new SQMReadings(sqmId,response[sqmId],type);
		});
	}
	
	// return the list of sqms
	sqmIds() {
		return _.keys(this.#readings);
	}
	
	// return SQMReadings object for the given sqm
	get(sqmId) {
		return this.#readings[sqmId];
	}
	
	remove(sqmId) {
		delete this.#readings[sqmId];
	}
	
	// add an SMReadingsSet object to this one
	add(newReadingsSet) {
		const newSqmIds = [];
		newReadingsSet.sqmIds().forEach((sqmId) => {
			if (this.#readings[sqmId] && newReadingsSet.get(sqmId)) {
				this.#readings[sqmId].addReadingsTo(newReadingsSet.get(sqmId));
			} else {
				if (newReadingsSet.get(sqmId)) {
					this.#readings[sqmId] = newReadingsSet.get(sqmId);
					newSqmIds.push(sqmId);
				}
			}
		});
		return newSqmIds;
	}
	
	allReadings() {
		return _.mapObject(this.#readings,(readings,sqmId) => readings.allReadings());
	}
	
	noCloudyReadings() {
		return _.mapObject(this.#readings,(readings,sqmId) => readings.noCloudyReadings());
	}
	
	noSunMoonCloudsReadings() {
		return _.mapObject(this.#readings,(readings,sqmId) => readings.noSunMoonCloudsReadings());
	}
	
	#readingsFor(sqmIds) {
		const result = {};
		sqmIds.forEach((sqmId) => {
			result[sqmId] = this.get(sqmId);
		});
		return result;
	}
	
	/* return the first start datetime among the specified sqms
	
		sqmIds: array of sqmId strings */
	startDatetime(sqmIds) {
		return _.min(_.values(this.#readingsFor(sqmIds)).map((readings) => readings.startDatetime));
	}
	
	/* return the last end datetime among the specified sqms
	
		sqmIds: array of sqmId strings */
	endDatetime(sqmIds) {
		return _.max(_.values(this.#readingsFor(sqmIds)).map((readings) => readings.endDatetime));
	}
	
	/* return the last latest reading datetime among the specified sqms
	
		sqmIds: array of sqmId strings */
	latestDatetime(sqmIds) {
		return _.max(_.values(this.#readingsFor(sqmIds))
				.map((readings) => readings.latestDatetime));
	}
	
	/*	return the last latest reading among the specified sqms
	
		sqmIds: array of sqmId strings */
	latestReading(sqmIds) {
		if (sqmIds.length == 0) {
			return null;
		}
		const sqmId = sqmIds.reduce((latestId,currentId) =>
			this.#readings[latestId].latestDatetime > this.#readings[currentId].latestDatetime ?
				latestId : currentId
		);
		return {
			sqmId: sqmId,
			datetime: this.#readings[sqmId].latestDatetime,
			value: this.#readings[sqmId].readings[this.#readings[sqmId].latestDatetime].reading
		};
	}
	
	// compute the best reading for a given sqm
	#bestReadingFrom(sqmId) {
		const datetimes = _.keys(this.#readings[sqmId].readings);
		if (datetimes.length == 0) {
			return null;
		}
		const bestDatetime = datetimes.reduce((bestSoFar,current) =>
			this.#readings[sqmId].readings[bestSoFar].reading >
				this.#readings[sqmId].readings[current].reading ?
			bestSoFar : current
		);
		return {
			sqmId: sqmId,
			datetime: bestDatetime,
			value: this.#readings[sqmId].readings[bestDatetime].reading
		};
	}	
	
	/*	return the best readings for the specified sqms
	
		sqmIds: array of sqmId strings */
	bestReadings(sqmIds) {
		const result = {};
		sqmIds.forEach((sqmId) => {
			result[sqmId] = this.#bestReadingFrom(sqmId);
		});
		return result;
	}
	
	/*	return the best reading among those for the specified sqms
	
		sqmIds: array of sqmId strings */
	bestReading(sqmIds) {
		const bestReadings = this.bestReadings(sqmIds);
		sqmIds = _.keys(bestReadings).filter((sqmId) => bestReadings[sqmId] != null);
		if (sqmIds.length == 0) {
			return null;
		}
		const bestSqmId = sqmIds.reduce((soFar,current) =>
			bestReadings[soFar].value > bestReadings[current].value ?
				soFar : current
		);
		return bestReadings[bestSqmId];
	}
	
	// compute statistics for the given sqm
	#statsFor(sqmId) {
		const values = _.keys(this.#readings[sqmId].readings)
						.map((datetime) => this.#readings[sqmId].readings[datetime].reading);
		return {
			mean: SQMReadingsSet.#mean(values),
			median: SQMReadingsSet.#median(values),
			number: values.length
		};
	}
	
	static #mean(values) {
		return _.values(values).reduce((sum,value) => sum + value,0) / _.values(values).length;
	}
	
	static #median(values) {
		const sorted = values.toSorted();
		const middle = Math.floor(sorted.length/2);
		return (sorted.length % 2 === 1) ? sorted[middle] : (sorted[middle-1] + sorted[middle])/2;
	}
	
	/*	return the statistics for the specified sqms
	
		sqmIds: array of sqmId strings */
	stats(sqmIds) {
		const bestReadings = this.bestReadings(sqmIds);
		_.keys(bestReadings).forEach((sqmId) => {
			if (!bestReadings[sqmId]) {
				delete bestReadings[sqmId];
			}
		});
		if (_.keys(bestReadings).length == 0) {
			return {};
		}
		return _.mapObject(bestReadings,(readings,sqmId) => {
			const stats = this.#statsFor(sqmId);
			stats.best = bestReadings[sqmId];
			return stats;
		});
	}
}