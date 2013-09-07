var jasmine = require('jasmine-node');
exports.test = function(specFolder){
	var options = {
		specFolders : [specFolder]
	}      
	jasmine.executeSpecsInFolder(options);
}
