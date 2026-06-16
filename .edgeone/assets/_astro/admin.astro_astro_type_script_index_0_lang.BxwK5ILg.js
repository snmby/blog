const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/decap-cms.hkBjt5OQ.js","_astro/_commonjsHelpers.CqkleIqs.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.CVfkMyKi.js";const t=document.getElementById("admin-status"),s=t?.getAttribute("data-base-url")||"/";window.CMS_MANUAL_INIT=!0;window.addEventListener("load",async()=>{try{const{default:i}=await r(async()=>{const{default:d}=await import("./decap-cms.hkBjt5OQ.js").then(n=>n.d);return{default:d}},__vite__mapDeps([0,1]));i.init();const e=document.getElementById("nc-root"),o=()=>t?.setAttribute("hidden","");if(e?.hasChildNodes()){o();return}const a=new MutationObserver(()=>{e?.hasChildNodes()&&(o(),a.disconnect())});e&&a.observe(e,{childList:!0})}catch(i){console.error("Failed to initialize Decap CMS:",i),t&&(t.innerHTML=`
              <div class="admin-card">
                <h1>Admin failed to load</h1>
                <p>Make sure <code>${s}admin/config.yml</code> is reachable, then check the browser console for details.</p>
              </div>
            `)}});
