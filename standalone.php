<?php
/*	standalone.php
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

//	Creates the standalone.php file meant for distribution
?>
<?php include('php/head.php'); ?>

<!--
<?php include("build/LICENSES");
?>
-->
<style type="text/css">
<?php include("contrib/flatpickr/flatpickr.min.css"); ?>
</style>
<style>
<?php include('build/sqm_visualizer.min.css'); ?>
</style>
<script type="text/javascript">
const sqmConfig = { fetchUrl: false, loadInBackground: false, showLatitudeLongitude: true };
<?php include('build/sqm_visualizer_contrib.min.js'); ?>
</script>
<!-- standalone.php -->
<?php include('php/copyright.php'); ?>
<?php include('php/main.php'); ?>
<?php include('php/foot.php'); ?>
