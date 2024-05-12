/*	sqm_bar_chart.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	represents the bar chart displayed below the time chart when requested by the user */
	
class SQMBarChart {
	// options passed to the chart.js object
	_getChartOptions () {
		return {
			type: 'bar',
			options: {
				responsive: true,
				aspectRatio: 8/2,
				plugins: {
					legend: {
						display: false,
						position: 'bottom'
					},
					tooltip: {
						callbacks: {
							title: SQMBarChart.#hoverTextTitle,
							label: SQMBarChart.#hoverText
						}
					}
				}
			}
		};
	}
	
	#divId; // div housing the chart canvas
	#chartObject; // actual chart.js object
	#canvas; // canvas displaying the chart
	#contextMenu; // the right-click menu object
	
	// set if the user specifies the range to use
	#userRange;
	#userIncrement;
	
	#readingsSet; // SQMReadingsSet object
	
	#showWhich; // which readings are showing, 'all' or 'noCloudy' or 'noSunMoonClouds'
	
	#readingsType; // 'all' or 'best_nightly'
	
	// actual datasets for the chart.js object
	#datasets;
	
	// computed values from chart.js
	#computedMin;
	#computedMax;
	#computedIncrement;
	
	#colorManager;
	#isClear;
	#chartCount; // see sqm_time_chart.js
	
	#totalReadings;
	#numReadingsByLabel;
	
	constructor(divId) {
		this.#divId = divId;
		this.#makeChartObject();
		this.#userRange = false;
		this.#userIncrement = false;
		this.#datasets = {};
		this.#chartCount = 0;
		this.#totalReadings = {};
		this.#numReadingsByLabel = {};
		this.#contextMenu = new SQMBarContextMenu(divId,this);
	}
	
	// creates the actual chart.js object
	#makeChartObject() {
		this.#chartCount++;
		this.#canvas = document.createElement('canvas');
		this.#canvas.setAttribute('id',this.#divId + 'sqmbarchart' + this.#chartCount);
		$(this.#divId).appendChild(this.#canvas);
		this.#chartObject = new Chart(
			$(this.#divId + 'sqmbarchart' + this.#chartCount),this._getChartOptions()
		);
		this.#chartObject.colorManager = this.#colorManager;
		this.#chartObject.barChart = this;
		this.#isClear = false;
	}
	
	// make this sqm visible
	activateSqm(sqmId) {
		const index = this.#chartObject.data.datasets.findIndex((d) => d.sqmId == sqmId);
		if (index < 0) { return false; }
		this.#chartObject.show(index);
		this.#chartObject.data.datasets[index].hidden = false;
	}
	
	// make this sqm invisible
	deactivateSqm(sqmId) {
		const index = this.#chartObject.data.datasets.findIndex((d) => d.sqmId == sqmId);
		if (index < 0) { return false; }
		this.#chartObject.hide(index);
		this.#chartObject.data.datasets[index].hidden = true;
	}
	
	setColorManager(colorManager) {
		this.#colorManager = colorManager;
		this.#chartObject.colorManager = colorManager;
	}
	
	setReadingsType(readingsType) {
		this.#readingsType = readingsType;
	}
	
	// clear user specified range values
	clearRange() {
		this.#userRange = false;
		this.#userIncrement = false;
	}
	
	// get the range to use, either because the user set it or it was computed
	getRange() {
		if (this.#userRange) {
			return this.#userRange;
		} else {
			return { min: this.#computedMin, max: this.#computedMax };
		}
	}

	// called if the user changes the min/max/increment
	setMin(newMin) {
		if (this.#userRange) {
			this.#userRange = { min: newMin, max: this.#userRange.max };
		} else {
			this.#userRange = { min: newMin, max: this.#computedMax };
		}
		this.redraw();
	}
	
	setMax(newMax) {
		if (this.#userRange) {
			this.#userRange = { min: this.#userRange.min, max: newMax };
		} else {
			this.#userRange = { min: this.#computedMin, max: newMax };
		}
		this.redraw();
	}
	
	setIncrement(newIncrement) {
		this.#userIncrement = parseFloat(newIncrement);
		this.redraw();
	}
	
	setReadingsSet(readingsSet) {
		this.#readingsSet = readingsSet;
	}
	
	addDataset(dataset) {
		dataset.data = [];
		dataset.borderColor = SQMBarChart.#borderColor;
		dataset.backgroundColor = SQMBarChart.#backgroundColor;
		dataset.fill = false;
		this.#datasets[dataset.sqmId] = dataset;
	}
	
	addedToReadings() {
		// no need to anything since the logic is in the redraw method
	}
	
	removeDataset(sqmId) {
		delete this.#datasets[sqmId];
		this.#chartObject.data.datasets = [];
		_.values(this.#datasets).forEach((dataset) => {
			this.#chartObject.data.datasets.push(dataset);
		});
	}
	
	/*	destroy the chart object and its canvas entirely
		used for error recovery */
	clearChart() {
		if (this.#chartObject) {
			this.#chartObject.data.datasets = [];
			this.#chartObject.destroy();
		}
		const container = $(this.#divId);
		container.removeChild(container.firstElementChild);
		this.#isClear = true;
	}
	
	removeAllDatasets() {
		this.#datasets = {};
		this.#chartObject.data.datasets = [];
	}
	
	showAllReadings() {
		this.#showWhich = 'all';
	}
	
	showNoCloudyReadings() {
		this.#showWhich = 'noCloudy';
	}
	
	showNoSunMoonCloudsReadings() {
		this.#showWhich = 'noSunMoonClouds';
	}
	
	// compute the range and increment to use
	#computeRange(readings) {
		if (this.#userRange) {
			// if the user chose a range in the menu, use it
			this.#computedMin = this.#userRange.min;
			this.#computedMax = this.#userRange.max;
		} else {
			// otherwise compute the min and max reading values
			this.#computedMin = _.min(
				_.keys(readings).map((sqmId) => {
					if (_.values(readings[sqmId]).length == 0) {
						return 100;
					}
					const sorted = _.values(readings[sqmId])
									.map((reading) => reading.reading).sort();
					return sorted[Math.floor(sorted.length*0.05)];
				})
			);
			this.#computedMax = _.max(
				_.keys(readings).map((sqmId) => {
					if (_.values(readings[sqmId]).length == 0) {
						return -1;
					}
					return _.max(_.values(readings[sqmId]).map((reading) => reading.reading));
				})
			);
		}
		if (this.#userIncrement) {
			// if the user chose an increment, use it
			this.#computedIncrement = this.#userIncrement;
		} else {
			// otherwise choose a sensible value so there aren't too many bars
			if (this.#computedMax - this.#computedMin > 6) {
				this.#computedIncrement = 1.0;
			} else if (this.#computedMax - this.#computedMin > 3) {
				this.#computedIncrement = 0.5;
			} else if (this.#computedMax - this.#computedMin > 1.5) {
				this.#computedIncrement = 0.25;
			} else {
				this.#computedIncrement = 0.1;
			}
		}
	}
	
	#round(num) {
		return parseFloat(num.toFixed(4));
	}
	
	// draw the chart
	redraw() {
		// determine which readings to use
		var readings;
		switch(this.#showWhich) {
			case 'all':
				readings = this.#readingsSet.allReadings();
				break;
			case 'noCloudy':
				readings = this.#readingsSet.noCloudyReadings();
				break;
			case 'noSunMoonClouds':
				readings = this.#readingsSet.noSunMoonCloudsReadings();
				break;
		}
		// determine if there are any readings
		var hasReadings = false;
		_.keys(readings).forEach((sqmId) => {
			if (_.keys(readings[sqmId]).length > 0) {
				hasReadings = true;
			}
		});
		if (!hasReadings) {
			// if there are no readings, don't draw any data
			this.#setBestAndStats();
			this.#chartObject.update();
			return;
		}
		this.#computeRange(readings);
		
		const mult = Math.floor(1/this.#computedIncrement);
		const start = Math.floor(this.#computedMin * mult);
		const end = Math.ceil(this.#computedMax * mult);
		const labels = [];
		// first bin is < some amount, the rest are intervals
		if (_.keys(readings).length > 0) {
			labels.push("<" + this.#round((start/mult)+this.#computedIncrement));
		}
		// initially the dataset has 0 as the value for each bin
		_.keys(readings).forEach((sqmId) => {
			this.#datasets[sqmId].data = [ 0 ];
		});
		for (let j = start+1; j < end; j += 1) {
			_.keys(this.#datasets).forEach((sqmId) => {
				this.#datasets[sqmId].data.push(0);
			});
		}
		// add the labels of the intervals
		for (let j = start+1; j < end-1; j += 1) {
			labels.push("["+this.#round(j/mult)+","+this.#round((j+1)/mult)+")");
		}
		labels.push("["+this.#round((end-1)/mult)+","+this.#round(end/mult)+"]");
		this.#chartObject.data.datasets = [];
		this.#chartObject.data.labels = labels;
		// iterate through the readings, incrementing the bin counts
		_.keys(readings).forEach((sqmId) => {
			_.values(readings[sqmId]).forEach((value) => {
				const bin = Math.floor(value.reading * mult);
				if (bin < start) {
					this.#datasets[sqmId].data[0] += 1;
				} else if (bin == end) {
					this.#datasets[sqmId].data[end-start-1] += 1;
				} else {
					this.#datasets[sqmId].data[bin-start] += 1;
				}
			});
			this.#chartObject.data.datasets.push(this.#datasets[sqmId]);
			this.#numReadingsByLabel[sqmId] = {};
			for (let j = 0; j < end-start; j += 1) {
				this.#numReadingsByLabel[sqmId][labels[j]] = this.#datasets[sqmId].data[j];
			}
			this.#totalReadings[sqmId] =
				this.#datasets[sqmId].data.reduce((total,current) => total + current);
		});
		this.#contextMenu.setMin(Math.floor(start/mult));
		this.#contextMenu.setIncrement(this.#computedIncrement);
		
		this.#setBestAndStats();
		
		this.#chartObject.update();
	}
	
	#setBestAndStats() {
		const active = [];
		this.#chartObject.data.datasets.forEach((dataset) => {
			if (!dataset.hidden) {
				active.push(dataset.sqmId);
			}
		});
		// update the display of best and stats
		SQMUserDisplay.setBestBox(this.#readingsSet.bestReading(active),active.length > 1);
		SQMUserDisplay.setStatsBox(this.#readingsSet.stats(active));
	}
	
	// color callbacks, see sqm_time_chart.js
	static #borderColor(context) {
		return context.chart.colorManager.barBorder(context.dataset.sqmId);
	}
	
	static #backgroundColor(context) {
		return context.chart.colorManager.barBackground(context.dataset.sqmId);
	}
	
	static #hoverTextTitle(context) {
		return context.map(
			(ctx) => ctx.chart.barChart._hoverTextTitle(ctx.dataset.sqmId,ctx.label)
		).join("\n");
	}
	
	_hoverTextTitle(sqmId,labels) {
		return "";
	}
	
	static #hoverText(context) {
		return context.chart.barChart._hoverText(context.dataset.sqmId,context.label);
	}
	
	// tooltip text to display on hover (click on mobile)
	_hoverText(sqmId,label) {
		const sqmName = sqmManager.availableSqmInfos[sqmId].name;
		const numReadings = this.#numReadingsByLabel[sqmId][label];
		const totalReadings = this.#totalReadings[sqmId];
		const percent = Math.round(numReadings * 100 / totalReadings);
		const result = [ numReadings + " of " + totalReadings + " reading" +
							((totalReadings != 1) ? "s" : "") + " (" + percent + "%)",
						 sqmName.length > 20 ? sqmName.substring(0,18) + "..." : sqmName ];
		if (label[0] == "<") {
			const binMax = label.substring(1);
			result.push("Msas less than " + binMax);
		} else {
			const range = label.substring(1).substring(0,label.length-2).split(',');
			const binMin = range[0];
			const binMax = range[1];
			result.push("Msas between " + binMin + " and " + binMax);
		}
		return result;
	}
	
	image() {
		return this.#chartObject.toBase64Image();
	}
	
	blob(callback) {
		this.#canvas.toBlob(callback);
	}
}