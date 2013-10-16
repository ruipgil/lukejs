luke.Buffer = function() {
	this.buffer = "";
};
luke.Buffer.prototype = {
	constructor: luke.Buffer,
	push: function(value) {
		this.buffer += value;
		return this;
	},
	nl: function() {
		this.push("\n");
		return this;
	},
	toString: function() {
		return this.buffer;
	}
};