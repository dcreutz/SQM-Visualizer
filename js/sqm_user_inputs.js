/*	sqm_user_inputs.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the input fields presented to the user */

class SQMUserInputs {
	static isTouch;
	
	static initialize() {
		SQMUserInputs.isTouch = false;
		SQMUserInputs.#buildStartDatetimePicker();
		SQMUserInputs.#buildEndDatetimePicker();
		SQMUserInputs.#buildDatePicker();
		SQMUserInputs.#leftArrow = $('leftarrow');
		SQMUserInputs.#rightArrow = $('rightarrow');
		SQMUserInputs.#leftArrowGrid = $('leftarrowgrid');
		SQMUserInputs.#rightArrowGrid = $('rightarrowgrid');
		document.multiselect('#fakecurrentsqms');
		window.addEventListener('touchstart', function onFirstTouch() {
			SQMUserInputs.isTouch = true;
			window.removeEventListener('touchstarr',onFirstTouch,false);
		});
	}
	
	// arrows and grid arrows
	static #leftArrow;
	static #rightArrow;
	static #leftArrowGrid;
	static #rightArrowGrid;
	
	static showArrows(actions) {
		if (actions.right != null) {
			SQMUserInputs.#rightArrow.style.display = 'block';
			SQMUserInputs.#rightArrowGrid.style.opacity = 1.0;
			SQMUserInputs.#rightArrowGrid.style.cursor = 'pointer';
		} else {
			SQMUserInputs.#rightArrow.style.display = 'none';
			SQMUserInputs.#rightArrowGrid.style.opacity = 0.0;
			SQMUserInputs.#rightArrowGrid.style.cursor = 'default';
		}
		if (actions.left != null) {
			SQMUserInputs.#leftArrow.style.display = 'block';
			SQMUserInputs.#leftArrowGrid.style.opacity = 1.0;
			SQMUserInputs.#leftArrowGrid.style.cursor = 'pointer';
		} else {
			SQMUserInputs.#leftArrow.style.display = 'none';
			SQMUserInputs.#leftArrowGrid.style.opacity = 0.0;
			SQMUserInputs.#leftArrowGrid.style.cursor = 'default';
		}
	}
	
	static nightlyDatePicker;
	static startDatetimePicker;
	static endDatetimePicker;
	
	// build a datepicker
	static #buildPicker(id,options) {
		const width = getComputedStyle($(id)).width;
		options.disable = ["1970-01-01"]; // flatpickr bug displaying on phones if not set
		options.parseDate = (string,format) => { return dateFns.parse(string,format,new Date()); };
		options.formatDate = (date,format,locale) => { return dateFns.format(date,format); };
		options.altInput = true;
		if (!options.altFormat) {
			options.altFormat = options.dateFormat;
		}
		const picker = flatpickr('#'+id,options);
		picker.altInput.style.width = width;
		return picker;
	}
	
	static #buildStartDatetimePicker() {
		SQMUserInputs.startDatetimePicker = SQMUserInputs.#buildPicker('startdatetime',
			{
				enableTime: true,
				time_24hr: SQMDate.user24hourTime(),
				dateFormat: SQMDate.serverDatetimeFormat(),
				altFormat: SQMDate.controlsDatetimeNoSecondsFormat()
			}
		);
	}
	
	static #buildEndDatetimePicker() {
		SQMUserInputs.endDatetimePicker = SQMUserInputs.#buildPicker('enddatetime',
			{
				enableTime: true,
				time_24hr: SQMDate.user24hourTime(),
				dateFormat: SQMDate.serverDatetimeFormat(),
				altFormat: SQMDate.controlsDatetimeNoSecondsFormat()
			}
		);
	}
	
	static #buildDatePicker() {
		SQMUserInputs.nightlyDatePicker = SQMUserInputs.#buildPicker('nightly',
			{
				dateFormat: SQMDate.serverDateFormat(),
				altFormat: SQMDate.controlsDateFormat()
			}
		);
	}
	
	// user clicks "Custom"
	static showOptions() {
		$('options').style.maxHeight = $('optionshelper').offsetHeight + "px";
	}

	static hideOptions() {
		$('options').style.maxHeight = "0";
	}
	
	// user selected "all readings" and custom
	static showTimeInputs() {
		SQMUserInputs.startDatetimePicker.set('enableTime',true);
		SQMUserInputs.startDatetimePicker.set('time_24hr',SQMDate.user24hourTime());
		SQMUserInputs.startDatetimePicker.set('dateFormat',SQMDate.serverDatetimeFormat());
		SQMUserInputs.startDatetimePicker.set(
			'altFormat',SQMDate.controlsDatetimeNoSecondsFormat()
		);
		SQMUserInputs.endDatetimePicker.set('enableTime',true);
		SQMUserInputs.endDatetimePicker.set('time_24hr',SQMDate.user24hourTime());
		SQMUserInputs.endDatetimePicker.set('dateFormat',SQMDate.serverDatetimeFormat());
		SQMUserInputs.endDatetimePicker.set('altFormat',SQMDate.controlsDatetimeNoSecondsFormat());
		// flatpickr bug does not enable time input
		const elements = document.getElementsByClassName('flatpickr-time');
		for (var i=0;i<elements.length;i++) {
			elements.item(i).style.display = 'block';
		}
	}
	
	// best_nightly_readings and custom
	static hideTimeInputs() {
		SQMUserInputs.startDatetimePicker.set('enableTime',false);
		SQMUserInputs.startDatetimePicker.set('dateFormat',SQMDate.serverDateFormat());
		SQMUserInputs.startDatetimePicker.set('altFormat',SQMDate.controlsDateFormat());
		SQMUserInputs.endDatetimePicker.set('enableTime',false);
		SQMUserInputs.endDatetimePicker.set('dateFormat',SQMDate.serverDateFormat());
		SQMUserInputs.endDatetimePicker.set('altFormat',SQMDate.controlsDateFormat());
		const elements = document.getElementsByClassName('flatpickr-time');
		for (var i=0;i<elements.length;i++) {
			elements.item(i).style.display = 'none';
		}
	}
	
	static clearNightlyAndMonthlyInputs() {
		SQMUserInputs.clearNightlyInput();
		SQMUserInputs.clearMonthlyInput();
	}
	
	static clearNightlyInput() {
		SQMUserInputs.nightlyDatePicker.clear();
	}
	
	static clearMonthlyInput() {
		$('monthly').value = "";
	}
	
	static clearCustomInputs() {
		SQMUserInputs.startDatetimePicker.clear();
		SQMUserInputs.endDatetimePicker.clear();
	}
	
	static setNightlyInput(date) {
		SQMUserInputs.nightlyDatePicker.setDate(date,false);
	}
	
	static setMonthlyInput(month) {
		$('monthly').value = month;
	}
	
	// the custom datetime fields are treated as global variables
	// in the sense that they are what the code trusts to have the correct values
	// for what the user requested
	// all user request calls should, at the end, set these values
	static setDateTimeInputsAsDates(start,end) {
		SQMUserInputs.startDatetimePicker.setDate(start,false);
		SQMUserInputs.endDatetimePicker.setDate(end,false);
	}
	
	static getDateTimeInputsAsDates() {
		return {
			start: SQMUserInputs.startDatetimePicker.selectedDates[0],
			end: SQMUserInputs.endDatetimePicker.selectedDates[0]
		};
	}
	
	// all_readings or best_nightly_readings
	static setReadingsType(readingsType) {
		$('readings').value = readingsType;
		if (readingsType == "all_readings") {
			SQMUserInputs.showTimeInputs();
		} else {
			SQMUserInputs.hideTimeInputs();
		}
	}
	
	static getReadingsType() {
		return $('readings').value;
	}
	
	// keep track of what the monthly dropdown has for entries
	static #currentMonth;
	static #availableMonths;
	
	static isMonthAvailable(month) {
		return SQMUserInputs.#availableMonths.includes(month);
	}
	
	static availableMonths() {
		return SQMUserInputs.#availableMonths;
	}

	// creates the dropdown menu for monthly selections
	static setAvailableMonthsFrom(earliestDatetime,latestDatetime) {
		SQMUserInputs.#currentMonth = $('monthly').options[$('monthly').selectedIndex].value;
		const monthsSince = SQMUserInputs.#monthsBetween(earliestDatetime,latestDatetime);
		if ((!monthsSince) || (monthsSince.length == 0)) {
			$('monthlybox').style.display = "none";
			SQMUserInputs.#availableMonths = [];
			return;
		}
		SQMUserInputs.#availableMonths = monthsSince.map((month) => month.value);
		const monthSelect = $('monthly');
		const monthlyDropdown = $('actualmonthlydropdown');
		while (monthSelect.options.length > 0) {
			monthSelect.remove(0);
		}
		monthlyDropdown.innerHTML = "";
		const newOption = new Option("","",true);
		monthSelect.appendChild(newOption);
		monthsSince.forEach((month) => {
			const newOption = new Option(month.text,month.value,false,
				(month.value == SQMUserInputs.#currentMonth)
			);
			monthSelect.appendChild(newOption);
			const anchor = document.createElement("a");
			anchor.setAttribute('href',"#");
			anchor.innerHTML = month.text;
			anchor.addEventListener("click",(event) => {
				SQMUserRequest.monthly(month.value,true);
			});
			monthlyDropdown.appendChild(anchor);
		});
		$('monthlybox').style.display = "flex";
	}
	
	static #monthsBetween(earliestDatetime,latestDatetime) {
		if (!earliestDatetime) { return null; }
		const dates = SQMDate.monthsBetween(earliestDatetime,latestDatetime);
		const months = [];
		dates.forEach((date) => {
			months.push(
				{ text: SQMDate.formatControlsMonth(date), value: SQMDate.formatServerMonth(date) }
			);
		});
		return months;
	}
	
	// builds the multiselect which, if enabled, allows not all SQMs to be selected
	// see sqm_manager.js
	static #multiselect;
	
	static rebuildMultiselect(sqmManager) {
		$('fakecurrentsqms_multiSelect').style.display = "inline-block";
		if (SQMUserInputs.#multiselect) {
			SQMUserInputs.#multiselect.destroy();
			_.keys(sqmManager.availableSqmInfos).forEach((sqmId) => {
				SQMUserInputs.#multiselect.setCheckBoxClick(sqmId,(target,args)=>{ ; });
			});
		}
		const currentSqmsSelect = $('currentsqms');
		while (currentSqmsSelect.options.length > 0) {
			currentSqmsSelect.remove(0);
		}
		const currentsqms = $('currentsqms');
		const availableSqmInfos = sqmManager.availableSqmInfos;
		sqmConfig.defaultSqm.forEach((sqmId) => {
			if (_.keys(availableSqmInfos).includes(sqmId)) {
				const option = new Option(availableSqmInfos[sqmId].name,sqmId,
										  sqmManager.selectedSqmIds().includes(sqmId),
									  	  sqmManager.selectedSqmIds().includes(sqmId));
				currentsqms.appendChild(option);
			}
		});
		_.keys(availableSqmInfos).forEach((sqmId) => {
			if (!sqmConfig.defaultSqm.includes(sqmId)) {
				const option = new Option(availableSqmInfos[sqmId].name,sqmId,
										  sqmManager.selectedSqmIds().includes(sqmId),
										  sqmManager.selectedSqmIds().includes(sqmId));
				currentsqms.appendChild(option);
			}
		});
		SQMUserInputs.#multiselect = document.multiselect('#currentsqms');
		SQMUserInputs.#multiselect.setCheckBoxClick("checkboxAll",
			(target,args) => {
				if (args.checked) {
					SQMUserRequest.multiselectAll();
				} else {
					SQMUserRequest.multiselectNone();
				}
			});
		_.keys(availableSqmInfos).forEach((sqmId) => {
			SQMUserInputs.#multiselect.setCheckBoxClick(sqmId,
				Function("target","args","SQMUserRequest.multiselectAddRemove('" + sqmId + "');"));
		});
		if (_.keys(sqmManager.availableSqmInfos).length == 1) {
			$('currentsqms_multiSelect').style.display = "none";
		}
		$('fakecurrentsqms_multiSelect').style.display = "none";
	}
}