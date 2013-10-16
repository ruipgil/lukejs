luke.AnonymousFunction = function(params, body) {
	luke.IFunction.call(this);
	this.params = params;
	this.body = body;
};
luke.AnonymousFunction.prototype = Object.create(luke.IFunction.prototype);
luke.AnonymousFunction.prototype.compile = function(buffer) {
	buffer.push("function(" + this.params.join(", ") + ") {").nl();
	this.body.compile(buffer);
	buffer.push("}");
};