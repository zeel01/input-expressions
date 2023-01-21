import {InputAdapter, inputExpression, inputExprInitHandler} from "/handler.js";

class TextInputAdapter extends InputAdapter {
	get value() {
		return this.element.value;
	}
	set value(val) {
		this.element.value = val;
	}
}

class InputExpressionsHandlers {
	static sheetHook(sheet, element, sheetdata, appdata) {
		element.find('[data-dtype="Number"]')
		.off("change").on("change", (event) => {
			const current = getProperty(sheetdata, event.target.name);
			inputExpression(
				new TextInputAdapter(event.target), current, {
					entity: sheetdata,
					data: appdata,
					event,
					actor: sheet.actor
				}
			);
		});
	}
	
	static hudEventHandler(event, hud, data, obj) {
		const input = event.target
		const bar = input.dataset.bar;
		let current;
		if (bar) {
			const prop = getProperty(obj.actor.system, obj.data[bar].attribute);
			// Sometimes the attribute is just a value, sometimes it's an object with value/max
			if (typeof prop == "object") {
				current = prop.value;
				if (prop.temp) current += prop.temp;
			}
			else current = prop;
		}
		else current = obj.data[input.name];
		
		inputExpression(
			new TextInputAdapter(input), current, { 
				entity: obj.actor.data,
				actor: obj.actor,
				data, event, negativesAreDelta: true
			}
		);

		hud._onAttributeUpdate(event);
	}
}

Hooks.once("init", inputExprInitHandler);

Hooks.on("renderActorSheet", (sheet, element, data) => InputExpressionsHandlers.sheetHook(sheet, element, sheet.actor, data));
Hooks.on("renderItemSheet", (sheet, element, data) => InputExpressionsHandlers.sheetHook(sheet, element, sheet.item, data));

Hooks.on("renderTokenHUD", (hud, element, data) => {
	const obj = hud.object;
	element.find(".attribute input")
	.off("change").on("change", (event) => InputExpressionsHandlers.hudEventHandler(event, hud, data, obj))
	.off("keydown").on("keydown", (event) => {
		const code = game.keyboard.getKey(event);
    	if (code === "Enter") return InputExpressionsHandlers.hudEventHandler(event, hud, data, obj);
	});
});

