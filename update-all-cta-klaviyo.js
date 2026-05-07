#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP_DIRS = new Set(['blog', '.git', 'node_modules', '.github']);

const KLAVIYO_FETCH = `fetch('https://a.klaviyo.com/client/subscriptions/?company_id=SXFMie', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'revision': '2023-02-22' },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: { list_id: 'WLb5bq', email: email }
            }
          })
        })`;

// ── Sticky CTA replacement (same across all pages) ───────────────────────────

const STICKY_NEW = `  <!-- Sticky email CTA (mobile) -->
  <div id="sticky-email-cta" class="sticky-email-cta" aria-hidden="true">
    <button class="sticky-cta-close" id="sticky-cta-close" aria-label="Close">&#x2715;</button>
    <p class="sticky-cta-heading">Stay in the loop</p>
    <form class="sticky-cta-form" id="sticky-cta-form" novalidate>
      <input type="email" name="email" placeholder="Your email" required autocomplete="email">
      <button type="submit">Subscribe</button>
    </form>
    <p class="sticky-cta-success" id="sticky-cta-success">Thanks — we'll be in touch!</p>
  </div>
  <script>
    (function() {
      var cta = document.getElementById('sticky-email-cta');
      var closeBtn = document.getElementById('sticky-cta-close');
      var form = document.getElementById('sticky-cta-form');
      var successMsg = document.getElementById('sticky-cta-success');
      if (!cta) return;
      try { if (localStorage.getItem('watts-cta-dismissed') || localStorage.getItem('watts-subscribed')) return; } catch(e) {}
      var shown = false;
      function showCta() {
        if (shown) return;
        shown = true;
        cta.style.display = 'block';
        void cta.offsetHeight;
        cta.classList.add('visible');
        cta.setAttribute('aria-hidden', 'false');
      }
      window.addEventListener('scroll', function() {
        if (window.scrollY > 300) showCta();
      }, { passive: true });
      closeBtn.addEventListener('click', function() {
        cta.classList.remove('visible');
        cta.setAttribute('aria-hidden', 'true');
        try { localStorage.setItem('watts-cta-dismissed', '1'); } catch(e) {}
        setTimeout(function() { cta.style.display = 'none'; }, 350);
      });
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = form.querySelector('input[type="email"]').value.trim();
        if (!email) return;
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        ${KLAVIYO_FETCH}.then(function(res) {
          if (res.ok || res.status === 202) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            try { localStorage.setItem('watts-subscribed', '1'); } catch(e) {}
            setTimeout(function() {
              cta.classList.remove('visible');
              setTimeout(function() { cta.style.display = 'none'; }, 350);
            }, 2500);
          } else {
            btn.disabled = false;
          }
        }).catch(function() { btn.disabled = false; });
      });
    })();
  </script>`;

const STICKY_PATTERN = /[ \t]*<!-- Sticky email CTA \(mobile\) -->[\s\S]*?<\/script>/;

// ── dog-age-calculator inline results form ────────────────────────────────────

const DAC_FORM_OLD = `<form class="email-cta-form" id="results-email-form" action="https://formspree.io/f/mjkalgwj" method="POST" novalidate>`;
const DAC_FORM_NEW = `<form class="email-cta-form" id="results-email-form" novalidate>`;

const DAC_JS_OLD = /\/\/ ={3,} RESULTS EMAIL FORM ={3,}\s*\(function\(\) \{[\s\S]*?\}\)\(\);/;
const DAC_JS_NEW = `// ===== RESULTS EMAIL FORM =====
  (function() {
    var form = document.getElementById('results-email-form');
    var successMsg = document.getElementById('results-email-success');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = form.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      ${KLAVIYO_FETCH}.then(function(res) {
        if (res.ok || res.status === 202) {
          form.style.display = 'none';
          successMsg.style.display = 'block';
          try { localStorage.setItem('watts-subscribed', '1'); } catch(e) {}
        } else {
          btn.disabled = false;
        }
      }).catch(function() { btn.disabled = false; });
    });
  })();`;

// ── supplement-quiz inline results form ──────────────────────────────────────

const SQ_FORM_OLD = `<form class="email-cta-form" id="results-email-form" action="https://formspree.io/f/mjkalgwj" method="POST" novalidate>`;
const SQ_FORM_NEW = `<form class="email-cta-form" id="results-email-form" novalidate>`;

const SQ_JS_OLD = /\/\/ ={3,} EMAIL FORM \(results\) ={3,}\s*document\.getElementById\('results-email-form'\)[\s\S]*?\}\);/;
const SQ_JS_NEW = `// ===== EMAIL FORM (results) =====
  document.getElementById('results-email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var form = this;
    var email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    ${KLAVIYO_FETCH}.then(function(r) {
      if (r.ok || r.status === 202) {
        form.style.display = 'none';
        document.getElementById('email-success').style.display = 'block';
        try { localStorage.setItem('watts-subscribed', '1'); } catch(e) {}
      } else {
        btn.disabled = false;
      }
    }).catch(function() { btn.disabled = false; });
  });`;

// ── Helpers ───────────────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) results.push(...findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

// ── Tool pages: inline forms ──────────────────────────────────────────────────

let toolUpdates = 0;

function patchToolPage(filePath, formOld, formNew, jsPattern, jsNew, label) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes(formOld)) {
    content = content.replace(formOld, formNew);
    changed = true;
  } else {
    console.log(`  WARN [${label}]: inline form HTML not found`);
  }

  if (jsPattern.test(content)) {
    content = content.replace(jsPattern, jsNew);
    changed = true;
  } else {
    console.log(`  WARN [${label}]: inline form JS not found`);
  }

  // Also fix sticky CTA
  if (STICKY_PATTERN.test(content)) {
    content = content.replace(STICKY_PATTERN, STICKY_NEW);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✓ ${path.relative(ROOT, filePath)}`);
    toolUpdates++;
  }
}

patchToolPage(
  path.join(ROOT, 'dog-age-calculator/index.html'),
  DAC_FORM_OLD, DAC_FORM_NEW, DAC_JS_OLD, DAC_JS_NEW,
  'dog-age-calculator'
);

patchToolPage(
  path.join(ROOT, 'supplement-quiz/index.html'),
  SQ_FORM_OLD, SQ_FORM_NEW, SQ_JS_OLD, SQ_JS_NEW,
  'supplement-quiz'
);

// ── All other pages: sticky CTA only ─────────────────────────────────────────

const allFiles = findHtmlFiles(ROOT);
let updated = 0;
let skipped = 0;

for (const filePath of allFiles) {
  // Skip tool pages (already handled above) and blog (handled previously)
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('dog-age-calculator') || rel.startsWith('supplement-quiz')) continue;

  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('sticky-email-cta') || !content.includes('formspree')) {
    skipped++;
    continue;
  }

  const newContent = content.replace(STICKY_PATTERN, STICKY_NEW);
  if (newContent === content) {
    console.log(`  WARN: pattern not matched in ${rel}`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  ✓ ${rel}`);
  updated++;
}

console.log(`\nDone: ${toolUpdates} tool pages, ${updated} other pages updated, ${skipped} skipped`);
