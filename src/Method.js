luke.Method = function(clss, fn) {
	luke.IFunction.call(this);
	this.fn = fn;
	this.fn.name = clss.getName() + ".prototype." + this.fn.name;
};
luke.Method.prototype = Object.create(luke.IFunction.prototype);
luke.Method.prototype.compile = function(buffer) {
	this.fn.compile(buffer);
	buffer.push(";").nl();
};