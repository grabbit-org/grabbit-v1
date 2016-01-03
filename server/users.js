Accounts.onCreateUser(function(options, user) {
  	console.log(user);
	if (options.profile)
		user.profile = options.profile;

	if(user.services.facebook) // get facebook user profile picture
		user.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
		user.profile.facebook = user.services.facebook

	// If this is the first user going into the database, make them an admin
	if (Meteor.users.find().count() === 0)
		user.admin = true;

  	return user;
});