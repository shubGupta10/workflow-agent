import { getToken } from '../auth';
import { UsageStatsResponse, SubscriptionResponse } from '../types/subscription';

const appUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const getHeaders = () => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

export const getUsageStats = async (): Promise<UsageStatsResponse> => {
    if (!appUrl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appUrl}/api/v1/get-usage-stats`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getUsageStats error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};

export const getSubscription = async (): Promise<SubscriptionResponse> => {
    if (!appUrl) {
        throw new Error('BACKEND_URL environment variable is not set');
    }

    const url = `${appUrl}/api/v1/get-subscription`;

    const response = await fetch(url, {
        method: "GET",
        headers: getHeaders(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[API] getSubscription error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
};
