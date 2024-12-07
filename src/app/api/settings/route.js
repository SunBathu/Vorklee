import dbConnect from '@/utils/dbConnect';
import SettingsGlobal from '@/models/SettingsGlobal';
import SettingsPCWise from '@/models/SettingsPCWise';

export default async function handler(req, res) {
    try {
        await dbConnect();

        if (req.method === 'GET') {
            // Fetch global settings
            let globalSettings = await SettingsGlobal.findOne({});
            if (!globalSettings) {
                globalSettings = await SettingsGlobal.create({
                    storagePath: 'SysFile',
                    dateFormat: 'DD-MM-YYYY',
                });
            }

            // Fetch PC-specific settings
            const pcSettings = await SettingsPCWise.find({});

            res.status(200).json({ globalSettings, pcSettings });
        } else if (req.method === 'POST') {
            const { globalSettings, pcSettingsList } = req.body;

            // Update global settings
            await SettingsGlobal.updateOne({}, globalSettings, { upsert: true });

            // Update PC-specific settings
            for (const pcSettings of pcSettingsList) {
                await SettingsPCWise.updateOne(
                    { hostName: pcSettings.hostName },
                    pcSettings,
                    { upsert: true }
                );
            }

            res.status(200).json({ message: 'Settings saved successfully' });
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to process request', error: error.message });
    }
}
