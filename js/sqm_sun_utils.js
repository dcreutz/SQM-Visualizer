/*	sqm_sun_utils.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	utility class for computing sunrise and sunset */

class SQMSunUtils {
	// given a collection of objects responding to .latitude and .longitude
	// and a datetime (defaults to now if not specified)
	// compute the most recent sunset for each object
	// and return the latest of those
	// returns a Date object
	static sunsetDateBeforeOne(latitudeLongitudeObjects,datetime = null) {
		const date = datetime ? SQMDate.parseServerDatetime(datetime) : new Date();
		if (_.values(latitudeLongitudeObjects).length == 0) {
			return SQMSunUtils.#sunsetBeforeDate(date,null,null);
		}
		return _.values(latitudeLongitudeObjects)
				.map((obj) =>
					SQMSunUtils.#sunsetBeforeDate(
						date,obj.latitude,
						obj.longitude,
						obj.time_zone_id
					)
				).reduce((latest,sunset) => latest < sunset ? sunset : latest,new Date(0));
	}
	
	static #sunsetBeforeDate(date,latitude,longitude,timezone) {
		const sunset = SQMSunUtils.#sunsetSunrise(date,latitude,longitude,timezone).sunset;
		if (sunset > date) {
			return SQMSunUtils.#sunsetSunrise(
				dateFns.addDays(date,-1),latitude,longitude,timezone
			).sunset;
		}
		return sunset;
	}
	
	// returns the datetime of the most recent sunset as a string
	static sunsetBeforeOne(latitudeLongitudeObjects,datetime = null) {
		return SQMDate.formatServerDate(
			SQMSunUtils.sunsetDateBeforeOne(latitudeLongitudeObjects,datetime)
		);
	}
	
	static #toTimezone(datetime,timezone) {
		const newDate = new Date(datetime.toLocaleString('en-US',{timeZone:timezone}));
		if (isNaN(newDate)) {
			// if the calculation fails, just return the datetime given
			return datetime;
		}
		return newDate;
	}
	
	// returns sunset and sunrise for a given date
	// defaults to 7pm and 5am if no latitude/longitude
	static #sunsetSunrise(date,latitude,longitude,timezone) {
		if (latitude && longitude) {
			const times = SunCalc.getTimes(date,latitude,longitude);
			return {
				sunset: SQMSunUtils.#toTimezone(SQMSunUtils.#extractSunset(times),timezone),
				sunrise: SQMSunUtils.#toTimezone(SQMSunUtils.#extractSunrise(times),timezone)
			};
		}
		const fakeSunset = dateFns.setHours(dateFns.setMinutes(dateFns.setSeconds(date,0),0),19);
		const fakeSunrise = dateFns.addHours(fakeSunset,-14);
		return { sunset: fakeSunset, sunrise: fakeSunrise };
	}
	
	// helper functions to return the correct sunset/sunrise type based on config.js options
	static #extractSunset(sunCalcTimes) {
		switch(sqmConfig.twilightType) {
			case 'civil':
				return sunCalcTimes.sunset;
			case 'nautical':
				return sunCalcTimes.dusk;
			case 'night':
				return sunCalcTimes.night;
			case 'astronomical':
			default:
				return sunCalcTimes.nauticalDusk;
		}
	}
	
	static #extractSunrise(sunCalcTimes) {
		switch(sqmConfig.twilightType) {
			case 'civil':
				return sunCalcTimes.sunrise;
			case 'nautical':
				return sunCalcTimes.dawn;
			case 'night':
				return sunCalcTimes.nightEnd;
			case 'astronomical':
			default:
				return sunCalcTimes.nauticalDawn;
		}
	}
	
	// returns the sunset for the given night and the following sunrise
	// night is a Date object
	// returns strings of the datetimes
	static sunsetSunriseForNight(night,latitude,longitude,timezone) {
		const date = dateFns.setHours(SQMDate.parseServerDate(night),12);
		const sunset = SQMSunUtils.#sunsetSunrise(date,latitude,longitude,timezone).sunset;
		const sunrise =
			SQMSunUtils.#sunsetSunrise(dateFns.addDays(date,1),latitude,longitude,timezone).sunrise;
		return { sunset: SQMDate.formatServerDatetime(sunset),
				 sunrise: SQMDate.formatServerDatetime(sunrise) };
	}
	
	// applies the above to a collection of objects on the same night
	static sunsetSunrisesForNight(night,latitudeLongitudeObjects) {
		const result = {};
		_.keys(latitudeLongitudeObjects).forEach((key) => {
			result[key] = SQMSunUtils.sunsetSunriseForNight(
				night,
				latitudeLongitudeObjects[key].latitude,
				latitudeLongitudeObjects[key].longitude,
				latitudeLongitudeObjects[key].timezoneOffset ?
					latitudeLongitudeObjects[key].timezoneOffset : 
					latitudeLongitudeObjects[key].time_zone_id
			);
		});
		return result;
	}
}