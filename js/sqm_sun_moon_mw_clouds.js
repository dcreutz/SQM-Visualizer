/*	sqm_sun_moon_mw_clouds.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	Attaches sun and moon information to readings

	called upon when the backend does not provide sun/moon info
	or when the data is uploaded by the user directly */

class SQMSunMoonMWClouds {
	static sunPosition(date,latitude,longitude) {
		return SunCalc.getPosition(date,latitude,longitude);
	}
	
	static moonPosition(date,latitude,longitude) {
		return SunCalc.getMoonPosition(date,latitude,longitude);
	}
	
	static moonIllumination(date,latitude,longitude) {
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
	
	// algorithm due to Bill Kowalik
	static milkyWay(reading,latitude,longitude) {
		const utcdate = SQMReadings.utcDate(reading.raw);
		const j2000 = SQMSunMoonMWClouds.#j2000(utcdate);
		if (utcdate) {
			const rightAscensionNGP = 192.85948 * Math.PI / 180.0;
			const decNGP = 27.12825 * Math.PI / 180.0;
			const galacticLongNCP = 122.93192 * Math.PI / 180;
			const rightAscension = SQMSunMoonMWClouds.#rightAscension(utcdate,j2000,longitude);
			const sqmRA = (rightAscension * 15.0) * Math.PI / 180.0;
			const sqmDec = latitude * Math.PI / 180.0;
			const galacticLatitude = Math.asin(Math.sin(sqmDec) * Math.sin(decNGP) + Math.cos(sqmDec) * Math.cos(decNGP) * Math.cos(sqmRA - rightAscensionNGP));
			const yy = Math.cos(sqmDec) * Math.sin(sqmRA - rightAscensionNGP);
			const xx = (Math.sin(sqmDec) * Math.cos(decNGP)) - (Math.cos(sqmDec) * Math.sin(decNGP) * Math.cos(sqmRA - rightAscensionNGP));
			const galacticLongitude = galacticLongNCP - Math.atan2(yy,xx);
			return {
				latitude: galacticLatitude * 180.0 / Math.PI,
				longitude: galacticLongitude >= 0 ? galacticLongitude * 180.0 / Math.PI : 
					(2 * Math.PI + galacticLongitude) * 180.0 / Math.PI
			};
		} else {
			return null;
		}
	}
	
	static #rightAscension(utcdate,j2000,longitude) {
		const ut = (utcdate.getHours() + utcdate.getMinutes()/60.0 + utcdate.getSeconds()/3600.0);
		var ra = 100.46 + 0.985647 * j2000 + longitude + 15.0 * ut;
		const mult = Math.round(ra/360.0);
		if (mult > 0) {
			ra -= mult * 360.0;
		}
		if (mult < 0) {
			ra -= mult * 360.0;
		}
		if (ra < 0) {
			ra += 360.0;
		}
		return ra/15.0;
	}
	
	static #j2000(utcdate) {
		const day = 24.0 * 60 * 60 * 1000;
		return (utcdate - new Date(2000,0,1,12,0,0))/day;
	}
}