// ────────── Module Importing ──────────
import { logMessage } from './logHandler.js';

async function updateSettingById(id, value) {
	const settingUpdate = {};
	settingUpdate[id] = value;

	await fetch('/updateSettings', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(settingUpdate)
	});
}

export function initSwitchButtons() {
	document.querySelectorAll('.SwitchButton').forEach(button => {
		button.addEventListener('click', async () => {
			button.classList.toggle('active');
			const isActive = button.classList.contains('active');

			logMessage(`SwitchButton "${button.id}" toggled to ${isActive ? 'active' : 'inactive'}`, "DEBUG");

			await updateSettingById(button.id + '_Active', isActive);

			switch (button.id) {
				case 'diamonds_Rob':
					break;
			}
		});
	});
}

export function initInputsUpdate() {
	document.querySelectorAll('input').forEach(input => {
		input.addEventListener('change', async () => {
			const id = input.id;
			if (!id) return; // skip inputs without ID

			let value = input.type === 'number' ? Number(input.value) : input.value;

			if (input.type === 'number' && isNaN(value)) value = 0;

			await updateSettingById(id, value);

			logMessage(`Input "${id}" changed to ${value}`, "DEBUG");
		});
	});
}

export async function loadSettings() {
	const settingsResponse = await fetch("/loadSettings");
	const settings = await settingsResponse.json();

	for (const key in settings) {
		if (!settings.hasOwnProperty(key)) continue;

		let element = document.getElementById(key);
		if (!element && key.endsWith('_Active')) {
			const baseId = key.replace(/_Active$/, '');
			element = document.getElementById(baseId);
		}
		if (!element) continue;

		const value = settings[key];

		if (element.tagName === 'INPUT') {
			if (element.type === 'checkbox' || element.type === 'radio') {
				element.checked = Boolean(value);
			} else {
				element.value = Array.isArray(value)
					? value.filter(n => Number.isFinite(n)).join('-')
					: (value !== null && value !== undefined)
						? value.toString()
						: '';
			}
		} else if (element.classList.contains('SwitchButton')) {
			if (value === true || value === 'true') element.classList.add('active');
			else element.classList.remove('active');
		} else {
			element.textContent = (value !== null && value !== undefined) ? value.toString() : '';
		}
	}
}