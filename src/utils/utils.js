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