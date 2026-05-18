// ── CUSTOM CURSOR ──
const cursor=document.getElementById('cursor');
const cursorRing=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
function animateRing(){rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;cursorRing.style.left=rx+'px';cursorRing.style.top=ry+'px';requestAnimationFrame(animateRing)}
animateRing();
document.querySelectorAll('a,button,.course-card,.review-card,.review-full,.cred-card,.stat,.filter-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.classList.add('expanded');cursorRing.classList.add('expanded')});
  el.addEventListener('mouseleave',()=>{cursor.classList.remove('expanded');cursorRing.classList.remove('expanded')});
});

// ── PARTICLES ──
function createParticles(){
  const container=document.getElementById('particles');
  if(!container)return;
  for(let i=0;i<18;i++){
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
  progressBar.style.width=(total>0?(scrolled/total*100):0)+'%';
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
  let start=0;
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
    email:document.getElementById('demo-email').value,
    phone:document.getElementById('demo-phone').value,
    type:document.getElementById('demo-type').value,
    interest:document.getElementById('demo-interest').value,
    note:document.getElementById('demo-note').value
  };
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Sending...';
  btn.disabled=true;
  fetch(SHEET_URL,{
    method:'POST',
    body:JSON.stringify(data)
  }).then(()=>{
    document.getElementById('demoFormContent').style.display='none';
    document.getElementById('demoSuccess').classList.add('show');
  }).catch(()=>{
    document.getElementById('demoFormContent').style.display='none';
    document.getElementById('demoSuccess').classList.add('show');
  });
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
  fetch(SHEET_URL,{
    method:'POST',
    body:JSON.stringify({formType:'review',name,program,text,type,stars})
  }).then(()=>{
    document.getElementById('reviewFormContent').style.display='none';
    document.getElementById('reviewSuccess').classList.add('show');
  }).catch(()=>{
    document.getElementById('reviewFormContent').style.display='none';
    document.getElementById('reviewSuccess').classList.add('show');
  });
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
  fetch(SHEET_URL,{
    method:'POST',
    body:JSON.stringify({formType:'contact',name,email,phone,interest,message})
  }).then(()=>{
    document.getElementById('contactSuccess').classList.add('show');
    e.target.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el=>el.style.display='none');
  }).catch(()=>{
    document.getElementById('contactSuccess').classList.add('show');
    e.target.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el=>el.style.display='none');
  });
}

// ── LOAD APPROVED REVIEWS FROM SHEETDB ──
const SHEETDB_URL='https://sheetdb.io/api/v1/3lvpwxsct2gz9/search?sheet=Reviews&Approved=Yes';

const DUMMY_REVIEWS=[
  {Name:'Priya Sharma',Review:'My daughter went from refusing to speak in class to winning the school debate. Ritu ma\'am\'s method is unlike anything else we\'ve tried.',Program:'Public Speaking',Type:'Parent',Stars:5},
  {Name:'Arjun Mehta',Review:'The interview preparation program got me my dream job. The mock sessions and feedback were incredibly detailed and honest.',Program:'Interview Preparation',Type:'Professional',Stars:5},
  {Name:'Sunita Verma',Review:'English grammar finally clicked for my son. His scores improved dramatically after just 8 weeks with Ritu ma\'am.',Program:'Basic Grammar',Type:'Parent',Stars:5}
];

function renderReviews(reviews){
  const container=document.getElementById('reviewsContainer');
  if(!container)return;
  container.innerHTML='';
  reviews.forEach(r=>{
    const starsNum=Number(r['Stars'])||5;
    const stars='★'.repeat(starsNum)+'☆'.repeat(5-starsNum);
    const card=document.createElement('div');
    card.className='review-full reveal';
    card.dataset.type=(r['Type']||'').toLowerCase();
    card.innerHTML=`<div class="stars">${stars}</div><div class="text">"${r['Review']}"</div><div class="author">${r['Name']}</div><div class="course-tag">${r['Program']} · ${r['Type']}</div>`;
    container.appendChild(card);
  });
}

function loadApprovedReviews(){
  const container=document.getElementById('reviewsContainer');
  if(!container)return;
  fetch(SHEETDB_URL+'&t='+Date.now())
    .then(r=>r.json())
    .then(reviews=>{
      if(reviews&&reviews.length>0){
        renderReviews(reviews);
      } else {
        renderReviews(DUMMY_REVIEWS);
      }
    }).catch(()=>{
      renderReviews(DUMMY_REVIEWS);
    });
}
if(document.getElementById('reviewsContainer')){
  loadApprovedReviews();
}

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
