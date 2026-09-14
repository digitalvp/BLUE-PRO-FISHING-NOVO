window.BlueLinkBio={};
(()=>{const B=window.BlueLinkBio,body=document.body;if(location.pathname.replace(/\/+$/,'')!=='/linkbio')return;
body.classList.add('linkbio-v2-body');const q=s=>document.querySelector(s);B.q=q;B.page=q('.bio-page');B.links=q('.bio-links');
const photo=q('.bio-hero-photo');if(photo){photo.src='/assets/img/sobre/DSC09308.jpg';photo.removeAttribute('width');photo.removeAttribute('height');photo.alt='Fachada real da Blue Pro Fishing em Palmas, Tocantins';photo.classList.add('lb-enter');photo.dataset.enter='5'}
const title=q('#bio-title');if(title)title.innerHTML='<span class="lb-title-line">A referência</span><span class="lb-title-line lb-blue">em pesca em Palmas</span>';
const sp=q('.bio-specialties');if(sp)sp.textContent='Pesca • Náutica • Camping • Lazer';const intro=q('.bio-intro');if(intro)intro.textContent='Blue Pro Fishing • Palmas - TO';
['Falar com a Blue','Acessar o site','YouTube Blue Pro','TikTok Blue Pro'].forEach(t=>[...(B.links?.children||[])].find(e=>e.textContent.includes(t))?.remove());
})();
