export const dynamic = 'force-dynamic'
import mediaSession from "@/components/media-session"

export async function POST(request: Request) {
    const id = await mediaSession.startSession();
    return Response.json({ id: id });
}