<!doctype html>
<html lang="en">
<head>
<title>SQM Visualizer</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" /><!-- index.php -->
<!-- SQM Visualizer -->
<!-- (c) 2025 Darren Creutz -->
<!-- Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 --><style type="text/css">
.flatpickr-calendar{background:transparent;opacity:0;display:none;text-align:center;visibility:hidden;padding:0;-webkit-animation:none;animation:none;direction:ltr;border:0;font-size:14px;line-height:24px;border-radius:5px;position:absolute;width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-touch-action:manipulation;touch-action:manipulation;background:#fff;-webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,0.08);box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,0.08)}.flatpickr-calendar.open,.flatpickr-calendar.inline{opacity:1;max-height:640px;visibility:visible}.flatpickr-calendar.open{display:inline-block;z-index:99999}.flatpickr-calendar.animate.open{-webkit-animation:fpFadeInDown 300ms cubic-bezier(.23,1,.32,1);animation:fpFadeInDown 300ms cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.inline{display:block;position:relative;top:2px}.flatpickr-calendar.static{position:absolute;top:calc(100% + 2px)}.flatpickr-calendar.static.open{z-index:999;display:block}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+1) .flatpickr-day.inRange:nth-child(7n+7){-webkit-box-shadow:none !important;box-shadow:none !important}.flatpickr-calendar.multiMonth .flatpickr-days .dayContainer:nth-child(n+2) .flatpickr-day.inRange:nth-child(7n+1){-webkit-box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-2px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-calendar .hasWeeks .dayContainer,.flatpickr-calendar .hasTime .dayContainer{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.flatpickr-calendar .hasWeeks .dayContainer{border-left:0}.flatpickr-calendar.hasTime .flatpickr-time{height:40px;border-top:1px solid #e6e6e6}.flatpickr-calendar.noCalendar.hasTime .flatpickr-time{height:auto}.flatpickr-calendar:before,.flatpickr-calendar:after{position:absolute;display:block;pointer-events:none;border:solid transparent;content:'';height:0;width:0;left:22px}.flatpickr-calendar.rightMost:before,.flatpickr-calendar.arrowRight:before,.flatpickr-calendar.rightMost:after,.flatpickr-calendar.arrowRight:after{left:auto;right:22px}.flatpickr-calendar.arrowCenter:before,.flatpickr-calendar.arrowCenter:after{left:50%;right:50%}.flatpickr-calendar:before{border-width:5px;margin:0 -5px}.flatpickr-calendar:after{border-width:4px;margin:0 -4px}.flatpickr-calendar.arrowTop:before,.flatpickr-calendar.arrowTop:after{bottom:100%}.flatpickr-calendar.arrowTop:before{border-bottom-color:#e6e6e6}.flatpickr-calendar.arrowTop:after{border-bottom-color:#fff}.flatpickr-calendar.arrowBottom:before,.flatpickr-calendar.arrowBottom:after{top:100%}.flatpickr-calendar.arrowBottom:before{border-top-color:#e6e6e6}.flatpickr-calendar.arrowBottom:after{border-top-color:#fff}.flatpickr-calendar:focus{outline:0}.flatpickr-wrapper{position:relative;display:inline-block}.flatpickr-months{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-months .flatpickr-month{background:transparent;color:rgba(0,0,0,0.9);fill:rgba(0,0,0,0.9);height:34px;line-height:1;text-align:center;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}.flatpickr-months .flatpickr-prev-month,.flatpickr-months .flatpickr-next-month{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-decoration:none;cursor:pointer;position:absolute;top:0;height:34px;padding:10px;z-index:3;color:rgba(0,0,0,0.9);fill:rgba(0,0,0,0.9)}.flatpickr-months .flatpickr-prev-month.flatpickr-disabled,.flatpickr-months .flatpickr-next-month.flatpickr-disabled{display:none}.flatpickr-months .flatpickr-prev-month i,.flatpickr-months .flatpickr-next-month i{position:relative}.flatpickr-months .flatpickr-prev-month.flatpickr-prev-month,.flatpickr-months .flatpickr-next-month.flatpickr-prev-month{/*
      /*rtl:begin:ignore*/left:0/*
      /*rtl:end:ignore*/}/*
      /*rtl:begin:ignore*/
/*
      /*rtl:end:ignore*/
.flatpickr-months .flatpickr-prev-month.flatpickr-next-month,.flatpickr-months .flatpickr-next-month.flatpickr-next-month{/*
      /*rtl:begin:ignore*/right:0/*
      /*rtl:end:ignore*/}/*
      /*rtl:begin:ignore*/
/*
      /*rtl:end:ignore*/
.flatpickr-months .flatpickr-prev-month:hover,.flatpickr-months .flatpickr-next-month:hover{color:#959ea9}.flatpickr-months .flatpickr-prev-month:hover svg,.flatpickr-months .flatpickr-next-month:hover svg{fill:#f64747}.flatpickr-months .flatpickr-prev-month svg,.flatpickr-months .flatpickr-next-month svg{width:14px;height:14px}.flatpickr-months .flatpickr-prev-month svg path,.flatpickr-months .flatpickr-next-month svg path{-webkit-transition:fill .1s;transition:fill .1s;fill:inherit}.numInputWrapper{position:relative;height:auto}.numInputWrapper input,.numInputWrapper span{display:inline-block}.numInputWrapper input{width:100%}.numInputWrapper input::-ms-clear{display:none}.numInputWrapper input::-webkit-outer-spin-button,.numInputWrapper input::-webkit-inner-spin-button{margin:0;-webkit-appearance:none}.numInputWrapper span{position:absolute;right:0;width:14px;padding:0 4px 0 2px;height:50%;line-height:50%;opacity:0;cursor:pointer;border:1px solid rgba(57,57,57,0.15);-webkit-box-sizing:border-box;box-sizing:border-box}.numInputWrapper span:hover{background:rgba(0,0,0,0.1)}.numInputWrapper span:active{background:rgba(0,0,0,0.2)}.numInputWrapper span:after{display:block;content:"";position:absolute}.numInputWrapper span.arrowUp{top:0;border-bottom:0}.numInputWrapper span.arrowUp:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid rgba(57,57,57,0.6);top:26%}.numInputWrapper span.arrowDown{top:50%}.numInputWrapper span.arrowDown:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid rgba(57,57,57,0.6);top:40%}.numInputWrapper span svg{width:inherit;height:auto}.numInputWrapper span svg path{fill:rgba(0,0,0,0.5)}.numInputWrapper:hover{background:rgba(0,0,0,0.05)}.numInputWrapper:hover span{opacity:1}.flatpickr-current-month{font-size:135%;line-height:inherit;font-weight:300;color:inherit;position:absolute;width:75%;left:12.5%;padding:7.48px 0 0 0;line-height:1;height:34px;display:inline-block;text-align:center;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.flatpickr-current-month span.cur-month{font-family:inherit;font-weight:700;color:inherit;display:inline-block;margin-left:.5ch;padding:0}.flatpickr-current-month span.cur-month:hover{background:rgba(0,0,0,0.05)}.flatpickr-current-month .numInputWrapper{width:6ch;width:7ch\0;display:inline-block}.flatpickr-current-month .numInputWrapper span.arrowUp:after{border-bottom-color:rgba(0,0,0,0.9)}.flatpickr-current-month .numInputWrapper span.arrowDown:after{border-top-color:rgba(0,0,0,0.9)}.flatpickr-current-month input.cur-year{background:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;cursor:text;padding:0 0 0 .5ch;margin:0;display:inline-block;font-size:inherit;font-family:inherit;font-weight:300;line-height:inherit;height:auto;border:0;border-radius:0;vertical-align:initial;-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield}.flatpickr-current-month input.cur-year:focus{outline:0}.flatpickr-current-month input.cur-year[disabled],.flatpickr-current-month input.cur-year[disabled]:hover{font-size:100%;color:rgba(0,0,0,0.5);background:transparent;pointer-events:none}.flatpickr-current-month .flatpickr-monthDropdown-months{appearance:menulist;background:transparent;border:none;border-radius:0;box-sizing:border-box;color:inherit;cursor:pointer;font-size:inherit;font-family:inherit;font-weight:300;height:auto;line-height:inherit;margin:-1px 0 0 0;outline:none;padding:0 0 0 .5ch;position:relative;vertical-align:initial;-webkit-box-sizing:border-box;-webkit-appearance:menulist;-moz-appearance:menulist;width:auto}.flatpickr-current-month .flatpickr-monthDropdown-months:focus,.flatpickr-current-month .flatpickr-monthDropdown-months:active{outline:none}.flatpickr-current-month .flatpickr-monthDropdown-months:hover{background:rgba(0,0,0,0.05)}.flatpickr-current-month .flatpickr-monthDropdown-months .flatpickr-monthDropdown-month{background-color:transparent;outline:none;padding:0}.flatpickr-weekdays{background:transparent;text-align:center;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:28px}.flatpickr-weekdays .flatpickr-weekdaycontainer{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1}span.flatpickr-weekday{cursor:default;font-size:90%;background:transparent;color:rgba(0,0,0,0.54);line-height:1;margin:0;text-align:center;display:block;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-weight:bolder}.dayContainer,.flatpickr-weeks{padding:1px 0 0 0}.flatpickr-days{position:relative;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start;width:307.875px}.flatpickr-days:focus{outline:0}.dayContainer{padding:0;outline:0;text-align:left;width:307.875px;min-width:307.875px;max-width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-wrap:wrap;-ms-flex-pack:justify;-webkit-justify-content:space-around;justify-content:space-around;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.dayContainer + .dayContainer{-webkit-box-shadow:-1px 0 0 #e6e6e6;box-shadow:-1px 0 0 #e6e6e6}.flatpickr-day{background:none;border:1px solid transparent;border-radius:150px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#393939;cursor:pointer;font-weight:400;width:14.2857143%;-webkit-flex-basis:14.2857143%;-ms-flex-preferred-size:14.2857143%;flex-basis:14.2857143%;max-width:39px;height:39px;line-height:39px;margin:0;display:inline-block;position:relative;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.flatpickr-day.inRange,.flatpickr-day.prevMonthDay.inRange,.flatpickr-day.nextMonthDay.inRange,.flatpickr-day.today.inRange,.flatpickr-day.prevMonthDay.today.inRange,.flatpickr-day.nextMonthDay.today.inRange,.flatpickr-day:hover,.flatpickr-day.prevMonthDay:hover,.flatpickr-day.nextMonthDay:hover,.flatpickr-day:focus,.flatpickr-day.prevMonthDay:focus,.flatpickr-day.nextMonthDay:focus{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.flatpickr-day.today{border-color:#959ea9}.flatpickr-day.today:hover,.flatpickr-day.today:focus{border-color:#959ea9;background:#959ea9;color:#fff}.flatpickr-day.selected,.flatpickr-day.startRange,.flatpickr-day.endRange,.flatpickr-day.selected.inRange,.flatpickr-day.startRange.inRange,.flatpickr-day.endRange.inRange,.flatpickr-day.selected:focus,.flatpickr-day.startRange:focus,.flatpickr-day.endRange:focus,.flatpickr-day.selected:hover,.flatpickr-day.startRange:hover,.flatpickr-day.endRange:hover,.flatpickr-day.selected.prevMonthDay,.flatpickr-day.startRange.prevMonthDay,.flatpickr-day.endRange.prevMonthDay,.flatpickr-day.selected.nextMonthDay,.flatpickr-day.startRange.nextMonthDay,.flatpickr-day.endRange.nextMonthDay{background:#569ff7;-webkit-box-shadow:none;box-shadow:none;color:#fff;border-color:#569ff7}.flatpickr-day.selected.startRange,.flatpickr-day.startRange.startRange,.flatpickr-day.endRange.startRange{border-radius:50px 0 0 50px}.flatpickr-day.selected.endRange,.flatpickr-day.startRange.endRange,.flatpickr-day.endRange.endRange{border-radius:0 50px 50px 0}.flatpickr-day.selected.startRange + .endRange:not(:nth-child(7n+1)),.flatpickr-day.startRange.startRange + .endRange:not(:nth-child(7n+1)),.flatpickr-day.endRange.startRange + .endRange:not(:nth-child(7n+1)){-webkit-box-shadow:-10px 0 0 #569ff7;box-shadow:-10px 0 0 #569ff7}.flatpickr-day.selected.startRange.endRange,.flatpickr-day.startRange.startRange.endRange,.flatpickr-day.endRange.startRange.endRange{border-radius:50px}.flatpickr-day.inRange{border-radius:0;-webkit-box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-day.flatpickr-disabled,.flatpickr-day.flatpickr-disabled:hover,.flatpickr-day.prevMonthDay,.flatpickr-day.nextMonthDay,.flatpickr-day.notAllowed,.flatpickr-day.notAllowed.prevMonthDay,.flatpickr-day.notAllowed.nextMonthDay{color:rgba(57,57,57,0.3);background:transparent;border-color:transparent;cursor:default}.flatpickr-day.flatpickr-disabled,.flatpickr-day.flatpickr-disabled:hover{cursor:not-allowed;color:rgba(57,57,57,0.1)}.flatpickr-day.week.selected{border-radius:0;-webkit-box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7;box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7}.flatpickr-day.hidden{visibility:hidden}.rangeMode .flatpickr-day{margin-top:1px}.flatpickr-weekwrapper{float:left}.flatpickr-weekwrapper .flatpickr-weeks{padding:0 12px;-webkit-box-shadow:1px 0 0 #e6e6e6;box-shadow:1px 0 0 #e6e6e6}.flatpickr-weekwrapper .flatpickr-weekday{float:none;width:100%;line-height:28px}.flatpickr-weekwrapper span.flatpickr-day,.flatpickr-weekwrapper span.flatpickr-day:hover{display:block;width:100%;max-width:none;color:rgba(57,57,57,0.3);background:transparent;cursor:default;border:none}.flatpickr-innerContainer{display:block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.flatpickr-rContainer{display:inline-block;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time{text-align:center;outline:0;display:block;height:0;line-height:40px;max-height:40px;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-time:after{content:"";display:table;clear:both}.flatpickr-time .numInputWrapper{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;width:40%;height:40px;float:left}.flatpickr-time .numInputWrapper span.arrowUp:after{border-bottom-color:#393939}.flatpickr-time .numInputWrapper span.arrowDown:after{border-top-color:#393939}.flatpickr-time.hasSeconds .numInputWrapper{width:26%}.flatpickr-time.time24hr .numInputWrapper{width:49%}.flatpickr-time input{background:transparent;-webkit-box-shadow:none;box-shadow:none;border:0;border-radius:0;text-align:center;margin:0;padding:0;height:inherit;line-height:inherit;color:#393939;font-size:14px;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-appearance:textfield;-moz-appearance:textfield;appearance:textfield}.flatpickr-time input.flatpickr-hour{font-weight:bold}.flatpickr-time input.flatpickr-minute,.flatpickr-time input.flatpickr-second{font-weight:400}.flatpickr-time input:focus{outline:0;border:0}.flatpickr-time .flatpickr-time-separator,.flatpickr-time .flatpickr-am-pm{height:inherit;float:left;line-height:inherit;color:#393939;font-weight:bold;width:2%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.flatpickr-time .flatpickr-am-pm{outline:0;width:18%;cursor:pointer;text-align:center;font-weight:400}.flatpickr-time input:hover,.flatpickr-time .flatpickr-am-pm:hover,.flatpickr-time input:focus,.flatpickr-time .flatpickr-am-pm:focus{background:#eee}.flatpickr-input[readonly]{cursor:pointer}@-webkit-keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}</style>
<link href="sqm_visualizer.css" media="all" rel="stylesheet" type="text/css" />
<script src="sqm_visualizer.js" type="text/javascript"></script>
<script src="config.js" type="text/javascript" onerror=""></script>
<script type="text/javascript">
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
		<h4 class="graphsubtitle" id="bestbox"><span id="besttext">&nbsp;</span></h4>
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
			<div id="stats">&nbsp;</div>
		</h4>
	</div>
	<div id="chartkey">
		<div id="chartkeyhelper">
			<div class="keyitem">
				<span class="tooltip defaultcursor">
					<span class="smalltext">Sun</span>
					<span class="toptooltiptext">
						Readings affected by the sun, calculated from solar altitude
					</span>
				</span>
				<span class="keybox"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun1"><span class="keytooltiptext" id="keysuntooltip1"></span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun2"><span class="keytooltiptext" id="keysuntooltip2"></span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keysun tooltip" id="keysun3"><span class="keytooltiptext" id="keysuntooltip3"></span></span><span class="keylinecontainer"><span class="keyline"></span></span></span>
			</div>
			<div class="keyitem">
				<span class="tooltip defaultcursor">
					<span class="smalltext">Moon</span>
					<span class="toptooltiptext">
						Readings affected by the moon, calculated from lunar altitude and illumination
					</span>
				</span>
				<span class="keybox"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon1"><span class="keytooltiptext">Heavy moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon2"><span class="keytooltiptext">Heavy moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon3"><span class="keytooltiptext">High moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon4"><span class="keytooltiptext">High moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon5"><span class="keytooltiptext">Mild moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon6"><span class="keytooltiptext">Mild moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon7"><span class="keytooltiptext">Low moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon8"><span class="keytooltiptext">Low moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon9"><span class="keytooltiptext">Little moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymoon tooltip" id="keymoon10"><span class="keytooltiptext">(Effectively) no moon light</span></span><span class="keylinecontainer"><span class="keyline"></span></span></span>
			</div>
			<div class="keyitem" id="keycloudiness">
				<span class="tooltip defaultcursor">
					<span class="smalltext">Clouds</span>
					<span class="toptooltiptext">
						Readings affected by cloudiness, calculated from mean r&sup2;
					</span>
				</span>
				<span class="keybox"><span id="keyclouds1"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Very cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds2"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds3"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Somewhat cloudy</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds4"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Mostly clear</span></span><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span></span><span id="keyclouds5"><span class="halfkeylinecontainer"><span class="halfkeyline"></span></span><span class="keyclouds tooltip"><span class="keytooltiptext">Clear</span></span><span class="keylinecontainer"><span class="keyline"></span></span></span></span><span class="keybox" id="keyunknownclouds"><span class="keylinecontainerunknown tooltip"><span class="keylinedashed"><span class="keylinedash"></span><span class="keylinedash"></span><span class="keylinedash"></span></span><span class="keytooltiptext">Indeterminate cloudiness</span></span></span>
			</div>
			<div class="keyitem" id="keymw">
				<span class="tooltip defaultcursor">
					<span class="smalltext" style="font-size: 95%;">Milky Way</span>
					<span class="toptooltiptext">
						Readings affected by the milky way, calculated from galactic latitude
					</span>
				</span>
				<span class="keybox"><span class="keylinecontainer"><span class="keyline"></span></span><span class="keymw tooltip" id="keymw1"><span id="keymw1a"></span><span class="keytooltiptext" id="keymwtooltip1"></span></span><span class="keylinecontainer"><span class="keyline"></span></span></span>
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
<div id="aboutpage">
	<div class="aboutcontainer">
		<div class="close" id="closeabout"></div>
		<h2 class="abouttitle">SQM Visualizer</h2>
		<h4>&copy; 2025 Darren Creutz</h4>
		<div class="aboutlinks">
			<a class="abouthref" href="https://dcreutz.com/sqm" target="_blank">dcreutz.com/sqm</a>
			| 
			<a class="abouthref" href="https://github.com/dcreutz/SQM-Visualizer/blob/main/README.md" target="_blank">github.com/dcreutz/SQM-Visualizer</a>
		</div>
	</div>
</div>
<div id="userguidepage">
	<div class="userguidecontainer">
		<div class="userguidetitle">
			<h2 class="abouttitle">SQM Visualizer</h2>
			<h4>&copy; 2025 Darren Creutz</h4>
			<div class="aboutlinks">
				<a class="abouthref" href="https://dcreutz.com/sqm" target="_blank">dcreutz.com/sqm</a>
				| 
				<a class="abouthref" href="https://github.com/dcreutz/SQM-Visualizer/blob/main/README.md" target="_blank">github.com/dcreutz/SQM-Visualizer</a>
			</div>
		</div>
		<div class="close" id="closeuserguide"></div>
		<div id="userguidetext">
<h1>Sky Quality Meter (SQM) Visualizer User Guide</h1>
<p>This describes the functions/features of the SQM Visualizer, how to access each feature, and how to navigate around the display. The SQM Visualizer works with data from a Unihedron SQM Device in the 'International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' <a href="https://darksky.org/app/uploads/bsk-pdf-manager/47_SKYGLOW_DEFINITIONS.PDF">format</a> and files in the format output by the Unihedron software feature 'sun-moon-mw-clouds'.</p>
<p>The SQM Visualizer can display “live data” being captured to a computer that both stores the captured data and runs the SQM Visualizer as a web application, in essentially real time.  In addition, without “real time” data, the SQM Visualizer will display historical data that may be loaded periodically (e.g., daily, monthly, or at some other frequency).  Thus, a user can transfer data from the station’s local computer to a central server via FTP, manual file transfer with USB sticks, or other mechanisms.</p>
<p>The Sky Quality Meter (SQM) captures and records data on how dark the sky is by recording msas (magnitudes per arc second squared) values; the SQM Visualizer presents this data for user information and analysis, providing a variety of perspectives.  This brief user guide explains the features of the SQM Visualizer and how to access them.  While there are many algorithms used to interpret the data to make it easily visualized by users, the SQM Visualizer is not intended for scientific research.  To that end, the actual data files can be accessed independently (with appropriate access to the computer storing the data; the SQM Visualizer application can also be configured to make the raw data files available for download) and analyzed by researchers and others interested in deeper perspectives, or using different assumptions and algorithms, than those incorporated in the SQM Visualizer.</p>
<h2>Main display</h2>
<p>Upon launching the SQM Visualizer, the user is presented with a graph showing the most recent set of SQM readings.  Depending on the time of day, the graph presents either data from “yesterday”, or data from today since evening nautical twilight (this can be configured to be civil or astronomical twilight).  (Prior to today’s twilight, the data shown is that for yesterday.)  The SQM Visualizer will update the graph in real time as new data is downloaded from the Unihedron device.</p>
<p>While there are number of configuration options that can tweak the specifics of the display for individual implementations, the default configuration presents nightly data with the best (darkest/highest msas) readings at the bottom of the graph and the readings for the brightest sky at the top.  Since readings typically run from evening twilight into the night (ending at morning twilight), the readings presented generally look like a broad valley, rapidly moving towards the best readings at the bottom of the graph, running through the night, and then moving upwards as the sun rises in the morning.  By default, when presenting best nightly readings over a time range, the vertical axis is oriented with the darkest readings at the top.</p>
<p>The graph consists of a line with circles representing each data point.  The colors, shading and shape of the line and circles provide information about the conditions of the sky (e.g., moon above the horizon, estimated cloud cover [as calculated by algorithms within the SQM Visualizer], etc.).  The SQM Visualizer can display multiple reporting stations (as described below).  Each reporting station is displayed with a different color.</p>
<p>For each station, there are a variety of color/shading options that may appear (again, this is assuming the default configuration as many values are configurable):</p>
<ul>
<li>Solid dark lines and circles indicate that the readings exist, that there is no interference from the moon, sun, or clouds, and the data can be presumed to be valid.</li>
<li>Yellow/orange circles indicate that the sun is within 18 degrees of the horizon, and therefore can be presumed to have an influence on the level of darkness.</li>
<li>Lines and circles that are “ghosts” (i.e., faint) indicate that it is significantly cloudy (as calculated by algorithms within the SQM Visualizer) and any data should not be considered to represent clear-sky darkness values.</li>
<li>Circles that are neither yellow nor solid indicate that the moon is above the horizon.  These circles may run from faint to deep gray, indicating the intensity of the moon’s probable interference (a combination of altitude and phase of the moon).  The darker the circle, the less moon interference is present.  (Note: the level of moon interference is calculated from information on moon altitude and phase and is not itself measured.)</li>
<li>Diamonds indicate that the milky way may be interfering in that the galactic latitude is within the specified cutoff (defaults to 2.5 degrees)</li>
</ul>
<p>Since the SQM Visualizer can show multiple stations at one time, each station is assigned a specific color (blue, gray, orange, etc.).  Depending on the specific configuration of your implementation, the default station for your implementation is deep blue.  As additional stations are identified for display, the SQM Visualizer will assign additional colors.  A legend below the graphical display provides the color associated with each displayed station; placing the cursor over a station (equivalently, clicking on it when on a touch screen device) in the legend shows it’s latitude, longitude, and local time zone (and elevation if that is specified in the data files).   </p>
<p>The top section of the display shows general information and allows the user to request specific time (in the station’s time zone) intervals for display.  While the default view is “tonight” (or “yesterday” if it is prior to twilight), the user may request a specific night.  In addition, the user may view the “best reading” (i.e., the darkest reading) for each night for any month, each night for the past six months, or for “all” (all data recorded for the selected stations).   </p>
<p>Using the “Custom” button, the user may define any specific time interval by defining a start and end date/time.  The “Custom” button also allows the user to request either all reading during the custom interval or the best nightly readings during the custom interval.  The user must click the “Load” button to actually view the data for a custom interval.  If the user changes the interval or which data to select, the user must again press the “Load” button to update the graph.</p>
<p>Note that at any time, the user can return to “Tonight” (displaying either tonight’s current data, or data for “yesterday” if it is before twilight) using the “Tonight” button.</p>
<p>Below the row of time interval selection options, is the period being displayed, and the best reading within the displayed interval and the date/time of the first occurrence of that reading during the period.</p>
<p>Below the graph is the legend showing the colors for each displayed station, and below that the latest reading among all selected SQM stations.</p>
<h2>Options menu</h2>
<p>Clicking with the right mouse button (press and hold on touch screen devices) anywhere on the graph opens an options menu.  The options are:</p>
<ul>
<li>Open graph in new tab – which displays the current graph as an image in a new tab</li>
<li>Save graph as image – which downloads the current graph image as a .png file to your default download folder</li>
<li>Show/hide statistics – which adds a row above the graph displaying statistics for the time interval displayed on the graph; for each station selected for display, statistics shown are: name of station; mean msas value; median msas value; number of data readings; and best (highest msas) reading with date/time of it’s first occurrence</li>
<li>Show/hide bar chart – which displays a bar chart below the data display providing an aggregate view of the data readings for the displayed interval</li>
<li>Hide/show best reading – which removes the display of the best reading during the time interval that appears above the graph</li>
<li>Hide/show latest reading – which removes the display of the last reading that appears below the graphical display</li>
<li>Exclude/include sun, moon, MW, clouds data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by the sun, moon, milky way, or clouds; this results in gaps in the graph and shows data points only when the sky is dark and presumed to be clear</li>
<li>Exclude/include cloudy data – which removes those data points where the algorithms of the SQM Visualizer evaluates that the data are influenced by clouds (but does not remove sun or moon influenced data)</li>
<li>Axis minimum – which sets the minimum msas reading to be included on the vertical axis (note that the minimum cannot be set lower than the bad daat cutoff specified in the configuration file, the default cutoff is 10.0)</li>
<li>Axis maximum – which sets the maximum msas reading to be included on the vertical axis</li>
<li>Reverse vertical axis – which reverses the direction of the vertical axis</li>
<li>Hide/show legend – which removes the legend below the graph showing the color codes and geographical data for the (possibly multiple) SQM stations displayed on the graph</li>
<li>Hide/show key – which removes the key below the graph legend describing the colorization based on sun, moon, MW and clouds</li>
<li>Add local data – which allows the user to load files of SQM data from their own device.  (Note that this data does not persist past the current session of the SQM Visualizer and is not uploaded to the server.)</li>
<li>View data files – which allows the user to view the raw data files</li>
<li>About... – which shows information about the SQM Visualizer software</li>
<li>User Guide – which shows this guide</li>
</ul>
<p>On mobile devices with small screens, some options are disabled in order to keep the menu small enough to be completely visible.</p>
<p>The options to exclude cloudy data are only available if the data files contain mean r squared calculations (or if run on a server).</p>
<h2>Detailed information for a reading</h2>
<p>If you hover over a specific data point (equivalently, click on a data point on touch screen devices), information appears related to that data point:</p>
<ul>
<li>Date/time of the reading</li>
<li>Moon status at the time of the reading</li>
<li>Sun status at the time of the reading</li>
<li>Galactic position at the time of the reading</li>
<li>Mean $r^2$, a technical value used in calculating the estimated cloud cover; in general a higher $r^2$ suggests a more cloudy sky</li>
<li>Name of the SQM station that associated the data point</li>
<li>Image thumbnail (if images are attached to the data)</li>
</ul>
<p>Clicking on a data point, when in all readings mode, will show a larger version of the image taken at that time.  Clicking on a data point, when in best nightly readings mode, will take the user to that night's data; while hovering over a point in best nightly mode, an additional options menu option View image allows the user to see the full size image for that data point.  (On touch screen devices, clicking the thumbnail will bring up the larger image.)</p>
<h2>Selecting datasets</h2>
<p>Clicking on an SQM dataset in the legend will show or hide that dataset's readings.  SQMs which have names displayed with strikethrough have their data hidden from view.</p>
<h2>Swiping / arrow buttons</h2>
<p>If the user swipes right or left on a touch screen device (equivalently on a nontouch device, if the user clicks the left or right arrow buttons above the graph), the data displayed will shift one night (one month if viewing best nightly readings) forward or backward in time.</p>
<h2>Grid view</h2>
<p>The “grid” button in the top center brings up a grid of six nights graphs (alternatively, six months graphs when in best nightly mode) allowing for quick visual comparison.  Clicking on a graph takes the user to the full-size version of that graph.  Left and right arrow buttons (equivalently swiping on mobile) shifts the grid three nights (or three months).</p>
<h2>Licensing</h2>
<p>The SQM Visualizer software is licensed under the <a href="https://www.gnu.org/licenses/agpl-3.0.en.html#license-text">GNU Affero General Public License</a> version 3 (at your option any later version) and, as such, is free and open-source.</p>
<p>User Guide contributed by Alan Creutz.</p>		</div>
	</div>
</div>
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
</div><?php $info_and_readings_preload = true; if (file_exists("sqm.php")) { include("sqm.php"); } ?></body>
</html>