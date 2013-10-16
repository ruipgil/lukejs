luke.Getter = function(clss, property) {
	luke.Method.call(this, clss, new luke.Function(luke.utils.ccFormat(["get", property.name]), [], new luke.Composite(function(buffer) {
		buffer.push("return " + property.name + ";").nl();
	})));
};
luke.Getter.prototype = Object.create(luke.Method.prototype);