import { SimplePool, finalizeEvent } from "nostr-tools";
import { RELAY_URLS } from "../config/env.config";

class IndexService {
    static async sendNostrEvent(nostrEvent: any, priKey: Uint8Array<ArrayBufferLike>) {
        const pool = new SimplePool();

        const signedEvent = finalizeEvent(nostrEvent, priKey);

        const pubs = pool.publish(RELAY_URLS, signedEvent);

        await Promise.any(
            pubs.map((pub) =>
                pub.then(
                    () => Promise.resolve(),
                    (err: Error) => {
                        console.log("Relay publish failed:", err);
                        return Promise.reject(err.message);
                    }
                )
            )
        );

        return signedEvent.id;
    }
}

export default IndexService;