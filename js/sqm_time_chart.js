/*	sqm_time_chart.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the actual time chart object central to the app */

class SQMTimeChart {
	// the chart.js options
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
						},
						time: {
							unit: 'minute',
							unitStepSize: 1,
							displayFormats: {
								'minute' : sqmConfig.chartTimeFormat,
								'day' : sqmConfig.chartDateFormat
							}
						}
					},
					y: {
						ticks: {
							stepSize: 1
						}
					}
				},
				elements: {
					point: {
						radius: SQMTimeChart.#pointRadius,
						hoverRadius: SQMTimeChart.#pointHoverRadius
					}
				},
				onClick: SQMTimeChart.#click,
				plugins: {
					legend: {
						display: true,
						position: 'bottom',
						onHover: SQMTimeChart.#legendHover,
						onLeave: SQMTimeChart.#legendStopHover,
						onClick: SQMTimeChart.#legendClick
					},
					tooltip: {
						enabled: true,
						callbacks: {
							title: SQMTimeChart.#hoverTextTitle,
							label: SQMTimeChart.#hoverText
						}
					}
				}
			}
		};
	}
	
	#divId; // the div housing the time chart
	#sqmChart; // the SQMChart object which 'owns' this time chart
	#chartObject; // the actual chart.js object
	#canvas; // the canvas element the chart is in
	#readingsType; // all_readings or best_nightly_readings
	#colorManager; // SQMChartColorManager object
	#isClear; // whether the chart object does not exist
	
	#chartCount; // for error recovery, ensures unique naming if the chart object needs replacing
	#reverseAll; // should the y axis be revered for all_readings
	#reverseBest; // likewise for best_nightly_readings
	#ticksSource; // data or auto
	
	#readingsSet; // SQMReadingsSet object
	
	#showWhich; // 'all', 'noCloudy' or 'noSunMoonClouds'
	
	#contextMenu; // SQMTimeContextMenu object
		
	// hack to work around bug in chartjs
	#tooltipEl;
	#tooltipElImage;
	#tooltipIsShowing;
	
	// are the legend and key visible
	#legendShowing;
	#keyShowing;
		
	constructor(divId,chart) {
		this.#divId = divId;
		this.#sqmChart = chart;
		this.#chartCount = 0;
		this.#makeChartObject();
		this.#reverseAll = sqmConfig.nightlyAxisDescending;
		this.#reverseBest = sqmConfig.bestReadingAxisDescending;
		this.#ticksSource = 'auto';
		this.#tooltipEl = document.createElement('div');
		this.#tooltipEl.classList.add('chartjs-tooltip');
		document.body.appendChild(this.#tooltipEl);
		this.#tooltipEl.addEventListener('click',(event) => {
			SQMImagePopup.showImage();
		});
		this.#tooltipIsShowing = false;
		this.#contextMenu = new SQMTimeContextMenu(divId,this,chart);
	}

	// returns an array of the sqmIds which are currently visible in the chart
	activeSqmIds() {
		const activeSqmIds = [];
		this.#chartObject.getSortedVisibleDatasetMetas().forEach((object) => {
			if (!object.hidden) {
				activeSqmIds.push(object._dataset.sqmId);
			}
		});
		return activeSqmIds;
	}
	
	// make an sqm visible
	activateSqm(sqmId) {
		const index = this.#chartObject.data.datasets.findIndex((d) => d.sqmId == sqmId);
		if (index < 0) { return false; }
		this.#chartObject.show(index);
		this.#chartObject.data.datasets[index].hidden = false;
	}
	
	// make an sqm not visible
	deactivateSqm(sqmId) {
		const index = this.#chartObject.data.datasets.findIndex((d) => d.sqmId == sqmId);
		if (index < 0) { return false; }
		this.#chartObject.hide(index);
		this.#chartObject.data.datasets[index].hidden = true;
	}
	
	// create the actual chart.js object
	#makeChartObject() {
		this.#chartCount++;
		this.#canvas = document.createElement('canvas');
		this.#canvas.setAttribute('id',this.#divId + 'sqmtimechart' + this.#chartCount);
		$(this.#divId).appendChild(this.#canvas);
		this.#chartObject = new Chart(
			$(this.#divId + 'sqmtimechart' + this.#chartCount),
			this._getChartOptions()
		);
		this.#chartObject.timeChart = this;
		this.#isClear = false;
	}
	
	setColorManager(colorManager) {
		this.#colorManager = colorManager;
		this.#chartObject.colorManager = colorManager;
	}
	
	setReadingsType(readingsType) {
		this.#readingsType = readingsType;
		this.setTimeScale((readingsType == 'all_readings') ? 'minute' : 'day');
		this.setAxisReverse(
			((readingsType == 'all_readings') && this.#reverseAll) ||
			((readingsType == 'best_nightly_readings') && this.#reverseBest)
		);
	}
	
	clearRange() {
		delete this.#chartObject.options.scales.y.min;
		delete this.#chartObject.options.scales.y.max;
	}
	
	// called by the context menu
	setMin(newMin) {
		this.#chartObject.options.scales.y.min = parseInt(newMin);
		this.redraw();
	}
	
	setMax(newMax) {
		const previousMin = this.#chartObject.scales.y.min;
		this.#chartObject.options.scales.y.max = parseInt(newMax);
		this.#chartObject.options.scales.y.min = previousMin;
		this.redraw();
	}
	
	setAxisReverse(reverse) {
		this.#chartObject.options.scales.y.reverse = reverse;
	}
	
	// minute or day
	setTimeScale(scale) {
		this.#chartObject.options.scales.x.time.unit = scale;
	}
	
	// auto or data
	setTicksSource(source) {
		this.#ticksSource = source;
		this.#chartObject.options.scales.x.ticks.source = source;
	}
	
	setTimeRange(startDatetime,endDatetime) {
		this.#chartObject.options.scales.x.min = startDatetime;
		this.#chartObject.options.scales.x.max = endDatetime;
	}
	
	setReadingsSet(readingsSet) {
		this.#readingsSet = readingsSet;
	}
	
	/*	add the dataset to the chart and set up the data in it from the readings set */
	addDataset(dataset) {
		const sqmId = dataset.sqmId;
		
		// convert the readings to data in the format expected by chart.js
		dataset.allData = this.#toData(this.#readingsSet.allReadings()[sqmId]);
		dataset.noSunMoonCloudsData =
			this.#toData(this.#readingsSet.noSunMoonCloudsReadings()[sqmId]);
		dataset.noCloudyData = this.#toData(this.#readingsSet.noCloudyReadings()[sqmId]);
		
		// create the chart object if necessary
		if (this.#isClear) {
			this.#makeChartObject();
		}
		
		// set dataset.data to be the correct version of readings based on user choices
		switch (this.#showWhich) {
			case 'all':
				dataset.data = dataset.allData;
				break;
			case 'noCloudy':
				dataset.data = dataset.noCloudyData;
				break;
			case 'noSunMoonClouds':
				dataset.data = dataset.noSunMoonCloudsData;
				break;
		}
		
		// set up hooks for coloring the chart
		dataset.borderColor = SQMTimeChart.#borderColor;
		dataset.backgroundColor = SQMTimeChart.#backgroundColor;
		dataset.pointBorderColor = SQMTimeChart.#pointBorderColor;
		dataset.pointBackgroundColor = SQMTimeChart.#pointBackgroundColor;
		dataset.pointHoverBackgroundColor = SQMTimeChart.#pointHoverBackgroundColor;
		dataset.pointHoverBorderColor = SQMTimeChart.#pointHoverBorderColor;
		dataset.pointStyle = SQMTimeChart.#pointStyle;
		dataset.fill = false;
		dataset.segment = {
			borderColor: SQMTimeChart.#segmentBorderColor,
			borderDash: SQMTimeChart.#segmentBorderDash
		};
		
		// actually add the dataset to the chart object
		this.#chartObject.data.datasets.push(dataset);
	}
	
	/*	convert the readings to the format for time chart data points */
	#toData(readings) {
		return _.keys(readings).map((datetime) => {
			return {
				x: datetime,
				y: readings[datetime].reading
			};
		});
	}
	
	/*	shift to the new data */
	shiftedReadings(newReadingsSet) {
		this.#handleNewData();
	}
	
	/*	add the new data in place */
	addedToReadings(newReadingsSet) {
		this.#handleNewData();
	}
	
	/*	update the datasets based on the readingsSet having new data */
	#handleNewData() {
		this.#chartObject.data.datasets.forEach((dataset) => {
			const sqmId = dataset.sqmId;
			this.#updateDatasetData(
				dataset.allData,this.#toData(this.#readingsSet.allReadings()[sqmId])
			);
			this.#updateDatasetData(
				dataset.noCloudyData,this.#toData(this.#readingsSet.noCloudyReadings()[sqmId])
			);
			this.#updateDatasetData(
				dataset.noSunMoonCloudsData,
				this.#toData(this.#readingsSet.noSunMoonCloudsReadings()[sqmId])
			);
		});
	}
	
	/* update the data object by adding in readings in newData not already in data */
	#updateDatasetData(data,newData) {
		const existingDatetimes = data.map((dataPoint) => dataPoint.x);
		const earliest = _.min(existingDatetimes);
		const latest = _.max(existingDatetimes);
		const before = [];
		const after = [];
		const between = [];
		newData.forEach((dataPoint) => {
			const datetime = dataPoint.x;
			if (!existingDatetimes.includes(datetime)) {
				if (datetime < earliest) {
					before.push(dataPoint);
				} else {
					if (datetime > latest) {
						after.push(dataPoint);
					} else {
						between.push(dataPoint);
					}
				}
			}
		});
		// put the new data prior to existing at the start of the dataset
		before.sort().reverse().forEach((dataPoint) => {
			data.unshift(dataPoint);
		});
		// and the new data after to the end
		after.sort().forEach((dataPoint) => {
			data.push(dataPoint);
		});
		if (between.length > 0) {
			between.forEach((dataPoint) => {
				data.push(dataPoint);
			});
			// if any new data is in between the existing data, sort it
			// this will cause the chart to redraw rather than shift but shouldn't happen
			data.sort();
		}
	}
		
	// remove a dataset from the chart
	removeDataset(sqmId) {
		const index = this.#chartObject.data.datasets.findIndex((d) => d.sqmId == sqmId);
		this.#chartObject.data.datasets.splice(index,1);
	}
	
	// completely clear the chart object and its container element
	// should only be needed for error recovery
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
		this.#chartObject.data.datasets = [];
	}
	
	// redraw the chart object
	redraw(animationDuration = null) {
		if (animationDuration) {
			this.#chartObject.update(animationDuration);
		} else {
			this.#chartObject.update();
		}
		var hasReadings = false;
		var hasIndeterminateCloudiness = false;
		var canFilterClouds = false;
		var canFilterSunMoonClouds = false;
		// determine if any visible datasets have readings in the time period
		this.activeSqmIds().forEach((sqmId) => {
			const dataset =
				this.#chartObject.data.datasets.find((dataset) => dataset.sqmId == sqmId);
			if (dataset.data.length > 0) {
				hasReadings = hasReadings || dataset.data.some((point) => {
					return ((this.#sqmChart.startDatetime <= point.x)
							&& (this.#sqmChart.endDatetime >= point.x)
							&& (point.y != undefined) && (point.y != null));
				});
			}
			// determine if flitering by clouds is possible
			// and whether there is data without r^2 values
			if (this.#readingsSet.get(dataset.sqmId).canFilterClouds()) {
				canFilterClouds = true;
				dataset.data.forEach((point) => {
					const r2 = this.#readingsSet.get(sqmId).reading(point.x).mean_r_squared;
					if ((r2 == null) || (r2 == undefined)) {
						hasIndeterminateCloudiness = true;
					}
				});
			}
			if (this.#readingsSet.get(dataset.sqmId).canFilterSunMoonClouds()) {
				canFilterSunMoonClouds = true;
			}
		});
		// if no readings then let the user know that
		if (hasReadings) {
			SQMUserDisplay.hideNoReadingsBox();
		} else {
			SQMUserDisplay.showNoReadingsBox(this.#showWhich != 'all');
		}
		// tell the context menu whether it should offer the option of filtering
		this.#contextMenu.canFilter(canFilterClouds,canFilterSunMoonClouds);
		// tell user display whether to show cloudiness in the key
		if (canFilterClouds) {
			SQMUserDisplay.showCloudinessKey();
		} else {
			SQMUserDisplay.hideCloudinessKey();
		}
		// tell the user display whether to show the dashed line in the key
		if (hasIndeterminateCloudiness) {
			SQMUserDisplay.showUnknownCloudiness();
		} else {
			SQMUserDisplay.hideUnknownCloudiness();
		}
		// tell the context menu the computed min and max
		this.#contextMenu.setMin(Math.floor(this.#chartObject.scales.y.min));
		this.#contextMenu.setMax(Math.ceil(this.#chartObject.scales.y.max));
	}
	
	// reverse the y axis of the chart and keep track of the user's choice
	// keep all and best separately
	flipChart() {
		if (this.#readingsType == 'all_readings') {
			this.#reverseAll = !this.#reverseAll;
			sqmConfig.nightlyAxisDescending = !sqmConfig.nightlyAxisDescending;
		} else {
			this.#reverseBest = !this.#reverseBest;
			sqmConfig.bestReadingAxisDescending = !sqmConfig.bestReadingAxisDescending;
		}
		const reversed = this.#chartObject.options.scales.y.reverse;
		this.#chartObject.options.scales.y.reverse = !reversed;
		this.redraw();
	}
	
	// handle the display of the legend (list of sqms at bottom of chart)
	showLegend(show) {
		this.#legendShowing = show;
		this.#chartObject.options.plugins.legend.display = show;
		this.#contextMenu.setLegendShowing(show);
	}
	
	showHideLegend() {
		if (this.#legendShowing) {
			this.showLegend(false);
		} else {
			this.showLegend(true);
		}
		this.redraw();
	}
	
	#canFilterClouds(sqmId) {
		return this.#readingsSet.get(sqmId).canFilterClouds();
	}
	
	setShowReadings(which) {
		this.#showWhich = which;
		this.#contextMenu.setShowingWhich(this.#showWhich);
	}
	
	// remove readings outside the displayed time range
	#removeReadingsOutsideTimeRange() {
		const start = this.#chartObject.scales.x.min;
		const end = this.#chartObject.scales.x.max;
		this.#chartObject.data.datasets.forEach((dataset) => {
			const newAllData = [];
			_.keys(dataset.allData).forEach((key) => {
				const datetime = dataset.allData[key].x;
				if ((datetime >= start) && (datetime <= end)) {
					newAllData.push(dataset.allData[key]);
				}
			});
			const newNoCloudyData = [];
			_.keys(dataset.noCloudyData).forEach((key) => {
				const datetime = dataset.noCloudyData[key].x;
				if ((datetime >= start) && (datetime <= end)) {
					newNoCloudyData.push(dataset.noCloudyData[key]);
				}
			});
			const newNoSunMoonCloudsData = [];
			_.keys(dataset.noSunMoonCloudsData).forEach((key) => {
				const datetime = dataset.noSunMoonCloudsData[key].x;
				if ((datetime >= start) && (datetime <= end)) {
					newNoSunMoonCloudsData.push(dataset.noSunMoonCloudsData[key]);
				}
			});
		});
	}
	
	// set the readings to show to be all
	showAllReadings() {
		if (this.#showWhich != 'all') {
			// remove nonvisible readings and redraw so the animation will be smooth
			this.#removeReadingsOutsideTimeRange();
			this.#chartObject.update('none');
		}
		this.#showWhich = 'all';
		this.#chartObject.data.datasets.forEach((dataset) => {
			dataset.data = dataset.allData;
		});
		this.#chartObject.options.scales.x.ticks.source = this.#ticksSource;
		this.#contextMenu.setShowingWhich(this.#showWhich);
		this.redraw();
	}
	
	// set the readings to show to be noCloudy
	showNoCloudyReadings() {
		if (this.#showWhich != 'noCloudy') {
			this.#removeReadingsOutsideTimeRange();
			this.#chartObject.update('none');
		}
		this.#showWhich = 'noCloudy';
		this.#chartObject.data.datasets.forEach((dataset) => {
			dataset.data = dataset.noCloudyData;
		});
		// force ticks to auto to keep the graph's shape
		this.#chartObject.options.scales.x.ticks.source = 'auto';
		this.#contextMenu.setShowingWhich(this.#showWhich);
		this.redraw();
	}
	
	// set the readings to show to be noSunMoonClouds
	showNoSunMoonCloudsReadings() {
		if (this.#showWhich != 'noSunMoonClouds') {
			this.#removeReadingsOutsideTimeRange();
			this.#chartObject.update('none');
		}
		this.#showWhich = 'noSunMoonClouds';
		this.#chartObject.data.datasets.forEach((dataset) => {
			dataset.data = dataset.noSunMoonCloudsData;
		});
		// force ticks to auto to keep the graph's shape
		this.#chartObject.options.scales.x.ticks.source = 'auto';
		this.#contextMenu.setShowingWhich(this.#showWhich);
		this.redraw();
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
	
	// returns the attributes for a given datetime and sqmId in our internal readings object
	// called by the chart.js callbacks for coloring the chart
	_attributesFor(sqmId,datetime) {
		return this.#readingsSet.get(sqmId).reading(datetime);
	}
	
	/*	static methods are required for hook routines
		by adding the colorManager object to the chart.js object, these static methods can call
		the color manager directly */
	
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
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// fill color of the point
	static #pointBackgroundColor(context) {
		return context.chart.colorManager.pointBackgroundColor(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// border color of point when selected
	static #pointHoverBorderColor(context) {
		return context.chart.colorManager.pointHoverBorderColor(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// fill color of point when selected
	static #pointHoverBackgroundColor(context) {
		return context.chart.colorManager.pointHoverBackgroundColor(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// color of line between two points
	static #segmentBorderColor(context) {
		const dataset = context.chart.data.datasets[context.datasetIndex];
		const sqmId = dataset.sqmId;
		const startPoint = context.chart.timeChart._attributesFor(sqmId,context.p0.raw.x);
		const endPoint = context.chart.timeChart._attributesFor(sqmId,context.p1.raw.x);
		return context.chart.colorManager.segmentColor(
			sqmId,startPoint,endPoint,dataset.readingsType
		);
	}
	
	// whether to draw the connecting lines as solid or dashed
	static #segmentBorderDash(context) {
		const dataset = context.chart.data.datasets[context.datasetIndex];
		if (!context.chart.timeChart.#canFilterClouds(dataset.sqmId)) {
			return undefined;
		}
		const sqmId = dataset.sqmId;
		const startPoint = context.chart.timeChart._attributesFor(sqmId,context.p0.raw.x);
		const endPoint = context.chart.timeChart._attributesFor(sqmId,context.p1.raw.x);
		return context.chart.colorManager.segmentDash(
			sqmId,startPoint,endPoint,dataset.readingsType
		);
	}
	
	// size of points in the chart
	static #pointRadius(context) {
		return context.chart.colorManager.pointRadius(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// size of points when the mouse is over them
	static #pointHoverRadius(context) {
		return context.chart.colorManager.pointHoverRadius(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// e.g. circle
	static #pointStyle(context) {
		return context.chart.colorManager.pointStyle(
			context.dataset.sqmId, SQMTimeChart.#parseContext(context)
		);
	}
	
	// respond to a mouse click on the chart
	// loops through the elements potentially involved until one responds to the click
	// then returns
	static #click(event,elements,chart) {
		var reacted = false;
		elements.forEach((element) => {
			if ((!reacted) && (element.datasetIndex >= 0) && (element.index >= 0) && chart) {
				const dataset = chart.data.datasets[element.datasetIndex];
				const point = dataset.data[element.index];
				// pass the click event to the time chart instance
				if (chart.timeChart._click(dataset.sqmId,point)) {
					reacted = true;
				}
			}
		});
	}
	
	// actually respond to a mouse click on this object's chart
	// on mobile, click triggers the tooltip rather than the click method
	// so this method is really only for non touch devices
	_click(sqmId,point) {
		if (this.#readingsType == 'best_nightly_readings') {
			// if user clicks on a point among best readings, go to that night's data
			if (point) {
				const datetime = point.x;
				setTimeout(() => {
					SQMUserRequest.nightly(
						SQMDate.nightOf(SQMDate.parseServerDatetime(datetime))
					);
				},1);
				return true;
			}
		} else if (this.#readingsType == 'all_readings') {
			// if user clicks on a point, show the image connected to that reading if there is one
			// for best readings, the context menu allows the user to see the image
			if (point) {
				const datetime = point.x;
				var image = this.#readingsSet.get(sqmId).reading(datetime).display_image;
				if (!image) {
					image = this.#readingsSet.get(sqmId).reading(datetime).image;
				}
				if (image) {
					SQMImagePopup.setImage(
						image,
						sqmManager.availableSqmInfos[sqmId].name +
							" " + SQMDate.formatTitleDatetime(datetime),
						this.#readingsSet.get(sqmId).reading(datetime).image
					);
					if (!SQMUserInputs.isTouch) {
						SQMImagePopup.showImage();
					}
					return true;
				}
			}
		}
		return false;
	}

	// handle the mouse being over the legend
	static #legendHover(event,legendContext,context) {
		return context.chart.timeChart._legendHover(
			context.legendHitBoxes[legendContext.datasetIndex],
			context.chart.data.datasets[legendContext.datasetIndex].sqmId
		);
	}
	
	static #legendStopHover(event,legendContext,context) {
		return context.chart.timeChart._legendStopHover();
	}
	
	#legendHovering;
	
	// when the mouse is over the legend, show info about the sqm
	_legendHover(legendHitBox,sqmId) {
		if (this.#legendHovering) {
			return;
		}
		const sqmInfo = sqmManager.availableSqmInfos[sqmId];
		if (sqmConfig.showLatitudeLongitude && sqmInfo.latitude) {
			const latitude  = Number.parseFloat(sqmInfo.latitude.toFixed(2));
			const longitude = Number.parseFloat(sqmInfo.longitude.toFixed(2));
			const latitudeStr  = latitude >= 0 ? latitude + "N" : Math.abs(latitude) + "S";
			const longitudeStr = longitude >= 0 ? longitude + "E" : Math.abs(longitude) + "W";
			$('legendtooltiplat').innerHTML = "Latitude " + latitudeStr;
			$('legendtooltiplong').innerHTML = "Longitude " + longitudeStr;
			if (sqmInfo.elevation) {
				$('legendtooltipelev').innerHTML = "Elevation " + sqmInfo.elevation + " meters";
			}
			if (sqmInfo.time_zone_name) {
				$('legendtooltiptz').innerHTML = "Time zone " + sqmInfo.time_zone_name;
			}
		}
		$('legendtooltipname').innerHTML = sqmInfo.name;
		if (!this.activeSqmIds().includes(sqmId)) {
			$('legendtooltipclick').innerHTML = "Click to show";
		} else if (this.activeSqmIds().length > 1) {
			$('legendtooltipclick').innerHTML = "Click to hide";
		} else {
			$('legendtooltipclick').style.display = "none";
		}
		this.#legendHovering = true;
		const tooltip = $('legendtooltip');
		tooltip.style.display = "block";
		tooltip.style.left = (legendHitBox.left + 20) + "px";
		tooltip.style.top = (legendHitBox.top - tooltip.offsetHeight - 3) + "px";
	}
	
	_legendStopHover() {
		$('legendtooltipname').innerHTML = "";
		$('legendtooltiplat').innerHTML = "";
		$('legendtooltiplong').innerHTML = "";
		$('legendtooltipelev').innerHTML = "";
		$('legendtooltipclick').innerHTML = "";
		$('legendtooltip').style.display = "none";
		this.#legendHovering = false;
	}
	
	// clicking on the legend activates/deactivates the datasets
	static #legendClick(event,legendContext,context) {
		return context.chart.timeChart._legendClick(legendContext);
	}
	
	_legendClick(legendContext) {
		if (this.#chartObject.isDatasetVisible(legendContext.datasetIndex)) {
			if (this.activeSqmIds().length > 1) {
				this.#chartObject.hide(legendContext.datasetIndex);
				legendContext.hidden = true;
			}
		} else {
			this.#chartObject.show(legendContext.datasetIndex);
			legendContext.hidden = false;
		}
		const activeSqmIds = this.activeSqmIds();
		this.#sqmChart.setActiveSqmIds(activeSqmIds);
		if (this.#legendHovering) {
			if (legendContext.hidden) {
				$('legendtooltipclick').innerHTML = "Click to show";
			} else if (this.activeSqmIds().length > 1) {
				$('legendtooltipclick').innerHTML = "Click to hide";
			} else {
				$('legendtooltipclick').style.display = "none";
			}
		}
	}
	
	// create the tooltips for hovering over points
	static #hoverTextTitle(context) {
		const titles = context.map((ctx) => ctx.chart.timeChart._hoverTextTitle())
							  .filter((title) => title != null);
		return titles.length > 0 ? titles.join("\n") : "";
	}
	
	_hoverTextTitle() {
		return null;
	}
	
	static #hoverText(context) {
		return context.chart.timeChart._hoverText(
			context.dataset.sqmId,context.raw.x,context.raw.y
		);
	}
	
	// the actual tooltip creation
	_hoverText(sqmId,datetime,value) {
		const sqmName = sqmManager.availableSqmInfos[sqmId].name;
		const readingAt = value + " @ " + datetime;
		
		// if there is a thumbnail image attached, set up the image
		// #tooltipElImage is our div for showing the thumbnail
		const thumbnail = this.#readingsSet.get(sqmId).reading(datetime).thumbnail;
		if (!thumbnail) {
			this.#tooltipElImage = null;
		} else {
			var image = this.#readingsSet.get(sqmId).reading(datetime).display_image;
			if (!image) {
				image = this.#readingsSet.get(sqmId).reading(datetime).image;
			}
			if (image) {
				SQMImagePopup.setImage(
					image,
					sqmName + " " + SQMDate.formatTitleDatetime(datetime),
					this.#readingsSet.get(sqmId).reading(datetime).image
				);
				this.#contextMenu.showViewImage(true);
			}
			this.#tooltipElImage = thumbnail;
		}
		const shortLabel = sqmName.length > 20 ? sqmName.substring(0,18) + "..." : sqmName;
		
		// result is an array of strings to be displayed as the tooltip
		const result = [ readingAt, shortLabel ];
		const reading = this.#readingsSet.get(sqmId).reading(datetime);
		
		if (sqmConfig.hoverTextSun && reading.sun_position) {
			result.push("Solar altitude " +
				Math.round(reading.sun_position.altitude*180/Math.PI) + " degrees"
			);
			const sunAzimuth = Math.round(reading.sun_position.azimuth*180/Math.PI);
			if (sunAzimuth >= 0) {
				result.push("Solar azimuth " + sunAzimuth + " degrees");
			} else {
				result.push("Solar azimuth " + (sunAzimuth+360) + " degrees");
			}
		}
		if (sqmConfig.hoverTextMoon && reading.moon_position) {
			result.push("Lunar altitude " +
				Math.round(reading.moon_position.altitude*180/Math.PI) +
				" degrees");
			const moonAzimuth =
				Math.round(reading.moon_position.azimuth*180/Math.PI);
			if (moonAzimuth >= 0) {
				result.push("Lunar azimuth " + moonAzimuth + " degrees");
			} else {
				result.push("Lunar azimuth " + (moonAzimuth+360) + " degrees");
			}
			result.push(SQMSunMoonMWClouds.extractPhase(reading.moon_illumination.phase));
			result.push("Lunar illumination " +
				Math.round(reading.moon_illumination.fraction*100) + "%"
			);
		}
		if (sqmConfig.hoverTextR2 && reading.mean_r_squared) {
			result.push(
				"Mean r² = " + (reading.mean_r_squared).toFixed(2)
			);
		}
		return result;
	}
	
	// hack to work around bug in chartjs
	// enabling external tooltip and builtin leads to incorrect opacity and positioning
	// being sent to the callbacks from chartjs
	static hook(object,x,y,width,height,xAlign,yAlign) {
		if (object.chart.timeChart) {
			object.chart.timeChart._hook(x,y,width,height,xAlign,yAlign);
		}
	}
	
	// compute where the tooltip image should be placed
	_hook(x,y,width,height,xAlign,yAlign) {
		const bodyRect = document.body.getBoundingClientRect();
		const chartRect = $('timechart').getBoundingClientRect();
		var offsetTop = chartRect.top - bodyRect.top;
		if (SQMUserDisplay.sqmsDropdownShowing) {
			offsetTop += 3;
		} else {
			offsetTop += 7;
		}
		if (yAlign == 'top') {
			this.#tooltipEl.style.top = (y + offsetTop + height) + "px";
		} else {
			this.#tooltipEl.style.top = (y + offsetTop - this.#tooltipEl.offsetHeight) + "px";
		}
		const offset = (this.#tooltipEl.offsetWidth - width)/2;
		this.#tooltipEl.style.left = (x - offset) + "px";
	}
	
	static hooktwo(object,n) {
		if (object.chart.timeChart) {
			object.chart.timeChart._hooktwo(n);
		}
	}
	
	// actually show/hide the tooltip image
	_hooktwo(n) {
		if ((!n) || (n.opacity === 0) || (!this.#tooltipElImage)) {
			this.#tooltipEl.innerHTML = '';
			this.#tooltipElImage = null;
			this.#tooltipEl.style.opacity = 0;
			this.#tooltipEl.style.visibility = 'hidden';
			this.#contextMenu.showViewImage(false);
			this.#tooltipIsShowing = false;
		} else {
			if (!this.#tooltipIsShowing) {
				this.#tooltipIsShowing = true;
				const image = new Image();
				image.timeChart = this;
				image.onload = function () {
					if (this.timeChart.#tooltipIsShowing) {
						const img = document.createElement('img');
						img.setAttribute('src',this.src);
						img.setAttribute('height',this.height);
						img.setAttribute('width',this.width);
						img.classList.add('thumbnail');
						this.timeChart.#tooltipEl.innerHTML = '';
						this.timeChart.#tooltipEl.appendChild(img);
						this.timeChart.#tooltipEl.style.opacity = 1;
						this.timeChart.#tooltipEl.style.visibility = 'visible';
					}
				};
				image.src = this.#tooltipElImage;
			}
		}
	}
	
	// only display the thumbnail once the image is loaded
	#imageOnLoad () {
		if (this.#tooltipIsShowing) {
			const img = document.createElement('img');
			img.setAttribute('src',this.src);
			img.setAttribute('height',this.height);
			img.setAttribute('width',this.width);
			img.classList.add('thumbnail');
			this.#tooltipEl.innerHTML = '';
			this.#tooltipEl.appendChild(img);
			this.#tooltipEl.style.opacity = 1;
			this.#tooltipEl.style.visibility = 'visible';
		}
	}
	
	// return the chart.js object as an image base64 encoded
	// needed for user downloading the chart as an image
	image() {
		return this.#chartObject.toBase64Image();
	}
	
	// return the chart.js object as a javascript blob
	// needed for oepning in a new tab
	blob(callback) {
		this.#canvas.toBlob(callback);
	}
}