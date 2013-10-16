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