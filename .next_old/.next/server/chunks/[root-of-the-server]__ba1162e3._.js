module.exports=[18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},74527,e=>{"use strict";var t=e.i(49729),r=e.i(93140),a=e.i(24541),i=e.i(35350),n=e.i(35152),o=e.i(73268),s=e.i(19075),l=e.i(34857),d=e.i(64115),p=e.i(99112),c=e.i(1157),u=e.i(918),x=e.i(446),v=e.i(58283),h=e.i(16868),g=e.i(93695);e.i(19034);var m=e.i(45324),f=e.i(5226),w=e.i(12866);async function b(e){let{searchParams:t}=new URL(e.url),r=t.get("certId");if(!r)return f.NextResponse.json({error:"certId required"},{status:400});let a=await (0,w.createSupabaseServerClient)(),{data:i}=await a.from("certificates").select("*").eq("id",r).single();if(!i)return f.NextResponse.json({error:"Not found"},{status:404});let n=new Date(i.issued_at).toLocaleDateString("ar-SA",{year:"numeric",month:"long",day:"numeric"});return new Response(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;800;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box }
  body {
    font-family: 'Tajawal', serif;
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
  }
  .cert {
    width: 900px; height: 640px;
    border: 2px solid #1a1a2e;
    position: relative;
    overflow: hidden;
    background: #fff;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 20px;
    padding: 50px 60px;
  }
  .cert::before {
    content: '';
    position: absolute; inset: 12px;
    border: 1px solid #635BFF; opacity: .3;
    pointer-events: none;
  }
  .corner {
    position: absolute; width: 60px; height: 60px;
    border-color: #635BFF; border-style: solid; opacity: .6;
  }
  .corner.tl { top:8px; right:8px; border-width:3px 0 0 3px; border-radius: 0 0 0 4px }
  .corner.tr { top:8px; left:8px;  border-width:3px 3px 0 0; border-radius: 0 0 4px 0 }
  .corner.bl { bottom:8px; right:8px; border-width:0 0 3px 3px; border-radius: 4px 0 0 0 }
  .corner.br { bottom:8px; left:8px;  border-width:0 3px 3px 0; border-radius: 0 4px 0 0 }
  .watermark {
    position: absolute; font-size: 120px; font-weight: 900;
    color: rgba(99,91,255,.04); top: 50%; left: 50%;
    transform: translate(-50%,-50%) rotate(-30deg);
    white-space: nowrap; pointer-events: none;
  }
  .logo-row { display:flex; align-items:center; gap:10px; margin-bottom:4px }
  .logo-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg,#635BFF,#4F46E5);
    display: flex; align-items: center; justify-content: center;
  }
  .logo-icon svg { width:22px; height:22px }
  .logo-name { font-size:18px; font-weight:900; color:#0A0A0A; letter-spacing:-.02em }
  .divider { width:80px; height:3px; background:linear-gradient(90deg,#635BFF,#0EA5E9); border-radius:99px; margin:4px auto }
  .cert-title { font-size:13px; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:#635BFF }
  .awarded { font-size:15px; color:#737373; font-weight:500 }
  .student-name { font-size:38px; font-weight:900; color:#0A0A0A; letter-spacing:-.02em; text-align:center; border-bottom:2px solid #635BFF; padding-bottom:8px; min-width:300px }
  .completed-text { font-size:14px; color:#737373 }
  .course-name { font-size:22px; font-weight:800; color:#0A0A0A; text-align:center; letter-spacing:-.01em }
  .meta-row { display:flex; gap:60px; align-items:center; margin-top:16px }
  .meta-item { text-align:center }
  .meta-label { font-size:11px; color:#A3A3A3; font-weight:600; letter-spacing:.08em; text-transform:uppercase; margin-bottom:4px }
  .meta-value { font-size:13px; font-weight:700; color:#3D3D3D }
  .cert-number { position:absolute; bottom:16px; left:50%; transform:translateX(-50%); font-size:10px; color:#A3A3A3; letter-spacing:.1em }
</style>
</head>
<body>
<div class="cert">
  <div class="watermark">MEDLEARN</div>
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>

  <div class="logo-row">
    <div class="logo-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    </div>
    <span class="logo-name">منصة تعلّم الطبية</span>
  </div>

  <div class="divider"></div>
  <div class="cert-title">شهادة إتمام دورة</div>
  <div class="awarded">تُمنح هذه الشهادة لـ</div>
  <div class="student-name">${i.student_name}</div>
  <div class="completed-text">لإتمامه بنجاح دورة</div>
  <div class="course-name">${i.course_title}</div>

  <div class="meta-row">
    <div class="meta-item">
      <div class="meta-label">المعلم</div>
      <div class="meta-value">${i.teacher_name}</div>
    </div>
    <div class="divider" style="width:1px;height:40px;background:#E8E8E8;margin:0"></div>
    <div class="meta-item">
      <div class="meta-label">تاريخ الإصدار</div>
      <div class="meta-value">${n}</div>
    </div>
    <div class="divider" style="width:1px;height:40px;background:#E8E8E8;margin:0"></div>
    <div class="meta-item">
      <div class="meta-label">الدرجة</div>
      <div class="meta-value" style="color:#16A34A">ممتاز ✓</div>
    </div>
  </div>

  <div class="cert-number">${i.certificate_number}</div>
</div>
<script>window.onload = () => window.print()</script>
</body>
</html>`,{headers:{"Content-Type":"text/html; charset=utf-8"}})}e.s(["GET",()=>b],39233);var R=e.i(39233);let y=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/certificate/pdf/route",pathname:"/api/certificate/pdf",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/platform/src/app/api/certificate/pdf/route.ts",nextConfigOutput:"",userland:R}),{workAsyncStorage:E,workUnitAsyncStorage:A,serverHooks:C}=y;function k(){return(0,a.patchFetch)({workAsyncStorage:E,workUnitAsyncStorage:A})}async function T(e,t,a){y.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/certificate/pdf/route";f=f.replace(/\/index$/,"")||"/";let w=await y.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!w)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:b,params:R,nextConfig:E,parsedUrl:A,isDraftMode:C,prerenderManifest:k,routerServerContext:T,isOnDemandRevalidate:N,revalidateOnlyGenerated:_,resolvedPathname:j,clientReferenceManifest:P,serverActionsManifest:S}=w,q=(0,s.normalizeAppPath)(f),F=!!(k.dynamicRoutes[q]||k.routes[j]),O=async()=>((null==T?void 0:T.render404)?await T.render404(e,t,A,!1):t.end("This page could not be found"),null);if(F&&!C){let e=!!k.routes[j],t=k.dynamicRoutes[q];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await O();throw new g.NoFallbackError}}let D=null;!F||y.isDev||C||(D="/index"===(D=j)?"/":D);let H=!0===y.isDev||!F,U=F&&!H;S&&P&&(0,o.setManifestsSingleton)({page:f,clientReferenceManifest:P,serverActionsManifest:S});let I=e.method||"GET",M=(0,n.getTracer)(),$=M.getActiveScopeSpan(),z={params:R,prerenderManifest:k,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:H,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,i)=>y.onRequestError(e,t,a,i,T)},sharedContext:{buildId:b}},B=new l.NodeNextRequest(e),L=new l.NodeNextResponse(t),K=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let o=async e=>y.handle(K,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${I} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${I} ${f}`)}),s=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var n,l;let d=async({previousCacheEntry:r})=>{try{if(!s&&N&&_&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(i);e.fetchMetrics=z.renderOpts.fetchMetrics;let l=z.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=z.renderOpts.collectedTags;if(!F)return await (0,u.sendResponse)(B,L,n,z.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,x.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,a=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:m.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})},!1,T),t}},p=await y.handleResponse({req:e,nextConfig:E,cacheKey:D,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:_,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!F)return null;if((null==p||null==(n=p.value)?void 0:n.kind)!==m.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(l=p.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",N?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let g=(0,x.fromNodeOutgoingHttpHeaders)(p.value.headers);return s&&F||g.delete(h.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||g.get("Cache-Control")||g.set("Cache-Control",(0,v.getCacheControlHeader)(p.cacheControl)),await (0,u.sendResponse)(B,L,new Response(p.value.body,{headers:g,status:p.value.status||200})),null};$?await l($):await M.withPropagatedContext(e.headers,()=>M.trace(p.BaseServerSpan.handleRequest,{spanName:`${I} ${f}`,kind:n.SpanKind.SERVER,attributes:{"http.method":I,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:q,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:N})},!1,T),F)throw t;return await (0,u.sendResponse)(B,L,new Response(null,{status:500})),null}}e.s(["handler",()=>T,"patchFetch",()=>k,"routeModule",()=>y,"serverHooks",()=>C,"workAsyncStorage",()=>E,"workUnitAsyncStorage",()=>A],74527)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__ba1162e3._.js.map