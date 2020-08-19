function _onChangeInputDelta(event) {
	// Helpers
	
	let entity = this.entity;
	let data = this.entity.data;
	let abilities = this.entity.data.abilities;
	let attributes = this.entity.data.attributes;

	let scope = {
		entity, data, abilities, attributes
	}

	// 
	const input = event.target;
	let value = input.value;

	if (value == "") return;

	if (/^[\+\-\/\*]/.test(value)) value = this.current + value;
	try {
		let evaluated = Number(math.evaluate(value, scope));
//		let evaluated = Number(eval(value));
		if (isNaN(evaluated)) throw Error("The expression did not have a numeric result.")
		input.value = evaluated;
	}
	catch (e) {
		console.error(e);
		ui.notifications.error(e);
		event.preventDefault();
		event.stopPropagation();
		return
	}
}

Hooks.once("init", () => {
	if (window.math?.roll) return;

	function roll(args) {
		let str = typeof args == "object"
			? args.reduce((s, a) => s + a.toString().replace(/\s/g, ''), "")
			: args;

		return new Roll(str).roll().total;
	}
	roll.rawArgs = true;

	math.import({ roll });
});

Hooks.on("renderActorSheet", (sheet, element, data) => {
	const inputs = element.find('[data-dtype="Number"]');
	inputs.off("change");
	inputs.on("change", (event) => {
		let current = getProperty(sheet.actor.data, event.target.name);
		_onChangeInputDelta.bind({
			current,
			entity: sheet.actor.data
		})(event);
	});
});
Hooks.on("renderItemSheet", (sheet, element, data) => {
	const inputs = element.find('[data-dtype="Number"]');
	inputs.off("change");
	inputs.on("change", (event) => {
		let current = getProperty(sheet.item.data, event.target.name);
		_onChangeInputDelta.bind({
			current,
			entity: sheet.item.data
		})(event);
	});
});
Hooks.on("renderTokenHUD", (hud, element, data) => {
	const inputs = element.find(".attribute input");
	inputs.off("change");
	inputs.on("change", (event) => {
		const input = event.target
		let bar = input.dataset.bar;
		let target, c;
		if (bar) {
			target = hud.object.data[bar].attribute;
			c = getProperty(hud.object.actor.data.data, target);
			if (typeof c == "object") {
				target += ".value";
				c = getProperty(hud.object.actor.data.data, target);
			}
		}
		else {
			c = hud.object.data[input.name];
		}
		const current = c;
		_onChangeInputDelta.bind({
			current,
			entity: hud.object.actor.data
		})(event);
		hud._onAttributeUpdate(event);
	});
});