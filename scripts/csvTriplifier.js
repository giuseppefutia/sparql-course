var fs = require('fs');
var csv = require('csv');

// TODO: Define instructions to parallelize this process.

/***
 Read input parameters:
 - baseURI
 - input data file path
 - conf file path
 - output file path
***/

if (process.argv.length !== 6) {
      console.error("Number of arguments is wrong!");
      console.error("You must specify a base URI, the path of input data, and the path of the conf file");
      return;
}

var baseURI = process.argv[2];
var data = fs.readFileSync(process.argv[3], "utf8");
var conf =  JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
var outputFileName = process.argv[5];

console.log("");
console.log("-----");
console.log("Base URI: " + baseURI); // TODO: verify if it has a good format
console.log("Input data path: " + process.argv[3]);
console.log("Configuration file path: " + process.argv[4]);
console.log("");

var dataTypes = conf[0]["dataType"][0]; // Examples of dataTypes: ^^xsd:int, ^^xsd:date
console.log("-----");
console.log("Defined data types");
console.log(dataTypes);
console.log("");
var dataMappers = conf[1]["propertiesToMap"][0];

var csvFields = [];
var result = "";

// TODO: The delimiter is currently hard-coded. Maybe it can be a parameter
var options = {"delimiter": ";"};

csv.parse(data, options, function(err, csvData) {
  for (var j = 0; j < csvData[0].length; j++) {
    csvFields[j] = csvData[0][j];
  }
  for (var i = 1; i < csvData.length; i++) {
    for (var h = 0; h < csvData[i].length; h++) {
      if (csvFields[h] !== "id" && dataMappers[csvFields[h]]!== "notSet") {
        var subject = baseURI + csvData[i][csvFields.indexOf("id")];
        var predicate = dataMappers[csvFields[h]];
        var object = checkObject(csvData[i][h], dataTypes[csvFields[h]])
        result += setBasicTriple(subject, predicate, object);
      }
    }
  }
  fs.writeFileSync(outputFileName + ".nt", result);
});

var setBasicTriple = function (subject, predicate, object) {
  var triple = "";
  // If necessary, set a control for each triple element
  triple += "<" + subject + "> <" + predicate + "> '" + object + "' .\n";
  return triple;
}

var checkSubject = function () {
  // TODO: implement control on subject
}

var checkPredicate = function () {
  // TODO: implement control on predicate
}

var checkObject = function (object, dataType) {
  var cleanedObject = "";
  if (dataType !== undefined && "entity") // TODO: Should be improved
    cleanedObject = object + dataType;
  else cleanedObject = object;
  return cleanedObject;
}
