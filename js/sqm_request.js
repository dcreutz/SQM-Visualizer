/*	sqm_request.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	handles making the actual data requests
	default behavior is to fetch data from the back end SQM Data Retriever
	if the background loader config option is enabled, the background loader will be asked
	for data before requesting it from the server (see sqm_load_in_background.js)
	likewise, preloaded requests set up by index.php are used if they exist */

class SQMRequest {
	// store results of any preloaded requests
	static #preloadedRequests = {};
	// the sqm_background_loader if it exists
	static #backgroundLoader;
	
	// send a nonblocking data request, using the background loader if applicable
	static send(request,allowBackground = true) {
		return SQMRequest.#send(request,allowBackground,false);
	}
	
	// send a blocking data request
	static sendBlocking(request) {
		return SQMRequest.#send(request,false,true);
	}
	
	static #send(request,allowBackground,blocking) {
		if (SQMRequest.#backgroundLoader && allowBackground) {
			const backgroundLoaded = SQMRequest.#backgroundLoader.handleRequest(request);
			// if the background loader exists and returns data
			if (backgroundLoaded) {
				if (sqmConfig.debug) {
					console.log("Background loaded request");
					console.log(request);
					console.log("Background loaded response");
					console.log(backgroundLoaded);
				}
				// return the background loaded data
				return new Promise((resolve,reject) => {
					resolve(backgroundLoaded);
				});
			}
		}
		// strip the sqm_ids from requests to check if they are preloaded
		const requestWithoutSqmIds = {};
		_.keys(request).forEach((key) => {
			if (key != 'sqm_ids') {
				requestWithoutSqmIds[key] = request[key];
			}
		});
		if (SQMRequest.#preloadedRequests[JSON.stringify(requestWithoutSqmIds)]) {
			// if the request was preloaded, use it
			const response = SQMRequest.#preloadedRequests[JSON.stringify(requestWithoutSqmIds)];
			// remove any sqms from the response that weren't requested
			_.keys(sqmManager.availableSqmInfos).forEach((sqmId) => {
				if (!request.sqm_ids.includes(sqmId)) {
					delete response[sqmId];
				}
			});
			if (sqmConfig.debug) {
				console.log("Preloaded Request");
				console.log(request);
				console.log("Preloaded Response");
				console.log(response);
			}
			// remove the preloaded request so that if it's requested again, it goes to the server
			delete SQMRequest.#preloadedRequests[JSON.stringify(requestWithoutSqmIds)];
			// return the preloaded response
			return new Promise((resolve,reject) => {
				resolve(response);
			});
		}
		if (!sqmConfig.fetchUrl) {
			// if the background loader and preloads didn't return a response and there is no
			// fetch url specified in config then all we can do is return an empty response
			return new Promise((resolve,reject) => {
				if (request.queries) {
					const response = {};
					_.keys(request.queries).forEach((query) => {
						response[query] = {};
						switch (request.queries[query].type) {
							case 'info':
								response[query].type = 'info';
								break;
							case 'readings_range':
								response[query].type = 'readings_range';
								break;
							case 'best_nightly_readings':
								response[query].type = 'best_nightly_readings';
								break;
							default:
								response[query].type = 'all_readings';
								break;
						}
					});
					resolve(response);
				} else {
					const response = {};
					switch (request.type) {
						case 'info':
							response.type = 'info';
							break;
						case 'readings_range':
							response.type = 'readings_range';
							break;
						case 'best_nightly_readings':
							response.type = 'best_nightly_readings';
							break;
						default:
							response.type = 'all_readings';
							break;
					}
					resolve(response);
				}
			});
		}
		if (sqmConfig.debug) {
			console.log("Request");
			console.log(request);
		}
		request.block = blocking;
		// send a POST request to the server back end asking for the data
		return fetch(sqmConfig.fetchUrl,
			{ 	method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ request: request }) }
		)
		.then((response)=>response.json()).then((object)=>{
			if (object['code'] == 'oldphp') {
				alert("PHP version 8 or later is required for the server backend");
				return {};
			}
			// then return the response once it's loaded
			if (sqmConfig.debug) {
				console.log("Response");
				console.log(object);
			}
			return object.response;
		});
	}
	
	// store a preloaded request (see preload.php)
	static preloadRequest(request,response) {
		SQMRequest.#preloadedRequests[JSON.stringify(request)] = response.response;
	}
	
	// set the background loader object
	static setBackgroundLoader(backgroundLoader) {
		SQMRequest.#backgroundLoader = backgroundLoader;
	}
}