/*	sqm_user_swipe.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	Listens for swipe actions on touch screen devices
	
	Callbacks can be registered with this object statically to be called when a swipe is detected
	Callback will be told which direction (up, down, right, left) the swipe was in
	Callback should return a boolean, true for if the event should not be propagated */

class SQMUserSwipe {
	static #listeners;
	
	static #threshold;
	
	// register a callback for when a swipe is detected
	static addListener(listener) {
		SQMUserSwipe.#listeners.push(listener);
	}
	
	// unregister a callback
	static removeListener(listener) {
		const index = SQMUserSwipe.#listeners.indexOf(listener);
		SQMUserSwipe.#listeners = SQMUserSwipe.#listeners.splice(index,1);
	}
	
	static initialize() {
		SQMUserSwipe.#threshold =
			Math.max(1,Math.floor(0.01 * (window.innerWidth || document.body.clientWidth)));
		SQMUserSwipe.#listeners = [];
		document.addEventListener('touchstart', SQMUserSwipe.handleTouchStart, false);        
		document.addEventListener('touchmove', SQMUserSwipe.handleTouchMove, false);
	}
	
	// position of the user tousching the screen
	static #touchPosition(event) {
		const firstTouch = event.touches[0];
		return { x: firstTouch.clientX, y: firstTouch.clientY };
	}
	
	static #down;
	
	// store the location where the potential swipe started
	static handleTouchStart(event) {
		SQMUserSwipe.#down = SQMUserSwipe.#touchPosition(event);
	}
	
	// touchmove event is fired when the user swipes on the screen
	static handleTouchMove(event) {
		if (!SQMUserSwipe.#down) {
			return;
		}
		const up = SQMUserSwipe.#touchPosition(event);
		const xDiff = SQMUserSwipe.#down.x - up.x;
		const yDiff = SQMUserSwipe.#down.y - up.y;
		const swipe = { start: SQMUserSwipe.#down, end: up };
		if (Math.abs(xDiff) > Math.abs(yDiff)) { // most significant
			if (xDiff > SQMUserSwipe.#threshold) {
				swipe.type = 'right';
			} else {
				swipe.type = 'left';
			}
		} else {
			if (xDiff > SQMUserSwipe.#threshold) {
				swipe.type = 'down';
			} else {
				swipe.type = 'up';
			}
		}
		SQMUserSwipe.#down = null;
		SQMUserSwipe.swipe(swipe,event);
	}
	
	static swipe(swipe,event) {
		SQMUserSwipe.#listeners.forEach((listener) => {
			if (listener(swipe)) {
				event.preventDefault();
			}
		});
	}
}