luke.IConstructor = function() {
	luke.IFunction.call(this);
};
luke.IConstructor.prototype = Object.create(luke.IFunction.prototype);
