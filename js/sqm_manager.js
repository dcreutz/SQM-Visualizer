/*	sqm_manager.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	global class which is the entry point into the sqm visualizer system
	called e.g. by SQMUserRequest when the user triggers an event */

class SQMManager {
	availableSqmInfos; // info objects indexed by sqmId
	inMemorySqms; // user loaded data files
	
	// selected means checked in the multiselect and that data for that sqm is loaded
	// active means the dataset is visible in the chart
	// selected but not active corresponds to strikethrough in the legend
	// and the data being hidden but in the chart
	// deselected corresponds to not having data loaded at all
	#selectedSqms;
	#initialActivatedSqms;
	
	// keep track of the earliest and latest readings for e.g. building the monthly dropdown
	#earliestDatetimes;
	#latestDatetimes;
	#latestReadings;
	
	// data requester object actually manages the calls to the backend
	#sqmDataRequester;
	
	// the list of sqms to be listed first and to be active on load
	#defaultSqms;
	
	// see sqm_load_in_background.js
	#backgroundLoader;
	
	constructor(defaultSqms) {
		this.availableSqmInfos = {};
		this.inMemorySqms = {};
		this.#selectedSqms = [];
		this.#initialActivatedSqms = [];
		this.#defaultSqms = defaultSqms;
		this.#earliestDatetimes = {};
		this.#latestDatetimes = {};
		this.#latestReadings = {};
	}
	
	defaultSqms() {
		return this.#defaultSqms;
	}
	
	initialActivatedSqms() {
		return this.#initialActivatedSqms;
	}
	
	// called when the user requests an action
	// sends the request via the SQMDataRequester and catches any errors thrown
	userRequest(request,titleStringCallback,slide = false) {
		return this.#sqmDataRequester.userRequest(request,titleStringCallback,slide)
			.catch((error) => {
				if (sqmConfig.debug) {
					console.log("Error processing request");
					console.log(request);
					console.log(error);
				}
				this.#sqmDataRequester.clearCharts();
				SQMManager.errorHandler(error,
					"Could not retrieve requested data. If this persists, try reloading the page."
				);
			});
	}
	
	// called by e.g. the background loader to launch a request in the background
	backgroundRequest(request) {
		return SQMRequest.sendBlocking(request).then((sqmReadings) => {
			this.#sqmDataRequester.addFromInMemory(request,sqmReadings);
			return sqmReadings;
		});
	}
	
	// called by e.g. SQMTimeChartGrid to request data directly
	directRequest(request) {
		return SQMRequest.send(request,true).then((sqmReadings) => {
			this.#sqmDataRequester.addFromInMemory(request,sqmReadings);
			return sqmReadings;
		});
	}
	
	// create the sqm_manager object
	// called after the window is loaded
	initialize() {
		// create the data requester object
		this.#sqmDataRequester = new SQMDataRequester(this,'timechart','barchart');
	
		// initialize the various static user interface objects
		SQMDate.initialize();
		SQMUserInputs.initialize();
		SQMUserDisplay.initialize();
		SQMUserRequest.addEventListeners();
		SQMBrowserHistory.initialize();
		SQMImagePopup.initialize();
		SQMChartColorManager.colorKey();
		
		// determine what sqms are available and what timeframes
		// if preloading is enabled, this request/response is preloaded
		SQMRequest.send(
			{queries: {
				info: {type: 'info'},
				readings_range: {type: 'readings_range'}
			}}
		).then((responses) => {
			// once the request is completed, throw an error if no response was generated
			// or if the response doesn't make sense
			if (!responses) {
				responses = { info: { type: 'info' }, readings_range: { type: 'readings_range' } };
			}
			if ((!_.keys(responses).includes('info')) || (responses.info.type != 'info')) {
				throw new SQMError("Bad response type loading SQM info",
					[ "Response to info and readings range request was ", responses ]
				);
			}
			delete responses.info.type;
			
			// create the list of available sqms and their info
			// put the default sqms first, then the rest
			// set up selected vs active as specified in config.js
			this.availableSqmInfos = {};
			this.#defaultSqms.forEach((sqmId) => {
				if (_.keys(responses.info).includes(sqmId)) {
					this.#selectedSqms.push(sqmId);
					this.#initialActivatedSqms.push(sqmId);
					this.availableSqmInfos[sqmId] = responses.info[sqmId];
				}
			});
			_.keys(responses.info).forEach((sqmId) => {
				if (!_.keys(this.availableSqmInfos).includes(sqmId)) {
					this.availableSqmInfos[sqmId] = responses.info[sqmId];
					if ((sqmConfig.enabledSqms === true)
							|| (sqmConfig.enabledSqms.includes(sqmId))) {
						this.#selectedSqms.push(sqmId);
					}
				}
			});
			
			// if there are no selected sqms, select the first one we find
			if ((_.keys(this.#selectedSqms).length == 0)
					&& (_.keys(this.availableSqmInfos).length > 0)) {
				const anSqmId = _.keys(this.availableSqmInfos).find((sqmId) => sqmId != undefined);
				this.#selectedSqms.push(anSqmId);
			}
			
			// likewise, at least one must be active
			if (_.keys(this.#initialActivatedSqms).length == 0) {
				this.#selectedSqms.forEach((sqmId) => {
					this.#initialActivatedSqms.push(sqmId);
				});
			}
			
			// build the multiselect (only displayed if specified to be in config.js)
			SQMUserInputs.rebuildMultiselect(this);
			this.#sqmDataRequester.updateSqmList();
			
			// compute the earliest and latest datetimes available
			this.#computeEarliestAndLatest(responses.readings_range);
			// set up the monthly dropdown based on earliest and latest
			SQMUserInputs.setAvailableMonthsFrom(
				_.min(_.values(this.#earliestDatetimes)),
				_.max(_.values(this.#latestDatetimes))
			);
			
			// if specified in config,js, set up recurring calls to check the server for
			// changes in available sqms and their time ranges
			if ((sqmConfig.latestPollingInterval) && (sqmConfig.latestPollingInterval > 0)) {
				setInterval(() => { 
					sqmManager.updateEarliestLatest();
				},sqmConfig.latestPollingInterval);
			}
			if ((sqmConfig.infoPollingInterval) && (sqmConfig.infoPollingInterval > 0)) {
				setInterval(() => {
					sqmManager.updateSqmInfos();
				},sqmConfig.infoPollingInterval);
			}

			// now that everything is initialized, remove the cover over the page
			SQMUserDisplay.hideCover();
			if (this.#selectedSqms.length > 0) {
				// if there is at least one sqm available
				// first check if the url specified the request to start with
				const fromUrl = SQMBrowserHistory.fromUrl();
				if (fromUrl) {
					SQMBrowserHistory.fromState(fromUrl)
					.then(() => {
						this.#makeBackgroundLoader();
					});
				} else {
					// otherwise default to the initial query specified in config.js
					this.initialQuery()
					.then(() => {
						this.#makeBackgroundLoader();
					});
				}
			} else {
				// if there are no sqms then we are in standalone mode and the user needs
				// to upload data files
				SQMUserDisplay.hideLoading();
				SQMUserDisplay.showInitialFileInput();
			}
		}).catch((error) => {
			SQMManager.errorHandler(error,"Something went wrong fetching SQM info from server");
		});
	}
	
	// (re)create the SQMBackgroundLoader if config.js enables it
	#makeBackgroundLoader() {
		if (!sqmConfig.loadInBackground) {
			return;
		}
		if (this.#backgroundLoader) {
			this.#backgroundLoader.destroy();
		}
		this.#backgroundLoader = new SQMLoadInBackground(_.min(_.values(this.#earliestDatetimes)));
	}
	
	// return the datetime of the most recent reading
	mostRecentDatetime() {
		if (_.keys(this.activeSqmIds()).length > 0) {
			return _.max(this.activeSqmIds().map(
				(sqmId) => this.#latestDatetimes[sqmId])
			);
		} else {
			// return now if there are no readings
			return new Date();
		}
	}
	
	// return the datetime of the earliest reading
	earliestDatetime() {
		if (_.keys(this.activeSqmIds()).length > 0) {
			return _.min(this.activeSqmIds().map(
				(sqmId) => this.#earliestDatetimes[sqmId])
			);
		} else {
			// return now if there are no readings
			return new Date();
		}
	}
	
	// perform the initial query as specified in config.js
	initialQuery() {
		switch(sqmConfig.initialQuery) {
			case 'most recent':
				return SQMUserRequest.nightFor(this.mostRecentDatetime());
				break;
			case 'tonight':
				return SQMUserRequest.nightFor();
				break;
			case 'six months':
				return SQMUserRequest.sixMonthsBeforeDate(this.mostRecentDatetime());
				break;
			case 'all time':
				return SQMUserRequest.allTime();
				break;
		}
	}
	
	// called by the polling interval (if set) to check for updated time range
	updateEarliestLatest() {
		return SQMRequest.send({ type: 'readings_range' }).then((responses) => {
			_.keys(this.inMemorySqms).forEach((sqmId) => {
				responses[sqmId] = this.inMemorySqms[sqmId].readingsRange();
			});
			this.#computeEarliestAndLatest(responses);
			SQMUserInputs.setAvailableMonthsFrom(
				_.min(_.values(this.#earliestDatetimes)),
				_.max(_.values(this.#latestDatetimes))
			);
			return responses;
		}).catch((error) => {
			SQMManager.silentErrorHandler(error,"Something went wrong fetching reading range info");
		});
	}
	
	// called by the polling interval (if set) to check for new/removed sqms
	updateSqmInfos() {
		return SQMRequest.send({ type: 'info' }).then((responses) => {
			_.keys(this.inMemorySqms).forEach((sqmId) => {
				responses[sqmId] = this.inMemorySqms[sqmId].sqmInfo();
			});
			this.#reloadSqmInfos(responses);
			return responses;
		}).catch((error) => {
			SQMManager.silentErrorHandler(error,"Something went wrong fetching SQM info");
		});
	}
	
	// actually reload the sqm info returned by the server
	#reloadSqmInfos(sqmResponses) {
		if (sqmResponses.type != 'info') {
			throw new SQMError("Bad response type loading SQM info",
				[ "responses.info was", sqmResponses ]
			);
		}
		delete sqmResponses.type;
		var sqmListChanged = false;
		// look for removed sqms
		_.keys(this.availableSqmInfos).forEach((sqmId) => {
			if ((!_.keys(sqmResponses).includes(sqmId))
					&& (!_.keys(this.inMemorySqms).includes(sqmId))) {
				delete this.availableSqmInfos[sqmId];
				sqmListChanged = true;
			}
		});
		// look for added sqms
		_.keys(sqmResponses).forEach((sqmId) => {
			if ((!_.keys(this.availableSqmInfos).includes(sqmId)) ||
					(sqmResponses[sqmId].name != this.availableSqmInfos[sqmId].name)) {
				sqmListChanged = true;
			}
			this.availableSqmInfos[sqmId] = sqmResponses[sqmId];
		});
		// if the list changed, rebuild the multiselect and create a new background loader
		if (sqmListChanged) {
			SQMUserInputs.rebuildMultiselect(this);
			this.#sqmDataRequester.updateSqmList();
			this.#makeBackgroundLoader();
		}
	}
	
	// called when the user uploads files
	createInMemorySqm(fileList,addData = true) {
		// create a unique id for the sqm
		const sqmId = _.keys(this.inMemorySqms).length == 0 ? 
			"Uploaded" : "Uploaded " + (_.keys(this.inMemorySqms).length + 1);
		// create the in memory sqm object
		const sqmInMemory = new SQMDataInMemory(sqmId);
		// construct the sqm in memory from the files
		return sqmInMemory.constructFrom(fileList)
		.then(() => {
			// (re)create the background loader and update everything
			this.inMemorySqms[sqmId] = sqmInMemory;
			this.#makeBackgroundLoader();
			this.availableSqmInfos[sqmId] = this.inMemorySqms[sqmId].sqmInfo();
			this.#earliestDatetimes[sqmId] = this.inMemorySqms[sqmId].earliestDatetime();
			this.#latestDatetimes[sqmId] = this.inMemorySqms[sqmId].latestDatetime();
			this.#latestReadings[sqmId] = this.inMemorySqms[sqmId].latestReading().reading;
			SQMUserInputs.setAvailableMonthsFrom(
				_.min(_.values(this.#earliestDatetimes)),
				_.max(_.values(this.#latestDatetimes))
			);
			// the user uploaded this so it should be selected and activated
			this.#selectedSqms.push(sqmId);
			this.#sqmDataRequester.activateSqmId(sqmId);
			if (addData) {
				this.#sqmDataRequester.addDataRequest([ sqmId ]);
			}
			SQMUserInputs.rebuildMultiselect(this);
			this.#sqmDataRequester.updateSqmList();
			return sqmId;
		});
	}
	
	// activate an sqm
	activateSqmId(sqmId) {
		this.#sqmDataRequester.activateSqmId(sqmId);
	}
	
	// compute earliest and latest from a readings_range response from the server
	#computeEarliestAndLatest(sqmResponses) {
		if (sqmResponses.type != 'readings_range') {
			SQMManager.silentErrorHandler(
				new SQMError("Bad response type loading readings range",
					[ "responses was", sqmResponses ]
				),
				"Warning: something went wrong computing earliest and latest"
			);
			return;
		}
		delete sqmResponses.type;
		_.keys(sqmResponses).forEach((sqmId) => {
			this.#earliestDatetimes[sqmId] = sqmResponses[sqmId].startDatetime;
			this.#latestDatetimes[sqmId] = sqmResponses[sqmId].endDatetime;
			this.#latestReadings[sqmId] =
				sqmResponses[sqmId].readings[this.#latestDatetimes[sqmId]].reading;
		});
		this.updateLatest();
	}
	
	// update the latest reading display
	updateLatest() {
		const latestDatetimeId = this.activeSqmIds().length == 0 ? null :
			this.activeSqmIds().reduce((latest,current) =>
			this.#latestDatetimes[latest] > this.#latestDatetimes[current] ?
				latest : current
		);
		if (latestDatetimeId) {
			SQMUserDisplay.setLatestReading({
				sqmId: latestDatetimeId,
				datetime: this.#latestDatetimes[latestDatetimeId],
				value: this.#latestReadings[latestDatetimeId]
			},this.activeSqmIds().length > 1);
		} else {
			SQMUserDisplay.setLatestReading(null);
		}
	}
	
	// return an array of sqmIds which are active (visible in the chart)
	activeSqmIds() {
		return this.#sqmDataRequester.activeSqmIds();
	}

	// return an array of sqmIds which are selected (in the chart, visible or not)
	selectedSqmIds() {
		return this.#selectedSqms;
	}
	
	// return the sqm info objects for the given array of sqmIds
	sqmInfosFor(sqmIds) {
		const result = {};
		sqmIds.forEach((sqmId) => {
			result[sqmId] = this.availableSqmInfos[sqmId];
		});
		return result;
	}
	
	// set the specified sqm to be selected
	select(sqmId) {
		this.#selectedSqms.push(sqmId);
		this.#sqmDataRequester.addDataRequest([ sqmId ])
		.then(this.#sqmDataRequester.activateSqmId(sqmId))
		.catch((error) => {
			if (sqmConfig.debug) {
				console.log("Error requesting data for sqmId " + sqmId + ": ");
				console.log(error);
			}
			SQMManager.errorHandler(error,"Could not retrieve data for selected SQM");
		});
	}
	
	deselect(sqmId) {
		this.#sqmDataRequester.deactivateSqmId(sqmId);
		this.#selectedSqms.splice(this.#selectedSqms.indexOf(sqmId),1);
		this.#sqmDataRequester.removeReadings(sqmId);
	}
	
	selectAll() {
		this.#sqmDataRequester.addDataRequest(
			_.keys(this.availableSqmInfos).filter(
				(sqmId) => !this.#selectedSqms.includes(sqmId)
			)
		).then((sqmResponses) => {
			this.#selectedSqms = _.keys(this.availableSqmInfos);
		}).catch((error) => {
			if (sqmConfig.debug) {
				console.log("Error requesting data for all sqmIds: ");
				console.log(error);
			}
			SQMManager.errorHandler(error,"Could not retrieve data for selected SQM");
		});
	}
	
	deselectAll() {
		this.activeSqmIds().forEach((sqmId) => {
			this.#sqmDataRequester.deactivateSqmId(sqmId);
		});
		this.#selectedSqms = [];
		this.#sqmDataRequester.removeAllReadings();
	}
	
	setReadingsType(readingsType) {
		SQMUserInputs.setReadingsType(readingsType);
	}
	
	// return the color managers for the main charts
	// called by the time chart grid
	getColorManagers() {
		return this.#sqmDataRequester.getColorManagers();
	}
	
	showingWhich() {
		return this.#sqmDataRequester.showingWhich();
	}
	
	// error handling routines
	static errorHandler(error,message) {
		SQMManager.silentErrorHandler(error,message);
		alert(sqmConfig.userErrorMessage);
	}
	
	static silentErrorHandler(error,message) {
		if (sqmConfig.debug) {
			console.log(message);
			console.log("Error was");
			console.log(error);
			if (sqmManager) {
				console.log("sqmManager is");
				console.log(sqmManager);
			} else {
				console.log("<invalid SQMManager object>");
			}
			if (error.debugObjects) {
				console.log("Additional info");
				error.debugObjects.forEach((object) => { console.log(object); });
			}
		}
	}
	
	#getTZOffset(timeZone){
		const str = new Date().toLocaleString('en', {timeZone, timeZoneName: 'longOffset'});
		const [_,h,m] = str.match(/([+-]\d+):(\d+)$/) || [, '+00', '00'];
		return -(h * 60 + (h > 0 ? +m : -m));
	}
	
	getTimezoneOffset(sqmId,date) {
		if (this.availableSqmInfos[sqmId].time_zone_id) {
			return this.#getTZOffset(this.availableSqmInfos[sqmId].time_zone_id);
		} else {
			return this.inMemorySqms[sqmId].getTimezoneOffset(date);
		}
	}
}

// custom error class
class SQMError extends Error {
	debugObjects;
	
	constructor(message,listOfDebugObjects) {
		super(message);
		this.debugObjects = listOfDebugObjects;
	}
}