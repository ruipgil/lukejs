luke.Function = function(name, params, body) {
	luke.IFunction.call(this);
	this.name = name;
	this.aFn = new luke.AnonymousFunction(params, body);
};
luke.Function.prototype = Object.create(luke.IFunction.prototype);
luke.Function.prototype.compile = function(buffer) {
	buffer.push(this.name + " = ");
	this.aFn.compile(buffer);
};