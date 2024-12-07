'use client';

import { useState, useEffect } from 'react';

export default function GlobalSettingsPage() {
    const [settings, setSettings] = useState({
        storagePath: 'SysFile',
        imageType: 'jpg',
        dateFormat: 'DD-MM-YYYY',
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch settings on load
    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings');
            if (!response.ok) throw new Error('Failed to fetch settings.');

            const data = await response.json();
            setSettings((prevSettings) => ({
                storagePath: data.storagePath || prevSettings.storagePath,
                imageType: data.imageType || prevSettings.imageType,
                dateFormat: data.dateFormat || prevSettings.dateFormat,
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    // Handle save settings
    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Storage Path Validation: Must not be empty and must be a valid path format
        if (!settings.storagePath.trim()) {
            setError('Storage Path is required.');
            return;
        }

        // Image Type Validation: Allow only jpg, png, or gif
        const allowedImageTypes = ['jpg', 'png', 'gif'];
        if (!allowedImageTypes.includes(settings.imageType.toLowerCase())) {
            setError('Invalid Image Type. Allowed types are: jpg, png, gif.');
            return;
        }

        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (!response.ok) throw new Error('Failed to save settings.');

            setSuccess('Settings saved successfully!');
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Global Settings</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSave}>
                <div>
                    <label>Storage Path:</label>
                    <input
                        type="text"
                        name="storagePath"
                        value={settings.storagePath}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Image Type:</label>
                    <input
                        type="text"
                        name="imageType"
                        value={settings.imageType}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Date Format for Daily Folders:</label>
                    <select
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                    >
                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                    </select>
                </div>

                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
}
