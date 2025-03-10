/*	sqm_user_guide.js
	SQM Visualizer
	(c) 2025 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the popup shown when the user chooses User Guide in the context menu
	if this option is enabled in config.js */

class SQMUserGuide {
	static #holder;
	static #isShowing;

	static initialize(divId) {
		SQMUserGuide.#holder = $(divId);
		document.body.addEventListener('mousedown', SQMUserGuide.#click);
		SQMUserGuide.#isShowing = false;
		$('closeuserguide').addEventListener('click', SQMUserGuide.hide);
	}
	
	static show() {
		if (!SQMUserGuide.#isShowing) {
			SQMUserGuide.#holder.style.display = "block";
			SQMUserGuide.#holder.style.opacity = 0.25;
			SQMUserGuide.#isShowing = true;
			setTimeout(() => {
				SQMUserGuide.#holder.style.opacity = 1;
			},20);
		}
	}
	
	static hide() {
		setTimeout(() => {			
			SQMUserGuide.#holder.style.opacity = 0;
			setTimeout(() => {
				SQMUserGuide.#holder.style.display = "none";
				SQMUserGuide.#isShowing = false;
			},3*1000);
		},20);
	}
	
	static #click(event) {
		if (!SQMUserGuide.#holder.contains(event.target) && SQMUserGuide.#isShowing) {
			SQMUserGuide.hide();
		}
	}
}