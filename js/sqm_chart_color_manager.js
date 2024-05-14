/*	sqm_chart_color_manager.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	handles determining how to color and otherwise display the data in the charts
	relies on multiple options in config.js to determine colorization */

class SQMChartColorManager {
	#baseColors;
	static #colorScheme;
	
	// create the color scheme to use based on the config.js options
	updateColorSchemes(defaultSqms,availableSqmInfos) {
		SQMChartColorManager.#colorScheme = sqmConfig.colorScheme.map((hex) => {
			if (hex[0] == '#') {
				hex = hex.substring(1);
			}
			// convert the hexadecimal code to rgb values
			const bigint = parseInt(hex, 16);
			return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
		});
		this.#baseColors = {};
		var index = 0;
		// default sqms are assigned colors first
		defaultSqms.forEach((sqmId) => {
			this.#baseColors[sqmId] = index % SQMChartColorManager.#colorScheme.length;
			index += 1;
		});
		// then the remaining sqms
		// loop back to the starting color if necessary
		_.keys(availableSqmInfos).forEach((sqmId) => {
			if (!defaultSqms.includes(sqmId)) {
				this.#baseColors[sqmId] = index % SQMChartColorManager.#colorScheme.length;
				index += 1;
			}
		});
		_.keys(this.#baseColors).forEach((sqmId) => {
			this.#baseColors[sqmId] =
				SQMChartColorManager.#colorScheme[this.#baseColors[sqmId]].join(",");
		});
	}
	
	// the color for the given sqm
	_baseColor(sqmId) {
		return "rgb(" + this.#baseColors[sqmId] + ")";
	}
	
	// transparent version
	_baseColorTransparent(sqmId,transparency) {
		return "rgb(" + this.#baseColors[sqmId] + "," + transparency + ")";
	}
	
	// how to color the legend, the base color
	legendBorder(sqmId) {
		return this._baseColor(sqmId);
	}
	
	legendBackground(sqmId) {
		return this._baseColor(sqmId);
	}
	
	// computes transparency based on mean r^2 values
	#transparency(reading) {
		if (reading.mean_r_squared) {
			if (reading.mean_r_squared < sqmConfig.cloudyCutoff) {
				return 1.0;
			}
			if (reading.mean_r_squared > sqmConfig.cloudyMax) {
				return 0.25;
			}
			return 1.0 - 
				((reading.mean_r_squared - sqmConfig.cloudyCutoff)/
					(sqmConfig.cloudyMax-sqmConfig.cloudyCutoff))*0.75;
		} else {
			return 1.0;
		}
	}
	
	// color for the border of the point
	// base color, possibly transparent
	pointBorderColor(sqmId,reading) {
		if (!reading) {
			return this._baseColor(sqmId);
		}
		return this._baseColorTransparent(sqmId,this.#transparency(reading));
	}
	
	// color of the point itself
	// orange colors correspond to the sun being up
	// white to black indicate moon illumination
	// transparency indicates mean r^2
	pointBackgroundColor(sqmId,reading) {
		if (!reading) {
			return this._baseColor(sqmId);
		}
		if (!reading.sun_position || !reading.moon_position) {
			return this._baseColor(sqmId);
		}
		const sunAltitude = reading.sun_position.altitude*180/Math.PI;
		if (sunAltitude > sqmConfig.sunAltitudeCutoffs[0]) {
			return "rgba(255,215,0," + this.#transparency(reading) + ")";
		}
		if (sunAltitude > sqmConfig.sunAltitudeCutoffs[1]) {
			return "rgba(255,165,0," + this.#transparency(reading) + ")";
		}
		if (sunAltitude > sqmConfig.sunAltitudeCutoffs[2]) {
			return "rgba(255,140,0," + this.#transparency(reading) + ")";
		}
		const moonAltitude = reading.moon_position.altitude*180/Math.PI;
		if (moonAltitude < sqmConfig.moonAltitudeCutoffs[0]) {
			return "rgb(0,0,0," + this.#transparency(reading) + ")";
		}
		const moonshine = moonAltitude > sqmConfig.moonAltitudeCutoffs[1] ? 1.0 : 
			(moonAltitude-sqmConfig.moonAltitudeCutoffs[0])/
				(sqmConfig.moonAltitudeCutoffs[1] - sqmConfig.moonAltitudeCutoffs[0]);
		const illumination = reading.moon_illumination.fraction > 0.33 ? 1.0 :
			reading.moon_illumination.fraction / 0.33;
		const amount = moonshine*illumination*255;
		return "rgba(" + amount + "," + amount + "," + amount + "," +
				this.#transparency(reading) + ")";
	}
	
	pointHoverBorderColor(sqmId,reading) {
		return this.pointBorderColor(sqmId,reading);
	}
	
	pointHoverBackgroundColor(sqmId,reading) {
		return this.pointBackgroundColor(sqmId,reading);
	}
	
	// color of the segment joining two points
	segmentColor(sqmId,reading,nextReading,readingsType) {
		if (reading == null) {
			return this._baseColor(sqmId);
		}
		if (nextReading == null) {
			return this._baseColorTransparent(sqmId,this.#transparency(reading));
		}
		const d = new Date(reading.datetime).getTime() - new Date(nextReading.datetime).getTime();
		if (readingsType == 'all_readings') {
			// don't connect dots more than six hours apart
			if (Math.abs(d) >= 21600000) { // 6 * 60 * 60 * 1000
				return 'rgba(0,0,0,0.0)';
			}
		} else {
			// don't connect dots more than twenty days apart
			if (Math.abs(d) >= 1728000000) { // 20 * 24 * 60 * 60 * 1000
				return 'rgba(0,0,0,0.0)';
			}
		}
		const transparencyFirst = this.#transparency(reading);
		const transparencyNext = this.#transparency(nextReading)
		const transparency = ((transparencyFirst == 0.0) || (transparencyNext == 0.0)) ? 0.0 :
			(transparencyFirst + transparencyNext)/2;
		return this._baseColorTransparent(sqmId,transparency);
	}
	
	// draw the segment dashed if no mean r^2 value is available
	segmentDash(sqmId,reading,nextReading,readingsType) {
		if (!reading.mean_r_squared || !nextReading.mean_r_squared) {
			return [6,6];
		}
		return undefined;
	}
	
	// size of the points
	pointRadius(sqmId,reading) {
		return 4;
	}
	
	pointHoverRadius(sqmId,reading) {
		return 6;
	}
	
	// size of the points in the charts in the grid
	smallPointRadius(sqmId,reading) {
		return 2;
	}
	
	smallPointHoverRadius(sqmId,reading) {
		return 3;
	}
	
	pointStyle(sqmId,reading) {
		return 'circle';
	}
	
	// colors of the bars in the bar chart
	barBorder(sqmId) {
		return this._baseColor(sqmId);
	}
	
	barBackground(sqmId) {
		return this._baseColor(sqmId);
	}
	
	// colorize the key telling the user what the colors indicate
	static colorKey() {
		var color = 'rgb('+SQMChartColorManager.#colorScheme[0].join(",")+')';
		document.querySelectorAll('.keysun, .keymoon, .keyclouds').forEach((elt) => {
			elt.style.borderColor = color;
		});
		document.querySelectorAll('.keyline, .halfkeyline').forEach((elt) => {
			elt.style.background = color;
		});
		$('keysun1').style.background = 'gold';
		$('keysun2').style.background = 'orange';
		$('keysun3').style.background = 'darkorange';
		for (let i=1;i<=10;i++) {
			$('keymoon' + i).style.background = 'rgba(0,0,0,'+(i/10.0)+')';
		}
		for (let i=1;i<=3;i++) {
			$('keysuntooltip' + i).innerHTML =
				"Sun altitude above " + sqmConfig.sunAltitudeCutoffs[i-1] + " degrees";
		}
		for (let i=1;i<=5;i++) {
			color = 'rgba('+SQMChartColorManager.#colorScheme[0].join(",")+","+(0.2*i)+')';
			document.querySelectorAll(
				'#keyclouds'+i+' .keylinecontainer .keyline'
			).forEach((elt) => {
				elt.style.background = color;
			});
			document.querySelectorAll(
				'#keyclouds'+i+' .halfkeylinecontainer .halfkeyline'
			).forEach((elt) => {
				elt.style.background = color;
			});
			document.querySelectorAll(
				'#keyclouds'+i+' .keyclouds'
			).forEach((elt) => {
				elt.style.borderColor = color;
			});
		}
	}
}

/*	color manager for all readings */
class SQMChartAllReadingsColorManager extends SQMChartColorManager {
}

/*	color manager for best nightly readings */
class SQMChartBestReadingsColorManager extends SQMChartColorManager {
}

/*	color manager that does not colorize based on anything but sqmId */
class SQMChartPlainColorManager extends SQMChartColorManager {
	legendBorder(sqmId) {
		return this._baseColor(sqmId);
	}
	
	legendBackground(sqmId) {
		return this._baseColor(sqmId);
	}
	
	pointBorderColor(sqmId,reading) {
		return this._baseColor(sqmId);
	}
		
	pointBackgroundColor(sqmId,reading) {
		// fully transparent
		return 'rgba(0,0,0,0.0)';
	}
	
	segmentColor(sqmId,reading,nextReading,readingsType) {
		return this._baseColor(sqmId);
	}
	
	segmentDash(sqmId,reading,nextReading,readingsType) {
		return undefined;
	}
	
	pointRadius(sqmId,reading) {
		return 4;
	}
	
	pointHoverRadius(sqmId,reading) {
		return 4;
	}
	
	pointStyle(sqmId,reading) {
		return 'circle';
	}
	
	barBorder(sqmId) {
		return this._baseColor(sqmId);
	}
	
	barBackground(sqmId) {
		return this._baseColor(sqmId);
	}
}