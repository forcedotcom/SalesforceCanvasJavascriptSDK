// --- SETTINGS ---
var DOC_JAR = '../jsdoc_toolkit-2.4.0/jsdoc-toolkit/jsrun.jar ../jsdoc_toolkit-2.4.0/jsdoc-toolkit/app/run.js';
 
// --- SETUP ---
var _exec = require('child_process').exec;
 
exports.gendocs = function(srcPath, distPath) {
    // exec is asynchronous
    _exec(
      'java -jar '+ DOC_JAR + " -r -q " +  srcPath +  ' -d='+ distPath +
		" -t=../jsdoc_toolkit-2.4.0/jsdoc-toolkit/templates/jsdoc",
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
