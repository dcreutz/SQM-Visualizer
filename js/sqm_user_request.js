/*	sqm_user_request.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */
	
/*	responsible for reacting to user triggered events */

class SQMUserRequest {
	static #optionsShowing;
	
	// set up listeners for user triggered events
	static addEventListeners() {
		$('tonight').addEventListener("click",(event) => {
			SQMUserRequest.tonight();
		});
		$('tonight').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.tonight();
			}
		});
		SQMUserInputs.nightlyDatePicker.config.onChange.push(() => {
			if (SQMUserInputs.nightlyDatePicker.selectedDates.length > 0) {
				SQMUserRequest.nightly(SQMDate.formatServerDate(
					SQMUserInputs.nightlyDatePicker.selectedDates[0]
				));
			}
		});
		$('gridbutton').addEventListener("click",(event) => {
			SQMUserRequest.showGrid();
		});
		$('gridbutton').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.showGrid();
			}
		});
		$('monthlydropdown').addEventListener("click",(event) => {
			$('actualmonthlydropdown').classList.toggle("monthlyshow");
		});
		window.addEventListener("click", (event) => {
			if (!event.target.matches('.monthlydropbutton')) {
				if ($('actualmonthlydropdown').classList.contains('monthlyshow')) {
					$('actualmonthlydropdown').classList.remove('monthlyshow');
				}
			}
		});
		$('sixmonths').addEventListener("click",(event) => {
			SQMUserRequest.sixMonths();
		});
		$('sixmonths').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.sixMonths();
			}
		});
		$('alltime').addEventListener("click",(event) => {
			SQMUserRequest.allTime();
		});
		$('alltime').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.allTime();
			}
		});
		SQMUserRequest.#optionsShowing = false;
		$('showhideoptions').addEventListener("click",(event) => {
			SQMUserRequest.showhideOptions();
		});
		$('showhideoptions').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.showhideOptions();
			}
		});
		$('readings').addEventListener("change",(event) => {
			SQMUserRequest.setReadings($('readings').options[$('readings').selectedIndex].value);
		});
		$('loadbutton').addEventListener("click",(event) => {
			SQMUserRequest.custom();
		});
		$('loadbutton').addEventListener("keyup",(event) => {
			if ((event.key == 'Enter') || (event.key == 'Return')) {
				SQMUserRequest.custom();
			}
		});
		$('initialfileupload').addEventListener("change",(event) => {
			SQMUserRequest.addInitialDataFromLocalFiles($('initialfileupload').files);
			SQMUserDisplay.hideInitialFileInput();
		});
		$('addfileupload').addEventListener("change",(event) => {
			SQMUserRequest.addDataFromLocalFiles($('addfileupload').files);
			SQMUserDisplay.hideAddFileInput();
		});		
		$('leftarrow').addEventListener("click",(event) => {
			SQMUserRequest.leftArrow();
		});
		$('rightarrow').addEventListener("click",(event) => {
			SQMUserRequest.rightArrow();
		});
		$('leftarrowgrid').addEventListener("click",(event) => {
			SQMUserRequest.leftArrow();
		});
		$('rightarrowgrid').addEventListener("click",(event) => {
			SQMUserRequest.rightArrow();
		});
		SQMUserSwipe.initialize();
		SQMUserSwipe.addListener(SQMUserRequest.swipe);
	}
	
	// called by SQMUserSwipe
	static swipe(swipe) {
		switch (swipe.type) {
			case 'right':
				SQMUserRequest.rightArrow();
				return true;
			case 'left':
				SQMUserRequest.leftArrow();
				return true;
		}
		return false;
	}
	
	// arrowActions correspond to what to do on a swipe
	// these are set by each individual user triggered event, e.g. nightly, monthly, etc
	// to do the correct forward/backward depending on context
	static #arrowActions;
	
	static setArrowActions(actions = {}) {
		SQMUserRequest.#arrowActions = actions;
		SQMUserInputs.showArrows(actions);
	}
	
	static leftArrow() {
		if (SQMUserRequest.#arrowActions && SQMUserRequest.#arrowActions.left) {
			SQMUserRequest.arrowAction(SQMUserRequest.#arrowActions.left);
		}
	}
	
	static rightArrow() {
		if (SQMUserRequest.#arrowActions && SQMUserRequest.#arrowActions.right) {
			SQMUserRequest.arrowAction(SQMUserRequest.#arrowActions.right);
		}
	}
	
	static arrowAction(action) {
		switch (action.type) {
			case 'nightly':
				SQMUserRequest.nightlySlide(action.date);
				break;
			case 'monthly':
				SQMUserRequest.monthlySlide(action.month);
				break;
			case 'sixmonths':
				SQMUserRequest.sixMonthsSlide(action.endDate);
				break;
			case 'grid':
				SQMUserRequest.gridArrowAction(action);
				break;
		}
	}
	
	// the grid of 6 days or 6 months depending on context
	static #timeChartGrid;
	
	static showGrid() {
		if (!SQMUserRequest.#timeChartGrid) {
			SQMUserRequest.#timeChartGrid = new SQMTimeChartGrid(
				'timechartgridholder','timechartgrid'
			);
		}
		SQMUserRequest.#timeChartGrid.setPriorArrowActions(SQMUserRequest.#arrowActions);
		SQMUserRequest.#timeChartGrid.showBackground();
		SQMUserRequest.#timeChartGrid.setColorManagers(sqmManager.getColorManagers());
		SQMUserDisplay.showLoading();
		const dates = SQMUserInputs.getDateTimeInputsAsDates();
		var promise;
		if (SQMUserInputs.getReadingsType() == 'all_readings') {
			const startDate = isNaN(dates.start) ? new Date() : dates.start;
			promise = SQMUserRequest.#timeChartGrid.loadNightly(startDate);
		} else {
			const endDate = isNaN(dates.end) ? new Date() : dates.end;
			const month = SQMDate.formatServerMonth(endDate);
			promise = SQMUserRequest.#timeChartGrid.loadMonthly(month);
		}
		return promise.then((arrowActions) => {
			SQMUserRequest.setArrowActions(arrowActions);
			SQMUserDisplay.hideLoading();
			SQMUserRequest.#timeChartGrid.showGrid();
		});
	}
	
	static gridArrowAction(action) {
		SQMUserDisplay.showLoading();
		return SQMUserRequest.#timeChartGrid.arrowAction(action).then((arrowActions) => {
			SQMUserRequest.setArrowActions(arrowActions);
			SQMUserDisplay.hideLoading();
			SQMUserRequest.#timeChartGrid.redraw();
		});
	}
	
	// user triggered chart display functions
	static tonight() {
		return SQMUserRequest.nightFor();
	}
	
	static nightFor(datetime = null) {
		const date = SQMSunUtils.sunsetBeforeOne(
			sqmManager.activeSqmIds().map((sqmId) => sqmManager.availableSqmInfos[sqmId]),
			datetime
		);
		SQMUserInputs.clearNightlyInput();
		SQMUserInputs.setNightlyInput(date);
		return SQMUserRequest.nightly(null);
	}
	
	static nightly(date,addToHistory = true) {
		return SQMUserRequest.#doNightly(date,addToHistory,false);
	}
	
	// for swipe actions
	static nightlySlide(date,addToHistory = true) {
		return SQMUserRequest.#doNightly(date,addToHistory,true);
	}
	
	static #doNightly(date,addToHistory,slide) {
		if (!date) {
			date = SQMDate.formatServerDate(SQMUserInputs.nightlyDatePicker.selectedDates[0]);
		}
		return sqmManager.userRequest(
			{ type: 'nightly', date: date, twilightType: sqmConfig.twilightType },
			(startDatetime,endDatetime) =>
				"All readings from sunset " + SQMDate.serverToTitleDatetime(startDatetime) + 
				" to sunrise " + SQMDate.serverToTitleDatetime(endDatetime),
			slide
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearMonthlyInput();
			SQMUserInputs.setNightlyInput(date);
			if (addToHistory) {
				SQMBrowserHistory.nightly(date);
			}
			const dateObject = SQMDate.parseServerDate(date);
			const actions = {
				left: {
					type: 'nightly',
					date: SQMDate.formatServerDate(dateFns.addDays(dateObject,-1))
				}
			};
			if (dateObject <= dateFns.addDays(new Date(),-1)) {
				actions.right = {
					type: 'nightly',
					date: SQMDate.formatServerDate(dateFns.addDays(dateObject,1))
				};
			}
			SQMUserRequest.setArrowActions(actions);
		});
	}
	
	static monthly(month,addToHistory = true) {
		if (month != "") {
			return SQMUserRequest.#doMonthly(month,addToHistory,false);
		}
	}
	
	// for swipe actions
	static monthlySlide(month,addToHistory = true) {
		return SQMUserRequest.#doMonthly(month,addToHistory,true);
	}
	
	static #doMonthly(month,addToHistory,slide) {
		const date = dateFns.setDate(SQMDate.parseServerMonth(month),1);
		const titleString =
			"Best nightly readings during " + SQMDate.formatTitleMonth(date);
		const firstDay = SQMDate.formatServerDatetime(date);
		const lastDay = SQMDate.formatServerDatetime(dateFns.lastDayOfMonth(date));
		return sqmManager.userRequest(
			{ type: 'best_nightly_readings', start: firstDay, end: lastDay },
			(startDatetime,endDatetime) => titleString,
			slide
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearNightlyInput();
			SQMUserInputs.setMonthlyInput(month);
			if (addToHistory) {
				SQMBrowserHistory.monthly(month);
			}
			const dateObject = SQMDate.parseServerMonth(month);
			const monthBefore = SQMDate.formatServerMonth(dateFns.addMonths(dateObject,-1));
			const monthAfter = SQMDate.formatServerMonth(dateFns.addMonths(dateObject,1));
			const actions = {};
			if (SQMUserInputs.isMonthAvailable(monthBefore)) {
				actions.left = { type: 'monthly', month: monthBefore };
			}
			if (SQMUserInputs.isMonthAvailable(monthAfter)) {
				actions.right = { type: 'monthly', month: monthAfter };
			}
			SQMUserRequest.setArrowActions(actions);
		});
	}
	
	static allTime(addToHistory = true) {
		return sqmManager.userRequest(
			{ type: 'best_nightly_readings' },
			(startDatetime,endDatetime) => "Best nightly readings over all data"
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearNightlyAndMonthlyInputs();
			if (addToHistory) {
				SQMBrowserHistory.allTime();
			}
			SQMUserRequest.setArrowActions();
		});
	}
	
	static sixMonths(addToHistory = true) {
		var endDate = SQMUserInputs.getDateTimeInputsAsDates().end;
		if (isNaN(endDate)) {
			endDate = new Date();
		}
		return SQMUserRequest.#doSixMonths(endDate,addToHistory,false);
	}
	
	// called by browser history or initial query
	static sixMonthsBeforeDate(endDateString,addToHistory = true) {
		const endDate = SQMDate.parseServerDate(endDateString);
		return SQMUserRequest.#doSixMonths(endDate,addToHistory,false);
	}
	
	// for swipe actions
	static sixMonthsSlide(endDate,addToHistory = true) {
		return SQMUserRequest.#doSixMonths(endDate,addToHistory,true);
	}
		
	static #doSixMonths(endDate,addToHistory,slide) {
		const todayString = SQMDate.formatServerDate(endDate);
		const date = dateFns.addMonths(endDate,-6);
		const sixMonthsAgoString = SQMDate.formatServerDate(date);
		const monthBefore = SQMDate.formatServerMonth(dateFns.addMonths(date,-1));
		const monthAfter = SQMDate.formatServerMonth(dateFns.addMonths(date,7));
		const actions = {};
		if (SQMUserInputs.isMonthAvailable(monthBefore)) {
			actions.left = { type: 'sixmonths', endDate: dateFns.addMonths(endDate,-1) };
		}
		if (SQMUserInputs.isMonthAvailable(monthAfter)) {
			actions.right = { type: 'sixmonths', endDate: dateFns.addMonths(endDate,1) };
		}
		return sqmManager.userRequest(
			{ type: 'best_nightly_readings',
			  start: sixMonthsAgoString,
			  end: todayString },
			(startDatetime,endDatetime) =>
				"Best nightly readings " + SQMDate.formatTitleDate(date)
					+ " to " + SQMDate.formatTitleDate(endDate),
			slide
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearNightlyAndMonthlyInputs();
			if (addToHistory) {
				SQMBrowserHistory.sixMonths(SQMDate.formatServerDate(endDate));
			}
			SQMUserRequest.setArrowActions(actions);
		});
	}
	
	static custom(addToHistory = true) {
		const readingsType = SQMUserInputs.getReadingsType();
		const dateTimeInputs = SQMUserInputs.getDateTimeInputsAsDates();
		if ((!dateTimeInputs.start) || (!dateTimeInputs.end)) {
			alert("Please enter valid start and end dates");
			return false;
		}
		if (readingsType == 'all_readings') {
			return SQMUserRequest.#customAll(
				dateTimeInputs.start,dateTimeInputs.end,addToHistory
			);
		} else {
			return SQMUserRequest.#customBestNightly(
				dateTimeInputs.start,dateTimeInputs.end,addToHistory
			);
		}
	}
	
	static #customBestNightly(start,end,addToHistory) {
		const titleString = "Best nightly readings from " + SQMDate.formatTitleDate(start) +
							" to " + SQMDate.formatTitleDate(end);
		const startDate = SQMDate.formatServerDatetime(start);
		const endDate = SQMDate.formatServerDatetime(end);
		return sqmManager.userRequest({
				type: 'best_nightly_readings',
				start: startDate,
				end: endDate
			},(startDatetime,endDatetime) => titleString
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearNightlyAndMonthlyInputs();
			if (addToHistory) {
				SQMBrowserHistory.customBestNightly(startDate,endDate);
			}
			SQMUserRequest.setArrowActions();
		});
	}
	
	static #customAll(start,end,addToHistory) {
		const titleString = "All readings from " + SQMDate.formatTitleDatetime(start) + 
							" to " + SQMDate.formatTitleDatetime(end);
		const startDatetime = SQMDate.formatServerDatetime(start);
		const endDatetime = SQMDate.formatServerDatetime(end);
		if (Math.abs(dateFns.differenceInDays(endDatetime,startDatetime)) >= 60) {
			alert("Showing all readings over a 60+ day period is not supported.  Showing best nightly readings in requested range instead.");
			SQMUserRequest.#customBestNightly(start,end,addToHistory);
			return;
		}
		return sqmManager.userRequest({
				type: 'all_readings',
				start: startDatetime,
				end: endDatetime
			},(startDatetime,endDatetime) => titleString
		)
		.then((sqmResponses) => {
			SQMUserInputs.clearNightlyAndMonthlyInputs();
			if (addToHistory) {
				SQMBrowserHistory.customAll(startDatetime,endDatetime);
			}
			SQMUserRequest.setArrowActions();
		});
	}
	
	// custom options
	static showhideOptions() {
		if (SQMUserRequest.#optionsShowing) {
			SQMUserInputs.hideOptions();
			SQMUserRequest.#optionsShowing = false;
		} else {
			SQMUserInputs.showOptions();
			SQMUserRequest.#optionsShowing = true;
		}
	}
	
	static setReadings(readingsType) { // 'all_readings' or 'best_nightly_readings'
		SQMUserInputs.setReadingsType(readingsType);
	}
	
	// multiselect
	static multiselectAll() {
		sqmManager.selectAll();
	}
	
	static multiselectNone() {
		sqmManager.deselectAll();
	}
	
	static multiselectAddRemove(sqmId) {
		if (sqmManager.selectedSqmIds().includes(sqmId)) {
			sqmManager.deselect(sqmId);
		} else {
			sqmManager.select(sqmId);
		}
	}
	
	// file upload
	static addDataFromLocalFiles(fileList) {
		if ((fileList) && (_.keys(fileList).length > 0)) {
			sqmManager.createInMemorySqm(fileList)
			.catch((error) => {
				if (sqmConfig.debug) {
					console.log("Parsing file failed");
					console.log(error);
				}
				SQMUserDisplay.hideLoading();
				alert("Failed to parse data file, is it a valid SQM data file?");
			});
		}
	}
	
	static addInitialDataFromLocalFiles(fileList) {
		if ((fileList) && (_.keys(fileList).length > 0)) {
			SQMUserDisplay.showLoading();
			sqmManager.createInMemorySqm(fileList,false)
			.then((sqmId) => {
				sqmManager.activateSqmId(sqmId);
				sqmManager.updateEarliestLatest();
				sqmManager.initialQuery();
			})
			.catch((error) => {
				if (sqmConfig.debug) {
					console.log("Parsing file failed");
					console.log(error);
				}
				SQMUserDisplay.hideLoading();
				alert("Failed to parse data file, is it a valid SQM data file?");
			});
		}
	}
}