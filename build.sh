#!/usr/bin/env bash

#	build.sh
#	SQM Visualizer
#	(c) 2024 Darren Creutz
#	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE

#	this script builds the distribution files

rm -fr dist
rm -fr build
mkdir -p build

#	copy all js files into our js.min file and minifiy them
cd js
for file in *; do
	jsmin < "$file" >> ../build/sqm_visualizer.min.js
done
cd ..

#	copy the js from other projects into our js.min file
cd contrib
cat chartjs/chart.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat chartjs-datefns-adapter/chartjs-adapter-date-dns.bundle.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat datefns/date_fns.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat flatpickr/flatpickr.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat papaparse/papaparse.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat multiselect/multiselect.min.js >> ../build/contrib.min.js
echo "" >> ../build/sqm_visualizer.min.js
cat suncalc/suncalc.min.js >> ../build/contrib.min.js
cd ..

#	copy the combined contrib code into our js file
cat build/contrib.min.js >> build/sqm_visualizer_contrib.min.js
#	add our copyright
echo "" >> build/sqm_visualizer_contrib.min.js
cat copyright.js >> build/sqm_visualizer_contrib.min.js
echo "" >> build/sqm_visualizer_contrib.min.js
#	and our code
cat build/sqm_visualizer.min.js >> build/sqm_visualizer_contrib.min.js

#	copy the css from other projects into our css.min file
cat contrib/multiselect/multiselect.css >> build/sqm_visualizer.css
echo "" >> build/sqm_visualizer.css
#	copy our css into our css.min file
cat sqm_visualizer.css >> build/sqm_visualizer.css
#	minify
cssmin build/sqm_visualizer.css > build/sqm_visualizer.min.css

#	build the actual php files intended to be deployed
php index_with_minification.php > build/index_with_minification.php

# copy our license into a combined license file
rm -f build/LICENSES
echo "SQM Visualizer" >> build/LICENSES
echo "(c) 2024 Darren Creutz" >> build/LICENSES
echo "---" >> build/LICENSES
cat LICENSE >> build/LICENSES
echo "" >> build/LICENSES
echo "" >> build/LICENSES
echo "" >> build/LICENSES

#	copy licenses for contributing projects into a combined license file
cd contrib
for dir in *; do
	echo "$dir" >> ../build/LICENSES
	echo "---" >> ../build/LICENSES
	echo "Source: " >> ../build/LICENSES
	cat $dir/SOURCE >> ../build/LICENSES
	echo "" >> ../build/LICENSES
	echo "License: " >> ../build/LICENSES
	cat $dir/LICENSE >> ../build/LICENSES
	echo "" >> ../build/LICENSES
	echo "" >> ../build/LICENSES
	echo "" >> ../build/LICENSES
done
cd ..

#	create the single page/standalone php file for distribution
php standalone.php > build/standalone.html
mkdir -p dist
cp build/standalone.html dist/sqm_visualizer.html

#	create the index.php and js and css files for deployment
mkdir -p dist/sqm_visualizer.distrib
cp build/index_with_minification.php dist/sqm_visualizer.distrib/index.php
cp build/sqm_visualizer.min.css dist/sqm_visualizer.distrib/sqm_visualizer.css
cp build/sqm_visualizer_contrib.min.js dist/sqm_visualizer.distrib/sqm_visualizer.js
cp config.js dist/sqm_visualizer.distrib/config.js
cp build/LICENSES dist/sqm_visualizer.distrib/LICENSES

rm -fr build
