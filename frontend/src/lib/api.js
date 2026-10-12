const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";

async function request(path, options) {
    const res = await fetch(`${API_URL}${path}`, options);
    const body = await res.json().catch(() => null);

    if(!res.ok) {
        throw new Error(body?.error ?? `Request failed (${res.status})`);
    }
    return body;
}

export const getServices = () => request("/services");
export const getQueues = () => request("/tickets/queues");
export const getCounterServices = (counterId) =>
    request(`/counters/${counterId}/services`);

export const createTicket = (serviceId) =>
    request("/tickets", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({serviceId}),        
    });

export const callNext = (counterId) => request(`/counters/${counterId}/next`);