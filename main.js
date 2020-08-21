/* global inputExpression:readonly InputAdapter:readonly */
class TextInputAdapter extends InputAdapter {
	get value() {
		return this.element.value;
	}
	set value(val) {
		this.element.value = val;
	}
}

Hooks.once("init", () => {
	if (window.math?.roll) return;

	function roll(args) {
		let str = args instanceof Array
			? args.reduce((s, a) => s + a.toString(), "").replace(/\s/g, "")
			: args;

		return new Roll(str).roll().total;
	}
	roll.rawArgs = true;

	math.import({ roll });
});

function sheetHook(element, sheetdata, appdata) {
	element.find('[data-dtype="Number"]')
	.off("change").on("change", (event) => {
		const current = getProperty(sheetdata, event.target.name);
		inputExpression(
			new TextInputAdapter(event.target),
			current, sheetdata, appdata, event
		);
	});
}

Hooks.on("renderActorSheet", (sheet, element, data) => sheetHook(element, sheet.actor.data, data));
Hooks.on("renderItemSheet", (sheet, element, data) => sheetHook(element, sheet.item.data, data));



Hooks.on("renderTokenHUD", (hud, element, data) => {
	element.find(".attribute input")
	.off("change").on("change", (event) => {
		const input = event.target
		const bar = input.dataset.bar;
		let current;
		if (bar) {
			current = getProperty(hud.object.actor.data.data, hud.object.data[bar].attribute);
			// Sometimes the attribute is just a value, sometimes it's an object with value/max
			if (typeof current == "object") {
				current = current.value;
			}
		}
		else current = hud.object.data[input.name];
		
		inputExpression(
			new TextInputAdapter(input),
			current, hud.object.actor.data, data, event
		);

		hud._onAttributeUpdate(event);
	});
});

