export const dynamic = 'force-dynamic'
import mediaSession from "@/components/media-session"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const path = await mediaSession.stopSession(params.id);
    return Response.json({ path: path });
}