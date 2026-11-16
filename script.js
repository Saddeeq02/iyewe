document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Gallery expand/collapse
  const toggleGalleryBtn = document.getElementById("toggleGalleryBtn");
  const hiddenItems = document.querySelectorAll(".gallery-item.is-hidden");
  let galleryExpanded = false;

  if (toggleGalleryBtn) {
    toggleGalleryBtn.addEventListener("click", () => {
      galleryExpanded = !galleryExpanded;
      hiddenItems.forEach((item) => {
        item.classList.toggle("is-hidden", !galleryExpanded);
      });
      toggleGalleryBtn.textContent = galleryExpanded
        ? "Show Fewer Photos"
        : "View All 15 Photos";
    });
  }

  // Lightbox
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[currentIndex].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
  }

  function showSlide(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentIndex].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener("click", () => openLightbox(idx));
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", () => showSlide(-1));
  if (lbNext) lbNext.addEventListener("click", () => showSlide(1));

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showSlide(-1);
    if (e.key === "ArrowRight") showSlide(1);
  });

  // Copy account number
  const copyAcctBtn = document.getElementById("copyAcctBtn");
  const accountNumber = document.getElementById("accountNumber");

  if (copyAcctBtn && accountNumber) {
    copyAcctBtn.addEventListener("click", async () => {
      const text = accountNumber.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        copyAcctBtn.textContent = "Copied!";
        setTimeout(() => {
          copyAcctBtn.textContent = "Copy";
        }, 2000);
      } catch {
        copyAcctBtn.textContent = "Copy failed";
      }
    });
  }

  // Donation anonymity toggle & WhatsApp confirmation
  const donateForm = document.getElementById("donateForm");
  const donateStatus = document.getElementById("donateStatus");
  const donorNameGroup = document.getElementById("donorNameGroup");
  const donateNameInput = document.getElementById("donateName");
  const visibilityRadios = document.querySelectorAll('input[name="visibility"]');

  visibilityRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const isAnon = radio.value === "anonymous" && radio.checked;
      if (donorNameGroup && donateNameInput) {
        donorNameGroup.style.display = isAnon ? "none" : "block";
        donateNameInput.required = !isAnon;
        if (isAnon) donateNameInput.value = "";
      }
    });
  });

  if (donateForm && donateStatus) {
    donateForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cause = document.getElementById("donateCause").value;
      const amount = document.getElementById("donateAmount").value.trim();
      const isAnon = document.querySelector('input[name="visibility"]:checked')?.value === "anonymous";
      const donorLabel = isAnon
        ? "Anonymous Donor"
        : (donateNameInput.value.trim() || "Supporter");

      const lines = [
        "Hello Iyewe Youth Forum, I would like to confirm a donation:",
        `Cause: ${cause}`,
        `Donor: ${donorLabel}`,
        `Visibility: ${isAnon ? "Keep me anonymous" : "Show my name"}`
      ];
      if (amount) lines.push(`Amount: ${amount}`);

      const waUrl = `https://wa.me/2347034776408?text=${encodeURIComponent(lines.join("\n"))}`;
      donateStatus.textContent = isAnon
        ? "Opening WhatsApp to confirm your anonymous donation."
        : "Opening WhatsApp to confirm your donation.";
      donateStatus.classList.add("visible");
      window.open(waUrl, "_blank", "noopener,noreferrer");
    });
  }

  // Join form -> WhatsApp handoff
  const joinForm = document.getElementById("joinForm");
  const joinStatus = document.getElementById("joinStatus");

  if (joinForm && joinStatus) {
    joinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const joinType = document.getElementById("joinType").value;
      const joinName = document.getElementById("joinName").value.trim();
      const joinPhone = document.getElementById("joinPhone").value.trim();
      const joinCommunity = document.getElementById("joinCommunity").value.trim();
      const joinNote = document.getElementById("joinNote").value.trim();

      const lines = [
        "Hello Iyewe Youth Forum, I would like to submit an application:",
        `Type: ${joinType}`,
        `Name: ${joinName}`,
        `Phone: ${joinPhone}`,
        `Community: ${joinCommunity}`,
        `Note: ${joinNote}`
      ];

      const waUrl = `https://wa.me/2347034776408?text=${encodeURIComponent(lines.join("\n"))}`;
      joinStatus.textContent = "Opening WhatsApp with your application. You can also call 07034776408 directly.";
      joinStatus.classList.add("visible");
      window.open(waUrl, "_blank", "noopener,noreferrer");
      joinForm.reset();
    });
  }

  // Subtle scroll-reveal
  const revealTargets = document.querySelectorAll(
    ".vm-card, .focus-card, .leader-card, .donate-card, .contact-card, .form-card"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  // Contact form -> WhatsApp handoff
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      const text = encodeURIComponent(
        `Hello Iyewe Youth Forum,\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`
      );
      const waUrl = `https://wa.me/2347034776408?text=${text}`;

      formStatus.textContent = "Opening WhatsApp with your message. You can also call 07034776408 directly.";
      formStatus.classList.add("visible");
      window.open(waUrl, "_blank", "noopener,noreferrer");
      contactForm.reset();
    });
  }
});

