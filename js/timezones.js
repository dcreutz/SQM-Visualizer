/*	timezone.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	returns the timezone closest to the given coordinates */
function getNearestTimezone(latitude,longitude) {
	if (isNaN(latitude) || isNaN(longitude)) {
		return null;
	}
	var closest = null;
	var closestDistance = 360;
	timezones.forEach((tz) => {
		const theta = longitude - tz.long;
		const distance = Math.abs((180 / Math.PI) * Math.acos(
			(Math.sin(latitude * Math.PI / 180) * Math.sin(tz.lat * Math.PI / 180)) +
			(Math.cos(latitude * Math.PI / 180) * Math.cos(tz.lat * Math.PI / 180)
				* Math.cos(theta * Math.PI / 180))));
		if (distance < closestDistance) {
			closest = tz;
			closestDistance = distance;
		}
	});
	return closest;
}

// the following was generated using the php DateTimeZone class
/*
echo "const timezones = [";
foreach (DateTimeZone::listIdentifiers() as $tz_id) {
	$tz = new DateTimeZone($tz_id);
	echo "{id: '" . $tz->getName() . "'";
	echo ",name: '" . (new DateTime("now",$tz))->format("T") . "'";
	echo ",lat: " . $tz->getLocation()['latitude'];
	echo ",long: " . $tz->getLocation()['longitude'];
	echo "},";
}
echo "]";
*/
const timezones = [{id: 'Africa/Abidjan',name: 'GMT',lat: 5.31666,long: -4.03334},{id: 'Africa/Accra',name: 'GMT',lat: 5.55,long: -0.21666999999999},{id: 'Africa/Addis_Ababa',name: 'EAT',lat: 9.03333,long: 38.7},{id: 'Africa/Algiers',name: 'CET',lat: 36.78333,long: 3.05},{id: 'Africa/Asmara',name: 'EAT',lat: 15.33333,long: 38.88333},{id: 'Africa/Bamako',name: 'GMT',lat: 12.65,long: -8},{id: 'Africa/Bangui',name: 'WAT',lat: 4.36666,long: 18.58333},{id: 'Africa/Banjul',name: 'GMT',lat: 13.46666,long: -16.65},{id: 'Africa/Bissau',name: 'GMT',lat: 11.85,long: -15.58334},{id: 'Africa/Blantyre',name: 'CAT',lat: -15.78334,long: 35},{id: 'Africa/Brazzaville',name: 'WAT',lat: -4.26667,long: 15.28333},{id: 'Africa/Bujumbura',name: 'CAT',lat: -3.38334,long: 29.36666},{id: 'Africa/Cairo',name: 'EEST',lat: 30.05,long: 31.25},{id: 'Africa/Casablanca',name: '+01',lat: 33.65,long: -7.58334},{id: 'Africa/Ceuta',name: 'CEST',lat: 35.88333,long: -5.31667},{id: 'Africa/Conakry',name: 'GMT',lat: 9.51666,long: -13.71667},{id: 'Africa/Dakar',name: 'GMT',lat: 14.66666,long: -17.43334},{id: 'Africa/Dar_es_Salaam',name: 'EAT',lat: -6.8,long: 39.28333},{id: 'Africa/Djibouti',name: 'EAT',lat: 11.6,long: 43.15},{id: 'Africa/Douala',name: 'WAT',lat: 4.05,long: 9.7},{id: 'Africa/El_Aaiun',name: '+01',lat: 27.15,long: -13.2},{id: 'Africa/Freetown',name: 'GMT',lat: 8.5,long: -13.25},{id: 'Africa/Gaborone',name: 'CAT',lat: -24.65001,long: 25.91666},{id: 'Africa/Harare',name: 'CAT',lat: -17.83334,long: 31.05},{id: 'Africa/Johannesburg',name: 'SAST',lat: -26.25,long: 28},{id: 'Africa/Juba',name: 'CAT',lat: 4.85,long: 31.61666},{id: 'Africa/Kampala',name: 'EAT',lat: 0.31666,long: 32.41666},{id: 'Africa/Khartoum',name: 'CAT',lat: 15.6,long: 32.53333},{id: 'Africa/Kigali',name: 'CAT',lat: -1.95,long: 30.06666},{id: 'Africa/Kinshasa',name: 'WAT',lat: -4.3,long: 15.3},{id: 'Africa/Lagos',name: 'WAT',lat: 6.45,long: 3.4},{id: 'Africa/Libreville',name: 'WAT',lat: 0.38333,long: 9.45},{id: 'Africa/Lome',name: 'GMT',lat: 6.13333,long: 1.21666},{id: 'Africa/Luanda',name: 'WAT',lat: -8.8,long: 13.23333},{id: 'Africa/Lubumbashi',name: 'CAT',lat: -11.66667,long: 27.46666},{id: 'Africa/Lusaka',name: 'CAT',lat: -15.41667,long: 28.28333},{id: 'Africa/Malabo',name: 'WAT',lat: 3.75,long: 8.78333},{id: 'Africa/Maputo',name: 'CAT',lat: -25.96667,long: 32.58333},{id: 'Africa/Maseru',name: 'SAST',lat: -29.46667,long: 27.5},{id: 'Africa/Mbabane',name: 'SAST',lat: -26.3,long: 31.1},{id: 'Africa/Mogadishu',name: 'EAT',lat: 2.06666,long: 45.36666},{id: 'Africa/Monrovia',name: 'GMT',lat: 6.3,long: -10.78334},{id: 'Africa/Nairobi',name: 'EAT',lat: -1.28334,long: 36.81666},{id: 'Africa/Ndjamena',name: 'WAT',lat: 12.11666,long: 15.05},{id: 'Africa/Niamey',name: 'WAT',lat: 13.51666,long: 2.11666},{id: 'Africa/Nouakchott',name: 'GMT',lat: 18.1,long: -15.95},{id: 'Africa/Ouagadougou',name: 'GMT',lat: 12.36666,long: -1.51667},{id: 'Africa/Porto-Novo',name: 'WAT',lat: 6.48333,long: 2.61666},{id: 'Africa/Sao_Tome',name: 'GMT',lat: 0.33333,long: 6.73333},{id: 'Africa/Tripoli',name: 'EET',lat: 32.9,long: 13.18333},{id: 'Africa/Tunis',name: 'CET',lat: 36.8,long: 10.18333},{id: 'Africa/Windhoek',name: 'CAT',lat: -22.56667,long: 17.1},{id: 'America/Adak',name: 'HDT',lat: 51.88,long: -176.65806},{id: 'America/Anchorage',name: 'AKDT',lat: 61.21805,long: -149.90028},{id: 'America/Anguilla',name: 'AST',lat: 18.2,long: -63.06667},{id: 'America/Antigua',name: 'AST',lat: 17.05,long: -61.8},{id: 'America/Araguaina',name: '-03',lat: -7.2,long: -48.2},{id: 'America/Argentina/Buenos_Aires',name: '-03',lat: -34.6,long: -58.45},{id: 'America/Argentina/Catamarca',name: '-03',lat: -28.46667,long: -65.78334},{id: 'America/Argentina/Cordoba',name: '-03',lat: -31.4,long: -64.18334},{id: 'America/Argentina/Jujuy',name: '-03',lat: -24.18334,long: -65.3},{id: 'America/Argentina/La_Rioja',name: '-03',lat: -29.43334,long: -66.85},{id: 'America/Argentina/Mendoza',name: '-03',lat: -32.88334,long: -68.81667},{id: 'America/Argentina/Rio_Gallegos',name: '-03',lat: -51.63334,long: -69.21667},{id: 'America/Argentina/Salta',name: '-03',lat: -24.78334,long: -65.41667},{id: 'America/Argentina/San_Juan',name: '-03',lat: -31.53334,long: -68.51667},{id: 'America/Argentina/San_Luis',name: '-03',lat: -33.31667,long: -66.35},{id: 'America/Argentina/Tucuman',name: '-03',lat: -26.81667,long: -65.21667},{id: 'America/Argentina/Ushuaia',name: '-03',lat: -54.8,long: -68.3},{id: 'America/Aruba',name: 'AST',lat: 12.5,long: -69.96667},{id: 'America/Asuncion',name: '-04',lat: -25.26667,long: -57.66667},{id: 'America/Atikokan',name: 'EST',lat: 48.75861,long: -91.62167},{id: 'America/Bahia',name: '-03',lat: -12.98334,long: -38.51667},{id: 'America/Bahia_Banderas',name: 'CST',lat: 20.8,long: -105.25},{id: 'America/Barbados',name: 'AST',lat: 13.1,long: -59.61667},{id: 'America/Belem',name: '-03',lat: -1.45,long: -48.48334},{id: 'America/Belize',name: 'CST',lat: 17.5,long: -88.2},{id: 'America/Blanc-Sablon',name: 'AST',lat: 51.41666,long: -57.11667},{id: 'America/Boa_Vista',name: '-04',lat: 2.81666,long: -60.66667},{id: 'America/Bogota',name: '-05',lat: 4.6,long: -74.08334},{id: 'America/Boise',name: 'MDT',lat: 43.61361,long: -116.2025},{id: 'America/Cambridge_Bay',name: 'MDT',lat: 69.11388,long: -105.05278},{id: 'America/Campo_Grande',name: '-04',lat: -20.45,long: -54.61667},{id: 'America/Cancun',name: 'EST',lat: 21.08333,long: -86.76667},{id: 'America/Caracas',name: '-04',lat: 10.5,long: -66.93334},{id: 'America/Cayenne',name: '-03',lat: 4.93333,long: -52.33334},{id: 'America/Cayman',name: 'EST',lat: 19.3,long: -81.38334},{id: 'America/Chicago',name: 'CDT',lat: 41.85,long: -87.65},{id: 'America/Chihuahua',name: 'CST',lat: 28.63333,long: -106.08334},{id: 'America/Ciudad_Juarez',name: 'MDT',lat: 31.73333,long: -106.48334},{id: 'America/Costa_Rica',name: 'CST',lat: 9.93333,long: -84.08334},{id: 'America/Creston',name: 'MST',lat: 49.1,long: -116.51667},{id: 'America/Cuiaba',name: '-04',lat: -15.58334,long: -56.08334},{id: 'America/Curacao',name: 'AST',lat: 12.18333,long: -69},{id: 'America/Danmarkshavn',name: 'GMT',lat: 76.76666,long: -18.66667},{id: 'America/Dawson',name: 'MST',lat: 64.06666,long: -139.41667},{id: 'America/Dawson_Creek',name: 'MST',lat: 55.76666,long: -120.23334},{id: 'America/Denver',name: 'MDT',lat: 39.73916,long: -104.98417},{id: 'America/Detroit',name: 'EDT',lat: 42.33138,long: -83.04584},{id: 'America/Dominica',name: 'AST',lat: 15.3,long: -61.4},{id: 'America/Edmonton',name: 'MDT',lat: 53.55,long: -113.46667},{id: 'America/Eirunepe',name: '-05',lat: -6.66667,long: -69.86667},{id: 'America/El_Salvador',name: 'CST',lat: 13.7,long: -89.2},{id: 'America/Fort_Nelson',name: 'MST',lat: 58.8,long: -122.7},{id: 'America/Fortaleza',name: '-03',lat: -3.71667,long: -38.5},{id: 'America/Glace_Bay',name: 'ADT',lat: 46.19999,long: -59.95},{id: 'America/Goose_Bay',name: 'ADT',lat: 53.33333,long: -60.41667},{id: 'America/Grand_Turk',name: 'EDT',lat: 21.46666,long: -71.13334},{id: 'America/Grenada',name: 'AST',lat: 12.05,long: -61.75},{id: 'America/Guadeloupe',name: 'AST',lat: 16.23333,long: -61.53334},{id: 'America/Guatemala',name: 'CST',lat: 14.63333,long: -90.51667},{id: 'America/Guayaquil',name: '-05',lat: -2.16667,long: -79.83334},{id: 'America/Guyana',name: '-04',lat: 6.8,long: -58.16667},{id: 'America/Halifax',name: 'ADT',lat: 44.65,long: -63.6},{id: 'America/Havana',name: 'CDT',lat: 23.13333,long: -82.36667},{id: 'America/Hermosillo',name: 'MST',lat: 29.06666,long: -110.96667},{id: 'America/Indiana/Indianapolis',name: 'EDT',lat: 39.76833,long: -86.15806},{id: 'America/Indiana/Knox',name: 'CDT',lat: 41.29583,long: -86.625},{id: 'America/Indiana/Marengo',name: 'EDT',lat: 38.37555,long: -86.34473},{id: 'America/Indiana/Petersburg',name: 'EDT',lat: 38.49194,long: -87.27862},{id: 'America/Indiana/Tell_City',name: 'CDT',lat: 37.95305,long: -86.76139},{id: 'America/Indiana/Vevay',name: 'EDT',lat: 38.74777,long: -85.06723},{id: 'America/Indiana/Vincennes',name: 'EDT',lat: 38.67722,long: -87.52862},{id: 'America/Indiana/Winamac',name: 'EDT',lat: 41.05138,long: -86.60306},{id: 'America/Inuvik',name: 'MDT',lat: 68.34972,long: -133.71667},{id: 'America/Iqaluit',name: 'EDT',lat: 63.73333,long: -68.46667},{id: 'America/Jamaica',name: 'EST',lat: 17.96805,long: -76.79334},{id: 'America/Juneau',name: 'AKDT',lat: 58.30194,long: -134.41973},{id: 'America/Kentucky/Louisville',name: 'EDT',lat: 38.25416,long: -85.75945},{id: 'America/Kentucky/Monticello',name: 'EDT',lat: 36.82972,long: -84.84917},{id: 'America/Kralendijk',name: 'AST',lat: 12.15083,long: -68.27667},{id: 'America/La_Paz',name: '-04',lat: -16.5,long: -68.15},{id: 'America/Lima',name: '-05',lat: -12.05,long: -77.05},{id: 'America/Los_Angeles',name: 'PDT',lat: 34.05222,long: -118.24278},{id: 'America/Lower_Princes',name: 'AST',lat: 18.05138,long: -63.04723},{id: 'America/Maceio',name: '-03',lat: -9.66667,long: -35.71667},{id: 'America/Managua',name: 'CST',lat: 12.15,long: -86.28334},{id: 'America/Manaus',name: '-04',lat: -3.13334,long: -60.01667},{id: 'America/Marigot',name: 'AST',lat: 18.06666,long: -63.08334},{id: 'America/Martinique',name: 'AST',lat: 14.6,long: -61.08334},{id: 'America/Matamoros',name: 'CDT',lat: 25.83333,long: -97.5},{id: 'America/Mazatlan',name: 'MST',lat: 23.21666,long: -106.41667},{id: 'America/Menominee',name: 'CDT',lat: 45.10777,long: -87.61417},{id: 'America/Merida',name: 'CST',lat: 20.96666,long: -89.61667},{id: 'America/Metlakatla',name: 'AKDT',lat: 55.12694,long: -131.57639},{id: 'America/Mexico_City',name: 'CST',lat: 19.4,long: -99.15001},{id: 'America/Miquelon',name: '-02',lat: 47.05,long: -56.33334},{id: 'America/Moncton',name: 'ADT',lat: 46.1,long: -64.78334},{id: 'America/Monterrey',name: 'CST',lat: 25.66666,long: -100.31667},{id: 'America/Montevideo',name: '-03',lat: -34.90917,long: -56.2125},{id: 'America/Montserrat',name: 'AST',lat: 16.71666,long: -62.21667},{id: 'America/Nassau',name: 'EDT',lat: 25.08333,long: -77.35},{id: 'America/New_York',name: 'EDT',lat: 40.71416,long: -74.00639},{id: 'America/Nome',name: 'AKDT',lat: 64.50111,long: -165.40639},{id: 'America/Noronha',name: '-02',lat: -3.85,long: -32.41667},{id: 'America/North_Dakota/Beulah',name: 'CDT',lat: 47.26416,long: -101.77778},{id: 'America/North_Dakota/Center',name: 'CDT',lat: 47.11638,long: -101.29917},{id: 'America/North_Dakota/New_Salem',name: 'CDT',lat: 46.845,long: -101.41084},{id: 'America/Nuuk',name: '-01',lat: 64.18333,long: -51.73334},{id: 'America/Ojinaga',name: 'CDT',lat: 29.56666,long: -104.41667},{id: 'America/Panama',name: 'EST',lat: 8.96666,long: -79.53334},{id: 'America/Paramaribo',name: '-03',lat: 5.83333,long: -55.16667},{id: 'America/Phoenix',name: 'MST',lat: 33.44833,long: -112.07334},{id: 'America/Port-au-Prince',name: 'EDT',lat: 18.53333,long: -72.33334},{id: 'America/Port_of_Spain',name: 'AST',lat: 10.65,long: -61.51667},{id: 'America/Porto_Velho',name: '-04',lat: -8.76667,long: -63.9},{id: 'America/Puerto_Rico',name: 'AST',lat: 18.46833,long: -66.10612},{id: 'America/Punta_Arenas',name: '-03',lat: -53.15,long: -70.91667},{id: 'America/Rankin_Inlet',name: 'CDT',lat: 62.81666,long: -92.08306},{id: 'America/Recife',name: '-03',lat: -8.05,long: -34.9},{id: 'America/Regina',name: 'CST',lat: 50.4,long: -104.65001},{id: 'America/Resolute',name: 'CDT',lat: 74.69555,long: -94.82917},{id: 'America/Rio_Branco',name: '-05',lat: -9.96667,long: -67.8},{id: 'America/Santarem',name: '-03',lat: -2.43334,long: -54.86667},{id: 'America/Santiago',name: '-04',lat: -33.45,long: -70.66667},{id: 'America/Santo_Domingo',name: 'AST',lat: 18.46666,long: -69.9},{id: 'America/Sao_Paulo',name: '-03',lat: -23.53334,long: -46.61667},{id: 'America/Scoresbysund',name: '-01',lat: 70.48333,long: -21.96667},{id: 'America/Sitka',name: 'AKDT',lat: 57.17638,long: -135.30195},{id: 'America/St_Barthelemy',name: 'AST',lat: 17.88333,long: -62.85},{id: 'America/St_Johns',name: 'NDT',lat: 47.56666,long: -52.71667},{id: 'America/St_Kitts',name: 'AST',lat: 17.3,long: -62.71667},{id: 'America/St_Lucia',name: 'AST',lat: 14.01666,long: -61},{id: 'America/St_Thomas',name: 'AST',lat: 18.35,long: -64.93334},{id: 'America/St_Vincent',name: 'AST',lat: 13.15,long: -61.23334},{id: 'America/Swift_Current',name: 'CST',lat: 50.28333,long: -107.83334},{id: 'America/Tegucigalpa',name: 'CST',lat: 14.1,long: -87.21667},{id: 'America/Thule',name: 'ADT',lat: 76.56666,long: -68.78334},{id: 'America/Tijuana',name: 'PDT',lat: 32.53333,long: -117.01667},{id: 'America/Toronto',name: 'EDT',lat: 43.65,long: -79.38334},{id: 'America/Tortola',name: 'AST',lat: 18.45,long: -64.61667},{id: 'America/Vancouver',name: 'PDT',lat: 49.26666,long: -123.11667},{id: 'America/Whitehorse',name: 'MST',lat: 60.71666,long: -135.05001},{id: 'America/Winnipeg',name: 'CDT',lat: 49.88333,long: -97.15001},{id: 'America/Yakutat',name: 'AKDT',lat: 59.54694,long: -139.72723},{id: 'Antarctica/Casey',name: '+08',lat: -66.28334,long: 110.51666},{id: 'Antarctica/Davis',name: '+07',lat: -68.58334,long: 77.96666},{id: 'Antarctica/DumontDUrville',name: '+10',lat: -66.66667,long: 140.01666},{id: 'Antarctica/Macquarie',name: 'AEST',lat: -54.5,long: 158.95},{id: 'Antarctica/Mawson',name: '+05',lat: -67.6,long: 62.88333},{id: 'Antarctica/McMurdo',name: 'NZST',lat: -77.83334,long: 166.6},{id: 'Antarctica/Palmer',name: '-03',lat: -64.8,long: -64.1},{id: 'Antarctica/Rothera',name: '-03',lat: -67.56667,long: -68.13334},{id: 'Antarctica/Syowa',name: '+03',lat: -69.00612,long: 39.59},{id: 'Antarctica/Troll',name: '+02',lat: -72.01139,long: 2.535},{id: 'Antarctica/Vostok',name: '+05',lat: -78.40001,long: 106.89999},{id: 'Arctic/Longyearbyen',name: 'CEST',lat: 78,long: 16},{id: 'Asia/Aden',name: '+03',lat: 12.75,long: 45.2},{id: 'Asia/Almaty',name: '+05',lat: 43.25,long: 76.95},{id: 'Asia/Amman',name: '+03',lat: 31.95,long: 35.93333},{id: 'Asia/Anadyr',name: '+12',lat: 64.75,long: 177.48333},{id: 'Asia/Aqtau',name: '+05',lat: 44.51666,long: 50.26666},{id: 'Asia/Aqtobe',name: '+05',lat: 50.28333,long: 57.16666},{id: 'Asia/Ashgabat',name: '+05',lat: 37.95,long: 58.38333},{id: 'Asia/Atyrau',name: '+05',lat: 47.11666,long: 51.93333},{id: 'Asia/Baghdad',name: '+03',lat: 33.35,long: 44.41666},{id: 'Asia/Bahrain',name: '+03',lat: 26.38333,long: 50.58333},{id: 'Asia/Baku',name: '+04',lat: 40.38333,long: 49.85},{id: 'Asia/Bangkok',name: '+07',lat: 13.75,long: 100.51666},{id: 'Asia/Barnaul',name: '+07',lat: 53.36666,long: 83.75},{id: 'Asia/Beirut',name: 'EEST',lat: 33.88333,long: 35.5},{id: 'Asia/Bishkek',name: '+06',lat: 42.9,long: 74.6},{id: 'Asia/Brunei',name: '+08',lat: 4.93333,long: 114.91666},{id: 'Asia/Chita',name: '+09',lat: 52.05,long: 113.46666},{id: 'Asia/Choibalsan',name: '+08',lat: 48.06666,long: 114.5},{id: 'Asia/Colombo',name: '+0530',lat: 6.93333,long: 79.85},{id: 'Asia/Damascus',name: '+03',lat: 33.5,long: 36.3},{id: 'Asia/Dhaka',name: '+06',lat: 23.71666,long: 90.41666},{id: 'Asia/Dili',name: '+09',lat: -8.55,long: 125.58333},{id: 'Asia/Dubai',name: '+04',lat: 25.3,long: 55.3},{id: 'Asia/Dushanbe',name: '+05',lat: 38.58333,long: 68.8},{id: 'Asia/Famagusta',name: 'EEST',lat: 35.11666,long: 33.95},{id: 'Asia/Gaza',name: 'EEST',lat: 31.5,long: 34.46666},{id: 'Asia/Hebron',name: 'EEST',lat: 31.53333,long: 35.095},{id: 'Asia/Ho_Chi_Minh',name: '+07',lat: 10.75,long: 106.66666},{id: 'Asia/Hong_Kong',name: 'HKT',lat: 22.28333,long: 114.14999},{id: 'Asia/Hovd',name: '+07',lat: 48.01666,long: 91.64999},{id: 'Asia/Irkutsk',name: '+08',lat: 52.26666,long: 104.33333},{id: 'Asia/Jakarta',name: 'WIB',lat: -6.16667,long: 106.8},{id: 'Asia/Jayapura',name: 'WIT',lat: -2.53334,long: 140.7},{id: 'Asia/Jerusalem',name: 'IDT',lat: 31.78055,long: 35.22388},{id: 'Asia/Kabul',name: '+0430',lat: 34.51666,long: 69.2},{id: 'Asia/Kamchatka',name: '+12',lat: 53.01666,long: 158.65},{id: 'Asia/Karachi',name: 'PKT',lat: 24.86666,long: 67.05},{id: 'Asia/Kathmandu',name: '+0545',lat: 27.71666,long: 85.31666},{id: 'Asia/Khandyga',name: '+09',lat: 62.65638,long: 135.55388},{id: 'Asia/Kolkata',name: 'IST',lat: 22.53333,long: 88.36666},{id: 'Asia/Krasnoyarsk',name: '+07',lat: 56.01666,long: 92.83333},{id: 'Asia/Kuala_Lumpur',name: '+08',lat: 3.16666,long: 101.7},{id: 'Asia/Kuching',name: '+08',lat: 1.55,long: 110.33333},{id: 'Asia/Kuwait',name: '+03',lat: 29.33333,long: 47.98333},{id: 'Asia/Macau',name: 'CST',lat: 22.19722,long: 113.54166},{id: 'Asia/Magadan',name: '+11',lat: 59.56666,long: 150.8},{id: 'Asia/Makassar',name: 'WITA',lat: -5.11667,long: 119.39999},{id: 'Asia/Manila',name: 'PST',lat: 14.58333,long: 121},{id: 'Asia/Muscat',name: '+04',lat: 23.6,long: 58.58333},{id: 'Asia/Nicosia',name: 'EEST',lat: 35.16666,long: 33.36666},{id: 'Asia/Novokuznetsk',name: '+07',lat: 53.75,long: 87.11666},{id: 'Asia/Novosibirsk',name: '+07',lat: 55.03333,long: 82.91666},{id: 'Asia/Omsk',name: '+06',lat: 55,long: 73.4},{id: 'Asia/Oral',name: '+05',lat: 51.21666,long: 51.35},{id: 'Asia/Phnom_Penh',name: '+07',lat: 11.55,long: 104.91666},{id: 'Asia/Pontianak',name: 'WIB',lat: -0.033339999999995,long: 109.33333},{id: 'Asia/Pyongyang',name: 'KST',lat: 39.01666,long: 125.75},{id: 'Asia/Qatar',name: '+03',lat: 25.28333,long: 51.53333},{id: 'Asia/Qostanay',name: '+05',lat: 53.19999,long: 63.61666},{id: 'Asia/Qyzylorda',name: '+05',lat: 44.8,long: 65.46666},{id: 'Asia/Riyadh',name: '+03',lat: 24.63333,long: 46.71666},{id: 'Asia/Sakhalin',name: '+11',lat: 46.96666,long: 142.7},{id: 'Asia/Samarkand',name: '+05',lat: 39.66666,long: 66.8},{id: 'Asia/Seoul',name: 'KST',lat: 37.55,long: 126.96666},{id: 'Asia/Shanghai',name: 'CST',lat: 31.23333,long: 121.46666},{id: 'Asia/Singapore',name: '+08',lat: 1.28333,long: 103.85},{id: 'Asia/Srednekolymsk',name: '+11',lat: 67.46666,long: 153.71666},{id: 'Asia/Taipei',name: 'CST',lat: 25.05,long: 121.5},{id: 'Asia/Tashkent',name: '+05',lat: 41.33333,long: 69.3},{id: 'Asia/Tbilisi',name: '+04',lat: 41.71666,long: 44.81666},{id: 'Asia/Tehran',name: '+0330',lat: 35.66666,long: 51.43333},{id: 'Asia/Thimphu',name: '+06',lat: 27.46666,long: 89.64999},{id: 'Asia/Tokyo',name: 'JST',lat: 35.65444,long: 139.74472},{id: 'Asia/Tomsk',name: '+07',lat: 56.5,long: 84.96666},{id: 'Asia/Ulaanbaatar',name: '+08',lat: 47.91666,long: 106.88333},{id: 'Asia/Urumqi',name: '+06',lat: 43.8,long: 87.58333},{id: 'Asia/Ust-Nera',name: '+10',lat: 64.56027,long: 143.22666},{id: 'Asia/Vientiane',name: '+07',lat: 17.96666,long: 102.6},{id: 'Asia/Vladivostok',name: '+10',lat: 43.16666,long: 131.93333},{id: 'Asia/Yakutsk',name: '+09',lat: 62,long: 129.66666},{id: 'Asia/Yangon',name: '+0630',lat: 16.78333,long: 96.16666},{id: 'Asia/Yekaterinburg',name: '+05',lat: 56.85,long: 60.6},{id: 'Asia/Yerevan',name: '+04',lat: 40.18333,long: 44.5},{id: 'Atlantic/Azores',name: '+00',lat: 37.73333,long: -25.66667},{id: 'Atlantic/Bermuda',name: 'ADT',lat: 32.28333,long: -64.76667},{id: 'Atlantic/Canary',name: 'WEST',lat: 28.1,long: -15.4},{id: 'Atlantic/Cape_Verde',name: '-01',lat: 14.91666,long: -23.51667},{id: 'Atlantic/Faroe',name: 'WEST',lat: 62.01666,long: -6.76667},{id: 'Atlantic/Madeira',name: 'WEST',lat: 32.63333,long: -16.9},{id: 'Atlantic/Reykjavik',name: 'GMT',lat: 64.15,long: -21.85},{id: 'Atlantic/South_Georgia',name: '-02',lat: -54.26667,long: -36.53334},{id: 'Atlantic/St_Helena',name: 'GMT',lat: -15.91667,long: -5.7},{id: 'Atlantic/Stanley',name: '-03',lat: -51.70001,long: -57.85},{id: 'Australia/Adelaide',name: 'ACST',lat: -34.91667,long: 138.58333},{id: 'Australia/Brisbane',name: 'AEST',lat: -27.46667,long: 153.03333},{id: 'Australia/Broken_Hill',name: 'ACST',lat: -31.95,long: 141.45},{id: 'Australia/Darwin',name: 'ACST',lat: -12.46667,long: 130.83333},{id: 'Australia/Eucla',name: '+0845',lat: -31.71667,long: 128.86666},{id: 'Australia/Hobart',name: 'AEST',lat: -42.88334,long: 147.31666},{id: 'Australia/Lindeman',name: 'AEST',lat: -20.26667,long: 149},{id: 'Australia/Lord_Howe',name: '+1030',lat: -31.55,long: 159.08333},{id: 'Australia/Melbourne',name: 'AEST',lat: -37.81667,long: 144.96666},{id: 'Australia/Perth',name: 'AWST',lat: -31.95,long: 115.85},{id: 'Australia/Sydney',name: 'AEST',lat: -33.86667,long: 151.21666},{id: 'Europe/Amsterdam',name: 'CEST',lat: 52.36666,long: 4.9},{id: 'Europe/Andorra',name: 'CEST',lat: 42.5,long: 1.51666},{id: 'Europe/Astrakhan',name: '+04',lat: 46.35,long: 48.05},{id: 'Europe/Athens',name: 'EEST',lat: 37.96666,long: 23.71666},{id: 'Europe/Belgrade',name: 'CEST',lat: 44.83333,long: 20.5},{id: 'Europe/Berlin',name: 'CEST',lat: 52.5,long: 13.36666},{id: 'Europe/Bratislava',name: 'CEST',lat: 48.15,long: 17.11666},{id: 'Europe/Brussels',name: 'CEST',lat: 50.83333,long: 4.33333},{id: 'Europe/Bucharest',name: 'EEST',lat: 44.43333,long: 26.1},{id: 'Europe/Budapest',name: 'CEST',lat: 47.5,long: 19.08333},{id: 'Europe/Busingen',name: 'CEST',lat: 47.69999,long: 8.68333},{id: 'Europe/Chisinau',name: 'EEST',lat: 47,long: 28.83333},{id: 'Europe/Copenhagen',name: 'CEST',lat: 55.66666,long: 12.58333},{id: 'Europe/Dublin',name: 'IST',lat: 53.33333,long: -6.25},{id: 'Europe/Gibraltar',name: 'CEST',lat: 36.13333,long: -5.35},{id: 'Europe/Guernsey',name: 'BST',lat: 49.45472,long: -2.53612},{id: 'Europe/Helsinki',name: 'EEST',lat: 60.16666,long: 24.96666},{id: 'Europe/Isle_of_Man',name: 'BST',lat: 54.15,long: -4.46667},{id: 'Europe/Istanbul',name: '+03',lat: 41.01666,long: 28.96666},{id: 'Europe/Jersey',name: 'BST',lat: 49.18361,long: -2.10667},{id: 'Europe/Kaliningrad',name: 'EET',lat: 54.71666,long: 20.5},{id: 'Europe/Kirov',name: 'MSK',lat: 58.6,long: 49.65},{id: 'Europe/Kyiv',name: 'EEST',lat: 50.43333,long: 30.51666},{id: 'Europe/Lisbon',name: 'WEST',lat: 38.71666,long: -9.13334},{id: 'Europe/Ljubljana',name: 'CEST',lat: 46.05,long: 14.51666},{id: 'Europe/London',name: 'BST',lat: 51.50833,long: -0.12528},{id: 'Europe/Luxembourg',name: 'CEST',lat: 49.6,long: 6.15},{id: 'Europe/Madrid',name: 'CEST',lat: 40.4,long: -3.68334},{id: 'Europe/Malta',name: 'CEST',lat: 35.9,long: 14.51666},{id: 'Europe/Mariehamn',name: 'EEST',lat: 60.1,long: 19.95},{id: 'Europe/Minsk',name: '+03',lat: 53.9,long: 27.56666},{id: 'Europe/Monaco',name: 'CEST',lat: 43.69999,long: 7.38333},{id: 'Europe/Moscow',name: 'MSK',lat: 55.75583,long: 37.61777},{id: 'Europe/Oslo',name: 'CEST',lat: 59.91666,long: 10.75},{id: 'Europe/Paris',name: 'CEST',lat: 48.86666,long: 2.33333},{id: 'Europe/Podgorica',name: 'CEST',lat: 42.43333,long: 19.26666},{id: 'Europe/Prague',name: 'CEST',lat: 50.08333,long: 14.43333},{id: 'Europe/Riga',name: 'EEST',lat: 56.94999,long: 24.1},{id: 'Europe/Rome',name: 'CEST',lat: 41.9,long: 12.48333},{id: 'Europe/Samara',name: '+04',lat: 53.19999,long: 50.15},{id: 'Europe/San_Marino',name: 'CEST',lat: 43.91666,long: 12.46666},{id: 'Europe/Sarajevo',name: 'CEST',lat: 43.86666,long: 18.41666},{id: 'Europe/Saratov',name: '+04',lat: 51.56666,long: 46.03333},{id: 'Europe/Simferopol',name: 'MSK',lat: 44.94999,long: 34.1},{id: 'Europe/Skopje',name: 'CEST',lat: 41.98333,long: 21.43333},{id: 'Europe/Sofia',name: 'EEST',lat: 42.68333,long: 23.31666},{id: 'Europe/Stockholm',name: 'CEST',lat: 59.33333,long: 18.05},{id: 'Europe/Tallinn',name: 'EEST',lat: 59.41666,long: 24.75},{id: 'Europe/Tirane',name: 'CEST',lat: 41.33333,long: 19.83333},{id: 'Europe/Ulyanovsk',name: '+04',lat: 54.33333,long: 48.4},{id: 'Europe/Vaduz',name: 'CEST',lat: 47.15,long: 9.51666},{id: 'Europe/Vatican',name: 'CEST',lat: 41.90222,long: 12.45305},{id: 'Europe/Vienna',name: 'CEST',lat: 48.21666,long: 16.33333},{id: 'Europe/Vilnius',name: 'EEST',lat: 54.68333,long: 25.31666},{id: 'Europe/Volgograd',name: 'MSK',lat: 48.73333,long: 44.41666},{id: 'Europe/Warsaw',name: 'CEST',lat: 52.25,long: 21},{id: 'Europe/Zagreb',name: 'CEST',lat: 45.8,long: 15.96666},{id: 'Europe/Zurich',name: 'CEST',lat: 47.38333,long: 8.53333},{id: 'Indian/Antananarivo',name: 'EAT',lat: -18.91667,long: 47.51666},{id: 'Indian/Chagos',name: '+06',lat: -7.33334,long: 72.41666},{id: 'Indian/Christmas',name: '+07',lat: -10.41667,long: 105.71666},{id: 'Indian/Cocos',name: '+0630',lat: -12.16667,long: 96.91666},{id: 'Indian/Comoro',name: 'EAT',lat: -11.68334,long: 43.26666},{id: 'Indian/Kerguelen',name: '+05',lat: -49.35278,long: 70.2175},{id: 'Indian/Mahe',name: '+04',lat: -4.66667,long: 55.46666},{id: 'Indian/Maldives',name: '+05',lat: 4.16666,long: 73.5},{id: 'Indian/Mauritius',name: '+04',lat: -20.16667,long: 57.5},{id: 'Indian/Mayotte',name: 'EAT',lat: -12.78334,long: 45.23333},{id: 'Indian/Reunion',name: '+04',lat: -20.86667,long: 55.46666},{id: 'Pacific/Apia',name: '+13',lat: -13.83334,long: -171.73334},{id: 'Pacific/Auckland',name: 'NZST',lat: -36.86667,long: 174.76666},{id: 'Pacific/Bougainville',name: '+11',lat: -6.21667,long: 155.56666},{id: 'Pacific/Chatham',name: '+1245',lat: -43.95,long: -176.55001},{id: 'Pacific/Chuuk',name: '+10',lat: 7.41666,long: 151.78333},{id: 'Pacific/Easter',name: '-06',lat: -27.15,long: -109.43334},{id: 'Pacific/Efate',name: '+11',lat: -17.66667,long: 168.41666},{id: 'Pacific/Fakaofo',name: '+13',lat: -9.36667,long: -171.23334},{id: 'Pacific/Fiji',name: '+12',lat: -18.13334,long: 178.41666},{id: 'Pacific/Funafuti',name: '+12',lat: -8.51667,long: 179.21666},{id: 'Pacific/Galapagos',name: '-06',lat: -0.90000000000001,long: -89.6},{id: 'Pacific/Gambier',name: '-09',lat: -23.13334,long: -134.95},{id: 'Pacific/Guadalcanal',name: '+11',lat: -9.53334,long: 160.2},{id: 'Pacific/Guam',name: 'ChST',lat: 13.46666,long: 144.75},{id: 'Pacific/Honolulu',name: 'HST',lat: 21.30694,long: -157.85834},{id: 'Pacific/Kanton',name: '+13',lat: -2.78334,long: -171.71667},{id: 'Pacific/Kiritimati',name: '+14',lat: 1.86666,long: -157.33334},{id: 'Pacific/Kosrae',name: '+11',lat: 5.31666,long: 162.98333},{id: 'Pacific/Kwajalein',name: '+12',lat: 9.08333,long: 167.33333},{id: 'Pacific/Majuro',name: '+12',lat: 7.15,long: 171.2},{id: 'Pacific/Marquesas',name: '-0930',lat: -9,long: -139.5},{id: 'Pacific/Midway',name: 'SST',lat: 28.21666,long: -177.36667},{id: 'Pacific/Nauru',name: '+12',lat: -0.51667,long: 166.91666},{id: 'Pacific/Niue',name: '-11',lat: -19.01667,long: -169.91667},{id: 'Pacific/Norfolk',name: '+11',lat: -29.05,long: 167.96666},{id: 'Pacific/Noumea',name: '+11',lat: -22.26667,long: 166.45},{id: 'Pacific/Pago_Pago',name: 'SST',lat: -14.26667,long: -170.7},{id: 'Pacific/Palau',name: '+09',lat: 7.33333,long: 134.48333},{id: 'Pacific/Pitcairn',name: '-08',lat: -25.06667,long: -130.08334},{id: 'Pacific/Pohnpei',name: '+11',lat: 6.96666,long: 158.21666},{id: 'Pacific/Port_Moresby',name: '+10',lat: -9.5,long: 147.16666},{id: 'Pacific/Rarotonga',name: '-10',lat: -21.23334,long: -159.76667},{id: 'Pacific/Saipan',name: 'ChST',lat: 15.2,long: 145.75},{id: 'Pacific/Tahiti',name: '-10',lat: -17.53334,long: -149.56667},{id: 'Pacific/Tarawa',name: '+12',lat: 1.41666,long: 173},{id: 'Pacific/Tongatapu',name: '+13',lat: -21.13334,long: -175.2},{id: 'Pacific/Wake',name: '+12',lat: 19.28333,long: 166.61666},{id: 'Pacific/Wallis',name: '+12',lat: -13.3,long: -176.16667},{id: 'UTC',name: 'UTC',lat: -90,long: -180}]