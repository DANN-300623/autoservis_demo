(function () {
  "use strict";

  /* ---------- Sticky header shadow ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("glavna-navigacija");

  function closeNav() {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Otvori meni");
  }

  function toggleNav() {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Zatvori meni" : "Otvori meni");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", toggleNav);

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- Reveal-on-scroll animation ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contact form (povezana sa Apps Script) ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var POGON_SCRIPT_URL = "PASTE_TVOJ_APPS_SCRIPT_WEB_APP_URL_OVDE";

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var podaci = {
        ime: form.ime.value,
        telefon: form.telefon.value,
        email: form.email.value,
        poruka: form.poruka.value,
      };

      submitBtn.disabled = true;
      status.textContent = "Slanje u toku...";

      fetch(POGON_SCRIPT_URL, { method: "POST", body: JSON.stringify(podaci) })
        .then(function (res) { return res.json(); })
        .then(function (res) {
          submitBtn.disabled = false;
          if (res.uspesno) {
            status.textContent = "Hvala! Proverite svoj mejl.";
            form.reset();
          } else {
            status.textContent = res.poruka || "Došlo je do greške. Pokušajte ponovo.";
          }
        })
        .catch(function () {
          submitBtn.disabled = false;
          status.textContent = "Došlo je do greške pri slanju. Proverite konekciju.";
        });
    });
  }
})();
