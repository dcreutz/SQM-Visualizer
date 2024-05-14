<?php
/*	main.php
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

// Outputs the bulk of the index.php and standalone.php files
?><script type="text/javascript">
var elm=document.getElementsByTagName("html")[0];
elm.style.display="none";
document.addEventListener("DOMContentLoaded",function(event) {elm.style.display="block"; });
</script>
</head>
<body>
<noscript>
	<div class="titlebox" style="z-index: 100">
		<h2>JavaScript is required for this site</h2>
	</div>
</noscript>
<div id="titlebox" class="titlebox">
	<h2 class="title"><span id="pagetitle">SQM Visualizer</span></h2>
	<span class="tooltip">
		<select id="currentsqms" multiple></select>
		<span class="multitooltiptext">
			Select among available SQM datasets<br/>
			Choose multiple for a visual comparison
		</span>
	</span>
	<select id="fakecurrentsqms" multiple>
		<option value="" selected></option>
	</select>
</div>
<div id="titlehr" class="fakehr"><div class="fakehrinside"></div></div>
<div id="topcontainer" class="container">
	<div class="box">
		<span class="clickable tooltip" id="tonight" tabindex="1">
			Tonight
			<span class="bottomtooltiptext">
				All nightly readings starting from the most recent sunset
			</span>
		</span>
	</div>
	<div class="box">
		<span class="tooltip" style="margin-bottom: -1px">
			Nightly
			<span class="bottomtooltiptext">
				All nightly readings starting from sunset of the chosen date
			</span>
		</span>
		&nbsp; <input id="nightly" name="nightly" type="text" readonly tabindex="2" />
	</div>
	<div class="box" id="monthlybox">
		<div class="monthlydropdown">
			<select id="monthly"><option value=""></option></select>
			<div id="monthlydropdown" class="monthlydropbutton tooltip" tabindex="3">
				Monthly
				<span class="righttooltiptext" style="min-width: 200px">
					Best (highest) reaadings from each night of the chosen month
				</span>
			</div>
			<div id="actualmonthlydropdown" class="monthlycontent">
				<a href="#">2024-02</a>
			</div>
		</div>
	</div>
	<div class="box" id="gridbutton">
		<span class="clickable tooltip" tabindex="4">
			Grid
			<span class="bottomtooltiptext">
				View multiple graphs simultaneously
			</span>
		</span>
	</div>
	<div id="sixmonths" class="box">
		<span class="clickable tooltip" tabindex="5">
			Six months
			<span class="bottomtooltiptext">
				Best (highest) readings from each night over the past six months
			</span>
		</span>
	</div>
	<div id="alltime" class="box">
		<span class="clickable tooltip" tabindex="6">
			All
			<span class="bottomtooltiptext">
				Best (highest) readings from each night over all available data
			</span>
		</span>
	</div>
	<div id="showhideoptions" class="box">
		<span class="clickable tooltip" tabindex="7">
			Custom
			<span class="bottomtooltiptext">
				Customize datetime range
			</span>
		</span>
	</div>
</div>
<div id="options">
	<div id="optionshelper">
		<div class="fakehr"><div class="fakehrinside"></div></div>
		<div class="optionscontainer">
			<select id="readings" class="optionitem" tabindex="8">
				<option value="all_readings">All readings</option>
				<option value="best_nightly_readings">Best nightly</option>
			</select>
			<span class="optiontext">from</span>
			<div class="datetimebox">
				<input id="startdatetime" name="startdate" type="text" readonly tabindex="9" />
			</div>
			<span class="optiontext">to</span>
			<div class="datetimebox">
				<input id="enddatetime" name="enddate" type="text" readonly tabindex="10" />
			</div>
			<span id="loadbutton" class="clickable" tabindex="11">
				Load
			</span>
		</div>
	</div>
</div>
<div class="fakehr"><div class="fakehrinside"></div></div>
<div class="graph" id="thegraph">
	<div id="timechartgridholder">
		<div class="close" id="closegrid"></div>
		<div id="leftarrowgrid">
			<i class="gridarrow gridleftarrow"></i>
			<i class="gridarrow gridleftarrow shiftleft"></i>
		</div>
		<div id="timechartgrid"></div>
		<div id="rightarrowgrid">
			<i class="gridarrow gridrightarrow shiftright"></i>
			<i class="gridarrow gridrightarrow"></i>
		</div>
	</div>
	<div class="graphtext">
		<div id="leftarrow">
			<i class="arrow leftarrow"></i>
			<i class="arrow leftarrow shiftleft"></i>
		</div>
		<div id="rightarrow">
			<i class="arrow rightarrow shiftright"></i>
			<i class="arrow rightarrow"></i>
		</div>
		<h3 id="graphtitle"></h3>
		<h4 class="graphsubtitle" id="noreadingsbox">No readings in range</h4>
		<h4 class="graphsubtitle" id="bestbox"><span id="besttext"></span></h4>
	</div>
	<div class="chartbox">
		<div id="timechart">
		</div>
		<div id="legendtooltip">
			<div id="legendtooltipname"></div>
			<div id="legendtooltiplat"></div>
			<div id="legendtooltiplong"></div>
			<div id="legendtooltipelev"></div>
			<div id="legendtooltiptz"></div>
			<div id="legendtooltipclick"></div>
		</div>
		<div class="loadingring" id="loading"></div>
	</div>
	<div class="graphtextstats">
		<h4 class="graphsubtitle" id="statsbox">
			<div id="stats"></div>
		</h4>
	</div>
	<div id="chartkey">
		<div id="chartkeyhelper">
			<div class="keyitem">
				<span class="tooltip defaultcursor">
					Solar
					<span class="toptooltiptext">
						Readings affected by the sun, calculated from solar altitude
					</span>
				</span>
				<span class="keybox"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun1"><span class="keytooltiptext" id="keysuntooltip1"></span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun2"><span class="keytooltiptext" id="keysuntooltip2"></span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun3"><span class="keytooltiptext" id="keysuntooltip3"></span></span><span class="keylinecontainer"><span class="keyline"></span></span></span>
			</div>
			<div class="keyitem">
				<span class="tooltip defaultcursor">
					Lunar
					<span class="toptooltiptext">
						Readings affected by the moon, calculated from lunar altitude and illumination
					</span>
				</span>
				<span class="keybox"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon1"><span class="keytooltiptext">Heavy moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon2"><span class="keytooltiptext">Heavy moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon3"><span class="keytooltiptext">High moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon4"><span class="keytooltiptext">High moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon5"><span class="keytooltiptext">Mild moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon6"><span class="keytooltiptext">Mild moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon7"><span class="keytooltiptext">Low moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon8"><span class="keytooltiptext">Low moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon9"><span class="keytooltiptext">Little moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon10"><span class="keytooltiptext">(Effectively) no moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span></span>
			</div>
			<div class="keyitem">
				<span class="defaultcursor">Cloudiness</span>
				<span class="keybox"><span id="keyclouds1"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Very cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds2"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds3"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Somewhat cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds4"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Mostly clear</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds5"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Clear</span></span><span class="keylinecontainer"><span class="keyline"></span></span></span></span>
				<span class="keybox" id="keyunknownclouds">
					<span class="keylinecontainerunknown tooltip">
						<span class="keylinedashed">
							<span class="keylinedash"></span>
							<span class="keylinedash"></span>
							<span class="keylinedash"></span>
						</span>
						<span class="keytooltiptext">Indeterminate cloudiness</span>
					</span>
				</span>
			</div>
		</div>
	</div>
</div>
<div class="fakehr"><div class="fakehrinside"></div></div>
<div id="barbox">
	<div id="barboxhelper">
		<div class="chartbox">
			<div id="barchart">
			</div>
			<ul id="barcontextmenu">
			</ul>
		</div>
		<div class="fakehr"><div class="fakehrinside"></div></div>
	</div>
</div>
<div class="container">
	<h4 class="graphsubtitle" id="latestbox"><span id="latesttext"></span></h4>
</div>
<div id="imagepopup">
	<div class="close" id="imageclose"></div>
	<div id="imagebackground">
		<div class="imagecontainer">
			<h3 id="theimagetext"></h3>
			<img id="theimage"/>
		</div>
	</div>
</div>
<?php include("about.php"); ?>
<div class="addfileinputcover" id="addfileinputcover">
	<div class="addfileinput" id="addfileinput">
		<span class="uploadtext">Add SQM data files</span>
		<span class="uploadtextsmall">This will NOT send your data to the server</span>
		<label class="sqmfileupload">
			<input type="file" id="addfileupload" multiple />
			Choose files
		</label>
		<div class="clickable" id="addfileclose">Cancel</div>
	</div>
</div>
<div id="cover"></div>
<div class="initialfileinputcover" id="initialfileinputcover">
	<div class="initialfileinput" id="initialfileinput">
		<span class="uploadtext">Select SQM data files</span>
		<label class="sqmfileupload">
			<input type="file" id="initialfileupload" multiple />
			Choose files
		</label>
	</div>
</div>