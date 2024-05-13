/*	sqm_context_menu.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	manages the context menus opened by right-clicking (press and hold on mobile) on the charts */

/*	abstract class managing a context menu */

class SQMContextMenu {
	#div; // the DOM element which when clicked opens the menu
	#menu; // the menu DOM element
	#isShowing; // whether the menu is showing
	
	constructor(div) {
		this.#div = $(div);
		this.#isShowing = false;
		// respond to right click
		this.#div.addEventListener('contextmenu',SQMContextMenu.#click.bind(null,this),false);
		// set up to close the menu on click outside of it
		document.body.addEventListener('mousedown', SQMContextMenu.#clickOutside.bind(null,this));
		this.#menu = document.createElement('ul');
		this.#menu.classList.add('contextmenu');
		this.#div.appendChild(this.#menu);
	}
	
	// on right-click, place the menu so it's visible and show it
	static #click(contextMenu,event) {
		return contextMenu._click(event);
	}
	
	_click(event) {
		event.preventDefault();
		event.stopPropagation();
		this._placeMenu(event.clientX,event.clientY);
		this.#menu.style.visibility = 'visible';
		this.#isShowing = true;
		return false;
	}
	
	// places the menu at the (x,y) coordinates of the mouse click
	// except if that would put it off the screen
	// shrink the menu, if necessary, so it's all visible
	_placeMenu(x,y) {
		if (this.#menu.offsetWidth > window.innerWidth*0.5) {
			this.#menu.style.transform =
				"scale(" + (window.innerWidth*0.5/this.#menu.offsetWidth) + ")";
		}
		if (this.#menu.offsetHeight > window.innerHeight*0.8) {
			this.#menu.style.transform =
				"scale(" + (window.innerHeight*0.8/this.#menu.offsetHeight) + ")";
		}
		if ((x + this.#menu.offsetWidth) > window.innerWidth - 10) {
			x = window.innerWidth - this.#menu.offsetWidth - 10;
		}
		if ((y - 30 + this.#menu.offsetHeight) > window.innerHeight) {
			y = window.innerHeight - this.#menu.offsetHeight;
		}
		this.#menu.style.left = x + "px";
		this.#menu.style.top = (y - 30) + "px";
	}
	
	static #clickOutside(contextMenu,event) {
		return contextMenu._clickOutside(event);
	}
	
	_clickOutside(event) {
		if (this.#isShowing && !this.#menu.contains(event.target)) {
			this.#menu.style.visibility = 'hidden';
			this.#isShowing = false;
		}
	}
	
	static #closeMenu(contextMenu) {
		contextMenu._closeMenu();
	}
	
	_closeMenu() {
		this.#menu.style.visibility = 'hidden';
	}
	
	// add an item to the menu with the given label
	// when clicked, it will trigger the given action
	_addMenuItem(label,action,classname = null) {
		const li = document.createElement("li");
		li.appendChild(document.createTextNode(label));
		li.classList.add('menu-item');
		if (classname) {
			li.classList.add(classname);
		}
		this.#menu.appendChild(li);
		li.addEventListener("click",SQMContextMenu.#closeMenu.bind(null,this));
		li.addEventListener("click",action);
		return li;
	}
	
	_addMenuSeparator(classname = null) {
		const li = document.createElement("li");
		li.appendChild(document.createTextNode(" "));
		li.classList.add('menu-separator');
		if (classname) {
			li.classList.add(classname);
		}
		this.#menu.appendChild(li);
		return li;
	}
	
	// add a menu item with a select dropdown
	_addRangeMenuItem(label,action,classname,values=null) {
		const li = document.createElement("li");
		li.appendChild(document.createTextNode(label));
		li.classList.add('menu-item-no-underline');
		if (classname) {
			li.classList.add(classname);
		}
		const select = document.createElement("select");
		select.style.float = 'right';
		if (!values) {
			const startValue = sqmConfig.badDataCutoff ? Math.floor(sqmConfig.badDataCutoff) : 0;
			const endValue = 25;
			for (let i = startValue; i <= endValue; i++) {
				const option = new Option(i,i,false);
				select.appendChild(option);
			}
		} else {
			values.forEach((value) => {
				const option = new Option(value,value,false);
				select.appendChild(option);
			});
		}
		li.appendChild(select);
		this.#menu.appendChild(li);
		li.addEventListener("change",SQMContextMenu.#closeMenu.bind(null,this));
		select.addEventListener("change",action);
		return select;
	}
}

/*	the time chart context menu */

class SQMTimeContextMenu extends SQMContextMenu {
	#timeChart;
	#chart;
	
	#viewImage; // view image menu item DOM elemeent
	#showViewImage; // whether to show an explcit show image menu item
	#clouds; // include/exclude clouds menu item DOM element
	#sunMoonClouds; // include/exclude SMC menu item DOM element
	#cloudsSep; // filter menu separator DOM element
	#min; // min select DOM element
	#max; // max select DOM element
	#legend; // show/hide legend menu item DOM element
	
	#canFilterClouds; // whether we can filter clouds
	#canFilterSunMoonClouds; // whether we can filter sun moon clouds
	#showingWhich; // which readings are currently showing
	
	constructor(div,timeChart,chart) {
		super(div);
		this.#timeChart = timeChart;
		this.#chart = chart;
		this.#viewImage = this._addMenuItem("View image",SQMImagePopup.showImage,'viewimage');
		this.#viewImage.style.display = 'none';
		this._addMenuItem(
			"Open graph in new tab",
			SQMTimeContextMenu.#imageInNewTab.bind(null,this)
		);
		this._addMenuItem("Save graph as image",SQMTimeContextMenu.#saveImage.bind(null,this));
		this._addMenuSeparator();
		this._addMenuItem("Stats",SQMUserDisplay.showhideStatsBox,'showhidestats');
		this._addMenuItem("Bins",SQMUserDisplay.showhideBinning,'binning');
		this._addMenuItem("Best",SQMUserDisplay.showhideBestBox,'showhidebest');
		this._addMenuItem("Latest",SQMUserDisplay.showhideLatestBox,'showhidelatest');
		this._addMenuSeparator();
		this.#sunMoonClouds = this._addMenuItem(
			"SunMoonClouds",
			SQMTimeContextMenu.#showHideSunMoonClouds.bind(null,this),
			'sunmoonclouds'
		);
		this.#clouds = this._addMenuItem(
			"Cloudy",
			SQMTimeContextMenu.#showHideCloudy.bind(null,this),
			'cloudy'
		);
		this.#cloudsSep = this._addMenuSeparator('cloudysep');
		this.#min = this._addRangeMenuItem(
			"Axis minimum",
			SQMTimeContextMenu.#setMin.bind(null,this),
			'limin'
		);
		this.#max = this._addRangeMenuItem(
			"Axis maximum",
			SQMTimeContextMenu.#setMax.bind(null,this),
			'limax'
		);
		this._addMenuItem("Reverse vertical axis",SQMTimeContextMenu.#flipChart.bind(null,this));
		this.#legend = this._addMenuItem(
			'Hide legend',SQMTimeContextMenu.#showHideLegend.bind(null,this),'showhidelegend'
		);
		if (sqmConfig.colorizeData) {
			const key = this._addMenuItem('Hide key',SQMUserDisplay.showhideKey,'showhidekey');
			key.setAttribute('id','showhidekey');
		}
		this._addMenuSeparator('filesep');
		this._addMenuItem("Add local data",SQMUserDisplay.showAddFileInput,'lifileinput');
		if (sqmConfig.dataFilesLink) {
			this._addMenuItem('View data files',SQMUserDisplay.dataFilesLink,'datafileslink');
		}
		if (sqmConfig.showAboutLink) {
			this._addMenuSeparator();
			SQMAbout.initialize('aboutpage');
			this._addMenuItem('About...',SQMAbout.show,'aboutlink');
		}
	}
	
	// called if we should add a menu item to show the image
	// used when not on mobile and viewing best nightly readings
	// since clicking on the data point opens that night's data
	showViewImage(show) {
		this.#showViewImage = show;
	}
	
	// called by the timechart to tell us if filtering is possible
	canFilter(clouds,sunMoonClouds) {
		this.#canFilterClouds = clouds;
		this.#canFilterSunMoonClouds = clouds;
		this.#drawFilterItems();
	}
	
	_click(event) {
		super._click(event);
		if (this.#showViewImage) {
			this.#viewImage.style.display = 'block';
		} else {
			this.#viewImage.style.display = 'none';
		}
	}
	
	// open the image of the chart in a new tab
	static #imageInNewTab(contextMenu) {
		contextMenu._imageInNewTab();
	}
	
	_imageInNewTab() {
		this.#timeChart.blob(SQMUserDisplay.imageInNewTab);
	}
	
	// save the image of the chart
	static #saveImage(contextMenu) {
		contextMenu._saveImage();
	}
	
	_saveImage() {
		SQMUserDisplay.saveImage("SQM",this.#timeChart.image());
	}
	
	// show/hide the data affected by the sun, moon and clouds
	static #showHideSunMoonClouds(contextMenu) {
		contextMenu._showHideSunMoonClouds();
	}
	
	_showHideSunMoonClouds() {
		this.#chart.showHideSunMoonClouds();
	}
	
	static #showHideCloudy(contextMenu) {
		contextMenu._showHideCloudy();
	}
	
	_showHideCloudy() {
		this.#chart.showHideCloudy();
	}
	
	// the dropdown menus in the context menu
	static #setMin(contextMenu) {
		contextMenu._setMin();
	}
	
	_setMin() {
		this.#timeChart.setMin(this.#min.value);
	}
	
	static #setMax(contextMenu) {
		contextMenu._setMax();
	}
	
	_setMax() {
		this.#timeChart.setMax(this.#max.value);
	}
	
	// flip the chart over/reverse the y-axis
	static #flipChart(contextMenu) {
		contextMenu._flipChart();
	}
	
	_flipChart() {
		this.#timeChart.flipChart();
	}
	
	static #showHideLegend(contextMenu) {
		contextMenu._showHideLegend();
	}
	
	_showHideLegend() {
		this.#timeChart.showHideLegend();
	}
	
	setMin(newMin) {
		this.#min.value = newMin;
	}
	
	setMax(newMax) {
		this.#max.value = newMax;
	}
	
	// called by the timechart to tell us which readings are showing
	setShowingWhich(which) {
		this.#showingWhich = which;
		this.#drawFilterItems();
	}
	
	// set the display text and visibility of the include/exclude filter menu items
	#drawFilterItems() {
		switch (this.#showingWhich) {
			case 'all':
				this.#clouds.innerHTML = "Exclude cloudy data";
				this.#sunMoonClouds.innerHTML = "Exclude sun, moon, clouds";
				break;
			case 'noCloudy':
				this.#clouds.innerHTML = "Include cloudy data";
				this.#sunMoonClouds.innerHTML = "Exclude sun, moon, clouds";
				break;
			case 'noSunMoonClouds':
				this.#sunMoonClouds.innerHTML = "Include sun, moon, clouds";
				break;
		}
		var either = false;
		if (this.#canFilterClouds && this.#showingWhich != 'noSunMoonClouds') {
			this.#clouds.style.display = 'block';
			either = true;
		} else {
			this.#clouds.style.display = 'none';
		}
		if (this.#canFilterSunMoonClouds) {
			this.#sunMoonClouds.style.display = 'block';
			either = true;
		} else {
			this.#sunMoonClouds.style.display = 'none';
		}
		if (either) {
			this.#cloudsSep.style.display = 'block';
		} else {
			this.#cloudsSep.style.display = 'none';
		}
	}
	
	setLegendShowing(showing) {
		this.#legend.innerHTML = showing ? "Hide legend" : "Show legend";
	}
}

/*	the bar chart context menu */

class SQMBarContextMenu extends SQMContextMenu {
	#barChart;
	#chart;
	
	#min;
	#increment;

	constructor (div,barChart) {
		super(div);
		this.#barChart = barChart;
		
		this._addMenuItem("Open graph in new tab",SQMBarContextMenu.#imageInNewTab.bind(null,this));
		this._addMenuItem("Save graph as image",SQMBarContextMenu.#saveImage.bind(null,this));
		this._addMenuSeparator();
		this.#min = this._addRangeMenuItem(
			"Axis minimum",
			SQMBarContextMenu.#setMin.bind(null,this),
			'libarmin'
		);
		this.#increment = this._addRangeMenuItem(
			"Increment",
			SQMBarContextMenu.#setIncrement.bind(null,this),
			'barincrement',
			[0.1,0.25,0.5,1.0,2.0]
		);
		this._addMenuSeparator();
		this._addMenuItem("Stats",SQMUserDisplay.showhideStatsBox,'showhidestats');
		this._addMenuItem("Best",SQMUserDisplay.showhideBestBox,'showhidebest');
		this._addMenuItem("Latest",SQMUserDisplay.showhideLatestBox,'showhidelatest');
	}
	
	static #imageInNewTab(contextMenu) {
		contextMenu._imageInNewTab();
	}
	
	_imageInNewTab() {
		this.#barChart.blob(SQMUserDisplay.imageInNewTab);
	}
	
	static #saveImage(contextMenu) {
		contextMenu._saveImage();
	}
	
	_saveImage() {
		SQMUserDisplay.saveImage("SQMBar",this.#barChart.image());
	}
	
	static #setMin(contextMenu) {
		contextMenu._setMin();
	}
	
	_setMin() {
		this.#barChart.setMin(this.#min.value);
	}
	
	static #setIncrement(contextMenu) {
		contextMenu._setIncrement();
	}
	
	_setIncrement(increment) {
		this.#barChart.setIncrement(this.#increment.value);
	}
	
	setMin(newMin) {
		this.#min.value = newMin;
	}
	
	setIncrement(newIncrement) {
		this.#increment.value = newIncrement;
	}
}