import dbConnect from "@/utils/dbConnect";
import Settings from "@/models/Settings";

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === "GET") {
        try {
            const settings = await Settings.findOne({});
            res.status(200).json(settings || {});
        } catch (error) {
            console.error("Error fetching settings:", error);
            res.status(500).json({ message: "Failed to fetch settings", error: error.message });
        }
    } else if (req.method === "POST") {
        try {
            const updatedSettings = await Settings.findOneAndUpdate(
                {},
                req.body,
                { upsert: true, new: true }
            );
            res.status(200).json({ message: "Settings updated successfully!", updatedSettings });
        } catch (error) {
            console.error("Error saving settings:", error);
            res.status(500).json({ message: "Failed to save settings", error: error.message });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
