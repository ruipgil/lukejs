luke.Setter = function(clss, property) {
	luke.Method.call(this, clss, new luke.Function(luke.utils.ccFormat(["set", property.name]), [property.name], new luke.Composite(function(buffer) {
		property.compileAssignment(buffer, property.name);
		buffer.push(";").nl();
	})));
};
luke.Setter.prototype = Object.create(luke.Method.prototype);