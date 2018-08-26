/* global Module */

Module.register("MM_Participants", {
	
	defaults: {
		updateInterval: 6000,
		animationSpeed: 2000,
		retryDelay: 5000,
		maximumEntries: 10,
		url: "https://calendar.google.com/calendar/ical/jannikleimkuhl%40gmail.com/private-1d82eb9778251143dabac67722194bde/basic.ics",
		EventName: "Test"
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	getData: function (url, maximumEntries, EventName, updateInterval) {
		var self = this;
		var sendit = {
			 url: url
			,maximumEntries: maximumEntries
			,EventName: EventName
			,updateInterval: updateInterval
		};
		this.sendSocketNotification("ATTENDEES_GET_DATA", sendit);
		
	},

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData(this.config.url, this.config.maximumEntries, this.config.EventName, this.config.updateInterval);
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ATTENDEES_EVENTS") {
			this.calendarData = payload;
			this.loaded = true;
		};

		this.updateDom(this.config.animationSpeed);
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData(this.config.url, this.config.maximumEntries, this.config.EventName, this.config.updateInterval);
		}, nextLoad);
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		console.log(this.calendarData);

		for (e in this.calendarData) {
			event = this.calendarData[e];

			var wrapperTitle = document.createElement("div");
			wrapperTitle.innerHTML = event.title;
			wrapper.appendChild(wrapperTitle);

			var wrapperDate = document.createElement("td");
			wrapperDate.innerHTML = event.startDate;
			wrapper.appendChild(wrapperDate);

			for (a in event.Attendees){
				AtteneeObject = event.Attendees[a];
				name = AtteneeObject.Name;
				var wrapperName = document.createElement("div");
				wrapperName.innerHTML = name;
				wrapper.appendChild(wrapperName);
			};


		};
		
		return wrapper;
	},


	getStyles: function () {
		return [
			"Teilnehmer.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			de: "translations/de.json"
		};
	},

});
