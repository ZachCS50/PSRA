import { Meteor } from 'meteor/meteor';
import { SchemaCollection } from '/imports/api/schema';
import { SatelliteCollection } from '/imports/api/satellite';
import './routes'
var fs = Npm.require('fs');

function insertSchema({ schema }) {
  SchemaCollection.insert({"schema": schema});
}

function insertSat({ name, noradID }) {
  SatelliteCollection.insert({name, noradID});
}

function insertSatEx({ name, noradID, observation }) {
  SatelliteCollection.insert({name, noradID, observation});
}




Meteor.startup(() => {
  if (SatelliteCollection.find().count() === 0 ){
    // Add some data 

    insertSat({
      name: 'ISS - Zarya',
      noradID: '25544'
    });

    // insertSatEx({
    //   name: ['ISS - Zarya','ISS','Floaty Space Ship'],
    //   noradID: '25544',
    //   observation: "{name:'whack json string'}"
    // });
  }

  if (SchemaCollection.find().count() === 0 ){
    var jsonObj = new Array();
  
    files = fs.readdirSync('./assets/app/schema' );
  
    // create the large JSON array 
    files.forEach(function (file) {
      data = fs.readFileSync('./assets/app/schema/' + file,'ascii');
      jsonObj.push(JSON.parse(data));
    })
  
    // Write to Mongo
    jsonObj.forEach(function (data) {
      SchemaCollection.insert(data);
    })
    
  }

});


function updateEntry(){
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $set: {"new_field": 1} },)
  
  // Multi doesn't work from client
  // SatelliteCollection.update({},    [{ $set: { new_field: ["1"] } }],  {multi: true })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $convert: {input: new_field, to: array } })
  // SatelliteCollection.update({_id: '2r8rrAwXct5xP9amg'},  { $push: {new_field: 2} })
}
updateEntry();