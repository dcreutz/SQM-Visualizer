<?php
/*	preload.php
	SQM Visualizer
	(c) 2024 Darren Creutz 2024
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */
	
/*	adds the code to index.php to enable preloading of sqm infos and readings ranges
	only effective if the backend distribution file sqm.php is in the same directory */
?><?php
echo '<?php $info_and_readings_preload = true; if (file_exists("sqm.php")) { include("sqm.php"); } ?>';
?>