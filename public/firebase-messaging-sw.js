// Import Firebase libraries
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js");

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXEpbeZsiEYvXthTbHxCOAX300bOhvyn4",
    authDomain: "mignonne-pink-paws.firebaseapp.com",
    projectId: "mignonne-pink-paws",
    storageBucket: "mignonne-pink-paws.firebasestorage.com",
    messagingSenderId: "543597676887",
    appId: "1:543597676887:web:a00f75399dba7d50ccd612",
    measurementId: "G-BYW070J97W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("[FCM SW] Background notification received:", payload);

    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "You have a new message.";
    const image = payload.notification?.image || "/default-icon.png";
    const url = payload.data?.url || "/";  // Fallback URL

    console.log("📩 Notification Data:", { title, body, image, url });

    // Show the notification
    self.registration.showNotification(title, {
        body,
        icon: image,
        data: { url },  // ✅ Store URL properly
        requireInteraction: true, // Keeps the notification until user interacts
        actions: [{ action: "open_url", title: "Open" }] // ✅ Ensures explicit action
    });
});

// Handle notification click
// self.addEventListener("notificationclick", (event) => {
//     console.log("🔔 Notification clicked:", event.notification);

//     event.notification.close();

//     // Fallback: Use action if data.url is missing
//     const urlToOpen = event.notification?.data?.url || event.action || "/";

//     console.log("🌐 URL to open:", urlToOpen);

//     event.waitUntil(
//         clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
//             for (let client of clientList) {
//                 console.log("🖥 Checking existing client:", client.url);
//                 if (client.url.includes(urlToOpen) && "focus" in client) {
//                     return client.focus();
//                 }
//             }
//             console.log("🌍 Opening new window:", urlToOpen);
//             return clients.openWindow(urlToOpen);
//         })
//     );
// });


self.addEventListener('push', (e) => {
    const notif = e.data.json().notification
    const data = e.data.json().data

    e.waitUntil(
        self.registration.showNotification(notif.title, {
            body: notif.body,
            icon: notif.image,
            data: {
                url: data.url                                      // I mean over here
            }
        })
    )
})


self.addEventListener('notificationclick', (e) => {
    e.waitUntil(clients.openWindow(e?.notification?.data?.url))      // and here
})