<?php
/*	index_with_minifaction.php
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

//	Creates the index.php file meant for deployment
?>
<?php include('php/head.php'); ?>
<!-- index.php -->
<?php include('php/copyright.php'); ?>
<style type="text/css">
<?php include("contrib/flatpickr/flatpickr.min.css"); ?>
</style>
<link href="sqm_visualizer.css" media="all" rel="stylesheet" type="text/css" />
<script src="sqm_visualizer.js" type="text/javascript"></script>
<script src="config.js" type="text/javascript" onerror=""></script>
<?php include('php/main.php'); ?>
<?php include('php/preload.php'); ?>
<?php include('php/foot.php'); ?>
