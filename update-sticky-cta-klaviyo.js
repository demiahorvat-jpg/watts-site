#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'blog');

const NEW_BLOCK = `  <!-- Sticky email CTA (mobile) -->
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
      if (localStorage.getItem('watts-cta-dismissed') || localStorage.getItem('watts-subscribed')) return;
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
        localStorage.setItem('watts-cta-dismissed', '1');
        setTimeout(function() { cta.style.display = 'none'; }, 350);
      });
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = form.querySelector('input[type="email"]').value.trim();
        if (!email) return;
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        fetch('https://a.klaviyo.com/client/subscriptions/?company_id=SXFMie', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'revision': '2023-02-22' },
          body: JSON.stringify({
            data: {
              type: 'subscription',
              attributes: { list_id: 'WLb5bq', email: email }
            }
          })
        }).then(function(res) {
          if (res.ok || res.status === 202) {
            form.style.display = 'none';
            successMsg.style.display = 'block';
            localStorage.setItem('watts-subscribed', '1');
            setTimeout(function() {
              cta.classList.remove('visible');
              setTimeout(function() { cta.style.display = 'none'; }, 350);
            }, 2500);
          } else {
            btn.disabled = false;
          }
        }).catch(function() {
          btn.disabled = false;
        });
      });
    })();
  </script>`;

const PATTERN = /[ \t]*<!-- Sticky email CTA \(mobile\) -->[\s\S]*?<\/script>/;

const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.html'));
let updated = 0;
let skipped = 0;

for (const file of files) {
  const filePath = path.join(BLOG_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('sticky-email-cta')) {
    skipped++;
    continue;
  }
  const newContent = content.replace(PATTERN, NEW_BLOCK);
  if (newContent === content) {
    console.log(`  WARN: no match in ${file}`);
    skipped++;
    continue;
  }
  fs.writeFileSync(filePath, newContent, 'utf8');
  updated++;
  console.log(`  ✓ ${file}`);
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`);
