// Author: Michael.Lagally@oracle.com
// Created: 7.5.2018
// Last modified: 7.5.2018

"use strict";

var fs = require("fs");
var path = require("path");
var baseDir = ".";

var filename=process.argv[2];

var verbose=process.argv[3] ==="-v";

if (verbose) console.log(`td-dm started`);


var content=fs.readFileSync('./'+filename);
var path=filename.substring(0, filename.lastIndexOf("/"));
// get package directory name
var pkg=path.substring(path.lastIndexOf("/")+1);
// strip path and extension
var plainfn=path.substring(filename.lastIndexOf("/")+1, filename.lastIndexOf("."));

var dm=JSON.parse(content);
if (verbose) console.log(dm);

if (verbose) console.log("-----");

var td={};
td.name=dm.name;
td.description=dm.description;
td.id=dm.urn;
td.base="http://<tbd>";
var now=new Date(Date.now());
td.createdAsString=now.toISOString();
td.created=now.valueOf();
td.lastModifiedAsString=now.toISOString();
td.lastModified=now.valueOf();
td.userLastModified="auto-generated by dm2td converter";
td.support="https://servient.example.com/contact";
td.properties={};
td.actions={};

for(var exKey in dm.attributes) {
    if (verbose) console.log("key:"+exKey+", value:"+dm.attributes[exKey]);
    var iac=dm.attributes[exKey];
    if (verbose) console.log(iac);
    var prop={};
    prop.name=iac.name;
    prop.description=iac.description;
    prop.type=iac.type.toLowerCase();
    prop.writable=iac.writable;
    if (!iac.alias) {
      prop.label=iac.name;
    } else {
      prop.label=iac.alias;
    };

    if (verbose) console.log(prop);

    td.properties[iac.name]=prop;
}

for(var exKey in dm.actions) {
    if (verbose) console.log("key:"+exKey+", value:"+dm.actions[exKey]);
    var iac=dm.actions[exKey];
    if (verbose) console.log(iac);
    var act={};

    act.name=iac.name;
    act.description=iac.description;
    if (iac.argType) {
      var inp={};
      inp.type=iac.argType.toLowerCase();
      if (iac.range) {
        inp.minimum=iac.range.split(",")[0];
        inp.maximum=iac.range.split(",")[1];
      }
      act.input=inp;
    }
    if (!iac.alias) {
      act.label=iac.name;
    } else {
      act.label=iac.alias;
    };

    td.actions[iac.name]=act;
}

if (verbose) console.log("-----");

console.log(JSON.stringify(td, null, "\t"));
