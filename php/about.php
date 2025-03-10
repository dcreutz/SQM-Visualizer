<?php
/*	about.php
	SQM Visualizer
	(c) 2025 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */
?>
<?php include("contrib/parsedown/Parsedown.php"); ?>
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
<?php echo(Parsedown::instance()->text(file_get_contents("UserGuide.MD"))); ?>
		</div>
	</div>
</div>
