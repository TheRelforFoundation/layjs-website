var
  execSync = require("child_process").execSync,
  fs = require("fs"),
  markdown = require("markdown").markdown;





if ((execSync("ls").toString()).indexOf("LayJS") === -1 )  {
  execSync("git clone https://github.com/LayJS/LayJS.git;");
}



var l = [];


function recurse( path, l, relpath ) {
  var fileNameS = fs.readdirSync(path);
  for ( var fileName of fileNameS ) {
    var filePath = path + "/" + fileName;
    var statFile = fs.statSync( filePath );
    if ( statFile.isDirectory() ) {
      l.push({
        title: fileName,
        sysname: fileName,
        sub: []
      });
      recurse( filePath, l[l.length-1].sub )
    } else if ( statFile.isFile() ) {
      if ( filePath.endsWith(".md")) {
        var name = fileName.substr(0, fileName.length-3);
        l.push({
          title: name,
          sysname: name,
          sub: [],
          content: markdown.toHTML(fs.readFileSync(filePath).toString())
        });
      }
    }
  }
}

recurse( execSync("pwd").toString().trim() + "/LayJS/api", l, "" );

fs.writeFileSync("static/api.js",
  `var API = ${JSON.stringify(l)}`, "utf8");

//execSync("rm -rf LayJS");