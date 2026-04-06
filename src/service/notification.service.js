import API from '@/api/api-main';

/**
 * GET /notification/me
 * @param {{ skip?: number, limit?: number }} [params]
 */
export async function fetchMyNotifications(params = {}) {
    const { skip = 0, limit = 20 } = params;
    const qs = new URLSearchParams({ skip: String(skip), limit: String(limit) }).toString();
    const res = await API.get(`notification/me?${qs}`);
    return res;
}

