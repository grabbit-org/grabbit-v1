GrabbsData = {
  "30-percent-lucky": {
    "title": "30%-50% Off at Lucky",
    "highlighted": true,
    "excerpt": "Save 30%-50% Off at Lucky on all awesome stuff.",
    "source": {
      "name": "Jane Doe"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "30-percent-lucky"
  },
  "50-off-shoes": {
    "title": "50% Off All Shoes",
    "excerpt": "50% Off All Shoes at this awesome store",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "50-off-shoes"
  },
  "80-off-nyc-and-co": {
    "title": "80% off at NY&CO",
    "excerpt": "You can not miss this amazing deal! 80% off on everything @ NY&CO!",
    "source": {
      "name": "Grabbit Staff"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "80-off-nyc-and-co"
  },
  "70-off-redzone": {
    "title": "70% off - Red Zone",
    "excerpt": "Grab 70% off on everything in the Red Zone",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "70-off-redzone"
  },
  "30-off-sweaters": {
    "title": "30% off sweaters",
    "excerpt": "Awesome deal! 30% off on sweaters at this awesome store!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "30-off-sweaters"
  },
  "30-off-nineWest": {
    "title": "30% Off purses!",
    "highlighted": true,
    "excerpt": "30% off on all Nine West purses and bags!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "30-off-nineWest"
  },
  "50-off-lockerRoom": {
    "title": "BoGo 50% Off",
    "excerpt": "Buy One Get One 50% off at Locker Room!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "50-off-lockerRoom"
  },
  "lucky-brand": {
    "title": "Lucky Brand deals!",
    "excerpt": "The best Lucky Brand deal around!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "lucky-brand"
  },
  "40-off-loft": {
    "title": "40% Off at Loft",
    "highlighted": true,
    "excerpt": "Save 40% on everything at Loft Perimeter",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "40-off-loft"
  },
  "50-off-rue21": {
    "title": "50% Off at Rue21",
    "highlighted": true,
    "excerpt": "Grabb this deal 40% Off at Rue21",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "50-off-rue21"
  },
  "75-off-theLimited": {
    "title": "75% Off The Limited",
    "excerpt": "75% Off at the Limited, grabb it now!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "75-off-theLimited"
  },
  "agacci": {
    "title": "Great deals at Agaci",
    "excerpt": "Grabb these great deals at Agaci",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "agacci"
  },
  "40-off-wetseal": {
    "title": "40% Off WetSeal",
    "excerpt": "40% Off Entire Store at WetSeal",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "40-off-wetseal"
  },
  "aldo": {
    "title": "Great deals at Aldo",
    "excerpt": "Check out the most awesome deals at Aldo",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "aldo"
  },
  "whbm": {
    "title": "White House Black Market",
    "excerpt": "Grabb deals at White House Black market",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "whbm"
  },
  "65-off-macys": {
    "title": "65% Off at Macys",
    "excerpt": "Great deals at Macys!",
    "source": {
      "name": "Perimeter Mall"
    },
    "location":{
      "lat": 33.881064, 
      "lng": -84.469953
    },
    "name": "65-off-macys"
  }
};

Grabbs = new Mongo.Collection('grabbs');

Grabbs.allow({
  insert: function(userId) {
    var user = Meteor.users.findOne(userId);
    return user && user.admin;
  }
});

Grabbs.latest = function() {
  return Grabbs.find({}, {sort: {date: -1}});
}

Meteor.methods({
  createGrabb: function(grabb){
    check(Meteor.userId(), String);
    check(grabb, {
      title: String,
      highlighted: Boolean,
      excerpt: String,
      image: String,
      location: Object,
      name: String,
      date: Date
    });

    grabb.source = {'name': Meteor.user().profile.name};

    Grabbs.insert(grabb)
  }
});

Meteor.startup(function() {
  if (Meteor.isServer && Grabbs.find().count() === 0) {
    _.each(GrabbsData, function(el, key) {
      // console.log(key, el)
      // el.date = new Date;
      var id = Grabbs.insert(
        el,
        function(err, id){
        console.log(err, id);
      });
    });
  }
});