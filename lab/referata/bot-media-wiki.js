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
        "|Id=" + csvData[i][0] +
        "|Titolo=" + csvData[i][1] +
        "|Anno=" + csvData[i][2] +
        "|Formato=" + csvData[i][3] +
        "|Autori=" + csvData[i][4] +
        "|Affiliazione autori NON CNR=" + csvData[i][5] +
        "|Lingua prodotto=" + csvData[i][6] +
        "|Abstract=" + csvData[i][7] +
        "|Lingua Abstract=" + csvData[i][8] +
        "|Altro Abstract=" + csvData[i][9] +
        "|Lingua Abstract=" + csvData[i][10] +
        "|Pagine DA=" + csvData[i][11] +
        "|Pagine A=" + csvData[i][12] +
        "|Rivista=" + csvData[i][13] +
        "|Volume=" + csvData[i][14] +
        "|Fascicolo=" + csvData[i][15] +
        "|DOI=" + csvData[i][16] +
        "|Referee=" + csvData[i][17] +
        "|Indicizzato da=" + csvData[i][18] +
        "|Parole chiave=" + csvData[i][19] +
        "|URL=" + csvData[i][20] +
        "|Stato=" + csvData[i][21] +
        "|Indicizzato DA=" + csvData[i][22] +
        "|Parole chiave=" + csvData[i][23] +
        "|URL=" + csvData[i][24] +
        "|Sede=" + csvData[i][25] +
        "|Progetto=" + csvData[i][26] +
        "|Modulo=" + csvData[i][27] +
        "|Permessi=" + csvData[i][28] +
        "}}";
        console.log(content);

        client.edit(csvData[i][0], content, "edit journal " + csvData[i][0], true, function (err, data) {
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
