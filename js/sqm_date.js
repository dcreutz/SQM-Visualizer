/*	sqm_date.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	utility class for managing dates
	parse functions take a string and return a Date object
	format functions take a Date object and return a string */

class SQMDate {
	// backend formats
	static #serverDate;
	static #serverDatetime;
	static #serverTime;
	static #serverMonth;
	
	// controls input controls formats
	static #controlsDate;
	static #controlsDatetime;
	static #controlsDatetimeNoSeconds;
	static #controls24hourTime;
	static #controlsMonth;
	
	// filename formats
	static #filenameDate;
	static #filenameDatetime;
	
	// displayed text formats
	static #titleDatetime;
	static #titleDate;
	static #titleMonth;

	static initialize() {
		SQMDate.#serverDate = sqmConfig.serverDatetimeFormats.date;
		SQMDate.#serverTime = sqmConfig.serverDatetimeFormats.time;
		SQMDate.#serverDatetime = sqmConfig.serverDatetimeFormats.datetime;
		SQMDate.#serverMonth = sqmConfig.serverDatetimeFormats.month;
		
		SQMDate.#controlsDate = sqmConfig.controlsDatetimeFormats.date;
		SQMDate.#controlsDatetime = sqmConfig.controlsDatetimeFormats.datetime;
		SQMDate.#controlsMonth = sqmConfig.controlsDatetimeFormats.month;
		
		SQMDate.#titleDate = sqmConfig.displayDatetimeFormats.date;
		SQMDate.#titleDatetime = sqmConfig.displayDatetimeFormats.datetime;
		SQMDate.#titleMonth = sqmConfig.displayDatetimeFormats.month;
		
		SQMDate.#filenameDatetime = sqmConfig.filenameDatetimeFormats.datetime;
		SQMDate.#filenameDate = sqmConfig.filenameDatetimeFormats.date;
	}
	
	static user24hourTime() {
		return !(SQMDate.#controlsDatetime.includes('h'));
	}
	
	static serverDatetimeFormat() {
		return SQMDate.#serverDatetime;
	}
	
	static serverDateFormat() {
		return SQMDate.#serverDate;
	}
	
	static controlsDatetimeNoSecondsFormat() {
		return SQMDate.#controlsDatetime.replace(':ss','').replace('-ss','').replace('ss','');
	}
	
	static controlsDateFormat() {
		return SQMDate.#controlsDate;
	}
	
	static formatServerDate(date) {
		return dateFns.format(date,SQMDate.#serverDate);
	}
	
	static formatServerDatetime(date) {
		return dateFns.format(date,SQMDate.#serverDatetime);
	}
	
	static formatServerMonth(date) {
		return dateFns.format(date,SQMDate.#serverMonth);
	}
	
	static serverToTitleDatetime(datetime) {
		return dateFns.format(
			dateFns.parse(datetime,SQMDate.#serverDatetime,new Date()),
			SQMDate.#titleDatetime
		);
	}
	
	static parseServerMonth(string) {
		return dateFns.parse(string,SQMDate.#serverMonth);
	}
	
	static parseServerDatetime(string) {
		return dateFns.parse(string,SQMDate.#serverDatetime,new Date());
	}
	
	static parseServerDate(string) {
		return dateFns.parse(string,SQMDate.#serverDate,new Date());
	}
	
	static formatControlsMonth(date) {
		return dateFns.format(date,SQMDate.#controlsMonth);
	}
	
	static formatTitleDatetime(date) {
		return dateFns.format(date,SQMDate.#titleDatetime);
	}
	
	static formatTitleDate(date) {
		return dateFns.format(date,SQMDate.#titleDate);
	}
	
	static formatTitleMonth(date) {
		return dateFns.format(date,SQMDate.#titleMonth);
	}
	
	static formatFilenameDate(date) {
		return dateFns.format(date,SQMDate.#filenameDate);
	}
	
	static formatFilenameDatetime(date) {
		return dateFns.format(date,SQMDate.#filenameDatetime);
	}
	
	// Date object representing the night this date object should be attached to
	static nightOf(dateObject) {
		return dateFns.format(dateFns.addHours(dateObject,-12),SQMDate.#serverDate);
	}
	
	// helper routines
	static daysBetween(startDateStr,endDateStr) {
		const startDate = SQMDate.parseServerDate(startDateStr);
		const endDate = SQMDate.parseServerDate(endDateStr);
		const dates = [];
		var date = startDate;
		while (date <= endDate) {
			dates.push(SQMDate.formatServerDate(date));
			date = dateFns.addDays(date,1);
		}
		return dates;
	}
	
	static monthsBetween(earliestDatetime,latestDatetime=null) {
		const lastDate = latestDatetime ? SQMDate.parseServerDatetime(latestDatetime) : new Date();
		const firstDayOfMonth = dateFns.setDate(SQMDate.parseServerDatetime(earliestDatetime),1);
		var months = [];
		var date = dateFns.addHours(lastDate,-12); // night of
		while (date >= firstDayOfMonth) {
			months.push(date);
			date = dateFns.addMonths(date,-1);
		}
		return months;
	}
	
	static daysInMonthOf(dateObject) {
		var date = dateFns.setDate(dateObject,1);
		const nextMonth = dateFns.addMonths(date,1);
		const dates = [];
		while (date < nextMonth) {
			dates.push(date);
			date = dateFns.addDays(date,1);
		}
		return dates;
	}
	
	static addMonths(month,num) {
		return SQMDate.formatServerMonth(dateFns.addMonths(SQMDate.parseServerMonth(month),num));
	}
}