/**
 * This class defines an intreface for getting and setting a value
 * this wrapper can be extended to adapt various input types.
 *
 * @class InputAdapter
 *//* exported InputAdapter */
class InputAdapter {
	/**
	 * Creates an instance of InputAdapter.
	 * @param {JQuery} element - Some element used for accepting input
	 * @memberof InputAdapter
	 */
	constructor(element) {
		this.element = element;
	}
	/** @override */
	get value() {
		return false;
	}
	/** @override */
	set value(val) {
		//noop
	}
}

/**
 * This function is used to handle all Input Expressions evaluations
 *
 * @param {InputAdapter} input - The input field, must be read/writable.
 * @param {*} current - The current value of the input field target.
 * @param {Object} { entity, data, actor } - Additional data for the context
 * @return {string} Returns the new value for the input.
 *//* exported inputExpression */
function inputExpression(input, current,  { event, entity, data, actor }) {
	let value = input.value;
	if (value == "") return "";
	
	// Helpers
	const scope = {
		entity, data,
		abilities: actor?.data?.data?.abilities, 
		attributes: actor?.data?.data?.attributes
	}

	if (/^[+\-/*]/.test(value)) value = current + value;
	try {
		value = inputFixer(value);
		let evaluated = Number(math.evaluate(value, scope));

		if (isNaN(evaluated)) throw Error("The expression did not have a numeric result.")
		input.value = evaluated;
		return evaluated;
	}
	catch (e) {
		console.error(e);
		ui.notifications.error(e);
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		return current;
	}
}
/**
 * Used by Hooks.on("init") to register the roll function to the
 * Math.js math object.
 *
 * @return {null} 
 *//* exported inputExprInitHandler */
function inputExprInitHandler() {
	if (window.math?.roll) return;

	function roll(args) {
		let str = args instanceof Array
			? args.reduce((s, a) => s + a.toString(), "").replace(/\s/g, "")
			: args;

		return new Roll(str).roll().total;
	}
	roll.rawArgs = true;

	math.import({ roll });
}
/**
 * This function runs fixes on the input string to correct common problems
 * - `.mod`: Math.js doesn't like the mod property of ability scores
 *   because it thinks it's a module function. So convert to array access style.
 *
 * @param {string} str - The expression string.
 */
function inputFixer(str) {
	str = str.replace(/\.mod/, "['mod']");
	return str;
}