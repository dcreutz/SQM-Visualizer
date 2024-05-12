/*	sqm_chart.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	manages the main time and bar charts */

class SQMChart {
	// the chart classes
	#timeChart;
	#barChart;
	
	// datetimes of actual data
	latestDatetime;
	startDatetime;
	endDatetime;
	
	// all_readings or best_nightly_readings
	readingsType;
	
	#sqmManager;
	#contextMenus;
	#allReadingsColorManager;
	#bestReadingsColorManager;
	#sunMoonMWClouds;
	
	// whether to filter data
	#showWhich; // 'all' or 'noCloudy' or 'noSunMoonClouds'
	
	// actual datasets for the chart.js objects
	#timeChartDatasets;
	#barChartDatasets;
	
	// the SQMReadingsSet
	#chartReadingsSet;
	
	// the requested start and end datetimes
	#requestedStartDatetime;
	#requestedEndDatetime;
	
	// which sqm datasets should be visible
	#activeSqmIds;
	
	// what function to call to make the chart title
	#titleBuilder;
	static #defaultTitleString() { return ""; }
	
	constructor(sqmManager,timeChartDivId,barChartDivId) {
		this.#sqmManager = sqmManager;
		if (sqmConfig.colorizeData) {
			this.#allReadingsColorManager = new SQMChartAllReadingsColorManager();
			this.#bestReadingsColorManager = new SQMChartBestReadingsColorManager();
		} else {
			this.#allReadingsColorManager = new SQMChartPlainColorManager();
			this.#bestReadingsColorManager = new SQMChartPlainColorManager();
		}
		this.updateSqmList();
		this.#timeChart = new SQMTimeChart(timeChartDivId,this);
		this.#timeChart.showLegend(sqmConfig.showLegend);
		this.#barChart = new SQMBarChart(barChartDivId);
		this.#sunMoonMWClouds = {};
		if (sqmConfig.showCloudyByDefault && sqmConfig.showSunMoonCloudsByDefault) {
			this.#showWhich = 'all';
		} else if (sqmConfig.showSunMoonCloudsByDefault) {
			this.#showWhich = 'noCloudy';
		} else {
			this.#showWhich = 'noSunMoonClouds';
		}
		this.#timeChart.setShowReadings(this.#showWhich);
		this.#barChart.setShowReadings(this.#showWhich);
		this.#timeChartDatasets = {};
		this.#barChartDatasets = {};
		this.#activeSqmIds = sqmManager.initialActivatedSqms();
		this.#titleBuilder = SQMChart.#defaultTitleString;
		this.reinitialize();
	}
	
	getColorManagers() {
		return { all: this.#allReadingsColorManager, best: this.#bestReadingsColorManager };
	}
	
	setTitleBuilder(titleBuilder) {
		this.#titleBuilder = titleBuilder;
	}
	
	// declare which sqms should be active (visible data)
	setActiveSqmIds(activeSqmIds) {
		this.#activeSqmIds = activeSqmIds;
		this.#chartReadingsSet.sqmIds().forEach((sqmId) => {
			if (activeSqmIds.includes(sqmId)) {
				this.#timeChart.activateSqm(sqmId);
				this.#barChart.activateSqm(sqmId);
			} else {
				this.#timeChart.deactivateSqm(sqmId);
				this.#barChart.deactivateSqm(sqmId);
			}
		});
		this.#computeTimesFrom(this.#chartReadingsSet)
		this.redrawTimeChart();
		this.redrawBarChart();
	}
	
	// activate an sqm
	activateSqmId(sqmId) {
		this.#activeSqmIds.push(sqmId);
		this.#timeChart.activateSqm(sqmId);
	}
	
	// deactivate an sqm
	deactivateSqmId(sqmId) {
		if (this.#activeSqmIds.includes(sqmId)) {
			this.#activeSqmIds.splice(this.#activeSqmIds.indexOf(sqmId),1);
			this.#timeChart.deactivateSqm(sqmId);
		}
	}
	
	// array of which sqms are active
	activeSqmIds() {
		return this.#activeSqmIds;
	}
	
	// clear everything
	reinitialize() {
		this.removeAllReadings();
		this.#timeChart.clearRange();
		this.#barChart.clearRange();
	}
	
	reinitializeBarChart() {
		this.#barChart.removeAllDatasets();
		this.#barChart.clearRange();
	}
	
	reinitializeTimeChart() {
		this.#timeChart.removeAllDatasets();
		this.#timeChart.clearRange();
	}
	
	// all_readings or best_nightly_readings
	setReadingsType(readingsType) {
		this.readingsType = readingsType;
		this.#timeChart.setReadingsType(readingsType);
		this.#barChart.setReadingsType(readingsType);
		if (readingsType == 'all_readings') {
			this.#timeChart.setColorManager(this.#allReadingsColorManager);
			this.#barChart.setColorManager(this.#allReadingsColorManager);
		} else {
			this.#timeChart.setColorManager(this.#bestReadingsColorManager);
			this.#barChart.setColorManager(this.#bestReadingsColorManager);
		}
		this.#sqmManager.setReadingsType(readingsType);
	}
	
	// when the sqm list changes, update the color manager color schemes
	updateSqmList() {
		this.#allReadingsColorManager.updateColorSchemes(
			sqmManager.defaultSqms(),sqmManager.availableSqmInfos
		);
		this.#bestReadingsColorManager.updateColorSchemes(
			sqmManager.defaultSqms(),sqmManager.availableSqmInfos
		);
	}
	
	clearCharts() {
		this.#timeChart.clearChart();
		this.#barChart.clearChart();
	}
	
	redrawBarChart() {
		this.#barChart.redraw();
	}
	
	// when redrawing the time chart, alsodraw the title
	redrawTimeChart() {
		SQMUserDisplay.setGraphTitle(this.#titleBuilder(
			this.startDatetime,this.endDatetime
		));
		this.#timeChart.redraw();
	}
	
	/*	set the data of the chart to be from this response from the server */
	setReadings(request,type,sqmResponse) {
		// create the readings set object
		this.#chartReadingsSet = new SQMReadingsSet(sqmResponse,type);
		// compute start and times
		this.#computeTimes(request,this.#chartReadingsSet);
		this.setReadingsType(type);
		// create the actual chart.js dataset objects and let the charts know
		this.#timeChart.setReadingsSet(this.#chartReadingsSet);
		this.#barChart.setReadingsSet(this.#chartReadingsSet);
		_.keys(sqmResponse).forEach((sqmId) => {
			this.#timeChartDatasets[sqmId] = this.#newChartDataset(sqmId);
			this.#timeChart.addDataset(this.#timeChartDatasets[sqmId]);
			this.#barChartDatasets[sqmId] = this.#newChartDataset(sqmId);
			this.#barChart.addDataset(this.#barChartDatasets[sqmId]);
		});
	}
	
	/*	add the data in this response to the chart and shift the time range */
	shiftReadings(request,type,sqmResponse) {
		const newReadingsSet = new SQMReadingsSet(sqmResponse,type);
		this.#chartReadingsSet.add(newReadingsSet);
		this.#computeTimes(request,newReadingsSet);
		// the bar chart doesn't shift so just rebuild it
		this.reinitializeBarChart();
		this.#barChart.setReadingsSet(newReadingsSet);
		_.keys(sqmResponse).forEach((sqmId) => {
			this.#barChartDatasets[sqmId] = this.#newChartDataset(sqmId);
			this.#barChart.addDataset(this.#barChartDatasets[sqmId]);
		});
		// the time chart shifts
		this.#timeChart.shiftedReadings(newReadingsSet);
	}
	
	/*	add the data in this repsonse to the chart and recompute the times */
	addToReadings(request,type,sqmResponse) {
		const newReadingsSet = new SQMReadingsSet(sqmResponse,type);
		const addedSqmIds = this.#chartReadingsSet.add(newReadingsSet);
		// add datasets for any new sqms
		addedSqmIds.forEach((sqmId) => {
			this.#timeChartDatasets[sqmId] = this.#newChartDataset(sqmId);
			this.#timeChart.addDataset(this.#timeChartDatasets[sqmId]);
			this.#barChartDatasets[sqmId] = this.#newChartDataset(sqmId);
			this.#barChart.addDataset(this.#barChartDatasets[sqmId]);
		});
		this.#computeTimes(request,this.#chartReadingsSet);
		// let the charts know to update themselves
		this.#barChart.addedToReadings(newReadingsSet);
		this.#timeChart.addedToReadings(newReadingsSet);
		this.redrawBarChart();
		this.redrawTimeChart();
	}
	
	/*	compute the start and end datetimes for the readings */
	#computeTimes(request,readingsSet) {
		this.#requestedStartDatetime = request.start;
		this.#requestedEndDatetime = request.end;
		this.#computeTimesFrom(readingsSet);
	}
		
	#computeTimesFrom(readingsSet) {
		// compute using only active sqms which have readaings
		var sqmIds = this.#activeSqmIds
						.filter((sqmId) => _.keys(readingsSet.get(sqmId).readings).length > 0);
		// unless none have readings
		if (sqmIds.length == 0) {
			sqmIds = this.#activeSqmIds;
		}
		// if none are active at all then just leave the datetimes as they were
		if (sqmIds.length == 0) {
			return;
		}
		// if the readings set knows the start/end datetimes use them, otherwise use the request
		this.startDatetime =
			readingsSet.startDatetime(sqmIds) || this.#requestedStartDatetime;
		this.endDatetime =
			readingsSet.endDatetime(sqmIds) || this.#requestedEndDatetime;
		this.latestDatetime = readingsSet.latestDatetime(sqmIds);
		// if we are to force the ticks on the time axis to be data points
		if (sqmConfig.forceTicksFromData) {
			if (this.readingsType == 'best_nightly_readings') {
				this.#timeChart.setTicksSource('data');
			} else {
				// if no data within 10 minutes of the desired end, use auto to preserve range
				if ((Date.parse(this.endDatetime) - Date.parse(this.latestDatetime)) >= 600000) {
					this.#timeChart.setTicksSource('auto');
				} else {
					this.#timeChart.setTicksSource('data');
				}
			}
		}
		// update the user datetime inputs
		SQMUserInputs.setDateTimeInputsAsDates(
			SQMDate.parseServerDatetime(this.startDatetime),
			SQMDate.parseServerDatetime(this.endDatetime)
		);
		// tell the time chart the range
		this.#timeChart.setTimeRange(this.startDatetime,this.endDatetime);
	}
	
	/*	create a new chart.js dataset object */
	#newChartDataset(sqmId) {
		return {
			sqmId: sqmId,
			label: this.#shortSqmLabel(sqmId),
			readingsType: this.readingsType,
			hidden: !this.#activeSqmIds.includes(sqmId)
		};
	}
	
	/*	remove the readings for an sqm */
	removeReadings(sqmId) {
		this.#timeChart.removeDataset(sqmId);
		this.#barChart.removeDataset(sqmId);
		this.#chartReadingsSet.remove(sqmId);
		delete this.#timeChartDatasets[sqmId];
		delete this.#barChartDatasets[sqmId];
		if (this.#chartReadingsSet.sqmIds().length > 0) {
			this.#computeTimesFrom(this.#chartReadingsSet);
		}
	}
	
	/*	remove all the readings */
	removeAllReadings() {
		this.#chartReadingsSet = new SQMReadingsSet({},this.readingsType);
		this.#timeChart.removeAllDatasets();
		this.#barChart.removeAllDatasets();
		this.#timeChart.setReadingsSet(this.#chartReadingsSet);
		this.#barChart.setReadingsSet(this.#chartReadingsSet);
	}
	
	// helper function to give a short label to the sqm based on its name
	#shortSqmLabel(sqmId) {
		const sqmName = this.#sqmManager.availableSqmInfos[sqmId].name;
		return sqmName.length > 20 ? sqmName.substring(0,18) + "..." : sqmName;
	}
	
	// toggle showing noCloudy readings
	showHideCloudy() {
		switch (this.#showWhich) {
			case 'all':
				this.#showWhich = 'noCloudy';
				this.#timeChart.showNoCloudyReadings();
				this.#barChart.showNoCloudyReadings();
				break;
			case 'noCloudy':
			case 'noSunMoonClouds':
				this.#showWhich = 'all';
				this.#timeChart.showAllReadings();
				this.#barChart.showAllReadings();
				break;
		}
	}
	
	// toggle showing noSunMoonClouds readings
	showHideSunMoonClouds() {
		switch (this.#showWhich) {
			case 'all':
			case 'noCloudy':
				this.#showWhich = 'noSunMoonClouds';
				this.#timeChart.showNoSunMoonCloudsReadings();
				this.#barChart.showNoSunMoonCloudsReadings();
				break;
			case 'noSunMoonClouds':
				this.#showWhich = 'all';
				this.#timeChart.showAllReadings();
				this.#barChart.showAllReadings();
				break;
		}
	}
	
	showingWhichy() {
		return this.#showWhich;
	}
}