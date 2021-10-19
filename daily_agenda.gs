/**
 * Lists 10 upcoming events in the user's calendar.
 */
function sendEmailWithTodaysEvents() {
  // Just for debugging
  var debug = false;

  // WHich calendar?
  var calendarId = 'primary';

  // From when, to when?
  var minTime = Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd\'T\'00:00:00.SSS\'Z\'');
  var maxTime = Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd\'T\'23:59:59.SSS\'Z\'');

  // Build args
  var optionalArgs = {
    timeMin: minTime,
    timeMax: maxTime,
    showDeleted: false,
    singleEvents: true,
    //maxResults: 10,
    orderBy: 'startTime'
  };
  if (debug) {
    
    Logger.log('%s', minTime);
    Logger.log('%s', maxTime);

  } else {
    var response = Calendar.Events.list(calendarId, optionalArgs);
    var events = response.items;
    var message = "## Todays meetings: \n\n";
    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var eventText = ""
        var eventAttendees = "";
        var event = events[i];
        
        // get the times
        var start = Utilities.formatDate(new Date(event.start.dateTime), 'GMT+1', 'HH:mm');
        var end = Utilities.formatDate(new Date(event.end.dateTime), 'GMT+1', 'HH:mm');
        if (!start) {
          start = event.start.date;
          end = "All day"
        }

        // Get teh attendees
        if (event.attendees) {
          for (p = 0; p < event.attendees.length; p++) {
            var emailaddress = event.attendees[p].email;
            var name = emailaddress.substring(0, emailaddress.lastIndexOf("@"))
            words = name.split(".");

            for (let q = 0; q < words.length; q++) {
              words[q] = words[q][0].toUpperCase() + words[q].substr(1);
            }
            name = words.join(" ");

            eventAttendees = eventAttendees + "\t- [["+ name  +"]]\n";
          }
        }
        

        
        eventText = "### "+ start +" - "+ end +" "+ event.summary +"\n"+
          "- Tags:\n"+
          "- Meeting Link: "+ event.hangoutLink +"\n"+
          "- Attendees:\n"+ eventAttendees +
          "- Agenda: \n"+ //event.description + commented out as it contains HTML :(
          "- Notes: \n\n";
        message = message + eventText;
        
      }
      //Logger.log('%s', message);
      // Email me the list
      
      MailApp.sendEmail(
        "mike.pearce@mytutor.co.uk", 
        "Todays Meetings Bruh", 
        message);
                
    } else {
      Logger.log('No upcoming events found.');
    }
  }

}
