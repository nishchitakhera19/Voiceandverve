

// ── PARTICLES ──
function createParticles(){
  const container=document.getElementById('particles');
  if(!container)return;
  for(let i=0;i<6;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.setProperty('--dur',(6+Math.random()*10)+'s');
    p.style.setProperty('--delay',(-Math.random()*12)+'s');
    p.style.setProperty('--drift',(Math.random()*80-40)+'px');
    container.appendChild(p);
  }
}
createParticles();

// ── SCROLL PROGRESS ──
const progressBar=document.getElementById('progressBar');
window.addEventListener('scroll',()=>{
  const scrolled=window.scrollY;
  const total=document.documentElement.scrollHeight-window.innerHeight;
  progressBar.style.transform=`scaleX(${total>0?(scrolled/total):0})`;
  document.getElementById('mainNav').classList.toggle('scrolled',scrolled>50);
});

// ── SCROLL REVEAL ──
const revealObserver=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');revealObserver.unobserve(e.target)}});
},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
function initReveal(){document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.timeline-item').forEach(el=>revealObserver.observe(el))}
initReveal();

// ── COUNTER ANIMATION ──
function animateCounter(el,target,suffix=''){
  const duration=1800;
  const startTime=performance.now();
  function step(now){
    const progress=Math.min((now-startTime)/duration,1);
    const eased=1-Math.pow(1-progress,3);
    el.textContent=Math.round(eased*target)+(progress<1?'':suffix||'+');
    if(progress<1)requestAnimationFrame(step);
    else el.textContent=target+'+';
  }
  requestAnimationFrame(step);
}
const counterObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!e.target.dataset.done){
      e.target.dataset.done='1';
      animateCounter(e.target,parseInt(e.target.dataset.target));
      counterObserver.unobserve(e.target);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.counter').forEach(el=>counterObserver.observe(el));

// ── PAGE ROUTING ──
let currentPage='home';
function showPage(page){
  if(page===currentPage)return;
  const transition=document.getElementById('pageTransition');
  transition.className='page-transition enter';
  setTimeout(()=>{
    document.querySelectorAll('.page').forEach(p=>{p.classList.remove('active','visible')});
    document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
    const pageEl=document.getElementById('page-'+page);
    if(pageEl){pageEl.classList.add('active');requestAnimationFrame(()=>requestAnimationFrame(()=>pageEl.classList.add('visible')))}
    const navEl=document.getElementById('nav-'+page);
    if(navEl)navEl.classList.add('active');
    window.scrollTo({top:0,behavior:'instant'});
    currentPage=page;
    // Re-run reveal for new page
    setTimeout(()=>{
      document.querySelectorAll('.page.active .reveal:not(.revealed),.page.active .reveal-left:not(.revealed),.page.active .reveal-right:not(.revealed),.page.active .timeline-item:not(.revealed)').forEach(el=>revealObserver.observe(el));
    },100);
    transition.className='page-transition exit';
  },320);
}

// ── FILTER REVIEWS ──
function filterReviews(type,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>{b.classList.add('outline');b.classList.remove('active')});
  btn.classList.remove('outline');btn.classList.add('active');
  document.querySelectorAll('.review-full').forEach(card=>{
    if(type==='all'||card.dataset.type===type){card.style.display='';card.style.animation='fadeIn 0.4s ease';}
    else card.style.display='none';
  });
}

// ── MODAL ──
function openModal(){document.getElementById('modalOverlay').classList.add('open');document.body.style.overflow='hidden'}
function closeModal(){document.getElementById('modalOverlay').classList.remove('open');document.body.style.overflow=''}
function closeModalOutside(e){if(e.target===document.getElementById('modalOverlay'))closeModal()}

// ── FORMS ──
const SHEET_URL='https://script.google.com/macros/s/AKfycbwWiJfN-AtWOIfKLTBODbKBpnHNcMydGmtkFAGN52QuaEzzoLVaznCUi12F7A8FekNHfQ/exec';

function submitDemo(e){
  e.preventDefault();
  const data={
    formType:'demo',
    name:e.target.querySelector('input[type=text]').value,
    phone:document.getElementById('demo-phone').value,
    email:(document.getElementById('demo-email-visible')||{}).value||'',
    interest:document.getElementById('demo-interest').value
  };
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Sending...';
  btn.disabled=true;
  // Show success immediately — don't wait for slow Apps Script
  document.getElementById('demoFormContent').style.display='none';
  document.getElementById('demoSuccess').classList.add('show');
  // Submit in background
  fetch(SHEET_URL,{method:'POST',body:JSON.stringify(data)}).catch(()=>{});
}

function submitReview(e){
  e.preventDefault();
  const name=document.getElementById('r-name').value;
  const program=document.getElementById('r-program').value;
  const text=document.getElementById('r-text').value;
  const type=document.getElementById('r-type').value;
  const ratingInput=document.querySelector('input[name="rating"]:checked');
  const stars=ratingInput?parseInt(ratingInput.value):5;
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Sending...';btn.disabled=true;
  // Show success immediately — don't wait for slow Apps Script
  document.getElementById('reviewFormContent').style.display='none';
  document.getElementById('reviewSuccess').classList.add('show');
  // Submit in background
  const location=document.getElementById('r-location')?document.getElementById('r-location').value:'';
  fetch(SHEET_URL,{method:'POST',body:JSON.stringify({formType:'review',name,program,text,type,stars,location})}).catch(()=>{});
}

function submitContact(e){
  e.preventDefault();
  const name=document.getElementById('c-name').value;
  const email=document.getElementById('c-email').value;
  const phone=document.getElementById('c-phone').value;
  const interest=document.getElementById('c-interest').value;
  const message=document.getElementById('c-message').value;
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Sending...';btn.disabled=true;
  // Show success immediately — don't wait for slow Apps Script
  document.getElementById('contactSuccess').classList.add('show');
  e.target.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el=>el.style.display='none');
  // Submit in background
  fetch(SHEET_URL,{method:'POST',body:JSON.stringify({formType:'contact',name,email,phone,interest,message})}).catch(()=>{});
}

// ── LOAD APPROVED REVIEWS FROM SHEET ──
const PLACEHOLDER_REVIEWS=[
  {stars:5,text:"My daughter went from refusing to speak in class to winning the school debate. Ritu ma'am's method is unlike anything else we've tried.",name:"Priya Sharma",program:"Public Speaking",type:"Parent"},
  {stars:5,text:"The interview preparation program got me my dream job. The mock sessions and feedback were incredibly detailed and honest.",name:"Arjun Mehta",program:"Interview Preparation",type:"Professional"},
  {stars:5,text:"CBSE grammar finally clicked for my son. His board exam scores improved dramatically after just 8 weeks with Ritu ma'am.",name:"Sunita Verma",program:"Basic Grammar",type:"Parent"}
];
function renderReviews(reviews){
  // ── Full reviews page ──
  const container=document.getElementById('reviewsContainer');
  if(container){
    container.innerHTML='';
    reviews.forEach(r=>{
      const stars='★'.repeat(r.stars)+'☆'.repeat(5-r.stars);
      const card=document.createElement('div');
      card.className='review-full reveal';
      card.dataset.type=(r.type||'').toLowerCase();
      const loc=r.location?` · ${r.location}`:'';
    card.innerHTML=`<div class="stars">${stars}</div><div class="text">"${r.text}"</div><div class="author">${r.name}</div><div class="course-tag">${r.program} · ${r.type}${loc}</div>`;
      container.appendChild(card);
    });
    initReveal();
  }
  // ── Homepage preview (max 3) ──
  const homeGrid=document.getElementById('homeReviewsGrid');
  if(homeGrid){
    homeGrid.innerHTML='';
    reviews.slice(0,3).forEach((r,i)=>{
      const stars='★'.repeat(r.stars)+'☆'.repeat(5-r.stars);
      const card=document.createElement('div');
      card.className='review-card reveal'+(i>0?' reveal-delay-'+i:'');
      card.innerHTML=`<div class="review-stars">${stars}</div><div class="review-text">"${r.text}"</div><div class="review-author">${r.name} · ${r.type}</div>`;
      homeGrid.appendChild(card);
    });
    initReveal();
  }
}
// Fetch reviews — try CSV first (fast), fall back to Apps Script
const CSV_URL='https://docs.google.com/spreadsheets/d/1oVYloXSX1SQbFBawMSCJcAklv9TZZ-6ZKboOV51PAGY/export?format=tsv&gid=1011886561';

function parseCSV(text){
  // Google Sheets exports as TSV (tab-separated) not CSV
  const lines=text.trim().split('\n');
  return lines.slice(1).map(line=>{
    // Split by tab
    const cols=line.split('\t').map(c=>c.trim().replace(/^"+|"+$/g,'').trim());
    if(!cols||cols.length<7)return null;
    const approved=(cols[7]||'').replace(/[^a-zA-Z]/g,'').toLowerCase();
    const name=(cols[1]||'').trim();
    const reviewText=(cols[3]||'').replace(/\r/g,' ').replace(/\n/g,' ').trim();
    return{
      name:name,
      program:(cols[2]||'').trim(),
      text:reviewText,
      type:(cols[4]||'').trim(),
      stars:parseInt(cols[5])||5,
      location:(cols[6]||'').trim(),
      approved:approved
    };
  }).filter(r=>r&&r.approved==='yes'&&r.text&&r.name);
}

function loadApprovedReviews(){
  // Show cached reviews instantly if available
  try{
    const cached=localStorage.getItem('vv_reviews');
    const cachedTime=localStorage.getItem('vv_reviews_time');
    const fiveMin=30*1000; // 30 seconds — so Yes/No changes reflect quickly
    if(cached&&cachedTime&&(Date.now()-parseInt(cachedTime))<fiveMin){
      const parsed=JSON.parse(cached);
      if(parsed.length){renderReviews(parsed);}
      else{renderReviews(PLACEHOLDER_REVIEWS);}
      // Refresh cache silently in background
      fetch(CSV_URL).then(r=>r.text()).then(text=>{
        const reviews=parseCSV(text);
        if(reviews.length){
          localStorage.setItem('vv_reviews',JSON.stringify(reviews));
          localStorage.setItem('vv_reviews_time',Date.now().toString());
        }
      }).catch(()=>{});
      return;
    }
  }catch(e){}
  // Try CSV first (fast), fallback to Apps Script if CSV fails
  fetch(CSV_URL)
    .then(r=>{
      if(!r.ok)throw new Error('CSV failed');
      return r.text();
    })
    .then(text=>{
      const reviews=parseCSV(text);
      if(!reviews.length){
        // CSV worked but no approved reviews — try Apps Script to confirm
        return fetch(SHEET_URL).then(r=>r.json()).then(data=>{
          if(Array.isArray(data)&&data.length){
            renderReviews(data);
            try{localStorage.setItem('vv_reviews',JSON.stringify(data));localStorage.setItem('vv_reviews_time',Date.now().toString());}catch(e){}
          } else {
            renderReviews(PLACEHOLDER_REVIEWS);
          }
        }).catch(()=>renderReviews(PLACEHOLDER_REVIEWS));
      }
      renderReviews(reviews);
      try{localStorage.setItem('vv_reviews',JSON.stringify(reviews));localStorage.setItem('vv_reviews_time',Date.now().toString());}catch(e){}
    })
    .catch(()=>{
      // CSV failed — use Apps Script
      fetch(SHEET_URL).then(r=>r.json()).then(reviews=>{
        if(!Array.isArray(reviews)||!reviews.length){renderReviews(PLACEHOLDER_REVIEWS);}
        else{
          renderReviews(reviews);
          try{localStorage.setItem('vv_reviews',JSON.stringify(reviews));localStorage.setItem('vv_reviews_time',Date.now().toString());}catch(e){}
        }
      }).catch(()=>renderReviews(PLACEHOLDER_REVIEWS));
    });
}
loadApprovedReviews();

// ── FAQ TOGGLE ──
function toggleFaq(btn){
  const answer=btn.nextElementSibling;
  const isOpen=btn.classList.contains('open');
  document.querySelectorAll('.faq-q.open').forEach(b=>{
    b.classList.remove('open');
    b.nextElementSibling.classList.remove('open');
  });
  if(!isOpen){
    btn.classList.add('open');
    answer.classList.add('open');
  }
}

// ── MOBILE MENU ──
function toggleMobileMenu(){document.getElementById('mobileMenu').classList.toggle('open')}

// ── KEYBOARD ──
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
