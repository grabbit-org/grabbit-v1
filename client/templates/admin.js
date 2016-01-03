var IMAGE_KEY = 'adminAttachedImage';

Template.admin.onRendered(function () {
  // var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"));
  //if(Meteor.user()){
    setTimeout(function(){
      var autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete"));
    }, 300);
  //}
});

Template.admin.helpers({
  isAdmin: function() {
    return Meteor.user() && Meteor.user().admin;
  },
  
  latestNews: function() {
    return News.latest();
  },

  latestGrabbs: function(){
    return Grabbs.latest();
  }
});

Template.admin.events({
  'submit form': function(event) {
    event.preventDefault();

    var name = $(event.target).find('[name=name]').val();
    var excerpt = $(event.target).find('[name=excerpt]').val();
    var address = $(event.target).find('[name=location]').val();
    var grabb = { 
      'title': name,
      'highlighted': true,
      'excerpt': excerpt,
      'image': Session.get(IMAGE_KEY),
      'name': name.split('-')[0],
      'date': new Date 
    };
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': address}, function(result, status){
      if (status == google.maps.GeocoderStatus.OK) { //try and get the coordinates of the address input
        grabb.location = result[0].geometry.location
      }else{ // in case there was a problem just grab users location
        grabb.location = Geolocation.latLng();
      }

      Meteor.call('createGrabb', grabb, function(error){
        if (error) {
          alert(error.reason);
        } else {
          Template.appBody.addNotification({
            action: 'View',
            title: 'The Grabb was saved.',
            callback: function() {
              Router.go('recipe', { name: self.name }); //, { query: { activityId: result } });
              Template.recipe.setTab('feed');
            }
          });
        }
      });
    });
    
    // Meteor.call('createGrabb', grabb, function(){
    //   if (error) {
    //     alert(error.reason);
    //   } else {
    //     Template.appBody.addNotification({
    //       action: 'View',
    //       title: 'The Grabb was saved.',
    //       callback: function() {
    //         Router.go('recipe', { name: self.name }); //, { query: { activityId: result } });
    //         Template.recipe.setTab('feed');
    //       }
    //     });
    //   }
    // });

  },

  'click .js-attach-image': function(){
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
  
  'click .login.twitter': function() {
    Meteor.loginWithTwitter();
  },

  'click .login.facebook': function() {
    Meteor.loginWithFacebook({
      loginStyle: 'redirect',
      requestPermissions: ['email', 'public_profile', 'user_location', 'publish_actions']
    });
  },

  'click #logout': function(){
    Meteor.logout();
  }
});