# SQM Visualizer

[Visualizer](https://www.dcreutz.com/sqm/index.html) for darkness readings collected by Unihedron Sky Quality Meters.

Works with files in the 'International Dark Sky Association (IDA) NSBM Community Standards for Reporting Skyglow Observations' [format](https://darksky.org/app/uploads/bsk-pdf-manager/47_SKYGLOW_DEFINITIONS.PDF) and files in the format output by the Unihedron software feature 'sun-moon-mw-clouds'.

The software can be run as a web application or standalone (no server).

The SQM Visualizer software is free and open-source, provided as-is and licensed under the GNU Affero General Public License version 3, or (at your option) any later version.  The software was designed and developed by Darren Creutz.

While absolutely not mandatory, if you install the software on a public website and/or find it useful, the author would appreciate a quick email to [dcreutz@gmail.com](mailto:dcreutz@gmail.com?subject=SQMVisualizer) letting him know.

Thanks to Bill Kowalik for sharing his regression analysis and milky way code.

## Examples

[Full feature set](https://dcreutz.com/sqm/sqm_visualizer_examples/full_feature/index.php)

[Multiple datasets](https://dcreutz.com/sqm/sqm_visualizer_examples/two_datasets_no_images/index.php)

[No cacheing](https://dcreutz.com/sqm/sqm_visualizer_examples/no_cacheing/index.php)

[Standalone version](https://dcreutz.com/sqm/sqm_visualizer_standalone/sqm_visualizer.html)

## User guide

Many features are documented in the [user guide](UserGuide.md) contributed by Alan Creutz.

## Installation (Standalone)

1. [Download the standalone SQM Visualizer](https://github.com/dcreutz/SQM-Visualizer/releases/download/v0.2alpha/sqm_visualizer_standalone.zip) and extract the zip file.

2. Open sqm_visualizer.html in your browser (most likely this just means double click on the file, alternatively open a new tab/window in your browser and drag the file into it).

3. When prompted, select the data files on your computer (multiple files can be selected simultaneously).

4. [Optiona] Edit the sqm_visualizer.html file to customize the options.  See the [SQM Visualizer configuration instructions](config.md) for more information.

## Installation (Server)

The server version requires PHP version 8 or later.

1. [Download the server-side SQM Visualizer](https://github.com/dcreutz/SQM-Visualizer/releases/download/v0.2alpha/sqm_visualizer_server.tar.gz).

2. Extract the .tar.gz file and place the contents in a directory on your web server.

3. Copy (or symlink) your SQM data files into the data directory.

4. [Recommended] Make the cache directory writeable by the web server user.  On shared hosting, this is often automatic; on a typical linux server, use chown to set the owner of the cache directory to www or www-data.

5. [Optional] If you have a camera taking images of the sky, copy (or symlink) the images in to the images directory.  The directory structure expected is images/YYYY-MM/YYYY-MM-DD/image-file-name, see the [SQM Data Retriever configuration instructions](https://github.com/dcreutz/SQM-Data-Retriever/blob/main/config.md) for more information.

6. [Optional] If you have images and would like the backend to automatically create thumbnails, make the resized_images directory writeable by the web server user.

7. [Optional] Edit config.js to customize your installation.  See the [SQM Visualizer configuration instructions](config.md) for more information.

8. [Optional] Edit config.php to customize your installation.  See the [SQM Data Retriever configuration instructions](config.md) for more information.

9. [Optional] If using a large dataset, particularly if regression analysis and images are involved, run the included command line script bin/update_cache_cli.php (see below).

10. [Optional] Create .info files in each data directory specifying information about the SQM.  The file should be named .info and have the structure
```
	Name: My SQM Device
	Latitude: 30.1234
	Longitude: -110.6789
	Elevation: 100.2
	Timezone: America/Los_Angeles
```

11. Go to http(s)://your-server/sqm-directory/index.php in your browser.  If cacheing is enabled, the first run make take some time to initially build the cache.

## Data directory structure

The backend can work with a single SQM's data or with that of multiple SQMs.  If using a single SQM, simply place the data files in the data directory.  If working with multiple SQMs, create a subdirectory inside the data directory for each SQM and place its data files in that directory.

If cacheing is not enabled, the backend relies on the data files to be named in such a way that indicates the month(s) of data they contain.  Therefore, they must be named in such a way as to include YYYY-MM or YYYYMM somewhere in their name for each month they have data for.

If cacheing is enabled, the file names can be anything.

## Included utilities

### clear_cache.php

Browser callable script to clear the cache.  Disabled by default, to enable it, edit the .php file and change the line ```$disable = true;``` to ```$disable = false;```.  Ideally an unnecessary script but included since cache corruption can occur when server connectivity is interrupted.

### bin/clear_cache_cli.php

Command line script to clear the cache.  This script can only be run when in the directory containing sqm.php.

### bin/update_cache_cli.php

Command line script to update the cache.  This script can only be run when in the directory containing sqm.php.

When working with large datasets, and most especially when resizing images, this script should be used prior to the first browser call to the backend.

Note that this script must be run as the same server user as the web server runs as, or after running it, the cache (the cache directory and all files inside it) must be manually set to be writeable by the web user.

Optionally, a cron job can be configured to periodically update the cache using a cron.d file (or crontab entry) similar to

```*/5 * * * * www-data cd /var/www/html; ./bin/update_cache_cli.php```

If a cron job is configured, optionally edit config.php to prevent cacheing based on web requests

```$update_cache_cli_only = true;```

## Large numbers of SQMs

If you have data files for more than about five SQMs, you may wish to take advantage of the configuration option enabledSqms (see the [configuration instructions](config.md)) to only enable some of them and have a dropdown list allowing the user to select which subset are displayed in the chart.

## Server backend

The server backend, included in the distribution files for the SQM Visualizer, is the [SQM Data Retriever](https://github.com/dcreutz/SQM-Data-Retriever).  While developed exclusively to process data files for the SQM Visualizer, the SQM Data Retriever is a standalone server application with a full API and may be of use for other applications.

## Data collection

For SQM-LE devices, the [sqm_read](https://github.com/dcreutz/sqm_read) package is a minimal tool to generate data files.  The simplest way to combine the two is to symlink the monthly data files directory generated by sqm_read into the data folder for the visualizer backend.

The software works well in conjunction with [PySQM](https://github.com/mireianievas/PySQM) performing the actual data collection.  The simplest method of combining the two is to run PySQM creating monthly data files and symlink the directory containing the monthly data files to the data directory in the visualizer directory.

## Acknowledgements

Thanks to [chart.js](https://www.chartjs.org/), [chartjs-datefns-adapter](https://github.com/chartjs/chartjs-adapter-date-fns), [dateFns](https://date-fns.org/), [flatpickr](https://flatpickr.js.org/), [multiselect](https://github.com/miket-dev/multiselect), [papaparse](https://github.com/mholt/PapaParse), [suncalc](https://github.com/mourner/suncalc) and [suncalc-php](https://github.com/gregseth/suncalc-php).
Thanks to Bill Kowalik for sharing his regression analysis code which the SQM Data Retriever's regression algorithm is loosely based on.

## Licensing

The SQM Visualizer software is licensed under the [GNU Affero General Public License](https://www.gnu.org/licenses/agpl-3.0.en.html#license-text) version 3 (at your option any later version) and, as such, is free and open-source.

If you wish to incorporate it or its components (including the SQM Data Retriever) in a substantial way in software not sharing that or a similar license, a dual licensing scheme may be arranged at the discretion of the author of the code/owner of the copyright.