document.addEventListener("DOMContentLoaded", function() {
    const infoDiv = document.getElementById("info");
    const storyDiv = document.getElementById("story");
    const startButton = document.getElementById("startButton");

    function addInfo(label, value, className = '') {
        const info = document.createElement("div");
        info.className = `info ${className} initial`;
        info.innerHTML = `<strong>${label}:</strong> ${value}`;
        infoDiv.insertBefore(info, infoDiv.firstChild);
        infoDiv.style.display = 'block';
        requestAnimationFrame(() => {
            info.classList.remove('initial');
        });
    }

    function showNextStep(message, callback) {
        const messageDiv = document.createElement("div");
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<p>${message}</p>`;
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.addEventListener("click", function() {
            messageDiv.classList.add('fade-out');
            setTimeout(() => {
                messageDiv.remove();
                callback();
            }, 100);
        });
        messageDiv.appendChild(nextButton);
        messageDiv.classList.add('fade-in');
        storyDiv.appendChild(messageDiv);
    }

    startButton.addEventListener("click", function() {
        startButton.style.display = 'none';
        showNextStep("Let's start with something simple. Your public IP address.", function() {
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    addInfo("Public IP Address", data.ip, 'shocking');
                    showNextStep("Your public IP address is visible to every website you visit. This alone can be used to approximate your location.", function() {
                        const rtc = new RTCPeerConnection({iceServers: []});
                        rtc.createDataChannel('');
                        rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
                        rtc.onicecandidate = function(event) {
                            if (event.candidate) {
                                const candidate = event.candidate.candidate;
                                const localIP = candidate.split(' ')[4];
                                addInfo("Local IP Address (WebRTC)", localIP, 'shocking');
                                showNextStep("Your local IP address is exposed through WebRTC. This is used to single out your device among all other users.", function() {
                                    if (navigator.geolocation) {
                                        navigator.geolocation.getCurrentPosition(function(position) {
                                            addInfo("Latitude", position.coords.latitude, 'shocking');
                                            addInfo("Longitude", position.coords.longitude, 'shocking');
                                            proceedWithBatteryStatus();
                                        }, function(error) {
                                            addInfo("Geolocation", "Not available, good job :)", 'shocking');
                                            proceedWithBatteryStatus();
                                        });
                                    } else {
                                        addInfo("Geolocation", "Not supported", 'shocking');
                                        proceedWithBatteryStatus();
                                    }

                                    function proceedWithBatteryStatus() {
                                        showNextStep("Your geolocation can be accessed if you grant permission. Now, let's check your battery status.", function() {
                                            navigator.getBattery().then(function(battery) {
                                                const batteryLevel = Math.round(battery.level * 100);
                                                addInfo("Battery Charging", battery.charging ? "Yes" : "No", 'shocking');
                                                addInfo("Battery Level", `${batteryLevel}%`, 'shocking');
                                                let comment;
                                                if (batteryLevel > 80) {
                                                    comment = "Nice job keeping your battery charged.";
                                                } else if (batteryLevel <= 40) {
                                                    comment = "You might want to charge your device soon (if you aren't already), you should get on that.";
                                                } else {
                                                    comment = "Your battery level is fine, you won't have to worry about it for a while.";
                                                }
                                                showNextStep(comment, function() {
                                                    const tracker = document.createElement("div");
                                                    tracker.style.position = "absolute";
                                                    tracker.style.width = "20px";
                                                    tracker.style.height = "20px";
                                                    tracker.style.border = "2px solid #9ccfd8";
                                                    tracker.style.borderRadius = "50%";
                                                    tracker.style.pointerEvents = "none";
                                                    document.body.appendChild(tracker);

                                                    document.addEventListener("mousemove", function(event) {
                                                        tracker.style.left = `${event.clientX - 10 + window.scrollX}px`;
                                                        tracker.style.top = `${event.clientY - 10 + window.scrollY}px`;
                                                    });

                                                    document.addEventListener("visibilitychange", function() {
                                                        if (document.visibilityState === "visible") {
                                                            document.title = "Are You Secure?";
                                                        } else {
                                                            document.title = "I'm watching you.";
                                                        }
                                                    });

                                                    showNextStep("Now, let's track your mouse movements. Move your cursor around. Now, see where it says 'Are You Secure?' at the top of the tab? Switch to a new tab and take a look.", function() {
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