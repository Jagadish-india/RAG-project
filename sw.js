// StudyBuddy Service Worker
// Enables offline functionality and caching for better performance

const CACHE_NAME = 'studybuddy-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Nunito:wght@400;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('StudyBuddy Service Worker: Install event');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('StudyBuddy Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('StudyBuddy Service Worker: Cache failed', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('StudyBuddy Service Worker: Activate event');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('StudyBuddy Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Claim control of all pages
  event.waitUntil(self.clients.claim());
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.includes('fonts.googleapis.com') &&
      !event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  // Handle Gemini API requests differently
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return a custom offline response for API calls
          return new Response(
            JSON.stringify({
              error: 'You are offline. StudyBuddy needs an internet connection to chat with you! 📡'
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          console.log('StudyBuddy Service Worker: Serving from cache', event.request.url);
          return response;
        }

        console.log('StudyBuddy Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            
            // Return a generic offline response for other resources
            return new Response('StudyBuddy is offline. Please check your internet connection! 🌐', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for offline messages (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'studybuddy-sync') {
    console.log('StudyBuddy Service Worker: Background sync triggered');
    event.waitUntil(syncOfflineMessages());
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('StudyBuddy Service Worker: Push event received');
  
  const options = {
    body: event.data ? event.data.text() : 'StudyBuddy has something new for you!',
    icon: '/manifest-icon-192.png',
    badge: '/manifest-icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/manifest-icon-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/manifest-icon-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('StudyBuddy 🤖', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('StudyBuddy Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for syncing offline messages
async function syncOfflineMessages() {
  try {
    // Get offline messages from IndexedDB (future implementation)
    console.log('StudyBuddy Service Worker: Syncing offline messages');
    
    // This would sync any messages stored while offline
    // Implementation would depend on IndexedDB storage
    
    return Promise.resolve();
  } catch (error) {
    console.error('StudyBuddy Service Worker: Sync failed', error);
    throw error;
  }
}

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  console.log('StudyBuddy Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handler
self.addEventListener('error', (event) => {
  console.error('StudyBuddy Service Worker: Error occurred', event.error);
});

// Unhandled rejection handler
self.addEventListener('unhandledrejection', (event) => {
  console.error('StudyBuddy Service Worker: Unhandled promise rejection', event.reason);
  event.preventDefault();
});

console.log('StudyBuddy Service Worker: Loaded and ready! 🚀');