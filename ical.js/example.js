var ical = require('./node-ical')
  , months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


ical.fromURL('https://calendar.google.com/calendar/ical/jannikleimkuhl%40gmail.com/private-1d82eb9778251143dabac67722194bde/basic.ics', {}, function(err, data){
  for (var k in data){
    if (data.hasOwnProperty(k)){
      var ev = data[k];
      console.log("Conference", ev.summary);
      console.log("3:  ", ev.attendee, "\n");
    }
  }
})
