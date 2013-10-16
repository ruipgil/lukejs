luke.InstClass = function(options) {
	luke.IClass.call(this);
	var that = this;

	this.name = options.name;
	this.parent = options.parent || false;
	this.properties = options.properties ? options.properties.filter(function(property) {
		if (that.isExtended()) {
			return that.getParent().getAllProperties().has(property);
		}
		return true;
	}) : [];
	options.constructorType = options.constructorType || luke.Constructor;
	this.constr = new options.constructorType(this);

	options.methods = options.methods || [];
	this.methods = options.methods.map(function(fn) {
		return new luke.Method(that, fn);
	});

	this.getProperties().forEach(function(property) {
		if (options.getters) {
			that.methods.push(new luke.Getter(that, property));
		}
		if (options.setters) {
			that.methods.push(new luke.Setter(that, property));
		}
	});

};
luke.InstClass.prototype = Object.create(luke.IClass.prototype);
luke.InstClass.prototype.compile = function(buffer) {
	this.constr.compile(buffer);
	buffer.nl().push(this.name + ".prototype = ");
	if (this.isExtended()) {
		buffer.push("Object.create(" + this.getParent().getName() + ".prototype);").nl();
	} else {
		buffer.push("{").nl().push("constructor: " + this.name).nl().push("};").nl();
	}
	this.methods.forEach(function(method) {
		method.compile(buffer);
	});
};
luke.InstClass.prototype.getName = function() {
	return this.name;
};
luke.InstClass.prototype.isExtended = function() {
	return this.parent !== false;
};
luke.InstClass.prototype.getParent = function() {
	return this.parent;
};
luke.InstClass.prototype.getProperties = function() {
	return this.properties;
};
luke.InstClass.prototype.getAllProperties = function() {
	if (this.isExtended()) {
		return this.getParent().getAllProperties().concat(this.getProperties());
	} else {
		return this.getProperties();
	}
};
luke.InstClass.prototype.getMethods = function() {
	return this.methods;
};
luke.InstClass.prototype.getAllMethods = function() {
	if (this.isExtended()) {
		return this.getMethods().concat(this.getParent().getAllMethods());
	} else {
		return this.getMethods();
	}
};
