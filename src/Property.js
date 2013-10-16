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