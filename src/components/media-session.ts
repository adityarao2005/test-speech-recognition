import { File } from "buffer";
import crypto from "crypto";
import fs from 'fs/promises'

class MediaSessionManager {
    private sessions: Map<string, Buffer[]> = new Map();

    async startSession() {
        const id = crypto.randomBytes(16).toString("hex");
        this.sessions.set(id, []);
        return id;
    }

    async acceptChunk(id: string, chunk: ArrayBuffer) {
        console.log(this.sessions.get(id))
        this.sessions.get(id)?.push(Buffer.from(chunk));
    }

    async stopSession(id: string) {
        console.log(this.sessions.get(id))
        const chunks = this.sessions.get(id);
        if (chunks) {
            const buffer = Buffer.concat(chunks!);
            this.sessions.delete(id);

            // Save blob to file in /public/audio
            const filePath = `public/audio/${id}.ogg`;
            await fs.writeFile(filePath, buffer);

            // Return file path
            return `/audio/${id}.ogg`;
        }
        return null;
    }
}

export default new MediaSessionManager();