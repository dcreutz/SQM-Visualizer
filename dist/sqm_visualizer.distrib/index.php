<!doctype html>
<html lang="en">
<head>
<title>SQM Visualizer</title>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" /><!-- index.php -->
<!-- SQM Visualizer -->
<!-- (c) 2024 Darren Creutz -->
<!-- Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE --><style type="text/css">
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
				Cloudiness
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
<div id="aboutpage">
	<div class="aboutcontainer">
		<div class="close" id="closeabout"></div>
		<h2 class="abouttitle">SQM Visualizer</h2>
		<h4>&copy; 2024 Darren Creutz</h4>
		<a class="abouthref" href="https://github.com/dcreutz/SQM-Visualizer" target="_blank">github.com/dcreutz/SQM-Visualizer</a>
	</div>
</div><div class="addfileinputcover" id="addfileinputcover">
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