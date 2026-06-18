/* =====================================
   MAIN.JS — Fullscreen Menu + Site Logic
   ===================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================
     1. FULLSCREEN MENU — GSAP + SplitType
     ========================================== */

  const navOverlay     = document.getElementById("navOverlay");
  const menuBtn        = document.getElementById("menuBtn");
  const navInner       = document.querySelector(".nav_overlay-inner");
  const linksImgWrappers = document.querySelectorAll('[data-nav="link-img"]');
  const linksImgs     = document.querySelectorAll('[data-nav="link-img"] img');
  const navTopLinks    = document.querySelectorAll('[data-nav="top-link"]');
  const navBottomLinks = document.querySelectorAll('[data-nav="bottom-link"]');
  const allNavLines    = document.querySelectorAll('[data-nav="bottom-line"]');
  const navMenuLines   = document.querySelectorAll('[data-nav="menu-line"]');
  const heroTexts      = document.querySelectorAll(".hero_title, .hero_sub, .hero_cta, .hero_eyebrow");

  /* ---- SplitType for character animation ---- */
  const bottomSplits = Array.from(navBottomLinks, (n) =>
    new SplitType(n, { type: "chars" })
  );
  const topSplits = Array.from(navTopLinks, (n) =>
    new SplitType(n, { type: "chars" })
  );

  /* ---- Initial image clip state ---- */
  gsap.set(linksImgWrappers, {
    clipPath: (i) =>
      i % 2 === 0
        ? "inset(0% 0% 0% 100%)"
        : "inset(0% 100% 0% 0%)",
  });

  /* ---- Top nav link hover (char slide) ---- */
  navTopLinks.forEach((link, index) => {
    const chars = topSplits[index].chars;
    const from  = index % 2 === 0 ? "start" : "end";
    link.addEventListener("mouseenter", () => {
      gsap.to(chars, { y: "-100%", stagger: { each: 0.02, from } });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(chars, {
        y: "0%",
        overwrite: true,
        stagger: { each: 0.02, from },
      });
    });
  });

  /* ---- Bottom nav link hover (text + image reveal) ---- */
  navBottomLinks.forEach((link, index) => {
    const chars = bottomSplits[index].chars;
    const from  = index % 2 === 0 ? "start" : "end";

    const onEnter = () => {
      const tl = gsap.timeline();
      tl.to(chars, {
        y: "-100%",
        stagger: { each: 0.02, from },
      })
        .to(
          [linksImgWrappers[2 * index], linksImgWrappers[2 * index + 1]],
          { clipPath: "inset(0% 0% 0% 0%)" },
          0.2
        )
        .fromTo(
          [linksImgs[2 * index], linksImgs[2 * index + 1]],
          { scale: 1.5 },
          { scale: 1, duration: 0.75, ease: "expo.out" },
          0.2
        );
    };

    const onLeave = () => {
      const tl = gsap.timeline();
      tl.to(chars, {
        y: "0%",
        overwrite: true,
        stagger: { each: 0.02, from },
      })
        .to(
          [linksImgWrappers[2 * index], linksImgWrappers[2 * index + 1]],
          {
            clipPath:
              index % 2 === 0
                ? "inset(0% 0% 0% 100%)"
                : "inset(0% 100% 0% 0%)",
          },
          0.2
        )
        .fromTo(
          [linksImgs[2 * index], linksImgs[2 * index + 1]],
          { scale: 1 },
          { scale: 1.5, duration: 0.75, ease: "power2.out" },
          0.2
        );
    };

    link.addEventListener("mouseenter", onEnter);
    link.addEventListener("mouseleave", onLeave);
  });

  /* ---- Open / Close timelines ---- */
  const openTL = gsap
    .timeline({ paused: true })
    .fromTo(
      navInner,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.25, ease: "expo.inOut" }
    )
    .from(
      allNavLines,
      {
        clipPath: (i) =>
          i % 2 === 0
            ? "inset(1px 0% 1.15px 100%)"
            : "inset(1px 100% 1.15px 0%)",
        duration: 1.25,
        ease: "power3.inOut",
      },
      0.25
    )
    .fromTo(
      bottomSplits.map((x) => x.lines[0]),
      { y: "100%" },
      { y: "0%", duration: 1.5, ease: "power3.inOut" },
      0
    )
    .to(navTopLinks, { color: "#1e1d1a" }, 0.5)
    .to(navMenuLines, { backgroundColor: "#1e1d1a", duration: 0.125 }, 0.5)
    .to(
      navMenuLines,
      {
        transform: (i) =>
          i % 2 === 0 ? "translateY(4px)" : "translateY(-5px)",
        duration: 0.5,
        ease: "power2.out",
      },
      0.5
    )
    .to(heroTexts, { opacity: 0, duration: 1, ease: "power2.inOut" }, 0);

  const closeTL = gsap
    .timeline({ paused: true })
    .to(navInner, {
      clipPath: "inset(0 0 100% 0)",
      duration: 1.25,
      ease: "expo.inOut",
    })
    .to(
      allNavLines,
      {
        clipPath: (i) =>
          i % 2 === 0
            ? "inset(1px 0% 1.15px 100%)"
            : "inset(1px 100% 1.15px 0%)",
        duration: 1,
        ease: "power3.inOut",
      },
      0
    )
    .fromTo(
      bottomSplits.map((x) => x.lines[0]),
      { y: "0%" },
      { y: "100%", duration: 1, ease: "power3.inOut" },
      0
    )
    .to(navTopLinks, { color: "#ffffff" }, "-=0.5")
    .to(
      navMenuLines,
      { backgroundColor: "#ffffff", duration: 0.125 },
      "-=0.5"
    )
    .to(
      navMenuLines,
      { transform: "translateY(0)", duration: 0.75, ease: "power2.out" },
      "-=0.5"
    )
    .to(
      heroTexts,
      { opacity: 1, duration: 1, ease: "power2.out" },
      0.5
    );

  let menuOpen = false;

  menuBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (menuOpen) {
      /* Close */
      bottomSplits.forEach((n) =>
        n.elements[0]?.classList.remove("fade-in")
      );
      closeTL.restart().then(() => {
        navOverlay.classList.remove("open");
        document.body.style.overflow = "";
      });
    } else {
      /* Open */
      navOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
      openTL.restart().then(() => {
        bottomSplits.forEach((n) =>
          n.elements[0]?.classList.add("fade-in")
        );
      });
    }
    menuOpen = !menuOpen;
  });

  /* Close menu when a bottom nav link is clicked */
  navBottomLinks.forEach((link) => {
    link.addEventListener("click", () => {
      bottomSplits.forEach((n) =>
        n.elements[0]?.classList.remove("fade-in")
      );
      closeTL.restart();
      setTimeout(() => {
        navOverlay.classList.remove("open");
        document.body.style.overflow = "";
        menuOpen = false;
      }, 1300);
    });
  });

  /* ==========================================
     2. LIGHTBOX — click to enlarge demo images
     ========================================== */
  let lightboxImages = [];
  let lightboxIdx   = 0;

  window.openLightbox = function (img) {
    const lb    = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbCap = document.getElementById("lightbox-caption");
    const lbCnt = document.getElementById("lightbox-counter");
    lightboxImages = Array.from(document.querySelectorAll(".demo-item img"));
    lightboxIdx  = lightboxImages.indexOf(img);
    if (lightboxIdx < 0) lightboxIdx = 0;
    updateLightbox();
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  function updateLightbox() {
    const img  = lightboxImages[lightboxIdx];
    if (!img) return;
    const lbImg = document.getElementById("lightbox-img");
    const lbCap = document.getElementById("lightbox-caption");
    const lbCnt = document.getElementById("lightbox-counter");
    lbImg.src           = img.src;
    lbImg.alt           = img.alt;
    const capEl          = img.parentElement.querySelector("p");
    lbCap.textContent    = capEl ? capEl.textContent : img.alt || "";
    lbCnt.textContent    = lightboxIdx + 1 + " / " + lightboxImages.length;
  }

  window.lightboxNav = function (delta) {
    if (lightboxImages.length === 0) return;
    lightboxIdx =
      (lightboxIdx + delta + lightboxImages.length) % lightboxImages.length;
    updateLightbox();
  };

  window.closeLightbox = function () {
    const lb = document.getElementById("lightbox");
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.getElementById("lightbox").addEventListener("click", function (e) {
    if (e.target === this) window.closeLightbox();
  });

  document.addEventListener("keydown", function (e) {
    const lb = document.getElementById("lightbox");
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape")       window.closeLightbox();
    if (e.key === "ArrowRight")  { e.preventDefault(); window.lightboxNav(1); }
    if (e.key === "ArrowLeft")   { e.preventDefault(); window.lightboxNav(-1); }
  });

  document.querySelectorAll(".demo-item img").forEach(function (img) {
    img.addEventListener("click", function (e) {
      e.stopPropagation();
      window.openLightbox(this);
    });
  });

  /* ==========================================
     3. COPY WECHAT ID
     ========================================== */
  window.copyWechat = function () {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText("Zzing1018").then(showToast);
    } else {
      const ta = document.createElement("textarea");
      ta.value = "Zzing1018";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast();
    }
  };

  function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
  }

  /* ==========================================
     4. SCROLL REVEAL
     ========================================== */
  const revealEls = document.querySelectorAll(
    ".about-card, .video-item, .demo-item, .tech-card, .project-intro, .project-section-label"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el, i) => {
    el.style.opacity     = "0";
    el.style.transform   = "translateY(24px)";
    el.style.transition  =
      `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s`;
    revealObserver.observe(el);
  });

  /* ==========================================
     5. ACTIVE NAV HIGHLIGHT ON SCROLL
     ========================================== */
  const sections  = document.querySelectorAll("section[id]");

  function highlightNav() {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 300) {
        current = sec.getAttribute("id");
      }
    });
    navBottomLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", highlightNav);
});
