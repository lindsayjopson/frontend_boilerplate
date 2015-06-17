/**
 * Window Size Bookmarklet - refactored and modified by @patocallaghan
 *
 *
 * Based on Window Size Bookmarklet (unminified) 0.2.3 by @josscrowcroft
 * http://www.josscrowcroft.com/2011/code/window-size-bookmarklet/
 * 
 * No warranty - but FWIW, I'm pretty sure it won't break the internet.
 * 
 * No license - backlinks and improvement suggestions very welcome!
 */

//Needed to run outside of bookmarklet
 window.Terabytelet = { };
 window.Terabytelet.library = window.jQuery;
 
(function( global, document, $ ) {

	"use strict";

	var WindowSize = (function(){

		var doc;
		var container;
		var span;
		var containerStyle;
		var labelStyle;
		var inputStyle;
		var showEm;
		var defaultFontSize;

		var init = function () {

			doc = document;
			container = doc.createElement('div');
			container.id = 'window-size';
			span = doc.createElement('span');
			containerStyle = 'position:fixed;top:0;left:0;color:#fff;background:#222;padding:5px 1em;font:14px sans-serif;z-index:999999';
			inputStyle = 'margin: 1px;';
			labelStyle = 'display: inline-block;padding: 0 5px;color:#fff;';
			showEm = true;
			defaultFontSize = Number(getComputedStyle(document.documentElement,null).fontSize.replace(/[^\d]/g, ''));

			container.appendChild(span);

			//Create px and em radio buttons
			createRadioLabel ('px');
			createRadioInput ('measurement', !showEm);
			createRadioLabel ('em');
			createRadioInput ('measurement', showEm);
			
			// Append new div to body element:
			doc.body.appendChild( container );
			
			//set style for container
			addStyle(container, containerStyle);

			// Set div's content:
			setContent();

			// Bind window resize event:
			bindEvent(global, 'resize', setContent);
			bindEvent(global, 'keydown', processKeypress);
		};

		var reInit = function () {
			bindEvent(global, 'keydown', processKeypress);
			container.style.display = 'block';
		};

		/* Utility functions */
		var bindEvent = function (element, eventType, callback) {
			// Bind event:
			var onEvent = 'on' + eventType;
			if ( element.addEventListener )
				element.addEventListener(eventType, callback, false);
			else if ( element.attachEvent )
				element.attachEvent(onEvent, callback);
			else
				element[onEvent] = callback;
		};

		var unbindEvent = function (element, eventType, callback) {
			// Bind event:
			var onEvent = 'on' + eventType;
			if ( element.removeEventListener )
				element.removeEventListener(eventType, callback );
			else if ( element.detachEvent )
				element.detachEvent(onEvent, callback);
			else
				element[onEvent] = null;
		};

		var addStyle = function (element, style) {
			// Add style attribute to div:
			if( typeof element.style.cssText !== 'undefined' )
				element.style.cssText = style;
			else
				element.setAttribute('style', style);
		};

		var renderMeasurements = function (width, height) {
			return setValue(width) + ' x ' + setValue(height);
		};

		var setValue = function (value) {
			return showEm ? (value / defaultFontSize) : value;
		};

		var changeMeasurement = function () {
			showEm = !showEm;
			setContent();
		};

		var createRadioLabel = function (text) {

			var label = doc.createElement('label');
			label.for = text;

			// Set label's content:
			if ( global.innerWidth === undefined )
				// IE 6-8:
				label.innerText = text;
			else if ( doc.all )
				// Others:
				label.innerText = text;
			else
				// Firefox:
				label.textContent = text;


			addStyle(label,labelStyle);
			container.appendChild(label);
		};

		var createRadioInput = function (label, isSelected) {

			var input = doc.createElement('input');
			input.type = 'radio';
			input.name = label;
			addStyle(input,inputStyle);
			if(isSelected) {
				input.checked = true;
			}
			
			// Bind input change event:
			bindEvent(input, 'change', changeMeasurement);

			container.appendChild(input);
		};

		var setContent = function() {
			// Set div's content:
			if ( global.innerWidth === undefined )
				// IE 6-8:
				span.innerText = renderMeasurements(doc.documentElement.clientWidth, doc.documentElement.clientHeight);
			else if ( doc.all )
				// Others:
				span.innerText = renderMeasurements(global.innerWidth, global.innerHeight);
			else
				// Firefox:
				span.textContent = renderMeasurements(global.innerWidth, global.innerHeight);
		};

		var processKeypress = function (event) {
			
			if(event.keyCode === 27) {
				hideWindowSize();
			}
		};

		var hideWindowSize = function(){
			container.style.display = 'none';
			unbindEvent(container, 'keydown', processKeypress);
		};

		return {
			init : init,
			reInit : reInit
		};

	})();

	// expose our module to the global object
	global.Terabytelet.WindowSize = WindowSize;

})( window, window.document, window.Terabytelet.library );

Terabytelet.WindowSize.init();