/*
 * small script to format the data offered on https://datahub.io/cividi/ch-municipalities to our needs
 * maybe use smth like https://github.com/maxogden/simplify-geojson to reduce the accuracy of the inputfile
 * usage: node formatter.js <inputfile> <outputfile>
 */

let args

try {
    args = process.argv.slice(2);

    if(args.length < 2)
        throw "error";

} catch (e) {
    console.error("usage: node formatter.js <inputfile> <outputfile>");
    process.exit(1);
}


fs = require("fs");
var simplify = require('simplify-geojson')

const infile    = args[0];
const outfile   = args[1];

var original = JSON.parse(fs.readFileSync(infile).toString());

//var file = simplify(original, 0.0005);
var file = original;

// just filter the municipalities which are supported by a service
const supportedCantons = ["ZH", "GR", "BS", "BL", "TG", "AG", "ZG", "BE", "SO", "LU", "SZ", "SG", "FR"];

let municipalities = [];

file.features.forEach(el => {
    const kt = el.properties["kanton.KUERZEL"];
    if(!supportedCantons.includes(kt))
        return;

    let municipality = {};

    municipality.bfsNr       = el.properties["gemeinde.BFS_NUMMER"];
    municipality.name        = el.properties["gemeinde.NAME"];
    municipality.canton      = el.properties["kanton.KUERZEL"];
    //municipality.area        = "";
    //municipality.population  = "";

    municipality.border      = el.geometry;


    municipalities.push(municipality);
});

const re = /(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/g;
const output    = JSON.stringify(municipalities).replace(re, "$1,$3");
fs.writeFileSync(outfile, output);
console.log(outfile + " written");