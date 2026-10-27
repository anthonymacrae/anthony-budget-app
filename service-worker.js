const CACHE_NAME = 'my-budget-v2';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192-1.png',
  './icon-512-1.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request).then(response => {
      const url = new URL(event.request.url);
      const isAppPage = url.pathname.endsWith('/') || url.pathname.endsWith('/index.html');
      const contentType = response.headers.get('content-type') || '';

      if (!isAppPage || !contentType.includes('text/html')) return response;

      return response.clone().text().then(html => {
        const fix = `
<script>
(function(){
  function ensurePaymentControls(){
    var app=document.getElementById('app');
    if(!app) return;
    var cards=app.querySelectorAll('.payment-entry');
    if(!cards.length) return;

    var existing=document.getElementById('paymentNavigationFix');
    var search=document.getElementById('paymentSearch');
    var jump=document.getElementById('paymentJump');

    if(!existing){
      existing=document.createElement('div');
      existing.id='paymentNavigationFix';
      existing.style.cssText='display:grid;grid-template-columns:minmax(0,1fr) minmax(150px,260px);gap:8px;margin:0 0 15px;position:sticky;top:0;z-index:4;padding:8px 0;background:var(--bg);';
      var firstActions=app.querySelector('.actions');
      var panel=app.querySelector('.panel');
      if(firstActions) firstActions.insertAdjacentElement('afterend',existing);
      else if(panel) panel.insertAdjacentElement('beforebegin',existing);
      else app.insertBefore(existing,app.firstChild);
    }

    if(!search){
      search=document.createElement('input');
      search.id='paymentSearch';
      search.type='search';
      search.placeholder='🔎 Search payments';
      search.setAttribute('aria-label','Search payments');
      search.style.cssText='width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:11px;background:var(--card);color:var(--ink);font:inherit;min-width:0;';
      existing.appendChild(search);
    }

    if(!jump){
      jump=document.createElement('select');
      jump.id='paymentJump';
      jump.setAttribute('aria-label','Jump to payment');
      jump.style.cssText='width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:11px;background:var(--card);color:var(--ink);font:inherit;min-width:0;';
      existing.appendChild(jump);
      jump.addEventListener('change',function(){
        var n=parseInt(this.value,10);
        if(!Number.isFinite(n)) return;
        var target=app.querySelectorAll('.payment-entry')[n];
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    }

    var term=search.value.toLowerCase().trim();
    cards.forEach(function(card){
      card.style.display=!term || card.innerText.toLowerCase().includes(term)?'':'none';
    });

    var selected=jump.value;
    var options='<option value="">↕ Jump to a payment…</option>';
    cards.forEach(function(card,index){
      var title=card.querySelector('.payment-title');
      var name=title ? title.textContent.trim() : ('Payment '+(index+1));
      options+='<option value="'+index+'">'+String(name).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]})+'</option>';
    });
    jump.innerHTML=options;
    if([...jump.options].some(function(o){return o.value===selected;})) jump.value=selected;

    search.oninput=function(){
      var t=this.value.toLowerCase().trim();
      app.querySelectorAll('.payment-entry').forEach(function(card){
        card.style.display=!t || card.innerText.toLowerCase().includes(t)?'':'none';
      });
    };
  }

  var observer=new MutationObserver(function(){ensurePaymentControls();});
  if(document.body){
    observer.observe(document.body,{childList:true,subtree:true});
    ensurePaymentControls();
  }else{
    document.addEventListener('DOMContentLoaded',function(){
      observer.observe(document.body,{childList:true,subtree:true});
      ensurePaymentControls();
    });
  }
})();
</script>`;
        const patched = html.replace('</body>', fix + '</body>');
        return new Response(patched, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      });
    }).catch(() => caches.match(event.request))
  );
});
