var TWEETING_KEY = 'shareOverlayTweeting';
var FACEBOOK_KEY = 'shareOverlayFacebook';
var IMAGE_KEY = 'shareOverlayAttachedImage';

Template.shareOverlay.onCreated(function() {
  Session.set(TWEETING_KEY, false);
  Session.set(FACEBOOK_KEY, true);
  Session.set(IMAGE_KEY, null);
});

Template.shareOverlay.helpers({
  attachedImage: function() {
    return Session.get(IMAGE_KEY);
  },
  
  avatar: function() {
    return (Meteor.user().services.twitter) ? Meteor.user().services.twitter.profile_image_url_https : Meteor.user().profile.picture;
  },
  
  tweeting: function() {
    return Session.get(TWEETING_KEY);
  },

  facebooking: function(){
    return Session.get(FACEBOOK_KEY);
  }
});

Template.shareOverlay.events({
  'click .js-attach-image': function() {
    MeteorCamera.getPicture({width: 320}, function(error, data) {
      if (error)
        alert(error.reason);
      else
        Session.set(IMAGE_KEY, data);
    });
  },
  
  'click .js-unattach-image': function() {
    Session.set(IMAGE_KEY, null);
  },
  
  'change [name=tweeting]': function(event) {
    Session.set(TWEETING_KEY, $(event.target).is(':checked'));
  },

  'change [name=facebooking]': function(event) {
    Session.set(FACEBOOK_KEY, $(event.target).is(':checked'));
  },
  
  'submit': function(event, template) {
    var self = this;

    event.preventDefault();
    
    var text = $(event.target).find('[name=text]').val();
    var postType = (Session.get(TWEETING_KEY)) ? {tweet: Session.get(TWEETING_KEY)} : {fbPost: Session.get(FACEBOOK_KEY)};
    
    Meteor.call('createActivity', {
      recipeName: self.name,
      text: text,
      image: Session.get(IMAGE_KEY)
    }, 
    postType, 
    Geolocation.currentLocation(), 
    function(error, result) {
      if (error) {
        alert(error.reason);
      } else {
        Template.appBody.addNotification({
          action: 'View',
          title: 'Your photo was shared.',
          callback: function() {
            Router.go('recipe', { name: self.name }, 
              { query: { activityId: result } });

            Template.recipe.setTab('feed');
          }
        });
      }
    });

    Overlay.close();
  }
});
