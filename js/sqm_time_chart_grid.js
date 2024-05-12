/*	sqm_time_chart_grid.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	manages the grid of 6 mini charts */
	
class SQMTimeChartGrid {
	#holder; // the DOM element holding the grid
	#div; // the DOM element of the grid itself
	#container; // the DON element container created by this object
	#columns; // the columns of the chart
	#simpleCharts; // the actual mini charts SQMSimpleTimeChart objects
	#isShowing; // is this visible
	#isBackgroundShowing; // is the background element visible
	#allReadingsColorManager;
	#bestReadingsColorManager;
	#priorArrowActions; // preserve the arrow actions if the grid is closed
	
	constructor(holderId,divId) {
		this.#holder = $(holderId);
		this.#div = $(divId);
		this.#container = document.createElement("div");
		this.#container.classList.add("timechartgridcontainer");
		this.#div.appendChild(this.#container);
		this.#columns = [];
		this.#simpleCharts = {};
		this.#isShowing = false;
		this.#isBackgroundShowing = false;
		this.#priorArrowActions = {};
		// set up event listeners for user clicks that close the grid
		document.body.addEventListener('mousedown', SQMTimeChartGrid.#clickOutside.bind(null,this));
		// the close button should always close the grid
		$('closegrid').addEventListener('click', SQMTimeChartGrid.#close.bind(null,this));
	}
	
	// specify the color managers
	setColorManagers(managers) {
		this.#allReadingsColorManager = managers.all;
		this.#bestReadingsColorManager = managers.best;
	}
	
	// if the user clicks outside the grid and the grid is showing, close it
	static #clickOutside(timeChartGrid,event) {
		return timeChartGrid._clickOutside(event);
	}
	
	_clickOutside(event) {
		if (!this.#holder.contains(event.target)) {
			if (this.#isShowing) {
				SQMUserRequest.setArrowActions(this.#priorArrowActions);
			}
			this.hideGrid();
		}
	}
	
	// static methods are required for listeners and hooks
	// by binding to this object on setup, the static method can call the instance
	static #close(timeChartGrid,event) {
		return timeChartGrid._close(event);
	}
	
	_close(event) {
		if (this.#isShowing) {
			SQMUserRequest.setArrowActions(this.#priorArrowActions);
		}
		this.hideGrid();
	}
	
	setPriorArrowActions(actions) {
		this.#priorArrowActions = actions;
	}
	
	// create a DOM element to hold an SQMSimpleTimeChart
	#makeGridItem(id) {
		const item = document.createElement("div");
		item.classList.add("timechartgriditem");
		item.setAttribute("id",id);
		return item;
	}
	
	// create a DOM element for a column
	#makeColumn(id1,id2) {
		const column = document.createElement("div");
		column.classList.add("timechartgridcolumn");
		const item1 = this.#makeGridItem(id1);
		const item2 = this.#makeGridItem(id2);
		column.appendChild(item1);
		column.appendChild(item2);
		return column;
	}
	
	// create the DOM elements for the grid
	// and actually build the SQMSimpleTimeChart objects
	#makeGrid(keys,titles,callbacks,colorManager) {
		for (let i = 0; i < keys.length/2; i++) {
			const column = this.#makeColumn("timechartgrid"+keys[i*2],"timechartgrid"+keys[i*2+1]);
			this.#columns[i] = column;
			this.#container.appendChild(this.#columns[i]);
		}
		keys.forEach((key) => {
			this.#simpleCharts[key] = new SQMSimpleTimeChart(
				this,
				"timechartgrid"+key,
				titles[key], // title for the mini chart
				callbacks[key], // the function to call when the mini chart is clicked on
				colorManager
			);
		});
	}
	
	// show the background which hides the main chart
	showBackground() {
		if (!this.#isBackgroundShowing) {
			this.#clearCharts();
			this.#holder.style.display = "flex";
			this.#holder.style.opacity = 0.25;
			setTimeout(() => {
				this.#holder.style.opacity = 1;
			},20);
			this.#isBackgroundShowing = true;
		}
	}
	
	// show the grid itself
	showGrid() {
		this.showBackground();
		this.redraw();
		this.#isShowing = true;
	}
	
	// hide the grid
	hideGrid() {
		this.#holder.style.display = "none";
		this.#holder.style.opacity = 0;
		this.#isBackgroundShowing = false;
		this.#isShowing = false;
	}
	
	// set the readings of the mini charts
	#setReadings(
		readingsByDate,showWhich,activeSqmIds,titles,callbacks,colorManager
	) {
		this.#clearCharts();
		this.#makeGrid(_.keys(readingsByDate),titles,callbacks,colorManager);
		_.keys(readingsByDate).forEach((date) => {
			this.#simpleCharts[date].setReadings(readingsByDate[date],showWhich);
			this.#simpleCharts[date].setActiveSqmIds(activeSqmIds);
		});
	}
	
	// destroy the mini chart objects
	#clearCharts() {
		this.#container.innerHTML = "";
		_.keys(this.#simpleCharts).forEach((key) => {
			this.#simpleCharts[key].destroy();
		});
		this.#columns = [];
		this.#simpleCharts = {};
	}
	
	// redraw the entire grid
	redraw() {
		_.keys(this.#simpleCharts).forEach((key) => {
			this.#simpleCharts[key].redraw();
		});
	}
	
	// called when the grid should be activated for nightly readings centered on the given date
	loadNightly(startDate) {
		const titles = {};
		const callbacks = {};
		const queries = {};
		
		// default is to put the start date top left
		// check whether it should be elsewhere to avoid empty charts
		// e.g. when the specified date is today so there is no data for the next two days
		const lastAvailableNight = SQMSunUtils.sunsetDateBeforeOne(
			sqmManager.activeSqmIds().map((sqmId) => sqmManager.availableSqmInfos[sqmId]),
			sqmManager.mostRecentDatetime()
		);
		const firstAvailableNight = dateFns.addDays(
			SQMSunUtils.sunsetDateBeforeOne(
				sqmManager.activeSqmIds().map((sqmId) => sqmManager.availableSqmInfos[sqmId]),
				sqmManager.earliestDatetime()
			),1
		);
		
		if (dateFns.addDays(startDate,-3) < firstAvailableNight) {
			startDate = dateFns.addDays(firstAvailableNight,3);
		}
		if (dateFns.addDays(startDate,2) > lastAvailableNight) {
			startDate = dateFns.addDays(lastAvailableNight,-2);
		}
		
		// set up the arrow actions to shift if there is data to shift to
		const arrowActions = {};
		if (SQMDate.nightOf(dateFns.addDays(startDate,-3)) > SQMDate.nightOf(firstAvailableNight)) {
			arrowActions.left =
				{ type: 'grid', action: 'nightly', date: dateFns.addDays(startDate,-3) };
		}
		if (SQMDate.nightOf(dateFns.addDays(startDate,2)) < SQMDate.nightOf(lastAvailableNight)) {
			arrowActions.right =
				{ type: 'grid', action: 'nightly', date: dateFns.addDays(startDate,3) };
		}
		
		// create the grid with the days offset from the computed startDate
		//	0	1	2
		//	-3	-2	-1
		[ 0, -3, 1, -2, 2, -1 ].forEach((days) => {
			const dateObj = dateFns.addDays(startDate,days);
			const date = SQMDate.formatServerDate(dateObj);
			queries[date] = { type: 'nightly', date: date, twilightType: sqmConfig.twilightType };
			titles[date] = SQMDate.formatTitleDate(dateObj);
			callbacks[date] = () => { SQMUserRequest.nightly(date); };
		});
		return this.#loadReadings(
			queries,titles,callbacks,arrowActions,this.#allReadingsColorManager
		);
	}
	
	// called when the grid should be displayed showing monthly data
	loadMonthly(startMonth) {
		if (startMonth == "") {
			startMonth = SQMDate.formatServerMonth(new Date());
		}
		const titles = {};
		const callbacks = {};
		const queries = {};
		
		// determine what months there is data for
		const availableMonths = SQMUserInputs.availableMonths();
		const firstAvailableMonth = _.min(availableMonths);
		const lastAvailableMonth = _.max(availableMonths);
		
		// modify startMonth to avoid displaying empty charts
		// if there is less than 6 months data, default to the empty charts being on the bottom
		if (SQMDate.addMonths(startMonth,-3) < firstAvailableMonth) {
			startMonth = SQMDate.addMonths(firstAvailableMonth,3);
		}
		if (SQMDate.addMonths(startMonth,2) > lastAvailableMonth) {
			startMonth = SQMDate.addMonths(lastAvailableMonth,-2);
		}
		
		// set up the arrow actions if there is data to shift to
		const arrowActions = {};
		if (SQMDate.addMonths(startMonth,-3) > firstAvailableMonth) {
			arrowActions.left =
				{ type: 'grid', action: 'monthly', month: SQMDate.addMonths(startMonth,-3) };
		}
		if (SQMDate.addMonths(startMonth,2) < lastAvailableMonth) {
			arrowActions.right =
				{ type: 'grid', action: 'monthly', month: SQMDate.addMonths(startMonth,2) };
		}
		
		// actually create the grid
		[ 0, -3, 1, -2, 2, -1 ].forEach((months) => {
			const month = SQMDate.addMonths(startMonth,months);
			const date = dateFns.setDate(SQMDate.parseServerMonth(month),1);
			const firstDay = SQMDate.formatServerDatetime(date);
			const lastDay = SQMDate.formatServerDatetime(dateFns.lastDayOfMonth(date));
			queries[month] = { type: 'best_nightly_readings', start: firstDay, end: lastDay };
			callbacks[month] = () => { SQMUserRequest.monthly(month); };
			titles[month] = SQMDate.formatTitleMonth(date);
		});
		return this.#loadReadings(
			queries,titles,callbacks,arrowActions,this.#bestReadingsColorManager
		);
	}
	
	// wrapper function for loading readings into the simple charts
	// make the request via the SQMManager and then load the readings into the charts when answered
	#loadReadings(queries,titles,callbacks,arrowActions,colorManager) {
		return sqmManager.directRequest({ queries: queries }).then((sqmReadings) => {
			this.#setReadings(
				sqmReadings,
				sqmManager.showingWhich(),
				sqmManager.activeSqmIds(),
				titles,
				callbacks,
				colorManager
			);
			return arrowActions;
		});
	}
	
	// perform the action if an arrow is clicked, called by SQMUserRequest
	arrowAction(action) {
		if (action.action == 'nightly') {
			return this.loadNightly(action.date);
		} else {
			return this.loadMonthly(action.month);
		}
	}
}