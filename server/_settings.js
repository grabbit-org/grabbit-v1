// Provide defaults for Meteor.settings
//
// To configure your own Twitter keys, see:
//   https://github.com/meteor/meteor/wiki/Configuring-Twitter-in-Local-Market
if (typeof Meteor.settings === 'undefined')
  Meteor.settings = {};

_.defaults(Meteor.settings, {
  twitter: {
    consumerKey: "EifhxKFPYB3ZPTgQbF2IYvgTm", 
    secret: "imjBHEsKeT8iKtV25qzgtC4KsK2wfWdaImfJoRybVJozuU8oMA"
  },
  facebook: {
    appId: "864665146935682",//"864689203599943",
    secret: "39c02295ac113cce645a212630f11c4c"//"857d73acdd2fcd54869af7eeeea67052"
  }
});

ServiceConfiguration.configurations.upsert(
  { service: "twitter" },
  {
    $set: {
      consumerKey: Meteor.settings.twitter.consumerKey,
      secret: Meteor.settings.twitter.secret
    }
  }
);

ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: Meteor.settings.facebook.appId,
      secret: Meteor.settings.facebook.secret
    }
  }
);

