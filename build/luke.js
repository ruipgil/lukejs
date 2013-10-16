(function(){
Array.prototype.has = function(elm) {
	return~~ this.indexOf(elm);
};
luc.utils = {};

luc.utils.ccFormat = function(arr) {
	return arr.map(function(value, index) {
		if (index > 0) {
			return luc.utils.capitalizeString(value);
		} else {
			return value;
		}
	}).join("");
};

luc.utils.capitalizeString = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
var luke = {};

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = luke;
	}
	exports.luke = luke;
} else {
	window.luke = luke;
}
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
/**
 * A class property.
 *
 * @param {string} name Name of the property.
 * @param {string} type Type of the property.
 * @param {string} deflt Default value of the property.
 * @extends {luke.Property}
 */
luke.ClassProperty = function(name, type, deflt) {
	luke.Property.call(this, name, type, deflt);
};
luke.ClassProperty.prototype = Object.create(luke.Property.prototype);
/**
 * @override
 */
luke.ClassProperty.prototype.compileReference = function(buffer) {
	buffer.push("this.");
	luke.Property.prototype.compileReference.call(this, buffer);
};
/**
 * @override
 */
luke.ClassProperty.prototype.compileDeclaration = function(buffer) {
	this.compileAssignment(buffer, this.deflt);
};
luke.Composite = function() {
	this.comps = [];
	for (var f in arguments) {
		this.comps.push(arguments[f]);
	}
};
luke.Composite.prototype = {
	constructor: luke.Composite,
	compile: function(buffer) {
		this.comps.forEach(function(f) {
			if (f instanceof Function) {
				f(buffer);
			} else if (f instanceof luke.Composite) {
				f.compile(buffer);
			}
		});
	}
};
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
luke.Getter = function(clss, property) {
	luke.Method.call(this, clss, new luke.Function(luke.utils.ccFormat(["get", property.name]), [], new luke.Composite(function(buffer) {
		buffer.push("return " + property.name + ";").nl();
	})));
};
luke.Getter.prototype = Object.create(luke.Method.prototype);
/**
 * Class interface.
 * @interface
 */
luke.IClass = function() {};

luke.IClass.prototype = {
	constructor: luke.IClass
};
luke.IConstructor = function() {
	luke.IFunction.call(this);
};
luke.IConstructor.prototype = Object.create(luke.IFunction.prototype);

luke.IFunction = function() {};

luke.IFunction.prototype = {
	constructor: luke.IFunction
};
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

/**
 * A property.
 *
 * @param {string} name Name of the property.
 * @param {string} type Type of the property.
 * @param {string} deflt Default value of the property.
 */
luke.Property = function(name, type, deflt) {
	this.name = name;
	this.type = type;
	this.deflt = deflt;
};
luke.Property.prototype = {
	constructor: luke.Property,
	getName: function() {
		return this.name;
	},
	getType: function() {
		return this.type;
	},
	getDefault: function() {
		return this.deflt;
	},
	hasDefault: function() {
		return this.getDefault() !== undefined;
	},
	/**
	 * Compiles a reference to the property.
	 *
	 * @param  {luke.Buffer} buffer Buffer to compile to.
	 */
	compileReference: function(buffer) {
		buffer.push(this.name);
	},
	/**
	 * Compiles an assignment to the property.
	 *
	 * @param  {luke.Buffer} buffer Buffer to compile to.
	 * @param  {string} assignment Assignment value to the variable.
	 */
	compileAssignment: function(buffer, assignment) {
		this.compileReference(buffer);
		buffer.push(" = " + assignment);
	},
	/**
	 * Compile a declaration to the property.
	 *
	 * @param  {luke.Buffer} buffer Buffer to compile to.
	 */
	compileDeclaration: function(buffer) {
		buffer.push("var ");
		if (this.deflt !== undefined) {
			this.compileAssignment(buffer, this.deflt);
		} else {
			this.compileReference(buffer);
		}
	}
};
luke.Setter = function(clss, property) {
	luke.Method.call(this, clss, new luke.Function(luke.utils.ccFormat(["set", property.name]), [property.name], new luke.Composite(function(buffer) {
		property.compileAssignment(buffer, property.name);
		buffer.push(";").nl();
	})));
};
luke.Setter.prototype = Object.create(luke.Method.prototype);
})();