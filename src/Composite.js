luke.Composite = function() {
	this.comps = [];
	for (var f in arguments) {
		this.comps.push(arguments[f]);
	}
};
luke.Composite.prototype = {
	constructor: luke.Composite,
	compile: function(buffer) {
		this.comps.forEach(function(f) {
			if (f instanceof Function) {
				f(buffer);
			} else if (f instanceof luke.Composite) {
				f.compile(buffer);
			}
		});
	}
};