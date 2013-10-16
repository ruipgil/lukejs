luke.Constructor = function(clss) {
	luke.IConstructor.call(this);
	this.clss = clss;
};
luke.Constructor.prototype = Object.create(luke.IConstructor.prototype);
luke.Constructor.prototype.compile = function(buffer) {
	var clss = this.clss,
		propMapFn = function(property) {
			return property.getName();
		};
	new luke.Function(clss.getName(), clss.getAllProperties().map(propMapFn), new luke.Composite(function(buffer) {
		if (clss.isExtended()) {
			buffer.push(clss.getParent().getName() + ".call(" + ["this"].concat(clss.getParent().getAllProperties().map(propMapFn)).join(", ") + ");").nl();
		}
		clss.getProperties().forEach(function(property) {
			property.compileReference(buffer);
			buffer.push(" = " + property.getName() + (property.hasDefault() ? " || " + property.getDefault() : "") + ";").nl();
		});
	})).compile(buffer);
};
