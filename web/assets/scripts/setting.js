async function fetchCompanySettings() {
    try {
        const settings = await eel.fetch_company_settings()();
        return settings;
    } catch (error) {
        console.error('Error fetching company settings:', error);
        return null;
    }
}

async function insertCompanySettings(settings) {
    try {
        await eel.insert_company_settings(settings)();
        console.log('Company settings inserted successfully!');
    } catch (error) {
        console.error('Error inserting company settings:', error);
    }
}

async function updateCompanySettings(settings) {
    try {
        await eel.update_company_settings(settings)();
        console.log('Company settings updated successfully!');
    } catch (error) {
        console.error('Error updating company settings:', error);
    }
}

async function handleUpdate() {
    const settings = [
        document.getElementById('name').value,
        document.getElementById('language').value,
        document.getElementById('theme').value,
        document.getElementById('restaurant-name').value,
        document.getElementById('address').value,
        document.getElementById('phone').value,
        document.getElementById('currency').value,
        document.getElementById('timezone').value,
        parseFloat(document.getElementById('tax-rate').value)
    ];

    // Check if updating or inserting
    const currentSettings = await fetchCompanySettings();
    if (currentSettings) {
        await updateCompanySettings(settings);
    } else {
        await insertCompanySettings(settings);
    }
}

async function loadSettings() {
    const settings = await fetchCompanySettings();
    if (settings) {
        document.getElementById('name').value = settings[1];
        document.getElementById('language').value = settings[2];
        document.getElementById('theme').value = settings[3];
        document.getElementById('restaurant-name').value = settings[4];
        document.getElementById('address').value = settings[5];
        document.getElementById('phone').value = settings[6];
        document.getElementById('currency').value = settings[7];
        document.getElementById('timezone').value = settings[8];
        document.getElementById('tax-rate').value = settings[9];
    }
}

window.onload = loadSettings;
