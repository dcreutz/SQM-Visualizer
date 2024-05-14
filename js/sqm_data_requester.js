/*	sqm_data_requester.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	requests data from the SQMRequest object when asked to be the SQMManager */

class SQMDataRequester {
	currentRequest; // the current request, for adding data if new sqms are selected
	#sqmChart; // the SQMChart object
	#pollInterval;
	#sqmManager;
	
	constructor(sqmManager,timeChartDivId,barChartDivId) {
		this.#sqmManager = sqmManager;
		this.#sqmChart = new SQMChart(sqmManager,timeChartDivId,barChartDivId);
		this.#pollInterval = null;
		this.currentRequest = { sqm_ids: [] };
	}
	
	// returns the array of active sqms
	activeSqmIds() {
		return this.#sqmChart.activeSqmIds();
	}
	
	// performs a data request based on a user action
	userRequest(request,titleStringCallback,slide = true) {
		// stop polling for the previous request
		this.#endPolling();
		// request data for all selected sqms
		request.sqm_ids = this.#sqmManager.selectedSqmIds();
		// update the current request to the request given
		this.currentRequest = request;
		// tell the chart how to build a title for this request
		this.#sqmChart.setTitleBuilder(titleStringCallback);
		// make the request
		return this.#makeRequest(request,!slide,slide)
		.then((sqmResponses) => {
			// start looking for updates to the current request
			this.#beginPolling();
			// return the responses from SQMRequest
			return sqmResponses;
		});
	}
	
	// activate an sqm
	activateSqmId(sqmId) {
		this.#sqmChart.activateSqmId(sqmId);
	}
	
	// activate an sqm
	deactivateSqmId(sqmId) {
		this.#sqmChart.deactivateSqmId(sqmId);
	}
	
	// check for new data and catch errors silently
	static #checkNewData(instance) {
		instance.newDataRequest()
		.catch((error) => {
			if (sqmConfig.debug) {
				console.log("Error looking for new data: ");
				console.log(error);
			}
		});
	}
	
	// start/stop polling for updates to the current request
	#beginPolling() {
		this.#endPolling();
		if ((sqmConfig.pollingInterval) && (sqmConfig.pollingInterval > 0)) {
			this.#pollInterval = setInterval(
				SQMDataRequester.#checkNewData.bind(null,this),
				sqmConfig.pollingInterval
			);
		}
	}
	
	#endPolling() {
		if (this.#pollInterval) {
			clearInterval(this.#pollInterval);
		}
	}
	
	// called when e.g. the user swipes so new data should be added to the existing chart
	addDataRequest(sqmIds) {
		this.currentRequest.sqm_ids = sqmIds;
		return this.#makeRequest(this.currentRequest);
	}
	
	// called periodically (if enabled in config.js) to check for new data for the current request
	newDataRequest() {
		return this.#sendRequest(this.currentRequest)
		.then((sqmReadings) => {
			const type = sqmReadings.type;
			delete sqmReadings.type;
			if (this.#sqmChart.addToReadings(this.currentRequest,type,sqmReadings)) {
				this.redraw();
			}
		});
	}
	
	// add readings from the in memory sqms (if any) to the response
	addFromInMemory(request,response) {
		if (request.queries) {
			_.keys(request.queries).forEach((queryId) => {
				this.#addFromInMemoryOne(request.queries[queryId],response[queryId]);
			});
		} else {
			this.#addFromInMemoryOne(request,response);
		}
	}
			
	#addFromInMemoryOne(request,response) {
		_.keys(this.#sqmManager.inMemorySqms).forEach((sqmId) => {
			response[sqmId] = this.#sqmManager.inMemorySqms[sqmId].processRequest(request);
		});
	}
	
	// send a request via the SQMRequest object
	#sendRequest(request) {
		if (request.sqm_ids.length == 0) {
			// if no sqms are specified, return an empty response
			return new Promise((resolve,reject) => { resolve({}) });
		}
		return SQMRequest.send(request).then((sqmReadings) => {
			if (!sqmReadings) {
				sqmReadings = {};
			}
			// add in the in memory data
			request.sqm_ids.forEach((sqmId) => {
				if (_.keys(this.#sqmManager.inMemorySqms).includes(sqmId)) {
					sqmReadings[sqmId] =
						this.#sqmManager.inMemorySqms[sqmId].processRequest(request);
				}
			});
			// remove empty sqm reading sets
			_.keys(sqmReadings).forEach((sqmId) => {
				if (sqmId != 'type') {
					if ((!sqmReadings[sqmId]) ||  (!sqmReadings[sqmId].readings)) {
						delete sqmReadings[sqmId];
					}
				}
			});
			// store the readings
			return sqmReadings;
		});
	}
	
	// make a request from the SQMRequest object
	// the sliding should be handled better, it was shoehorned in
	#makeRequest(request,reinitialize=false,slide=false) {
		SQMUserDisplay.showLoading();
		return this.#sendRequest(request)
		.then((sqmReadings) => {
			const type = sqmReadings.type;
			delete sqmReadings.type;
			if (reinitialize) {
				// if the chart should definitely be rebuilt, do so
				this.#sqmChart.reinitialize();
				this.#sqmChart.setReadings(request,type,sqmReadings);
			} else {
				if (slide) {
					// if we should slide the time chart after adding data
					this.#sqmChart.shiftReadings(request,type,sqmReadings);
				} else {
					// otherwise just add the readings to the chart
					this.#sqmChart.addToReadings(request,type,sqmReadings);
				}
			}
			SQMUserDisplay.hideLoading();
			this.redraw();
			return sqmReadings;
		}).catch((error) => {
			SQMUserDisplay.hideLoading();
			throw error;
		});
	}
	
	// redraws the charts
	redraw() {
		this.#sqmChart.redrawTimeChart();
		this.#sqmChart.redrawBarChart();
	}
	
	updateSqmList() {
		this.#sqmChart.updateSqmList();
	}
	
	clearCharts() {
		this.#sqmChart.clearCharts();
	}
	
	removeReadings(sqmId) {
		this.#sqmChart.removeReadings(sqmId);
		this.redraw();
	}
	
	removeAllReadings() {
		this.#sqmChart.removeAllReadings();
		this.redraw();
	}
	
	getColorManagers() {
		return this.#sqmChart.getColorManagers();
	}
	
	showingWhich() {
		return this.#sqmChart.showingWhich();
	}
}