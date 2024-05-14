/*	sqm_image_popup.js
	SQM Visualizer
	(c) 2024 Darren Creutz
	Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE v3 */

/*	manages the popup of the display image due to a click on the time chart */

class SQMImagePopup {
	// array of DOM elements which show the image when clicked
	static #registered;
	
	static initialize() {
		SQMImagePopup.#registered = [];
		// if the image is showing and the user clicks outside it, hide the image
		$('imagepopup').addEventListener('click',(event) => {
			SQMImagePopup.hideImage();
		});
		$('imagebackground').addEventListener('click',(event) => {
			SQMImagePopup.hideImage();
		});
		// if the user clicks on the image, open the full image in a new tab and hide the popup
		$('theimage').addEventListener('click',(event) => {
			SQMImagePopup.inNewTab();
			SQMImagePopup.hideImage();
		});
	}
	
	// register a DOM element
	static register(div) {
		SQMImagePopup.#registered[div] = div.addEventListener('click',(event) => {
			SQMImagePopup.showImage();
		});
	}
	
	static unregister(div) {
		delete SQMImagePopup.#registered[div];
	}
	
	static #image;

	// set the image to show in the popup, called by SQMTimeChart
	static setImage(image,text,fullImage) {
		SQMImagePopup.#image = fullImage;
		$('theimage').src = image;
		$('theimagetext').innerHTML = text;
	}
	
	// show the actual image popup
	static showImage() {
		const body = document.body,html = document.documentElement;
		const height = Math.max(body.scrollHeight, body.offsetHeight, 
								html.clientHeight, html.scrollHeight, html.offsetHeight );
		$('imagepopup').style.height = height + "px";
		$('imagepopup').style.display = 'block';
	}
	
	// hide the popup
	static hideImage() {
		SQMImagePopup.#image = null;
		$('theimage').src = "";
		$('theimagetext').innerHTML = "";
		$('imagepopup').style.display = 'none';
	}
	
	// open the full image in a new tab/window
	static inNewTab() {
		const w = window.open();
		w.location = SQMImagePopup.#image;
	}
}