# SQM Visualizer

Open-source software for visualizing data collected by Unihedron Sky Quality Meters.

Works with files in the 'International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' format ['International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' format]('International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' format) and files in the format output by the Unihedron software feature 'sun-moon-mw-clouds'.

The software can be run as a web application or standalone (no server).

The server backend, included in the distribution files for the SQM Visualizer, is the [SQM Data Retriever](https://github.com/dcreutz/SQM_Data-Retriever).

The SQM Visualizer software is licensed under the GNU Affero General Public License version 3, or (at your option) any later version.  The sofware was designed and developed by Darren Creutz.

## Examples

[https://dcreutz.com/sqm/sqm_visualizer_examples/full_feature/index.php](Full feature set example)

[https://dcreutz.com/sqm/sqm_visualizer_examples/two_datasets_no_images/index.php](Multiple datasets)

[https://dcreutz.com/sqm/sqm_visualizer_examples/no_cacheing/index.php](No cacheing)

[https://dcreutz.com/sqm/sqm_visualizer_standalone/sqm_visualizer.html](Standalone version)


[)https://dcreutz.com/sqm/ ](https://dcreutz.com/sqm/

## Installation (Server version)

1. [Download the SQM Visualizer](full_dist/sqm_visualizer_server.tar.gz)

2. Extract the tar.gz file and place the contents in a directory on your web server.

3. Copy (or symlink) your SQM data files into the data directory.

4. [Recommended] Make the cache directory writeable by the web server user.  On shared hosting, this step usually isn't necessary; on a typical linux system, this means running chown to set the owner of the cache folder to www-data or www.

5. [Optional] If you have a camera taking images of the sky, copy (or symlink) the images in to the images directory.  The directory structure expected is iamges/YYYY-MM/YYYY-MM-DD/image-file-name, see the [configuration instructions](config.MD) for more information.

6. [Optional] If you have images and would like the backend to automatically create thumbnails, make the resized_images directory writeable by the web server user.

7. [Optional] Edit config.js to customize your installation.  See the [configuration instructions](config.MD) for more information.

8. [Optional] Edit config.php to customize your installation.  See the [configuration instructions](config.MD) for more information.

9. [Optional] If using a large dataset, particularly if regression analysis and images are involved, run the included command line script bin/update_cache_cli.php (see below).

10. [Optional] Create .info files in each data directory specifying information about the SQM.  The file should be named .info and have the structure
```
	Name: <name>
	Latitude: <latitude>
	Longitude: <longitude>
	Elevation: <elevation>
```

11. Navigate to http(s)://your-server/sqm-directory/index.php in your browser.  If cacheing is enabled, the first run make take some time to initially build the cache.

## Installation (Standalone version)

1. [Download the SQM Visualizer](full_dist/sqm_visualizer_standalone.tar.gz)

2. Extract the files.

3. Open sqm_visualizer.html in your browser.

4. When prompted, select the data files on your computer (multiple files can be selected simultaneously).

## Data directory structure

The backend can work with a single SQM's data or with that of multiple SQMs.  If using a single SQM, simply place the data files in the data directory.  If working with multiple SQMs, create a subdirectory inside the data directory for each SQM and place its data files in that directory.

If cacheing is not enabled, the backend relies on the data files to be named in such a way that indicates the month(s) of data they contain.  Therefore, they must be named in such a way as to include YYYY-MM or YYYYMM somewhere in their name for each month they have data for.

If cacheing is enabled, the file names can be anything.

## Included utilities

### clear_cache.php

Browser callable script to clear the cache.  Disabled by default, to enable it, edit the .php file and change $disable = true to $disable = false.  Ideally an unnecessary script but included since cache corruption can occur.

### bin/clear_cache_cli.php

Command line script to clear the cache manually.

### bin/update_cache_cli.php

Command line script to manually update the cache.  When working with large datasets, and most especially when resizing images, this script should be used prior to the first browser call to the backend.

Note that this script must be run as the same server user as the web server runs as or after running it, the cache must be manually set to be readable and writeable by the web user.

Optionally, a cron job can be configured to periodically update the cache.

## Data collection

The software works well in conjunction with [PySQM](https://github.com/mireianievas/PySQM) performing the actual data collection.  The simplest method of combining the two is to run PySQM creating monthly data files and simply replace the data directory in the visualizer folder on the webserver with a symlink to the location of the monthly data files.

## Thanks

Thanks to [chart.js](https://www.chartjs.org/), [chartjs-datefns-adapter](https://github.com/chartjs/chartjs-adapter-date-fns), [dateFns](https://date-fns.org/), [flatpickr](https://flatpickr.js.org/), [multiselect](https://github.com/miket-dev/multiselect), [papaparse](https://github.com/mholt/PapaParse), [suncalc](https://github.com/mourner/suncalc) and [suncalc-php](https://github.com/gregseth/suncalc-php).
Thanks to Bill Kowalik for sharing his regression analysis code which ours is loosely based on.