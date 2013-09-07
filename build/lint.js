var _cli = require('commander'),
    _jshint = require('jshint'),
    _fs = require('fs');
 
 
exports.lint = function(path, callback) {
    var buf = _fs.readFileSync(path, 'utf-8');
    // remove Byte Order Mark
    buf = buf.replace(/^\uFEFF/, ''); 
    _jshint.JSHINT(buf);
 
    var nErrors = _jshint.JSHINT.errors.length;
 
    if (nErrors) {
        console.log(_jshint.JSHINT.errors);
        console.log(' Found %j lint errors on %s, do you want to continue?', nErrors, path);
        _cli.choose(['no', 'yes'], function(i){
            if (i) {
                process.stdin.destroy();
                if(callback) callback();
            } else {
                process.exit(0);
            }
        });
    } else if (callback) {
        callback();
    }
}
 
