document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================================================
     1. ENVELOPE OPENING LOGIC
     ========================================================= */
  const envelopeWrapper = document.getElementById("inviteEnvelopeWrapper");
  const envelopeImage = document.getElementById("envelopeImage");
  const mainContent = document.getElementById("mainContent");
  const weddingMusic = document.getElementById("weddingMusic");
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicLabel = document.getElementById("musicLabel");

  function setMusicButtonState(isPlaying) {
    if (!musicToggle) return;
    musicToggle.disabled = false;
    musicToggle.title = isPlaying ? "Pause wedding music" : "Play wedding music";
    musicToggle.classList.toggle("is-playing", isPlaying);
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
    if (musicIcon) musicIcon.textContent = isPlaying ? "♫" : "♪";
    if (musicLabel) musicLabel.textContent = isPlaying ? "Music On" : "Music Off";
  }

  function playWeddingMusic() {
    if (!weddingMusic) return;
    weddingMusic.volume = 0.55;
    const attempt = weddingMusic.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setMusicButtonState(true)).catch((error) => {
        console.warn("Wedding music could not start:", error);
        setMusicButtonState(false);
      });
    }
  }

  setMusicButtonState(false);

  if (weddingMusic) {
    weddingMusic.addEventListener("error", () => {
      console.error("Wedding music failed to load:", weddingMusic.currentSrc || weddingMusic.src);
      setMusicButtonState(false);
    });
    weddingMusic.addEventListener("loadeddata", () => {
      console.log("Wedding music loaded:", weddingMusic.currentSrc || weddingMusic.src);
    });
    weddingMusic.load();
  }

  if (envelopeWrapper && envelopeImage) {
    envelopeImage.addEventListener("click", () => {
      if (envelopeWrapper.classList.contains("is-opening")) return;

      envelopeWrapper.classList.add("is-opening");
      envelopeImage.classList.add("is-glowing");

      // Reveal the page first, then start playback from the same direct tap gesture.
      if (mainContent) {
        mainContent.classList.remove("hidden");
      }
      playWeddingMusic();

      setTimeout(() => {
        envelopeWrapper.classList.add("is-hidden");
        window.scrollTo(0, 0);
      }, 650); 
    });
  }

  if (musicToggle && weddingMusic) {
    musicToggle.addEventListener("click", () => {
      if (weddingMusic.paused) {
        playWeddingMusic();
      } else {
        weddingMusic.pause();
        setMusicButtonState(false);
      }
    });

    weddingMusic.addEventListener("play", () => setMusicButtonState(true));
    weddingMusic.addEventListener("pause", () => setMusicButtonState(false));
  }

  /* =========================================================
     2. COUNTDOWN
     ========================================================= */
  const targetDate = new Date("2026-11-24T20:00:00+05:30").getTime();

  function updateCountdown() {
    const now = Date.now();
    const distance = targetDate - now;

    if (distance <= 0) return;

    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60)
    };

    Object.entries(values).forEach(([key, value]) => {
      const el = document.getElementById(key);
      if (!el) return;
      const next = String(value).padStart(2, "0");
      if (el.textContent !== next) {
        el.textContent = next;
      }
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* =========================================================
     3. TIMELINE SCROLL (SVG WAVY LINE)
     ========================================================= */
  const timelinePath = document.getElementById("timelineProgress");
  
  if (timelinePath) {
    const pathLength = timelinePath.getTotalLength();
    
    // Hide stroke initially
    timelinePath.style.strokeDasharray = pathLength;
    timelinePath.style.strokeDashoffset = pathLength;
    // Smooth trailing transition
    timelinePath.style.transition = "stroke-dashoffset 0.15s ease-out";
    
    const timelineSection = document.querySelector(".timeline-section");
    let sectionTop = 0;
    let sectionHeight = 0;

    // Cache dimensions to prevent layout thrashing on scroll
    function updateDimensions() {
      if (!timelineSection) return;
      sectionTop = timelineSection.offsetTop;
      sectionHeight = timelineSection.offsetHeight;
    }

    // Initial calculation
    setTimeout(updateDimensions, 500); // slight delay to allow layout to settle
    window.addEventListener("resize", updateDimensions);
    
    let isTicking = false;
    window.addEventListener("scroll", () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (!timelineSection || sectionHeight === 0) {
             updateDimensions();
          }
          
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Start drawing when the top of the section enters the bottom of the viewport
          const startDrawPos = sectionTop - windowHeight + 100;
          // Finish drawing when the bottom of the section enters the bottom of the viewport (or slightly before)
          const endDrawPos = sectionTop + sectionHeight - windowHeight - 50;
          
          let progress = 0;
          
          if (scrollY > startDrawPos) {
            progress = (scrollY - startDrawPos) / (endDrawPos - startDrawPos);
          }
          
          // Clamp progress between 0 and 1
          progress = Math.max(0, Math.min(1, progress));
          
          // Update offset (from full length to 0)
          timelinePath.style.strokeDashoffset = pathLength * (1 - progress);
          
          isTicking = false;
        });
        isTicking = true;
      }
    }, { passive: true });
  }

});

  /* =========================================================
     4. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================= */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .hero-section, .invite-footer').forEach(el => {
    observer.observe(el);
  });

  /* =========================================================
     5. RSVP
     */
  const RSVP_URL = "https://script.google.com/macros/s/AKfycbxO0JGc647IwVsGIWf-e508744wk4qquZa9QgUrDi_3Y8jsKtm__tz5WaQV9TVJBc1w2w/exec";

  /* =========================================================
     5. RSVP FORM SUBMISSION
     ========================================================= */

  /*
   * Google Apps Script Web App endpoint.
   * Replace this placeholder with the /exec URL after deploying
   * the Google Apps Script supplied with this project.
   */
  const RSVP_ENDPOINT = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpSubmitBtn = document.getElementById("rsvpSubmitBtn");
  const rsvpSuccess = document.getElementById("rsvpSuccess");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!rsvpSubmitBtn) return;

      const originalText = rsvpSubmitBtn.textContent;
      if (rsvpSuccess) rsvpSuccess.hidden = true;

      if (RSVP_ENDPOINT === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        rsvpSubmitBtn.textContent = "RSVP Not Connected";
        rsvpSubmitBtn.disabled = false;

        if (rsvpSuccess) {
          rsvpSuccess.querySelector("strong").textContent = "RSVP setup incomplete";
          rsvpSuccess.querySelector("span:last-child").textContent =
            "The RSVP service still needs its Google Apps Script Web App URL.";
          rsvpSuccess.hidden = false;
        }
        return;
      }

      rsvpSubmitBtn.textContent = "Sending...";
      rsvpSubmitBtn.disabled = true;

      const formData = new FormData(rsvpForm);
      const data = new URLSearchParams();

      data.set("name", String(formData.get("name") || "").trim());
      data.set("phone", String(formData.get("phone") || "").trim());
      data.set("attendance", String(formData.get("attendance") || ""));
      data.set("events", formData.getAll("events").join(", "));

      try {
        const response = await fetch(RSVP_ENDPOINT, {
          method: "POST",
          body: data
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "The RSVP service rejected the submission.");
        }

        rsvpForm.reset();
        rsvpSubmitBtn.textContent = "RSVP Received";
        rsvpSubmitBtn.disabled = false;

        if (rsvpSuccess) {
          rsvpSuccess.querySelector("strong").textContent = `Thank you, ${data.get("name")}!`;
          rsvpSuccess.querySelector("span:last-child").textContent =
            "Your response has been recorded successfully.";
          rsvpSuccess.hidden = false;
        }
      } catch (error) {
        console.error("RSVP submission failed:", error);

        rsvpSubmitBtn.textContent = originalText;
        rsvpSubmitBtn.disabled = false;

        if (rsvpSuccess) {
          rsvpSuccess.querySelector("strong").textContent = "Submission failed";
          rsvpSuccess.querySelector("span:last-child").textContent =
            "Please check your connection and try again.";
          rsvpSuccess.hidden = false;
        }
      }
    });
  }
