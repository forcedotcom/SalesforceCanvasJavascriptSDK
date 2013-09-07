var concat = require('./concat.js');
var compile = require('./compile.js');
var lint = require('./lint.js');
var docs = require('./jsdoc.js');
var test = require('./test.js');

var fullFileName = 'canvas-all.js'

concat.concat({
    src : [
        '../js/canvas.js',
        '../js/cookies.js',
        '../js/oauth.js',
        '../js/xd.js',
        '../js/client.js'
    ],
    dest : fullFileName
});
compile.compile(fullFileName, 'canvas-all.min.js');
docs.gendocs('../js/*.js', 'docs');
test.test('specs');
