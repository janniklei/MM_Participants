
var ical = require('./ical.js/index.js');
var moment = require("moment");
var rrule = require("rrule-alt").RRule;
// var maximumEntries = 10;
// var url = 'https://calendar.google.com/calendar/ical/jannikleimkuhl%40gmail.com/private-1d82eb9778251143dabac67722194bde/basic.ics';
// var EventName = 'Test';

var EventsAttendeesFetcher = function(url, maximumEntries, EventName) {
	var self = this;

	ParseStatus = function(Status) {
		if (Status === "ACCEPTED"){return "Zugesagt";
		} else if (Status === "DECLINED"){return "Abgelehnt";
		} else if (Status === "TENTATIVE"){return "Mit Vorbehalt";
		} else if (Status === "NEEDS-ACTION") {return "Antwort ausstehend"
		} else {return Status;};
	};
	
	isFullDayEvent = function(event) {
		if (event.start.length === 8) {
			return true;
		}
		var start = event.start || 0;
		var startDate = new Date(start);
		var end = event.end || 0;
	
		if (end - start === 24 * 60 * 60 * 1000 && startDate.getHours() === 0 && startDate.getMinutes() === 0) {
			// Is 24 hours, and starts on the middle of the night.
			return true;
		}
	
		return false;
	};
	
	timeFilterApplies = function(now, endDate, filter) {
		if (filter) {
			var until = filter.split(" "),
				value = parseInt(until[0]),
				increment = until[1].slice("-1") === "s" ? until[1] : until[1] + "s", // Massage the data for moment js
				filterUntil = moment(endDate.format()).subtract(value, increment);
	
			return now < filterUntil.format("x");
		}
	
		return false;
	};

	ical.fromURL(url, {}, function(err, data){

	  		var newEvents = [],
			 	newAttendees = [],
				events = [];

			var limitFunction = function(date, i) {return i < maximumEntries;};
			var eventDate = function(event, time) {
				return (event[time].length === 8) ? moment(event[time], "YYYYMMDD") : moment(new Date(event[time]));
			};
			var eventTime = function(event, time) {
				return (event[time].length === 8) ? moment(event[time], "YYYYMMDD") : moment(new Date(event[time]));
			};		
			// console.log(data);

			for (var e in data) {
									
				var event = data[e];
				var now = new Date();
				var today = moment().startOf("day").toDate();
				var tomorrow = moment().startOf("day").add(2, "days").subtract(1,"seconds").toDate();
				var future = moment().startOf("day").add(5, "days").subtract(1,"seconds").toDate(); // Subtract 1 second so that events that start on the middle of the night will not repeat.

				if (event.type === "VEVENT") {
					var title = "Event";

					if (event.summary) {
						title = (typeof event.summary.val !== "undefined") ? event.summary.val : event.summary;
					} else if(event.description) {
						title = event.description;
					}

					if (title == EventName){
						var dateFilter = null;
						var location = event.location || false;
						var geo = event.geo || false;
						var description = event.description || false;
						console.log("Test Event Pass")

						var Huhu = true;

						if (typeof event.rrule != "undefined" && Huhu) {
							var rule = event.rrule;
							var dates = rule.between(today, future, true, limitFunction);

							for (r in event.recurrences) {
								newevent = event.recurrences[r];

								var startDate = eventDate(newevent, "start");
								var endDate;
								if (typeof event.end !== "undefined") {
									endDate = eventDate(newevent, "end");
								};

								// calculate the duration f the event for use with recurring events.
								var duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));
								if (newevent.start.length === 8) {
									startDate = startDate.startOf("day");
								};

								for (var a in newevent.attendee) {
									attending = newevent.attendee[a]
									var AttendeeName = attending.params.CN;
									var AttendeeStatus = attending.params.PARTSTAT;

									newAttendees.push({
											Name: AttendeeName,
											Status: ParseStatus(AttendeeStatus)
										});
								};

								if (endDate.format("x") > now) {
									newEvents.push({
										title: title,
										startDateNum: startDate.format("x"),
										endDateNum: endDate.format("x"),
										startDate: startDate.format("DD.MM.YYYY"),
										endDate: endDate.format("DD.MM.YYYY"),
										fullDayEvent: isFullDayEvent(event),
										class: event.class,
										firstYear: event.start.getFullYear(),
										location: location,
										geo: geo,
										description: description,
										Attendees: newAttendees,
										TestFlag: "Recurrent Event"
									});
								newAttendees =[];
								}

							}
						} 

						if (newEvents.length === 0){
							// console.log("Single event ...");
							// Single event.
							var fullDayEvent = isFullDayEvent(event);
							// console.log(fullDayEvent);
							if (!fullDayEvent && endDate < new Date()) {
								// console.log("It's not a fullday event, and it is in the past. So skip: " + title);
								continue;
							}
							if (fullDayEvent && endDate <= today) {
								// console.log("It's a fullday event, and it is before today. So skip: " + title);
								continue;
							}

							if (startDate > future) {
								// console.log("It exceeds the maximumNumberOfDays limit. So skip: " + title);
								continue;
							}

							if (timeFilterApplies(now, endDate, dateFilter)) {
								continue;
							}

							// Every thing is good. Add it to the list.
							for (var a in event.attendee) {
								attending = event.attendee[a]
								var AttendeeName = attending.params.CN;
								var AttendeeStatus = attending.params.PARTSTAT;
								newAttendees.push({
										Name: AttendeeName,
										Status: ParseStatus(AttendeeStatus)
								});
							};

							var startDate = eventDate(event, "start");
							var endDate;
							if (typeof event.end !== "undefined") {
								endDate = eventDate(event, "end");
							};

							// calculate the duration f the event for use with recurring events.
							var duration = parseInt(endDate.format("x")) - parseInt(startDate.format("x"));

							if (event.start.length === 8) {
								startDate = startDate.startOf("day");
							};

							newEvents.push({
								title: title,
								startDateNum: startDate.format("x"),
								endDateNum: endDate.format("x"),
								startDate: startDate.format("DD.MM.YYYY"),
								endDate: endDate.format("DD.MM.YYYY"),
								fullDayEvent: fullDayEvent,
								class: event.class,
								location: location,
								geo: geo,
								description: description,
								Attendees: newAttendees,
								TestFlag: "Initial Event"
							});
							newAttendees =[];
						};
						newAttendees =[];
					};
				};
			};

			newEvents.sort(function(a, b) {
				return a.startDate - b.startDate;
			});

			for (e in newEvents){
				testevent = newEvents[e];
				teststart = testevent.startDate
				console.log(teststart, testevent.TestFlag)
				for (a in newEvents[e].Attendees){
					console.log(newEvents[e].Attendees[a].Name, newEvents[e].Attendees[a].Status);
				};
			};

			events = newEvents.slice(0, maximumEntries);
			return events;
	});
};

module.exports = EventsAttendeesFetcher;