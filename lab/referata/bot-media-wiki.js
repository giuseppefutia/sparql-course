var bot = require('nodemw');
var fs = require('fs');
var csv = require('csv');

// read config from external file
var client = new bot('./config.js');

// Get article for test reasons
client.getArticle('Main Page', function (err, data) {

  console.log();
  console.log("*** GET AN ARTICLE ***");
  console.log();

  // error handling
  if (err) {
    console.error(err);
    return;
  }

  loadCSVinMW();
});

var loadCSVinMW = function () {
  var data = fs.readFileSync(process.argv[2], "utf8");

  console.log();
  console.log("*** READ CSV ***");
  console.log();

  csv.parse(data, function (err, csvData) {

    for (var i = 0; i < csvData.length; i++ ) {
      if (i > 0) {
        console.log();
        console.log("*** CONTENT ***");
        console.log();
        var content = "{{Contributo in RIVISTA" +
        "|Id=" + csvData[1][0] +
        "|Titolo=" + csvData[1][1] +
        "|Anno=" + csvData[1][2] +
        "|Formato=" + csvData[1][3] +
        "|Autori=" + csvData[1][4] +
        "|Affiliazione autori NON CNR=" + csvData[1][5] +
        "|Lingua prodotto=" + csvData[1][6] +
        "|Abstract=" + csvData[1][7] +
        "|Lingua Abstract=" + csvData[1][8] +
        "|Altro Abstract=" + csvData[1][9] +
        "|Lingua Abstract=" + csvData[1][10] +
        "|Pagine DA=" + csvData[1][11] +
        "|Pagine A=" + csvData[1][12] +
        "|Rivista=" + csvData[1][13] +
        "|Volume=" + csvData[1][14] +
        "|Fascicolo=" + csvData[1][15] +
        "|DOI=" + csvData[1][16] +
        "|Referee=" + csvData[1][17] +
        "|Indicizzato da=" + csvData[1][18] +
        "|Parole chiave=" + csvData[1][19] +
        "|URL=" + csvData[1][20] +
        "|Stato=" + csvData[1][21] +
        "|Indicizzato DA=" + csvData[1][22] +
        "|Parole chiave=" + csvData[1][23] +
        "|URL=" + csvData[1][24] +
        "|Sede=" + csvData[1][25] +
        "|Progetto=" + csvData[1][26] +
        "|Modulo=" + csvData[1][27] +
        "|Permessi=" + csvData[1][28] +
        "}}";
        console.log(content);

        client.edit(csvData[1][0], content, "edit journal " + csvData[1][0], true, function (err, data) {
          console.log("*** EDIT A PAGE ***");
          if (err) {
            console.error(err);
            return;
          }
          console.log(data);
        });
      }
    }
  });
}
