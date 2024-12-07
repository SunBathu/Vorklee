import dbConnect from "@/utils/dbConnect";
import Settings from "@/models/Settings";

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
