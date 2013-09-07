// --- SETTINGS ---
var COMPILER_JAR = './compiler.jar';
 
// --- SETUP ---
var _exec = require('child_process').exec;
 
exports.compile = function(srcPath, distPath) {
    // exec is asynchronous
    _exec(
      'java -jar '+ COMPILER_JAR +' --js '+ srcPath +' --js_output_file '+ distPath,
      function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
        } else {
            console.log(stdout);
            console.log(' '+ distPath + ' built.');
        }
      }
    );
}
 
