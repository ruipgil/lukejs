luke.OptionalConstructor = function(clss) {
	luke.IConstructor.call(this);
	this.clss = clss;
};
luke.OptionalConstructor.prototype = Object.create(luke.IConstructor.prototype);
luke.OptionalConstructor.prototype.compile = function(buffer) {
	var clss = this.clss;
	new luke.Function(clss.getName(), ["options"], new luke.Composite(function(buffer) {
		if (clss.isExtended()) {
			buffer.push(clss.getParent().getName() + ".call(" + ["this", "options"].join(", ") + ");").nl();
		}
		clss.getProperties().forEach(function(property) {
			property.compileReference(buffer);
			buffer.push(" = options." + property.getName() + (property.hasDefault() ? " || " + property.getDefault() : "") + ";").nl();
		});
	})).compile(buffer);
};
