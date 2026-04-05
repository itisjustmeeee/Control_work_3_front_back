import { urlBase64ToUint8Array } from '../utils/push';

const SERVER_URL = "http://localhost:3001";

export async function subscribeToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Push не поддерживается");
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;

        const response = await fetch(`${SERVER_URL}/vapid-public-key`);
        const publicKey = await response.text();

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        await fetch(`${SERVER_URL}/subscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
        });

        console.log("Подписка отправлена");
    } catch (err) {
        console.error("Ошибка подписки:", err);
    }
}

export async function unsubscribeFromPush() {
    if (!("serviceWorker" in navigator)) return;

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            console.log("Нет активной подписки");
            return;
        }

        await fetch(`${SERVER_URL}/unsubscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                endpoint: subscription.endpoint,
            }),
        });

        await subscription.unsubscribe();

        console.log("Отписка выполнена");
    } catch (err) {
        console.error("Ошибка отписки:", err);
    }
}