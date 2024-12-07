import dbConnect from '@/utils/dbConnect';
import Settings from '@/models/Settings';

export default async function handler(req, res) {
    try {
        await dbConnect();

        const settings = await Settings.findOne({});
        if (!settings) {
            const newSettings = await Settings.create({
                storagePath: "SysFile",
                imageType: "jpg",
                dateFormat: "DD-MM-YYYY",
            });
            return res.status(200).json(newSettings);
        }

        res.status(200).json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const settings = await Settings.findOne({});
        return Response.json(settings || {});
    } catch (error) {
        console.error("Error fetching settings:", error);
        return new Response(
            JSON.stringify({ message: "Failed to fetch settings", error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            body,
            { upsert: true, new: true }
        );
        return Response.json({ message: "Settings updated successfully!", updatedSettings });
    } catch (error) {
        console.error("Error saving settings:", error);
        return new Response(
            JSON.stringify({ message: "Failed to save settings", error: error.message }),
            { status: 500 }
        );
    }
}
