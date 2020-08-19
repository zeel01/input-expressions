function _onChangeInputDelta(event) {
	// Helpers
	function roll(...args) {
		return new Roll(...args).roll().total;
	}
	let entity = this.entity;
	let data = this.entity.data;
	let abilities = this.entity.data.abilities;
	let attributes = this.entity.data.attributes;

	// 
	const input = event.target;
	let value = input.value;

	if (/^[\+\-\/\*]/.test(value)) value = this.current + value;
	try {
		let evaluated = Number(eval(value));
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