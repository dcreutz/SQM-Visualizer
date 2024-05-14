/*	sqm_user_display.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the fields displayed to the user */
	
class SQMUserDisplay {
	static sqmsDropdownShowing;
	
	static initialize() {
		SQMUserDisplay.setPageTitle(sqmConfig.title);
		if ((sqmConfig.showSqmsDropdown === true) ||
				((sqmConfig.showSqmsDropdown === null) && (sqmConfig.enabledSqms !== true))) {
			$('titlebox').style.display = 'block';
			$('titlehr').style.display = 'block';
			SQMUserDisplay.sqmsDropdownShowing = true;
		} else {
			$('titlebox').style.display = 'none';
			$('titlehr').style.display = 'none';
			$('topcontainer').style.marginTop = '5px';
			SQMUserDisplay.sqmsDropdownShowing = false;
		}
		if (sqmConfig.showKey && sqmConfig.colorizeData) {
			SQMUserDisplay.showKey();
		} else {
			SQMUserDisplay.hideKey();
		}
		if (sqmConfig.showBestReading) {
			SQMUserDisplay.showBestBox();
		} else {
			SQMUserDisplay.hideBestBox();
		}
		if (sqmConfig.showLatestReading) {
			SQMUserDisplay.showLatestBox();
		} else {
			SQMUserDisplay.hideLatestBox();
		}
		if (sqmConfig.showStats) {
			SQMUserDisplay.showStatsBox();
		} else {
			SQMUserDisplay.hideStatsBox();
		}
		if (sqmConfig.showBinning) {
			SQMUserDisplay.showBinning();
		} else {
			SQMUserDisplay.hideBinning();
		}
		SQMUserDisplay.hideUnknownCloudiness();
		$('addfileclose').addEventListener("click",(event) => {
			SQMUserDisplay.hideAddFileInput();
		});
	}
	
	static setPageTitle(title) {
		$('pagetitle').innerHTML = title;
		document.title = title;
	}
	
	// cover elements displays to hide the content until it's loaded
	static hideCover() {
		$('cover').style.display = "none";
	}
	
	// show/hide the loading indicator spinning circle
	static showLoading() {
		$('loading').style.display = "inline-block";
	}

	static hideLoading() {
		$('loading').style.display = "none";
	}
	
	static setGraphTitle(title) {
		$('graphtitle').innerHTML = title;
	}
	
	// handle the "no readings" display
	static showNoReadingsBox(excludedData = false) {
		$('noreadingsbox').innerHTML = excludedData ?
			"No readings in range, possibly due to excluding sun, moon, cloud data" :
			"No readings in range";
		$('noreadingsbox').style.display = 'block';
	}
	
	static hideNoReadingsBox() {
		$('noreadingsbox').style.display = 'none';
	}
	
	// handle the best reading display
	static showBestBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidebest',"Hide best reading");
		$('bestbox').style.maxHeight = ($('besttext').offsetHeight + 2) + "px";
	}
	
	static hideBestBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidebest',"Show best reading");
		$('bestbox').style.maxHeight = "0";
	}
	
	static showhideBestBox() {
		if ($('bestbox').offsetHeight == 0) {
			SQMUserDisplay.showBestBox();
		} else {
			SQMUserDisplay.hideBestBox();
		}
	}
	
	static setBestBox(bestReading,displayName) {
		if (!bestReading) {
			$('besttext').innerHTML = "";
			return;
		}
		$('besttext').innerHTML = "Best reading " + SQMUserDisplay.#displayReading(bestReading);
		if (displayName) {
			$('besttext').innerHTML
				+= " by " + sqmManager.availableSqmInfos[bestReading.sqmId].name;
		}
	}
	
	// handle the latest reading display
	static showLatestBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidelatest',"Hide latest reading");
		$('latestbox').style.maxHeight = ($('latesttext').offsetHeight + 2) + "px";
	}
	
	static hideLatestBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidelatest',"Show latest reading");
		$('latestbox').style.maxHeight = "0";
	}
	
	static showhideLatestBox() {
		if ($('latestbox').offsetHeight == 0) {
			SQMUserDisplay.showLatestBox();
		} else {
			SQMUserDisplay.hideLatestBox();
		}
	}
	
	static setLatestReading(latestReading,displayName) {
		if (!latestReading) {
			$('latesttext').innerHTML = "";
			return;
		}
		$('latesttext').innerHTML = "Latest reading " + 
			SQMUserDisplay.#displayReading(latestReading);
		if (displayName) {
			$('latesttext').innerHTML += " by " +
				sqmManager.availableSqmInfos[latestReading.sqmId].name;
		}
	}
	
	// handle the statistics display
	static showStatsBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidestats',"Hide statistics");
		$('statsbox').style.maxHeight = ($('stats').offsetHeight + 2) + "px";
	}
	
	static hideStatsBox() {
		SQMUserDisplay.#allClassInnerHTML('showhidestats',"Show statistics");
		$('statsbox').style.maxHeight = "0px";
	}
	
	static showhideStatsBox() {
		if ($('statsbox').offsetHeight == 0) {
			SQMUserDisplay.showStatsBox();
		} else {
			SQMUserDisplay.hideStatsBox();
		}
	}
	
	static setStatsBox(stats) {
		$('stats').innerHTML = "";
		_.keys(stats).forEach((sqmId) => {
			const row = document.createElement('div');
			row.classList.add('statsrow');
			row.appendChild(
				SQMUserDisplay.#statsItem("["+sqmManager.availableSqmInfos[sqmId].name+"]")
			);
			row.appendChild(SQMUserDisplay.#statsItem("Mean: " + stats[sqmId].mean.toFixed(2)));
			row.appendChild(SQMUserDisplay.#statsItem("Median: " + stats[sqmId].median.toFixed(2)));
			row.appendChild(SQMUserDisplay.#statsItem("Number: " + stats[sqmId].number));
			row.appendChild(
				SQMUserDisplay.#statsItem(
					"Best: " + SQMUserDisplay.#displayReading(stats[sqmId].best)
				)
			);
			$('stats').appendChild(row);
		});
		if ($('statsbox').offsetHeight != 0) {
			SQMUserDisplay.showStatsBox();
		}
	}
	
	static #displayReading(reading) {
		return reading.value + " @ " + SQMDate.serverToTitleDatetime(reading.datetime);
	}
	
	static #statsItem(text) {
		const div = document.createElement('div');
		div.appendChild(document.createTextNode(text));
		div.classList.add('statsitem');
		return div;
	}
	
	// handle showing the key (icons indicating sun/moon/clouds)
	static showhideKey() {
		if ($('chartkey').offsetHeight != 0) {
			SQMUserDisplay.hideKey();
		} else {
			SQMUserDisplay.showKey();
		}
	}
	
	static showKey() {
		SQMUserDisplay.#allClassInnerHTML('showhidekey',"Hide key");
		$('chartkey').style.maxHeight = $('chartkeyhelper').offsetHeight + "px";
		setTimeout(() => { $('chartkey').style.overflow = "visible"; },320);
	}
	
	static hideKey() {
		SQMUserDisplay.#allClassInnerHTML('showhidekey',"Show key");
		$('chartkey').style.overflow = "hidden";
		$('chartkey').style.maxHeight = "0px";
	}
	
	// handle displaying the bar chart
	static isBinningShown() {
		return $('barbox').offsetHeight != 0;
	}
	
	static showBinning() {
		SQMUserDisplay.#allClassInnerHTML('binning',"Hide bar chart");
		$('barbox').style.maxHeight = $('barboxhelper').offsetHeight + "px";
		setTimeout(() => {
			$('barbox').style.overflow = "visible";
			$('barbox').scrollIntoView();
		}, 620);
	}
	
	static hideBinning() {
		SQMUserDisplay.#allClassInnerHTML('binning',"Show bar chart");
		$('barbox').style.overflow = "hidden";
		$('barbox').style.maxHeight = "0";
	}
	
	static showhideBinning() {
		if (SQMUserDisplay.isBinningShown()) {
			SQMUserDisplay.hideBinning();
		} else {
			SQMUserDisplay.showBinning();
		}
	}
	
	// called when data without mean R^2 values is being displayed
	static showUnknownCloudiness() {
		$('keyunknownclouds').style.display = "inline-block";
	}
	
	static hideUnknownCloudiness() {
		$('keyunknownclouds').style.display = "none";
	}
	
	// called by the standalone version
	static showInitialFileInput() {
		$('initialfileinputcover').style.display = "inline-block";
	}
	
	static hideInitialFileInput() {
		$('initialfileinputcover').style.display = "none";
	}
	
	// triggered by the context menu item
	static showAddFileInput() {
		$('addfileinputcover').style.display = "inline-block";
	}
	
	static hideAddFileInput() {
		$('addfileinputcover').style.display = "none";
	}
	
	// for computing the location of the thumbnail image popup
	static bestStatsHeight() {
		var height = 0;
		if (window.getComputedStyle($('statsbox'),null).display != "none") {
			height += $('statsbox').offsetHeight;
		}
		if (window.getComputedStyle($('bestbox'),null).display != "none") {
			height += $('bestbox').offsetHeight;
		}
		return height;
	}
	
	// save the chart being displayed as an image
	static saveImage(name,image) {
		var a = document.createElement('a');
		a.href = image;
		const datetimes = SQMUserInputs.getDateTimeInputsAsDates();
		if (SQMUserInputs.getReadingsType() == 'all_readings') {
			a.download = name + "_All_Readings_" +
				SQMDate.formatFilenameDatetime(datetimes.start) + "_" +
				SQMDate.formatFilenameDatetime(datetimes.end);
		} else {
			a.download = name + "_Best_Nightly_Readings_" +
				SQMDate.formatFilenameDate(datetimes.start) + "_" +
				SQMDate.formatFilenameDate(datetimes.end);
		}
		a.click();
	}
	
	// open the chart as an image in a new tab
	static imageInNewTab(blob) {
		window.open(URL.createObjectURL(blob),'_blank');
	}
	
	// helper function to ensure all context menus get updated
	static #allClassInnerHTML(classname,text) {
		Array.from(document.getElementsByClassName(classname)).forEach((elt) => {
			elt.innerHTML = text;
		});
	}
	
	// called by the context menu
	static dataFilesLink() {
		window.open(sqmConfig.dataFilesLink, '_blank').focus();
	}
}