/* Magic Mirror
*/

var NodeHelper = require("node_helper");
var EventsAttendeesFetcher = require("./EventsAttendeesFetcher.js");

module.exports = NodeHelper.create({

	start: function() {
		var events = [];

		console.log("Starting node helper for: " + this.name);
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		var eventsData;
		if (notification === "ATTENDEES_GET_DATA") {
			// console.log("Working notification system. Notification:", notification, "payload: ", payload);
			// console.log("fetch new data from url: " + payload.url + " - Interval: " + payload.updateInterval);
			console.log("starting fetch...")
			eventsData = EventsAttendeesFetcher(payload.url, payload.maximumEntries, payload.EventName);
			console.log("fetched")

			console.log(eventsData);
		}
	},

});
