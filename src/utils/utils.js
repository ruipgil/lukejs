luke.utils = {};

luke.utils.ccFormat = function(arr) {
	return arr.map(function(value, index) {
		if (index > 0) {
			return luke.utils.capitalize(value);
		} else {
			return value;
		}
	}).join("");
};

luke.utils.capitalize = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
};