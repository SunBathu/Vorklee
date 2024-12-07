"use client";

import { useEffect, useState } from "react";

const GlobalSettingsPage = () => {
    const [settings, setSettings] = useState({
        storagePath: "",
        imageType: "jpg",
        dateFormat: "dd.MM.yyyy",
        maxFileSize: 5,          // New field (default 5 MB)        
        theme: "light",          // New field (default theme)
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch("/api/settings");
                if (!response.ok) throw new Error("Failed to fetch settings.");
                const data = await response.json();
                setSettings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSave = async () => {
        if (!settings.storagePath) {
            setError("Storage Path is required.");
            return;
        }

        if (settings.maxFileSize <= 0) {
            setError("Max File Size must be a positive number.");
            return;
        }

        try {
            const response = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (!response.ok) throw new Error("Failed to save settings.");
            alert("Settings saved successfully!");
            setError(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div>
            <h1>Global Settings</h1>
            <form>
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
                    <select
                        name="imageType"
                        value={settings.imageType}
                        onChange={handleChange}
                    >
                        <option value="jpg">JPG</option>
                        <option value="png">PNG</option>
                    </select>
                </div>
                <div>
                    <label>Date Format:</label>
                    <input
                        type="text"
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Max File Size (MB):</label>
                    <input
                        type="number"
                        name="maxFileSize"
                        value={settings.maxFileSize}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Theme:</label>
                    <select
                        name="theme"
                        value={settings.theme}
                        onChange={handleChange}
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <button type="button" onClick={handleSave}>
                    Save Settings
                </button>
            </form>
        </div>
    );
};

export default GlobalSettingsPage;
