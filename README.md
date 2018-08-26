# MM_Participants

This is a custom Module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by [Michael Teeuw](https://github.com/MichMich)

## Goal of this Module

Goal is, to show the attendees of an calendar event with the Status.As a base I am usning the standard calendar fetcher from the original Magic Mirror.

For that the [iCal Parser](https://github.com/peterbraden/ical.js) used in that Module from [Peter Braden](https://github.com/peterbraden) is extended.

```javascript
// ...
      , 'SUMMARY' : storeParam('summary')
      , 'DESCRIPTION' : storeParam('description')
      , 'URL' : storeParam('url')
      , 'UID' : storeParam('uid')
      , 'LOCATION' : storeParam('location')
      , 'DTSTART' : dateParam('start')
      , 'DTEND' : dateParam('end')
      ,' CLASS' : storeParam('class')
      , 'TRANSP' : storeParam('transparency')
      , 'GEO' : geoParam('geo')
      , 'PERCENT-COMPLETE': storeParam('completion')
      , 'COMPLETED': dateParam('completed')
      , 'CATEGORIES': categoriesParam('categories')
      , 'FREEBUSY': freebusyParam('freebusy')
      , 'DTSTAMP': dateParam('dtstamp')
      , 'EXDATE': exdateParam('exdate')
      , 'CREATED': dateParam('created')
      , 'LAST-MODIFIED': dateParam('lastmodified')
      , 'RECURRENCE-ID': recurrenceParam('recurrenceid')
      , 'ATTENDEE': storeParam('attendee')      // Adding Attendees to Parsing iCal for further use in MM
```

ATTENDEES is just stored as parameter and will then be available for calendar fetcher.

## Module

is currently not working

Information flow is not jet ready to use.