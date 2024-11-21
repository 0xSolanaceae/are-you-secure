document.addEventListener("DOMContentLoaded", function() {
    const infoDiv = document.getElementById("info");
    const storyDiv = document.getElementById("story");
    const startButton = document.getElementById("startButton");

    function addInfo(label, value, className = '') {
        const info = document.createElement("div");
        info.className = `info ${className}`;
        info.innerHTML = `<strong>${label}:</strong> ${value}`;
        infoDiv.insertBefore(info, infoDiv.firstChild); // Prepend the info
        infoDiv.style.display = 'block'; // Make the info div visible
    }

    function showNextStep(message, callback) {
        const messageDiv = document.createElement("div");
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<p>${message}</p>`;
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", function() {
            messageDiv.remove();
            callback();
        });
        messageDiv.appendChild(nextButton);
        storyDiv.appendChild(messageDiv);
    }

    startButton.addEventListener("click", function() {
        startButton.style.display = 'none';
        showNextStep("Let's start with something simple. Your public IP address.", function() {
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    addInfo("Public IP Address", data.ip, 'shocking');
                    showNextStep("Your public IP address is visible to every website you visit. Imagine what someone could do with this information.", function() {
                        const rtc = new RTCPeerConnection({iceServers: []});
                        rtc.createDataChannel('');
                        rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
                        rtc.onicecandidate = function(event) {
                            if (event.candidate) {
                                const candidate = event.candidate.candidate;
                                const localIP = candidate.split(' ')[4];
                                addInfo("Local IP Address (WebRTC)", localIP, 'shocking');
                                showNextStep("Your local IP address can be exposed through WebRTC. This could be used to track your device on a local network.", function() {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(function(position) {
                                            addInfo("Latitude", position.coords.latitude, 'shocking');
                                            addInfo("Longitude", position.coords.longitude, 'shocking');
                                            showNextStep("Your geolocation can be accessed if you grant permission. This reveals your exact physical location.", function() {
                                                navigator.getBattery().then(function(battery) {
                                                    const batteryLevel = Math.round(battery.level * 100);
                                                    addInfo("Battery Charging", battery.charging ? "Yes" : "No", 'less-important');
                                                    addInfo("Battery Level", `${batteryLevel}%`, 'less-important');
                                                    let comment;
                                                    if (batteryLevel > 80) {
                                                        comment = "Nice job keeping your battery charged.";
                                                    } else if (batteryLevel <= 40) {
                                                        comment = "You might want to charge your device soon, you should get on that.";
                                                    } else {
                                                        comment = "Your battery level is fine, you won't have to worry about it for a while.";
                                                    }
                                                    showNextStep(comment, function() {
                                                        // Create a tracking element
                                                        const tracker = document.createElement("div");
                                                        tracker.style.position = "absolute";
                                                        tracker.style.width = "20px";
                                                        tracker.style.height = "20px";
                                                        tracker.style.border = "2px solid #9ccfd8";
                                                        tracker.style.borderRadius = "50%";
                                                        tracker.style.pointerEvents = "none";
                                                        document.body.appendChild(tracker);
    
                                                        // Track mouse pointer
                                                        document.addEventListener("mousemove", function(event) {
                                                            tracker.style.left = `${event.clientX - 10 + window.scrollX}px`;
                                                            tracker.style.top = `${event.clientY - 10 + window.scrollY}px`;
                                                        });
    
                                                        // Change document title based on visibility
                                                        document.addEventListener("visibilitychange", function() {
                                                            if (document.visibilityState === "visible") {
                                                                document.title = "Are You Secure?";
                                                            } else {
                                                                document.title = "I miss you, come back!";
                                                            }
                                                        });
    
                                                        showNextStep("Now, let's track your mouse movements. Try switching to a new tab, then look at the top text.", function() {
                                                            addInfo("User Agent", navigator.userAgent, 'less-important');
                                                            addInfo("Platform", navigator.platform, 'less-important');
                                                            addInfo("Language", navigator.language, 'less-important');
                                                            addInfo("Cookies Enabled", navigator.cookieEnabled, 'less-important');
                                                            addInfo("Screen Width", screen.width, 'less-important');
                                                            addInfo("Screen Height", screen.height, 'less-important');
                                                            addInfo("Window Width", window.innerWidth, 'less-important');
                                                            addInfo("Window Height", window.innerHeight, 'less-important');
                                                            addInfo("Timezone", Intl.DateTimeFormat().resolvedOptions().timeZone, 'less-important');
                                                            storyDiv.innerHTML = "<p>As you can see, a lot of information about you is readily available to websites you visit. Protect your privacy by being aware of what you share online.</p>";
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    } else {
                                        addInfo("Geolocation", "Not supported", 'shocking');
                                        showNextStep("Your geolocation can be accessed if you grant permission. Now, let's check your battery status.", function() {
                                            navigator.getBattery().then(function(battery) {
                                                const batteryLevel = battery.level * 100;
                                                addInfo("Battery Charging", battery.charging ? "Yes" : "No", 'less-important');
                                                addInfo("Battery Level", `${batteryLevel}%`, 'less-important');
                                                let comment;
                                                if (batteryLevel > 80) {
                                                    comment = "Nice job keeping your battery charged.";
                                                } else if (batteryLevel <= 40) {
                                                    comment = "You might want to charge your device soon, better get on that.";
                                                } else {
                                                    comment = "Your battery level is fine, may want to pay attention to it soon.";
                                                }
                                                showNextStep(comment, function() {
                                                    // Create a tracking element
                                                    const tracker = document.createElement("div");
                                                    tracker.style.position = "absolute";
                                                    tracker.style.width = "20px";
                                                    tracker.style.height = "20px";
                                                    tracker.style.border = "2px solid red";
                                                    tracker.style.borderRadius = "50%";
                                                    tracker.style.pointerEvents = "none";
                                                    document.body.appendChild(tracker);
                                                
                                                    // Track mouse pointer
                                                    document.addEventListener("mousemove", function(event) {
                                                        tracker.style.left = `${event.clientX - 10 + window.scrollX}px`;
                                                        tracker.style.top = `${event.clientY - 10 + window.scrollY}px`;
                                                    }, { once: true }); // Ensure this runs only once to set the initial position
                                                
                                                    // Continue tracking mouse pointer
                                                    document.addEventListener("mousemove", function(event) {
                                                        tracker.style.left = `${event.clientX - 10 + window.scrollX}px`;
                                                        tracker.style.top = `${event.clientY - 10 + window.scrollY}px`;
                                                    });
                                                    // Change document title based on visibility
                                                    document.addEventListener("visibilitychange", function() {
                                                        if (document.visibilityState === "visible") {
                                                            document.title = "Are You Secure?";
                                                        } else {
                                                            document.title = "I miss you, come back!";
                                                        }
                                                    });
    
                                                    showNextStep("I can see everywhere you move your mouse. Try opening a new tab, then look at the top text.", function() {
                                                        addInfo("User Agent", navigator.userAgent, 'less-important');
                                                        addInfo("Platform", navigator.platform, 'less-important');
                                                        addInfo("Language", navigator.language, 'less-important');
                                                        addInfo("Cookies Enabled", navigator.cookieEnabled, 'less-important');
                                                        addInfo("Screen Width", screen.width, 'less-important');
                                                        addInfo("Screen Height", screen.height, 'less-important');
                                                        addInfo("Window Width", window.innerWidth, 'less-important');
                                                        addInfo("Window Height", window.innerHeight, 'less-important');
                                                        addInfo("Timezone", Intl.DateTimeFormat().resolvedOptions().timeZone, 'less-important');
                                                        storyDiv.innerHTML = "<p>As you can see, a lot of information about you is readily available to websites you visit. Protect your privacy by being aware of what you share online.</p>";
                                                    });
                                                });
                                            });
                                        });
                                    }
                                });
                            }
                        };
                    });
                });
        });
    });
});