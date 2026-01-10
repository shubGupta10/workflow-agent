import crypto from "crypto";

export function getPrReviewCacheKey(prUrl: string, diff: string) {
    const hash = crypto.createHash("sha256").update(diff).digest("hex");
    return `pr:review:${prUrl}:${hash}`;
}