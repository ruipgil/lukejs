var luke = {};

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = luke;
	}
	exports.luke = luke;
} else {
	window.luke = luke;
}