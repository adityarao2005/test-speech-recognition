export const dynamic = 'force-dynamic'
import mediaSession from "@/components/media-session"

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const data = await request.arrayBuffer();
    await mediaSession.acceptChunk(params.id, data);
    return new Response(null, { status: 200 });
}