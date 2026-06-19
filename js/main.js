/* =====================================
   MAIN.JS — Fullscreen Menu + Site Logic
   ===================================== */

/* ==========================================
   0. PROJECT TAB SWITCHER — Global Scope
   ========================================== */
function switchProject(projectId, btn) {
  // Hide all project content
  var contents = document.querySelectorAll(".project-content");
  contents.forEach(function(el) {
    el.classList.add("hidden");
  });

  // Remove active from all tabs
  var tabs = document.querySelectorAll(".project-tab");
  tabs.forEach(function(el) {
    el.classList.remove("active");
  });

  // Show target project
  var target = document.getElementById("project-" + projectId);
  if (target) {
    target.classList.remove("hidden");
  }

  // Activate the correct tab
  if (btn) {
    btn.classList.add("active");
  } else {
    var targetTab = document.getElementById("tab-" + projectId);
    if (targetTab) {
      targetTab.classList.add("active");
    }
  }
}
window.switchProject = switchProject;

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

  /* ==========================================
     6. METHOD DETAIL LIGHTBOX
     ========================================== */
  const methodDetails = [
    {
      title: "Prompt 工程",
      body: '<h4 style="color:#6d5efc;margin:24px 0 12px;">🌟 一、核心目标</h4><p>影灵灵的 Prompt 工程不是单纯"写提示词"，而是构建一个可稳定生成<strong>统一角色 + 连续叙事 + 风格一致</strong>的 AIGC IP 系统。</p><p style="background:#f5f0ff;padding:12px 16px;border-radius:8px;margin:12px 0;"><strong>解决三个核心问题：</strong><br>❌ 角色不一致（每张图长得不一样）<br>❌ 风格漂移（中国皮影 vs 现代插画混乱）<br>❌ 无法动画化（无法进入视频生成）</p><h4 style="color:#6d5efc;margin:24px 0 12px;">🧩 二、整体 Prompt 系统结构</h4><p>影灵灵采用的是<strong>三层 Prompt 架构</strong>：</p><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>① 角色层（Character Prompt）</strong> — 锁定"影灵灵是谁"</p><p style="color:#515154;font-size:14px;margin:8px 0;">中国皮影戏光影精灵少女，长发及腰，半透明光影身体，内部可见发光骨骼结构，朱砂红与金色汉服，面容甜美灵动，大眼睛，高精细CG质感</p><p style="color:#515154;font-size:13px;"><strong>关键技巧：</strong>固定外观关键词 · 固定"材料属性" · 强制结构稳定</p></div><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>② 风格层（Style Prompt）</strong> — 统一视觉风格</p><p style="color:#515154;font-size:14px;margin:8px 0;">吉卜力动画 + 中国水墨 + 非遗皮影艺术 + 电影级光影 + 柔光体积光</p><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:12px 0;font-size:13px;"><div><strong>色彩</strong><br>暖金 / 朱砂红 / 象牙白</div><div><strong>光影</strong><br>体积光 / 背光 / 幕布透光</div><div><strong>材质</strong><br>皮影牛皮质感 + 光粒子</div><div><strong>氛围</strong><br>治愈 / 神秘 / 东方奇幻</div></div></div><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>③ 叙事层（Scene / Motion Prompt）</strong> — 控制"她在做什么"</p><p style="color:#515154;font-size:14px;margin:8px 0;">镜头：皮影戏舞台前<br>动作：挥动金箍棒 / 转身亮相 / 比心<br>环境：幕布透光 + 暖金色灯光<br>情绪：温暖 / 神圣 / 文化传承感</p></div><h4 style="color:#6d5efc;margin:24px 0 12px;">🔗 三、进阶：一致性控制策略</h4><div style="background:#fff8e1;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>1. Prompt 锁定策略（Character Lock）</strong><br>重复核心描述 · 禁止随机描述 · 固定结构顺序</p><p style="margin-top:12px;"><strong>2. 风格锁（Style Anchor）</strong><br>始终固定：皮影 + 水墨 + 吉卜力 + 电影光影<br>不允许变化成：赛博朋克 / 写实摄影 / 二次元动漫</p><p style="margin-top:12px;"><strong>3. 材质统一（Material Consistency）</strong><br>统一关键词：半透明光体 · 牛皮雕刻质感 · 发光粒子 · 幕布投影</p><p style="margin-top:12px;"><strong>4. 叙事连续性（For Video）</strong><br>镜头1：诞生 → 镜头2：觉醒 → 镜头3：学习制作 → 镜头4：进入皮影舞台 → 镜头5：与观众互动</p></div><h4 style="color:#6d5efc;margin:24px 0 12px;">💎 四、作品集一句话总结</h4><p style="background:linear-gradient(135deg,#f5f0ff,#e8f8f5);padding:16px 20px;border-radius:12px;font-weight:600;">影灵灵 Prompt 工程构建了一个三层结构系统（角色层 / 风格层 / 叙事层），通过角色锁定、风格锚定与镜头级动作控制，实现 AIGC 环境下文化 IP 的一致性生成与视频化生产能力。</p>'
    },
    {
      title: "视觉一致性控制",
      body: '<h4 style="color:#6d5efc;margin:24px 0 12px;">🎯 核心策略</h4><p>视觉一致性控制是影灵灵项目的关键技术挑战，主要通过以下四个策略实现：</p><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>1. Prompt 锁定策略（Character Lock）</strong></p><p style="color:#515154;font-size:14px;margin:8px 0;">重复核心描述 · 禁止随机描述 · 固定结构顺序</p></div><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>2. 风格锁（Style Anchor）</strong></p><p style="color:#515154;font-size:14px;margin:8px 0;">始终固定：皮影 + 水墨 + 吉卜力 + 电影光影<br>不允许变化成：赛博朋克 / 写实摄影 / 二次元动漫</p></div><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>3. 材质统一（Material Consistency）</strong></p><p style="color:#515154;font-size:14px;margin:8px 0;">统一关键词：半透明光体 · 牛皮雕刻质感 · 发光粒子 · 幕布投影</p></div><div style="background:#fafafa;padding:16px 20px;border-radius:12px;margin:12px 0;"><p><strong>4. 叙事连续性（For Video）</strong></p><p style="color:#515154;font-size:14px;margin:8px 0;">镜头1：诞生 → 镜头2：觉醒 → 镜头3：学习制作 → 镜头4：进入皮影舞台 → 镜头5：与观众互动</p></div><div class="detail-placeholder" style="margin-top:16px;">📷 你可以在这里插入对比图（不一致 vs 一致的效果）</div>'
    },
    {
      title: "多模态管线设计",
      body: '<p>在这里添加你具体的做法，比如：</p><p>• 从文字创意到生成图片的工作流程</p><p>• 从图片到视频的转换过程</p><p>• 使用的工具和平台</p><div class="detail-placeholder">📷 你可以在这里插入工作流程图或成品截图</div>'
    }
  ];

  window.openMethodDetail = function(index) {
    const lb = document.getElementById("methodLightbox");
    const title = document.getElementById("method-title");
    const body = document.getElementById("method-body");
    const detail = methodDetails[index];
    if (!detail) return;
    title.textContent = detail.title;
    body.innerHTML = detail.body;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  window.closeMethodDetail = function() {
    const lb = document.getElementById("methodLightbox");
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };

  document.getElementById("methodLightbox").addEventListener("click", function(e) {
    if (e.target === this) window.closeMethodDetail();
  });

  document.addEventListener("keydown", function(e) {
    const lb = document.getElementById("methodLightbox");
    if (lb.classList.contains("open") && e.key === "Escape") {
      window.closeMethodDetail();
    }
  });

  // Hash-based project tab switching
  function checkProjectHash() {
    var hash = window.location.hash;
    if (hash === "#project-feishu") {
      switchProject("feishu", null);
    } else if (hash === "#project-yinglingling" || hash === "#project-yingling") {
      switchProject("yinglingling", null);
    }
  }
  checkProjectHash();
  window.addEventListener("hashchange", checkProjectHash);
});
