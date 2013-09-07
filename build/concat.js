// settings
var FILE_ENCODING = 'utf-8',
    EOL = '\n';
 
// setup
var _fs = require('fs');
 
exports.concat = function(opts) {
    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function(filePath){
            return _fs.readFileSync(filePath, FILE_ENCODING);
        });
    _fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
    console.log(' '+ distPath +' built.');
};
