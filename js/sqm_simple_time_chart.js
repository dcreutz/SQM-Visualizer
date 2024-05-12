/*	sqm_simple_time_chart.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	a simple time chart object used in the SQMTimeChartGrid */
	
class SQMSimpleTimeChart {
	_getChartOptions() {
		return {
			type: 'line',
			options: {
				responsive: true,
				aspectRatio: 5/2,
				scales: {
					x: {
						type: 'time',
						ticks: {
							source: 'auto',
							display: false
						},
						time: {
							unit: 'minute',
							unitStepSize: 1,
							displayFormats: {
								'minute' : sqmConfig.chartTimeFormat,
								'day' : sqmConfig.chartDateFormat
							}
						},
						display: false
					},
					y: {
						ticks: {
							stepSize: 1,
							display: false
						}
					}
				},
				events: [ 'click' ],
				onClick: SQMSimpleTimeChart.#onClick,
				elements: {
					point: {
						radius: SQMSimpleTimeChart.#pointRadius,
						hoverRadius: SQMSimpleTimeChart.#pointHoverRadius
					}
				},
				plugins: {
					title: {
						display: false
					},
					legend: {
						display: false
					},
					tooltip: {
						enabled: false
					}
				}
			}
		};
	}
		
	#divId; // DOM element
	#chartObject; // chart.js object
	#canvas; // DOM canvas element
	#colorManager;
	#readingsSet; // the SQMReadingsSet object
	#clickCallback; // what to do on click
	#grid; // the grid that owns this
	static #counter; // ensure unique naming
	knowsCloudiness;
	
	constructor(grid,divId,title,clickCallback,colorManager) {
		this.#grid = grid;
		this.#divId = divId;
		if (!SQMSimpleTimeChart.#counter) {
			SQMSimpleTimeChart.#counter = 1;
		} else {
			SQMSimpleTimeChart.#counter += 1;
		}
		const titleElt = document.createElement('div');
		titleElt.classList.add('timechartitemtitle');
		titleElt.innerHTML = title;
		$(this.#divId).appendChild(titleElt);
		const container = document.createElement('div');
		const canvasId = this.#divId + 'sqmsimpletimechart' + SQMSimpleTimeChart.#counter;
		container.setAttribute('id',canvasId+'container');
		container.classList.add('timechartgridcanvascontainer');
		$(this.#divId).appendChild(container);
		this.#canvas = document.createElement('canvas');
		this.#canvas.setAttribute('id',canvasId);
		$(this.#divId).addEventListener("click",(event) => {
			SQMSimpleTimeChart.#click.bind(null,this);
		});
		container.appendChild(this.#canvas);
		this.#chartObject = new Chart($(canvasId),this._getChartOptions());
		this.#chartObject.timeChart = this;
		this.#chartObject.colorManager = colorManager;
		this.#clickCallback = clickCallback;
		this.knowsCloudiness = false;
	}
	
	// static hook methods
	// putting this object into the chart object allows the instance to be called
	static #onClick(event,elements,chart) {
		return chart.timeChart._click(event);
	}
	
	static #click(simpleTimeChart,event) {
		return simpleTimeChart._click(event);
	}
	
	// on click, hide the grid and do what was specified
	_click(event) {
		this.#grid.hideGrid();
		this.#clickCallback();
	}
	
	redraw() {
		this.#chartObject.update();
	}
	
	// set the readings of this chart
	setReadings(sqmReadings,showWhich) {
		// all_readings or best_nightly_readings
		const readingsType = sqmReadings.type;
		delete sqmReadings.type;
		if (readingsType == 'all_readings') {
			this.#chartObject.options.scales.x.time.unit = 'minute';
			this.#chartObject.options.scales.y.reverse = sqmConfig.nightlyAxisDescending;
		} else {
			this.#chartObject.options.scales.x.time.unit = 'day';
			this.#chartObject.options.scales.y.reverse = sqmConfig.bestReadingAxisDescending;
		}
		this.#readingsSet = new SQMReadingsSet(sqmReadings,readingsType);
		const sqmIds = _.keys(sqmReadings);
		this.#chartObject.options.scales.x.min = this.#readingsSet.startDatetime(sqmIds);
		this.#chartObject.options.scales.x.max = this.#readingsSet.endDatetime(sqmIds);
		
		_.keys(sqmReadings).forEach((sqmId) => {
			// cnostruct the actual chart.js dataset
			const dataset = {
				sqmId: sqmId,
				label: "",
				readingsType: readingsType
			};
			var readings;
			switch (showWhich) {
				case 'all':
					readings = this.#readingsSet.allReadings()[sqmId];
					break;
				case 'noCloudy':
					readings = this.#readingsSet.noCloudyReadings()[sqmId];
					break;
				case 'noSunMoonClouds':
					readings = this.#readingsSet.noSunMoonCloudsReadings()[sqmId];
					break;
			}
			dataset.data = _.keys(readings).sort().map((datetime) => {
				return {
					x: datetime,
					y: readings[datetime].reading
				}
			});
			// set up the color manager hooks
			dataset.borderColor = SQMSimpleTimeChart.#borderColor;
			dataset.backgroundColor = SQMSimpleTimeChart.#backgroundColor;
			dataset.pointBorderColor = SQMSimpleTimeChart.#pointBorderColor;
			dataset.pointBackgroundColor = SQMSimpleTimeChart.#pointBackgroundColor;
			dataset.pointHoverBackgroundColor = SQMSimpleTimeChart.#pointHoverBackgroundColor;
			dataset.pointHoverBorderColor = SQMSimpleTimeChart.#pointHoverBorderColor;
			dataset.pointStyle = SQMSimpleTimeChart.#pointStyle;
			dataset.fill = false;
			dataset.segment = {
				borderColor: SQMSimpleTimeChart.#segmentBorderColor,
				borderDash: SQMSimpleTimeChart.#segmentBorderDash
			};
			this.#chartObject.data.datasets.push(dataset);
		});
	}
	
	// set which sqms are visible vs hidden
	setActiveSqmIds(sqmIds) {
		this.#chartObject.data.datasets.forEach((dataset) => {
			if (sqmIds.includes(dataset.sqmId)) {
				dataset.hidden = false;
			} else {
				dataset.hidden = true;
			}
		});
		this.#chartObject.options.scales.x.min = this.#readingsSet.startDatetime(sqmIds);
		this.#chartObject.options.scales.x.max = this.#readingsSet.endDatetime(sqmIds);
	}
	
	setColorManager(colorManager) {
		this.#colorManager = colorManager;
		this.#chartObject.colorManager = this.#colorManager;
	}
	
	destroy() {
		this.#chartObject.destroy();
	}
	
	// for chart color and click callbacks
	static #parseContext(context) {
		if (context.dataIndex >= 0) {
			return context.chart.timeChart._attributesFor(
				context.dataset.sqmId,context.dataset.data[context.dataIndex].x
			);
		}
		return null;
	}
	
	_attributesFor(sqmId,datetime) {
		return this.#readingsSet.get(sqmId).reading(datetime);
	}
	
	// border color of legend box
	static #borderColor(context) {
		return context.chart.colorManager.legendBorder(context.dataset.sqmId);
	}
	
	// fill color of legend box
	static #backgroundColor(context) {
		return context.chart.colorManager.legendBackground(context.dataset.sqmId);
	}
	
	// border color of the point
	static #pointBorderColor(context) {
		return context.chart.colorManager.pointBorderColor(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
	
	// fill color of the point
	static #pointBackgroundColor(context) {
		return context.chart.colorManager.pointBackgroundColor(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
	
	// border color of point when selected
	static #pointHoverBorderColor(context) {
		return context.chart.colorManager.pointHoverBorderColor(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
	
	// fill color of point when selected
	static #pointHoverBackgroundColor(context) {
		return context.chart.colorManager.pointHoverBackgroundColor(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
		
	// color of line between two points
	static #segmentBorderColor(context) {
		const dataset = context.chart.data.datasets[context.datasetIndex]
		const sqmId = dataset.sqmId;
		const startPoint = context.chart.timeChart._attributesFor(sqmId,context.p0.raw.x);
		const endPoint = context.chart.timeChart._attributesFor(sqmId,context.p1.raw.x);
		return context.chart.colorManager.segmentColor(
			sqmId,startPoint,endPoint,dataset.readingsType
		);
	}
	
	// should the line be drawn dashed
	static #segmentBorderDash(context) {
		if (!context.chart.timeChart.knowsCloudiness) {
			return undefined;
		}
		const dataset = context.chart.data.datasets[context.datasetIndex]
		const sqmId = dataset.sqmId;
		const startPoint = context.chart.timeChart._attributesFor(sqmId,context.p0.raw.x);
		const endPoint = context.chart.timeChart._attributesFor(sqmId,context.p1.raw.x);
		return context.chart.colorManager.segmentDash(
			sqmId,startPoint,endPoint,dataset.readingsType
		);
	}
	
	static #pointRadius(context) {
		return context.chart.colorManager.smallPointRadius(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
	
	static #pointHoverRadius(context) {
		return context.chart.colorManager.smallPointHoverRadius(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
	
	static #pointStyle(context) {
		return context.chart.colorManager.pointStyle(
			context.dataset.sqmId, SQMSimpleTimeChart.#parseContext(context)
		);
	}
}