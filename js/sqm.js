/*	sqm.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	initialization code to create the SQMManager once the page is loaded */

var sqmManager;

window.addEventListener("load",(event) => {
	// in case the config.js file is deleted entirely
	if (!sqmConfig) {
		sqmConfig = {};
	}
	
	// ensure defaultSqms is set to something
	if (!sqmConfig.defaultSqm) {
		sqmConfig.defaultSqm = [];
	}
	if (!Array.isArray(sqmConfig.defaultSqm)) {
		sqmConfig.defaultSqm = [ sqmConfig.defaultSqm ];
	}
	
	// ensure that all config options are set to sensible defaults in case they are
	// not set in config.js
	_.keys(sqmDefaultConfig).forEach((option) => {
		if ((!sqmConfig[option]) && (sqmConfig[option] !== false)) {
			sqmConfig[option] = sqmDefaultConfig[option];
		}
	});
	
	// convert from minutes to milliseconds
	sqmConfig.pollingInterval = sqmConfig.pollingInterval * 60 * 1000;
	sqmConfig.latestPollingInterval = sqmConfig.latestPollingInterval * 60 * 1000;
	sqmConfig.infoPollingInterval = sqmConfig.infoPollingInterval * 60 * 1000;
	
	// if there is a single color specified, use it
	if (sqmConfig.color) {
		sqmConfig.colorScheme = [ sqmConfig.color ];
	}
	
	sqmManager = new SQMManager(sqmConfig.defaultSqm);
	sqmManager.initialize();
});

// set up a global error handler
window.onerror = function(msg,url,line,col,error) {
	if (sqmConfig.debug) {
		var extra = !col ? '' : '\ncolumn: ' + col;
		extra += !error ? '' : '\nerror: ' + error;
		SQMManager.errorHandler(
			new SQMError("SQM Global Error Handler",[ msg, url, line, extra ]),
			"Something went wrong, try reloading the page"
		);
	} else {
		SQMManager.errorHandler(msg,"Something went wrong, try reloading the page");
	}
	return true;
}

// no jQuery but the $ function is useful shorthand
function $(id) { return document.getElementById(id); }

// no underscore.js library but a handful of these routines are useful
class _ {
	static keys(object) {
		return Object.keys(object);
	}
	
	static values(object) {
		return Object.values(object);
	}
	
	static mapObject(object,callable) {
		const result = {};
		_.keys(object).forEach((key) => { result[key] = callable(object[key],key) });
		return result;
	}
	
	static max(iterable) {
		if (iterable.length == 0) { return null; }
		return iterable.reduce((result,current) => result > current ? result : current);
	}
	
	static min(iterable) {
		if (iterable.length == 0) { return null; }
		return iterable.reduce((result,current) => result < current ? result : current);
	}
}