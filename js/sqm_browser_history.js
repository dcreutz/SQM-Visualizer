/*	sqm_browser_history.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the browser history (back and forward buttons) and ensures urls are written
	so that on page reload, the same request is made
	and so users can copy/paste links to requests
	
	since the web application never loads a new page,
	manage the browser history ourselves */

class SQMBrowserHistory {	
	static initialize() {
		// when the back or forward button is clicked
		window.addEventListener('popstate', (event) => {
			if (event.state) {
				SQMBrowserHistory.fromState(event.state);
			}
		});
	}

	// add an entry to the history
	static #addToHistory(state,title,url) {
		window.history.pushState(state,title,url);
	}
	
	// add a nightly entry
	static nightly(date) {
		SQMBrowserHistory.#addToHistory(
			{ type: 'nightly', date: date },
			sqmConfig.title,
			'?nightly='+encodeURIComponent(date)
		);
	}
	
	static monthly(month) {
		SQMBrowserHistory.#addToHistory(
			{ type: 'monthly', month: month },
			sqmConfig.title,
			'?monthly='+encodeURIComponent(month)
		);
	}
	
	static allTime() {
		SQMBrowserHistory.#addToHistory(
			{ type: 'allTime' },
			sqmConfig.title,
			'?allTime'
		);
	}
	
	static sixMonths(endDate) {
		SQMBrowserHistory.#addToHistory(
			{ type: 'sixMonths', endDate: endDate },
			sqmConfig.title,
			'?sixMonths='+encodeURIComponent(endDate)
		);
	}
	
	static customBestNightly(startDateStr,endDateStr) {
		SQMBrowserHistory.#addToHistory(
			{ type: 'bestNightly', start: startDateStr, end: endDateStr },
			sqmConfig.title,
			'?best&start='+encodeURIComponent(startDateStr)+'&end='+encodeURIComponent(endDateStr)
		);
	}
	
	static customAll(startDatetimeStr,endDatetimeStr) {
		SQMBrowserHistory.#addToHistory(
			{ type: 'all', start: startDatetimeStr, end: endDatetimeStr },
			sqmConfig.title,
			'?all&start='+encodeURIComponent(startDatetimeStr)
				+'&end='+encodeURIComponent(endDatetimeStr)
		);
	}
	
	// reconstruct the request from a history state
	static fromState(state) {
		switch (state.type) {
			case 'nightly':
				return SQMUserRequest.nightly(state.date,false);
				break;
			case 'monthly':
				return SQMUserRequest.monthly(state.month,false);
				break;
			case 'allTime':
				return SQMUserRequest.allTime(false);
				break;
			case 'sixMonths':
				const x =  SQMUserRequest.sixMonthsBeforeDate(state.endDate,false);
				return x;
				break;
			case 'bestNightly':
				SQMUserInputs.setReadingsType('best_nightly_readings');
				SQMUserInputs.setDateTimeInputsAsDates(
					SQMDate.parseServerDatetime(state.start),
					SQMDate.parseServerDatetime(state.end)
				);
				return SQMUserRequest.custom(false);
				break;
			case 'all':
				SQMUserInputs.setReadingsType('all_readings');
				SQMUserInputs.setDateTimeInputsAsDates(
					SQMDate.parseServerDatetime(state.start),
					SQMDate.parseServerDatetime(state.end)
				);
				return SQMUserRequest.custom(false);
				break;
			case 'custom':
				return SQMUserRequest.custom(false);
				break;
		}
	}
	
	// reconstruct a request from the url
	static fromUrl() {
		const params = new URLSearchParams(window.location.search);
		if (params.has('nightly')) {
			var dateString = decodeURIComponent(params.get('nightly'));
			const date = SQMDate.parseServerDate(dateString);
			if (isNaN(date)) {
				dateString = SQMDate.formatServerDate(new Date());
			}
			return { type: 'nightly', date: dateString };
		}
		if (params.has('monthly')) {
			var monthString = decodeURIComponent(params.get('monthly'));
			const date = SQMDate.parseServerMonth(monthString);
			if (isNaN(date)) {
				monthString = SQMDate.formatServerMonth(new Date());
			}
			return { type: 'monthly', month: monthString };
		}
		if (params.has('allTime')) {
			return { type: 'allTime' };
		}
		if (params.has('sixMonths')) {
			const endDateString = decodeURIComponent(params.get('sixMonths'));
			return { type: 'sixMonths', endDate: endDateString };
		}
		if (params.has('best')) {
			const startDateString = decodeURIComponent(params.get('start'));
			const startDate = SQMDate.parseServerDatetime(startDateString);
			const endDateString = decodeURIComponent(params.get('end'));
			const endDate = SQMDate.parseServerDatetime(startDateString);
			if (isNaN(startDate) || isNaN(endDate)) {
				SQMUserRequest.sixMonths();
			}
			SQMUserInputs.setReadingsType('best_nightly_readings');
			SQMUserInputs.setDateTimeInputsAsDates(startDate,endDate);
			return { type: 'custom' };
		}
		if (params.has('all')) {
			const startDateString = decodeURIComponent(params.get('start'));
			const startDate = SQMDate.parseServerDatetime(startDateString);
			const endDateString = decodeURIComponent(params.get('end'));
			const endDate = SQMDate.parseServerDatetime(endDateString);
			if (isNaN(startDate) || isNaN(endDate)) {
				SQMUserRequest.nightly();
			}
			SQMUserInputs.setReadingsType('all_readings');
			SQMUserInputs.setDateTimeInputsAsDates(startDate,endDate);
			return { type: 'custom' };
		}
		return false;
	}
}