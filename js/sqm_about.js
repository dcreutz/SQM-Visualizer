/*	sqm_about.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE */

/*	manages the popup shown when the user chooses About in the context menu
	if this option is enabled in config.js */

class SQMAbout {
	static #holder;
	static #isShowing;

	static initialize(divId) {
		SQMAbout.#holder = $(divId);
		document.body.addEventListener('mousedown', SQMAbout.#click);
		SQMAbout.#isShowing = false;
		$('closeabout').addEventListener('click', SQMAbout.hide);
	}
	
	static show() {
		if (!SQMAbout.#isShowing) {
			SQMAbout.#holder.style.display = "block";
			SQMAbout.#holder.style.opacity = 0.25;
			SQMAbout.#isShowing = true;
			setTimeout(() => {
				SQMAbout.#holder.style.opacity = 1;
			},20);
		}
	}
	
	static hide() {
		setTimeout(() => {
			SQMAbout.#holder.style.opacity = 0;
			setTimeout(() => {
				SQMAbout.#holder.style.display = "none";
				SQMAbout.#isShowing = false;
			},3*1000);
		},20);
	}
	
	static #click(event) {
		if (!SQMAbout.#holder.contains(event.target) && SQMAbout.#isShowing) {
			SQMAbout.hide();
		}
	}
}