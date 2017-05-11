

var APIKEY = "1a6b51627536533c102433e70573a39";

//My Groups
  $('.groupName').text('Loading . . .');
  $.ajax({ 
    type:"GET",
    url:"https://api.meetup.com/self/groups?&sign=true&key="+APIKEY+"", 
    success: function(data) { 
      var groupName = "";
      var url ="";
      var groupPhoto ="";
      $.each(data.data, function (i, item) {
          groupName += '<p>' + item.name + '</p>';
        });
      $('.groupName').html(groupName);
    },
      dataType: 'jsonp',
  });


//Upcoming Events
    $('.upcomingEvents').text('Loading . . .');
    $.ajax({ 
    type:"GET",
    url:"https://api.meetup.com/self/groups?&sign=true&key="+APIKEY+"&only=next_event&omit=next_event.utc_offset,id", 
    success: function(data) { 
      var upcomingEvents = "";
      $.each(data.data, function (i, next_event) {
        $.each(next_event, function (i, item) {
          var time= item.time; 
          var date = new Date(time).toDateString();
          upcomingEvents += '<div class="col-md-4 upcoming"><div class="text"><p class="name">' + item.name + 
          '</p><p class="date"><i class="fa fa-calendar"></i> '+ date +'</p><p class="RSVP"><i class="fa fa-ticket"></i>  RSVP: '
           + item.yes_rsvp_count +'</p></div><a href="/events/trackAttendance/'+item.id+'.'+item.name+
           '"><button class="btn btn-default upcoming">Track Event</button></a></div>';
        });
      });
      $('.upcomingEvents').html(upcomingEvents);
    },
      dataType: 'jsonp',
  });

var eventID = "237578896";

//Tracking Events for RSVP
    $('.memberID').text('Loading . . .');
    $('.memberName').text('Loading . . .');
    // $('.members').text('Loading . . .');
    $.ajax({ 
    type:"GET",
    url:"https://api.meetup.com/2/rsvps?&key="+APIKEY+"&sign=true&photo-host=public&rsvp=yes&order=social&event_id="
    +eventID+"&page=20&only=member", 
    success: function(data) { 
      var memberID = "";
      var memberName = "";
    //  var members ="";
      $.each(data.results, function (i, member) {
        $.each(member, function (i, item) {
          memberID += '<p>'+ item.member_id+'</p>';
          memberName += '<p>'+ item.name +'</p>';
         // members += memberID+memberName;
        });
      });
      $('.memberID').html(memberID);
      $('.memberName').html(memberName);
     //$('.members').html(members);
    },
      dataType: 'jsonp',
  });




//Past Events
/*$('.btnPast').click(function() {
    $('.textPast').text('loading . . .');
    $.ajax({ 
    type:"GET",
    url:"https://api.meetup.com/2/events?&sign=true&key="+"1a6b51627536533c102433e70573a39"+"&group_urlname=CorkSec&time=-2m,1m&status=past&page=20&only=name,yes_rsvp_count,headcount,time,id", //TEST API and Cork Sec
    success: function(data) { 
      var htmlString = "";
      $.each(data.results, function (i, item) {
        var time= item.time; 
        var date = new Date(time);//change milliseconds to date
        htmlString += '<h3>' + item.name + '</h3><li> Date:' + date +'</li><li> RSVP:' + item.yes_rsvp_count + '</li><li> Attended:'+item.headcount +'</li><li><a href="/users/attendanceReport/'+item.id+'.'+item.name+'"><button class="btn btn-default">More Details</button></a></li>';
      });
      $('.textPast').html(htmlString);
    },
      dataType: 'jsonp',
  });
});*/



