/* =========================================================
   WQ-Sender — Landing scripts (vanilla JS, no deps)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Header background on scroll ---------- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    var closeMenu = function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // close after picking a link
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    // close on resize to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- FAQ accordion (single open at a time) ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Graceful screenshot fallback ---------- */
  document.querySelectorAll(".shot img").forEach(function (img) {
    img.addEventListener("error", function () {
      var shot = img.closest(".shot");
      if (shot) shot.classList.add("is-missing");
    });
  });

  /* ---------- Screenshot lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector(".lightbox-img");
    var lbCap = lightbox.querySelector(".lightbox-cap");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lastFocused = null;

    var openLightbox = function (src, alt, caption) {
      lastFocused = document.activeElement;
      lbImg.src = src;
      lbImg.alt = alt || "";
      lbCap.textContent = caption || "";
      lightbox.hidden = false;
      // force reflow so the opening transition runs
      void lightbox.offsetWidth;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    };

    var closeLightbox = function () {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      var hide = function () {
        lightbox.hidden = true;
        lbImg.src = "";
        lightbox.removeEventListener("transitionend", hide);
      };
      lightbox.addEventListener("transitionend", hide);
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    };

    document.querySelectorAll(".shot-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var shot = btn.closest(".shot");
        if (shot && shot.classList.contains("is-missing")) return;
        var img = btn.querySelector("img");
        var cap = shot ? shot.querySelector(".cap") : null;
        if (!img) return;
        openLightbox(img.src, img.alt, cap ? cap.textContent : "");
      });
    });

    lbClose.addEventListener("click", closeLightbox);

    // close on backdrop click (but not when clicking the image)
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
