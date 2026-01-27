// THE SPY - Lightweight Client Tracker
// Place this in /public/tracker.js
(function() {
    // 1. Load Socket.io Client dynamically
    const script = document.createElement('script');
    script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js"; 
    script.onload = () => {
        // 2. Connect to "The Brain" (Backend)
        // CHANGE THIS URL to your Render/Railway URL when deployed!
        const socket = io('http://localhost:3000'); 
        
        socket.on('connect', () => {
            console.log('connected to surveillance');
            // 3. Report Presence
            socket.emit('visitor_hit');
        });
    };
    document.head.appendChild(script);
})();