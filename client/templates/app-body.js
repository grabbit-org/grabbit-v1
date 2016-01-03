var ANIMATION_DURATION = 300;
var NOTIFICATION_TIMEOUT = 3000;
var MENU_KEY = 'menuOpen';
var IGNORE_CONNECTION_ISSUE_KEY = 'ignoreConnectionIssue';
var CONNECTION_ISSUE_TIMEOUT = 5000;

var now = new Date();
var countTo = '2015-12-23'; // 25 * 24 * 60 * 60 * 1000 + now.valueOf();

Session.setDefault(IGNORE_CONNECTION_ISSUE_KEY, true);
Session.setDefault(MENU_KEY, false);

// XXX: this work around until IR properly supports this
//   IR refactor will include Location.back, which will ensure that initator is
//   set 
var nextInitiator = null, initiator = null;
Deps.autorun(function() {
  // add a dep
  Router.current();
  
  initiator = nextInitiator;
  nextInitiator = null;
});

var notifications = new Mongo.Collection(null);

Template.appBody.addNotification = function(notification) {
  var id = notifications.insert(notification);

  Meteor.setTimeout(function() {
    notifications.remove(id);
  }, NOTIFICATION_TIMEOUT);
};

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Only show the connection error box if it has been 5 seconds since
  // the app started
  setTimeout(function () {
    // Launch screen handle created in lib/router.js
    dataReadyHold.release();

    // Allow the connection error box to be shown if there is an issue
    Session.set(IGNORE_CONNECTION_ISSUE_KEY, false);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appBody.onRendered(function() {
  this.find("#content-container")._uihooks = {
    insertElement: function(node, next) {
      // short-circuit and just do it right away
      if (initiator === 'menu')
        return $(node).insertBefore(next);

      var start = (initiator === 'back') ? '-100%' : '100%';

      $.Velocity.hook(node, 'translateX', start);
      $(node)
      .insertBefore(next)
      .velocity({translateX: [0, start]}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false
      });
    },
    removeElement: function(node) {
      if (initiator === 'menu')
        return $(node).remove();

      var end = (initiator === 'back') ? '100%' : '-100%';

      $(node)
      .velocity({translateX: end}, {
        duration: ANIMATION_DURATION,
        easing: 'ease-in-out',
        queue: false,
        complete: function() {
          $(node).remove();
        }
      });
    }
  };

  this.find(".notifications")._uihooks = {
    insertElement: function(node, next) {
      $(node)
      .insertBefore(next)
      .velocity("slideDown", { 
        duration: ANIMATION_DURATION, 
        easing: [0.175, 0.885, 0.335, 1.05]
      });
    },
    removeElement: function(node) {
      $(node)
      .velocity("fadeOut", {
        duration: ANIMATION_DURATION,
        complete: function() {
          $(node).remove();
        }
      });
    }
  };

  /*Countdown initializer*/  
  $('.timer').countdown(countTo, function(event) {
    Session.set("days", event.offset.totalDays);
    Session.set("hours", event.offset.hours);
    Session.set("minutes", event.offset.minutes);
    Session.set("seconds",event.offset.seconds);
  });

  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "700",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
});


Template.appBody.helpers({
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  
  overlayOpen: function() {
    return Overlay.isOpen() ? 'overlay-open' : '';
  },
  
  connected: function() {
    return Session.get(IGNORE_CONNECTION_ISSUE_KEY) ||
      Meteor.status().connected;
  },
  
  notifications: function() {
    return notifications.find();
  },

  days: function(){ return Session.get("days"); },
  hours: function(){ return Session.get("hours"); },
  minutes: function(){ return Session.get("minutes"); },
  seconds: function(){ return Session.get("seconds"); }
});

Template.appBody.events({
  'click .js-menu': function(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .js-back': function(event) {
    nextInitiator = 'back';
    
    // XXX: set the back transition via Location.back() when IR 1.0 hits
    history.back();
    event.stopImmediatePropagation();
    event.preventDefault();
  },
  
  'click a.js-open': function(event) {
    // On Cordova, open links in the system browser rather than In-App
    if (Meteor.isCordova) {
      event.preventDefault();
      window.open(event.target.href, '_system');
    }
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click #menu a': function(event) {
    nextInitiator = 'menu'
    Session.set(MENU_KEY, false);
  },
  
  'click .js-notification-action': function() {
    if (_.isFunction(this.callback)) {
      this.callback();
      notifications.remove(this._id);
    }
  },

  'submit .form-inline': function (event) {
      // ...
      event.preventDefault();

      // send email to grabbit
      var email = $('[name=email]').val();
      var emailBody = 'Hello! Please add me to your mailing list. '+email;
      Meteor.call('sendEmail',
          'grabbitdeal@gmail.com',
          'postmaster@grabbitdeal.com',
          'Please add me to your mailing list',
          emailBody);


      var data = {name: "Stevo"};
      var html = Blaze.toHTMLWithData(Template.thankYouEmail, data);
      // send thank you email
      Meteor.call('sendEmail',
          email,
          'postmaster@grabbitdeal.com',
          'Thank you for joining the Grabbit network!',
          html, 
          function(){
            toastr.success("Thank you for joining the Grabbit network!");
          });

      $(event.target).trigger('reset');
    }
});

