// =============================================
// LOVE HUB — MONTHSARY EDITION
// JavaScript
// Relationship start: March 25, 2026
// =============================================

"use strict";

// =============================================
// 1. CONFIGURATION
// =============================================

const CONFIG = {
  username: "Casallo",
  password: "iloveyou",

  // Months are zero-based in JavaScript:
  // 2 means March.
  relationshipStartDate: new Date(2026, 2, 25, 0, 0, 0, 0)
};

// =============================================
// 2. HELPER FUNCTIONS
// =============================================

const $ = (selector) => document.querySelector(selector);

function padNumber(number) {
  return String(number).padStart(2, "0");
}

// =============================================
// 3. LOGIN
// =============================================

const loginScreen = $("#loginScreen");
const loginForm = $("#loginForm");
const loginMessage = $("#loginMessage");
const introScreen = $("#introScreen");
const dashboard = $("#dashboard");

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = $("#username")?.value.trim() ?? "";
    const password = $("#password")?.value ?? "";

    if (
      username === CONFIG.username &&
      password === CONFIG.password
    ) {
      if (loginMessage) {
        loginMessage.textContent = "";
      }

      loginScreen?.classList.add("hidden");
      introScreen?.classList.remove("hidden");

      startHeartAnimation();
    } else {
      if (loginMessage) {
        loginMessage.textContent =
          "Incorrect username or password. Try again, please. ♥";
      }

      const passwordInput = $("#password");

      if (passwordInput) {
        passwordInput.value = "";
        passwordInput.focus();
      }
    }
  });
}


 // =============================================
 // 4. CINEMATIC ENTER THE WORLD
 // =============================================

const enterDashboardButton = $("#enterDashboard");
let enteringWorld = false;

if (enterDashboardButton) {
  enterDashboardButton.addEventListener("click", () => {
    // Prevent repeated clicks during the transition.
    if (enteringWorld) return;
    enteringWorld = true;

    const intro = $("#introScreen");
    const dashboard = $("#dashboard");

    if (!intro || !dashboard) {
      enteringWorld = false;
      return;
    }

    enterDashboardButton.disabled = true;

    // Create the cinematic light burst.
    let burst = $(".world-transition");

    if (!burst) {
      burst = document.createElement("div");
      burst.className = "world-transition";
      burst.setAttribute("aria-hidden", "true");
      document.body.appendChild(burst);
    }

    // Restart the burst animation.
    burst.classList.remove("active");
    void burst.offsetWidth;
    burst.classList.add("active");

    // Zoom and fade out the heart intro.
    intro.classList.add("world-leaving");

    // Reveal the world after the light burst begins.
    window.setTimeout(() => {
      intro.classList.add("hidden");
      intro.classList.remove("world-leaving");

      dashboard.classList.remove("hidden");
      dashboard.classList.remove("world-arriving");

      // Restart the dashboard entrance animation.
      void dashboard.offsetWidth;
      dashboard.classList.add("world-arriving");

      // Remove the arrival animation after it finishes.
      // This prevents the animation transform from affecting the sidebar.
      window.setTimeout(() => {
          dashboard.classList.remove("world-arriving");
      }, 1200);

      // Start the existing dashboard features.
      updateMonthsaryCountdown();
      startMonthsaryCountdown();
      startFireworks();

      // Clean up the temporary light burst.
      window.setTimeout(() => {
        burst.classList.remove("active");
        enteringWorld = false;
        enterDashboardButton.disabled = false;
      }, 650);

    }, 650);
  });
}


// =============================================
// 5. HEART PARTICLE ANIMATION
// =============================================

let heartAnimationFrame = null;
let heartParticles = [];
let heartCanvas = null;
let heartContext = null;
let heartAnimationStarted = false;

function resizeHeartCanvas() {
  if (!heartCanvas || !heartContext) return;

  const rect = heartCanvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  heartCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
  heartCanvas.height = Math.max(1, Math.floor(rect.height * dpr));

  heartContext.setTransform(dpr, 0, 0, dpr, 0, 0);

  createHeartParticles();
}

function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);

  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return { x, y };
}

function createHeartParticles() {
  if (!heartCanvas) return;

  const width = heartCanvas.clientWidth;
  const height = heartCanvas.clientHeight;

  const scale = Math.min(width / 42, height / 34, 13);
  const centerX = width / 2;
  const centerY = height / 2 - 10;

  heartParticles = [];

  for (let t = 0; t < Math.PI * 2; t += 0.035) {
    const point = heartPoint(t);

    heartParticles.push({
      x: centerX + point.x * scale,
      y: centerY - point.y * scale,
      phase: Math.random() * Math.PI * 2,
      size: 1 + Math.random() * 2
    });
  }

  // Add floating particles around the heart.
  for (let i = 0; i < 90; i++) {
    heartParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      phase: Math.random() * Math.PI * 2,
      size: 0.6 + Math.random() * 1.5,
      floating: true
    });
  }
}

function drawHeartFrame(time) {
  if (!heartCanvas || !heartContext) return;

  if (introScreen?.classList.contains("hidden")) {
    heartAnimationFrame = null;
    return;
  }

  const width = heartCanvas.clientWidth;
  const height = heartCanvas.clientHeight;

  heartContext.clearRect(0, 0, width, height);

  const pulse = 1 + Math.sin(time * 0.0018) * 0.035;

  heartParticles.forEach((particle) => {
    let x = particle.x;
    let y = particle.y;

    if (particle.floating) {
      y += Math.sin(time * 0.0007 + particle.phase) * 9;
      x += Math.cos(time * 0.0005 + particle.phase) * 5;
    } else {
      const centerX = width / 2;
      const centerY = height / 2 - 10;

      x = centerX + (particle.x - centerX) * pulse;
      y = centerY + (particle.y - centerY) * pulse;
    }

    const isPink = Math.sin(particle.phase + time * 0.001) > 0;

    heartContext.beginPath();
    heartContext.arc(
      x,
      y,
      particle.size,
      0,
      Math.PI * 2
    );

    heartContext.fillStyle = isPink
      ? "rgba(255, 117, 181, 0.9)"
      : "rgba(112, 200, 255, 0.9)";

    heartContext.shadowBlur = 9;
    heartContext.shadowColor = isPink ? "#ff75b5" : "#70c8ff";
    heartContext.fill();
  });

  heartContext.shadowBlur = 0;

  heartAnimationFrame = requestAnimationFrame(drawHeartFrame);
}

function startHeartAnimation() {
  if (heartAnimationStarted) {
    if (heartAnimationFrame === null) {
      heartAnimationFrame = requestAnimationFrame(drawHeartFrame);
    }

    return;
  }

  heartCanvas = $("#heartCanvas");

  if (!heartCanvas) return;

  heartContext = heartCanvas.getContext("2d");

  if (!heartContext) return;

  heartAnimationStarted = true;

  resizeHeartCanvas();

  heartAnimationFrame = requestAnimationFrame(drawHeartFrame);
}

window.addEventListener("resize", () => {
  if (heartCanvas && !introScreen?.classList.contains("hidden")) {
    resizeHeartCanvas();
  }
});

// =============================================
// 6. MOBILE NAVIGATION MENU
// =============================================

const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });
}

// =============================================
// 7. MONTHSARY COUNTDOWN
// =============================================

let monthsaryTimer = null;

function getNextMonthsary(now = new Date()) {
  const start = CONFIG.relationshipStartDate;

  // Before the official relationship date.
  if (now < start) {
    return new Date(start);
  }

  // Begin with the 25th of the current month.
  let target = new Date(
    now.getFullYear(),
    now.getMonth(),
    25,
    0,
    0,
    0,
    0
  );

  // If today's monthsary date has passed, move to next month.
  if (target <= now) {
    target = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      25,
      0,
      0,
      0,
      0
    );
  }

  return target;
}

function getCompletedMonths(now = new Date()) {
  const start = CONFIG.relationshipStartDate;

  if (now < start) return 0;

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  if (now.getDate() < start.getDate()) {
    months--;
  }

  return Math.max(0, months);
}

function updateMonthsaryCountdown() {
  const daysElement = $("#lhDays");
  const hoursElement = $("#lhHours");
  const minutesElement = $("#lhMinutes");
  const secondsElement = $("#lhSeconds");
  const targetElement = $("#lhCountdownTarget");
  const messageElement = $("#lhCountdownMessage");

  if (
    !daysElement ||
    !hoursElement ||
    !minutesElement ||
    !secondsElement
  ) {
    return;
  }

  const now = new Date();
  const relationshipStart = CONFIG.relationshipStartDate;

  if (now < relationshipStart) {
    const distance = relationshipStart.getTime() - now.getTime();

    daysElement.textContent = padNumber(
      Math.floor(distance / (1000 * 60 * 60 * 24))
    );

    hoursElement.textContent = padNumber(
      Math.floor((distance / (1000 * 60 * 60)) % 24)
    );

    minutesElement.textContent = padNumber(
      Math.floor((distance / (1000 * 60)) % 60)
    );

    secondsElement.textContent = padNumber(
      Math.floor((distance / 1000) % 60)
    );

    if (targetElement) {
      targetElement.textContent = "Our story begins on March 25, 2026";
    }

    if (messageElement) {
      messageElement.textContent =
        "Counting down to the beginning of our story. ♥";
    }

    return;
  }

  const target = getNextMonthsary(now);
  const distance = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  daysElement.textContent = padNumber(days);
  hoursElement.textContent = padNumber(hours);
  minutesElement.textContent = padNumber(minutes);
  secondsElement.textContent = padNumber(seconds);

  if (targetElement) {
    targetElement.textContent = target.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  }

  if (messageElement) {
    const completedMonths = getCompletedMonths(now);

    if (now.getDate() === 25) {
      messageElement.textContent =
        `Happy ${completedMonths}-month monthsary! ` +
        "Here's to more memories together. ♥";
    } else {
      messageElement.textContent =
        `We've shared ${completedMonths} ` +
        `${completedMonths === 1 ? "beautiful month" : "beautiful months"} ` +
        "together. The next chapter is getting closer! ♥";
    }
  }
}

function startMonthsaryCountdown() {
  if (monthsaryTimer !== null) {
    clearInterval(monthsaryTimer);
  }

  updateMonthsaryCountdown();

  monthsaryTimer = setInterval(() => {
    updateMonthsaryCountdown();
  }, 1000);
}

// =============================================
// 8. COUNTDOWN SOUND TOGGLE
// =============================================

let countdownSoundEnabled = false;
let soundContext = null;

const soundToggle = $("#lhSoundToggle");

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    countdownSoundEnabled = !countdownSoundEnabled;

    soundToggle.textContent = countdownSoundEnabled
      ? "🔊 Sound Enabled"
      : "🔇 Sound Disabled";

    if (countdownSoundEnabled) {
      playSoftTone();
    }
  });
}

function playSoftTone() {
  if (!countdownSoundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!soundContext) {
      soundContext = new AudioContextClass();
    }

    if (soundContext.state === "suspended") {
      soundContext.resume();
    }

    const oscillator = soundContext.createOscillator();
    const gain = soundContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 660;

    gain.gain.setValueAtTime(0.0001, soundContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.05,
      soundContext.currentTime + 0.03
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      soundContext.currentTime + 0.25
    );

    oscillator.connect(gain);
    gain.connect(soundContext.destination);

    oscillator.start();
    oscillator.stop(soundContext.currentTime + 0.26);
  } catch (error) {
    console.warn("Audio could not be played.", error);
  }
}

// =============================================
// 9. SURPRISE BUTTON
// =============================================

const surpriseButton = $("#surpriseButton");
const surpriseMessage = $("#surpriseMessage");

const surpriseMessages = [
  "Surprise! You are one of my favorite parts of life. 💗",
  "If I could save one moment, I'd save a happy moment with you. ✨",
  "A little reminder: you are loved, valued, and appreciated. ♥",
  "More memories, more laughter, and more months together. 💝",
  "No grand gift can replace the little moments we share. 🌷"
];

let previousSurpriseIndex = -1;

if (surpriseButton && surpriseMessage) {
  surpriseButton.addEventListener("click", () => {
    let index;

    do {
      index = Math.floor(Math.random() * surpriseMessages.length);
    } while (
      surpriseMessages.length > 1 &&
      index === previousSurpriseIndex
    );

    previousSurpriseIndex = index;
    surpriseMessage.textContent = surpriseMessages[index];

    startFireworks();
  });
}

// =============================================
// 10. LOVE QUIZ
// =============================================

const quizOptions = document.querySelectorAll(".quiz-option");
const quizMessage = $("#quizMessage");

quizOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const isCorrect = option.dataset.answer === "correct";

    if (quizMessage) {
      quizMessage.textContent = isCorrect
        ? "Correct! March 25, 2026 — the start of our story. ♥"
        : "Not quite! Try again. Our official date is March 25, 2026. 💗";
    }

    if (isCorrect) {
      quizOptions.forEach((button) => {
        button.disabled = true;
      });

      startFireworks();
    }
  });
});

// =============================================
// 11. DAILY LOVE NOTES
// =============================================

const dailyMessage = $("#dailyMessage");
const newDailyMessageButton = $("#newDailyMessage");

const dailyMessages = [
  "You are appreciated more than words can say. ♥",
  "Small moments with you can become my favorite memories. ✨",
  "I hope today gives you reasons to smile. 🌷",
  "Thank you for being part of my journey. 💗",
  "One day at a time, one memory at a time, together. 🌙",
  "You deserve kindness, peace, and happiness today. 💙",
  "No matter how busy life gets, let's keep making time for us. 💞"
];

let previousDailyIndex = -1;

if (newDailyMessageButton && dailyMessage) {
  newDailyMessageButton.addEventListener("click", () => {
    let index;

    do {
      index = Math.floor(Math.random() * dailyMessages.length);
    } while (
      dailyMessages.length > 1 &&
      index === previousDailyIndex
    );

    previousDailyIndex = index;
    dailyMessage.textContent = dailyMessages[index];
  });
}

// =============================================
// 12. FIREWORKS ANIMATION
// =============================================

let fireworksCanvas = null;
let fireworksContext = null;
let fireworksAnimationFrame = null;
let fireworksRunning = false;
let fireworksParticles = [];

function resizeFireworksCanvas() {
  if (!fireworksCanvas || !fireworksContext) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  fireworksCanvas.width = Math.floor(window.innerWidth * dpr);
  fireworksCanvas.height = Math.floor(window.innerHeight * dpr);

  fireworksContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createFirework(x, y) {
  const colors = [
    "#ff75b5",
    "#ffc1df",
    "#70c8ff",
    "#b4e7ff",
    "#b39aff"
  ];

  const color = colors[Math.floor(Math.random() * colors.length)];
  const particleCount = 55;

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount;
    const speed = 1.2 + Math.random() * 4;

    fireworksParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.008 + Math.random() * 0.014,
      radius: 1 + Math.random() * 2,
      color
    });
  }
}

function drawFireworks() {
  if (!fireworksCanvas || !fireworksContext) return;

  fireworksContext.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  fireworksParticles = fireworksParticles.filter(
    (particle) => particle.life > 0
  );

  fireworksParticles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vy += 0.025;
    particle.vx *= 0.99;
    particle.vy *= 0.99;
    particle.life -= particle.decay;

    fireworksContext.globalAlpha = Math.max(0, particle.life);
    fireworksContext.beginPath();

    fireworksContext.arc(
      particle.x,
      particle.y,
      particle.radius,
      0,
      Math.PI * 2
    );

    fireworksContext.fillStyle = particle.color;
    fireworksContext.fill();
  });

  fireworksContext.globalAlpha = 1;

  if (fireworksParticles.length > 0) {
    fireworksAnimationFrame = requestAnimationFrame(drawFireworks);
  } else {
    fireworksRunning = false;
    fireworksAnimationFrame = null;
    fireworksContext.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}

function startFireworks() {
  if (!fireworksCanvas) {
    fireworksCanvas = $("#fireworksCanvas");

    if (!fireworksCanvas) return;

    fireworksContext = fireworksCanvas.getContext("2d");

    if (!fireworksContext) return;

    resizeFireworksCanvas();
  }

  // Launch two or three bursts per celebration.
  const burstCount = 2 + Math.floor(Math.random() * 2);

  for (let i = 0; i < burstCount; i++) {
    const x = window.innerWidth * (0.2 + Math.random() * 0.6);
    const y = window.innerHeight * (0.15 + Math.random() * 0.4);

    setTimeout(() => {
      createFirework(x, y);

      if (!fireworksRunning) {
        fireworksRunning = true;
        fireworksAnimationFrame = requestAnimationFrame(drawFireworks);
      }
    }, i * 250);
  }
}

window.addEventListener("resize", resizeFireworksCanvas);

// =============================================
// 13. INITIALIZE
// =============================================

document.addEventListener("DOMContentLoaded", () => {
  updateMonthsaryCountdown();

  // Countdown is updated every second even before opening dashboard.
  startMonthsaryCountdown();

  // If the user is already on the dashboard, keep the timer accurate.
  if (dashboard && !dashboard.classList.contains("hidden")) {
    updateMonthsaryCountdown();
  }
});

// =============================================
// INTERACTIVE LAMP CONTROLS
// =============================================

(() => {
  const loginScreen = document.querySelector("#loginScreen");
  const lampToggle = document.querySelector("#lampToggle");
  const lampToggleText = document.querySelector("#lampToggleText");
  const lampStatus = document.querySelector("#lampStatus");
  const lampColors = document.querySelectorAll(".lamp-color");

  if (
    !loginScreen ||
    !lampToggle ||
    !lampToggleText ||
    !lampStatus
  ) {
    return;
  }

  let lampIsOn = true;

  // Change the selected lighting color.
  lampColors.forEach((button) => {
    button.addEventListener("click", () => {
      const color = button.dataset.color;

      if (!color) return;

      loginScreen.style.setProperty("--lamp-color", color);

      lampColors.forEach((colorButton) => {
        const isSelected = colorButton === button;

        colorButton.classList.toggle("active", isSelected);
        colorButton.setAttribute(
          "aria-pressed",
          String(isSelected)
        );
      });
    });
  });

  // Turn the lamp on and off.
  lampToggle.addEventListener("click", () => {
    lampIsOn = !lampIsOn;

    loginScreen.classList.toggle("lamp-off", !lampIsOn);

    lampToggle.setAttribute(
      "aria-pressed",
      String(lampIsOn)
    );

    lampToggleText.textContent = lampIsOn
      ? "Turn the light off"
      : "Turn the light on";

    lampStatus.textContent = lampIsOn
      ? "LIGHT ON"
      : "LIGHT OFF";

    lampToggle.querySelector(".switch-icon").textContent =
      lampIsOn ? "☼" : "☾";
  });
})();


/* ==========================================
   LOVE HUB — SIDEBAR INTERACTIONS
========================================== */


/* ==========================================
   LOVE HUB — INSTAGRAM-STYLE NAVIGATION
========================================== */

(() => {
    const dashboard = document.querySelector("#dashboard");
    const nav = document.querySelector("#mainNav");
    const menuButton = document.querySelector("#menuToggle");

    if (!dashboard || !nav) return;

    const links = nav.querySelectorAll(".sidebar-link");

    // Get all main pages inside the dashboard
    const pages = dashboard.querySelectorAll(":scope > section");
    const footer = dashboard.querySelector(":scope > footer");

    function showPage(targetId, updateAddress = true) {
        let selectedPage = null;

        pages.forEach((page) => {
            const isSelected = page.id === targetId;

            page.classList.toggle("lh-view-active", isSelected);
            page.classList.toggle("lh-view-hidden", !isSelected);

            if (isSelected) {
                selectedPage = page;
            }
        });

        // Only show the footer on the Home page
        if (footer) {
            footer.classList.toggle("lh-view-hidden", targetId !== "home");
        }

        // Highlight the correct sidebar icon
        links.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${targetId}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        // Update the URL without jumping to the old scroll position
        if (updateAddress && selectedPage) {
            history.replaceState(null, "", `#${targetId}`);
        }

        // Always start the selected page at the top
        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }

    // Sidebar clicks switch pages instead of showing every section
    links.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const targetId = link.getAttribute("href").slice(1);

            if (document.getElementById(targetId)) {
                showPage(targetId);
            }
        });
    });

    // Expand or collapse the sidebar
    if (menuButton) {
        menuButton.addEventListener("click", () => {
            const expanded = dashboard.classList.toggle("sidebar-expanded");

            menuButton.setAttribute("aria-expanded", String(expanded));
        });
    }

    // Support browser Back/Forward navigation
    window.addEventListener("popstate", () => {
        const targetId = window.location.hash.slice(1) || "home";

        if ([...pages].some((page) => page.id === targetId)) {
            showPage(targetId, false);
        } else {
            showPage("home", false);
        }
    });

    // Show Home first, or restore a valid page from the URL
    const initialPage = window.location.hash.slice(1) || "home";

    if ([...pages].some((page) => page.id === initialPage)) {
        showPage(initialPage, false);
    } else {
        showPage("home", false);
    }
})();


/* ==========================================
   LOVE HUB — WELCOME TO LOGIN TRANSITION
========================================== */

(() => {
    const welcomePage = document.querySelector("#welcomePage");
    const loginScreen = document.querySelector("#loginScreen");
    const welcomeButton = document.querySelector("#welcomeLoginButton");

    if (!welcomePage || !loginScreen || !welcomeButton) return;

    // Start with the welcome screen visible
    welcomePage.hidden = false;
    loginScreen.classList.add("hidden");

    welcomeButton.addEventListener("click", () => {
        if (welcomeButton.disabled) return;

        welcomeButton.disabled = true;
        welcomePage.classList.add("welcome-leaving");

        window.setTimeout(() => {
            // Hide the welcome page completely
            welcomePage.hidden = true;
            welcomePage.classList.remove("welcome-leaving");

            // Show the existing lamp and login screen
            loginScreen.classList.remove("hidden");

            window.scrollTo(0, 0);
        }, 450);
    });
})();

const passwordField = document.getElementById("password");
const passwordToggle = document.getElementById("togglePassword");

if (passwordField && passwordToggle) {
    passwordToggle.addEventListener("click", () => {
        const isHidden = passwordField.type === "password";

        passwordField.type = isHidden ? "text" : "password";

        passwordToggle.setAttribute(
            "aria-label",
            isHidden ? "Hide password" : "Show password"
        );

        passwordToggle.setAttribute(
            "aria-pressed",
            String(isHidden)
        );
    });
}



// =============================================
// END OF LOVE HUB SCRIPT
// =============================================