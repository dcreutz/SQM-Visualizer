/*	sqm_sun_moon_mw_clouds.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	Attaches sun and moon information to readings

	called upon when the backend does not provide sun/moon info
	or when the data is uploaded by the user directly */

// FUTURE: add in milky way information (and colorize based on it)

class SQMSunMoonMWClouds {
	static sunPosition(datetime,latitude,longitude) {
		const date = SQMDate.parseServerDatetime(datetime);
		return SunCalc.getPosition(date,latitude,longitude);
	}
	
	static moonPosition(datetime,latitude,longitude) {
		const date = SQMDate.parseServerDatetime(datetime);
		return SunCalc.getMoonPosition(date,latitude,longitude);
	}
	
	static moonIllumination(datetime,latitude,longitude) {
		const date = SQMDate.parseServerDatetime(datetime);
		return SunCalc.getMoonIllumination(date,latitude,longitude);
	}
	
	static #phases = [ 'New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous',
					   'Full moon', 'Waning gibbous', 'Last quarter', 'Waning crescent' ];
	
	static extractPhase(phase) {
		if (((0.0 <= phase) && (phase < 0.0625)) || ((0.9375 <= phase) && (phase <= 1.0))) {
			return SQMSunMoonMWClouds.#phases[0];
		}
		var j =0;
		for (var i=0.0625; i<1.0; i += 0.125) {
			j = j+1;
			if ((i <= phase) && (phase < i+0.125)) {
				return SQMSunMoonMWClouds.#phases[j];
			}
		}
		return 'cannot be determined';
	}
}