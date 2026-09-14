const footerYear=document.getElementById('current-year');
if(footerYear)footerYear.textContent=new Date().getFullYear();
if(location.pathname.replace(/\/+$/,'')==='/linkbio'){
 const files=['/assets/js/lb-01.js','/assets/js/lb-02.js','/assets/js/lb-03.js','/assets/js/lb-04.js'];
 files.reduce((p,src)=>p.then(()=>new Promise((ok,fail)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=fail;document.body.append(s)})),Promise.resolve());
}
