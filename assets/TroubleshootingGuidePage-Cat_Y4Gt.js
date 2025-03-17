var U=(u,p,r)=>new Promise((x,s)=>{var t=d=>{try{g(r.next(d))}catch(m){s(m)}},h=d=>{try{g(r.throw(d))}catch(m){s(m)}},g=d=>d.done?x(d.value):Promise.resolve(d.value).then(t,h);g((r=r.apply(u,p)).next())});import{r as w,j as e}from"./react-vendor-Dgc981fj.js";import{P as V,H as a,Q as C}from"./MediaAssets-BgBl18UV.js";import{u as le,b as de,z as ce,U as pe,d as o,Q as he,D as O,ao as ue,ap as B,aq as $,ar as T,F as E,a_ as M,a$ as Q,p as A,m as n,W as _,B as j,as as N,bk as Y,bl as J,aj as G,ak as D,f as b,al as z,am as H,L as I,e as v,h as y,aH as xe,aI as ge,aJ as me,bm as be,bc as fe,aK as je,ay as K,bn as ve,bo as ye,b6 as we}from"./mui-BPTcmYo2.js";import"./vendor-QrZtzWVC.js";import"./three-CboCXHlv.js";const P=[{id:"jabra",name:"Jabra Enhance Pro 20",logo:a.jabra.logo,manualUrl:a.jabra.manualUrl,pairingVideoUrl:a.jabra.pairingVideoUrl,cleaningVideoUrl:a.jabra.cleaningVideoUrl,batteryUrl:a.jabra.batteryUrl,troubleshootingUrl:a.jabra.troubleshootingUrl},{id:"rexton",name:"Rexton Reach",logo:a.rexton.logo,manualUrl:a.rexton.manualUrl,pairingVideoUrl:a.rexton.pairingVideoUrl,cleaningVideoUrl:a.rexton.cleaningVideoUrl,batteryUrl:a.rexton.batteryUrl,troubleshootingUrl:a.rexton.troubleshootingUrl},{id:"philips",name:"Philips 9050",logo:a.philips.logo,manualUrl:a.philips.manualUrl,pairingVideoUrl:a.philips.pairingVideoUrl,cleaningVideoUrl:a.philips.cleaningVideoUrl,batteryUrl:a.philips.batteryUrl,troubleshootingUrl:a.philips.troubleshootingUrl}],S=[{id:"not-working",title:"Hearing Aid Not Working",icon:e.jsx(K,{}),steps:["Check if the hearing aid is turned on (open and close the battery door or check power button)","Replace the battery/ensure rechargeable aid is charged","Clean the hearing aid and check for wax blockage","Replace wax guards if necessary","If still not working, contact your hearing care provider"]},{id:"bluetooth",title:"Bluetooth Pairing Issues",icon:e.jsx(ve,{}),steps:["Ensure the hearing aid is charged and turned on.","Turn Bluetooth on in your device settings.","Put the hearing aid in pairing mode according to the manual.","Open the hearing aid app if applicable and follow the connection steps.","If pairing fails, restart both your device and the hearing aid."],platformSpecific:{ios:{title:"iOS Specific Steps",steps:["Go to Settings > Accessibility > Hearing Devices","Wait for your iPhone to detect your hearing aids","When your hearing aid appears, tap on it and follow the pairing request","If needed, confirm the pairing request on both devices"],url:V.ios.url},android:{title:"Android Specific Steps",steps:["Go to Settings > Connected Devices > Pair new device","Ensure your hearing aid is in pairing mode","When your hearing aid appears in the list, tap it to pair","Accept any pairing requests that appear"],url:V.android.url}}},{id:"battery",title:"Battery Issues",icon:e.jsx(ye,{}),steps:["Make sure you're using the correct battery size","Check for corrosion on battery contacts","For rechargeable aids, ensure the charging contacts are clean","Try a fresh pack of batteries","If battery drains quickly, reduce streaming time or consult provider"]},{id:"feedback",title:"Feedback/Whistling",icon:e.jsx(K,{}),steps:["Ensure the hearing aid is inserted properly","Check for ear wax buildup in your ear","Check for cracks in tubing (if applicable)","Lower the volume slightly","Contact your provider for possible adjustment"]},{id:"physical",title:"Physical Comfort Issues",icon:e.jsx(we,{}),steps:["Make sure you're inserting the hearing aid correctly","Check if the dome/earmold size is appropriate","For irritation, clean the hearing aid and your ear","Allow your ear time to adjust (usually 1-2 weeks)","If discomfort persists, contact your provider"]}],Ce=u=>U(void 0,null,function*(){try{const r=yield(yield fetch(u)).blob();return new Promise((x,s)=>{const t=new FileReader;t.onloadend=()=>x(t.result),t.onerror=s,t.readAsDataURL(r)})}catch(p){return console.error("Failed to convert image to data URL:",p),u}}),ke=(u,p=void 0)=>U(void 0,null,function*(){const r=P.find(t=>t.id===u);if(!r)return"";const x=yield Ce(r.logo),s=p?S.filter(t=>t.id===p):S;return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hearing Aid Troubleshooting Guide - ${r.name}</title>
  <style>
    @media print {
      @page {
        size: letter;
        margin: 0.5in;
      }
      body {
        font-size: 12pt;
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none;
      }
      .page-break {
        page-break-after: always;
      }
      .qr-code {
        width: 80px;
        height: 80px;
        max-width: 100%;
      }
      .logo {
        max-width: 120px;
      }
      
      /* Control page breaks */
      .troubleshooting-section {
        page-break-inside: avoid;
      }
      
      .platform-specific {
        page-break-inside: avoid;
      }
      
      h2, h3, h4, h5 {
        page-break-after: avoid;
      }
      
      .resources {
        page-break-inside: avoid;
      }
    }
    
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #1a365d;
      border-bottom: 2px solid #3182ce;
      padding-bottom: 10px;
      font-weight: 600;
    }
    
    h2 {
      color: #2c5282;
      margin-top: 30px;
      font-weight: 600;
    }
    
    h3 {
      color: #2a4365;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 15px;
    }
    
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 15px;
    }
    
    .logo {
      max-width: 150px;
      margin-right: 20px;
    }
    
    .troubleshooting-section {
      margin-bottom: 30px;
      border: 1px solid #e2e8f0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      background-color: #fff;
    }
    
    ol {
      margin-left: 0;
      padding-left: 25px;
      margin-bottom: 20px;
      counter-reset: item;
      list-style-type: none;
    }
    
    ol li {
      position: relative;
      margin-bottom: 12px;
      padding-left: 10px;
      counter-increment: item;
      line-height: 1.5;
    }
    
    ol li:before {
      content: counter(item) ".";
      position: absolute;
      left: -25px;
      width: 22px;
      text-align: right;
      font-weight: bold;
      color: #3182ce;
    }
    
    ul {
      margin-left: 0;
      padding-left: 25px;
      margin-bottom: 20px;
      list-style-type: square;
    }
    
    ul li {
      margin-bottom: 8px;
      padding-left: 5px;
    }
    
    .resources {
      background-color: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
      border: 1px solid #e2e8f0;
    }
    
    .resources h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .qr-resources {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 10px;
    }
    
    .qr-item {
      text-align: center;
      width: 100px;
    }
    
    .qr-code {
      display: block;
      margin: 0 auto 5px;
      border: 1px solid #e2e8f0;
      padding: 3px;
      background: white;
      border-radius: 4px;
    }
    
    .qr-item p {
      margin: 0;
      font-size: 0.85em;
      line-height: 1.2;
    }
    
    .button {
      background-color: #3182ce;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 20px;
    }
    
    .button:hover {
      background-color: #2c5282;
    }
    
    .no-print {
      margin-top: 30px;
      text-align: center;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      font-size: 0.9em;
      color: #718096;
      text-align: center;
    }
    
    .section-title {
      background-color: #ebf8ff;
      padding: 10px 15px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      margin: -20px -20px 15px -20px;
      border-bottom: 1px solid #bee3f8;
      font-weight: 600;
      color: #2c5282;
    }
    
    .platform-specific {
      background-color: #f0fff4;
      border: 1px solid #c6f6d5;
      border-radius: 8px;
      padding: 15px;
      margin-top: 20px;
    }
    
    .platform-specific h4 {
      color: #2f855a;
      margin-top: 0;
      margin-bottom: 15px;
    }
    
    .platform-specific h5 {
      color: #276749;
      margin-bottom: 10px;
      border-bottom: 1px solid #c6f6d5;
      padding-bottom: 5px;
    }
    
    .url-text {
      font-family: monospace;
      font-size: 0.9em;
      color: #4a5568;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${x}" alt="${r.name} Logo" class="logo">
    <h1>Hearing Aid Troubleshooting Guide</h1>
  </div>
  
  <h2>${r.name}</h2>
  
  <div class="resources">
    <h3>Quick Resources - Scan QR Codes for Help</h3>
    <div class="qr-resources">
      <div class="qr-item">
        <img class="qr-code" src="${C.baseUrl}?size=${C.defaultSize}&data=${encodeURIComponent(r.pairingVideoUrl)}" alt="QR Code for Pairing Video">
        <p><strong>Pairing</strong></p>
      </div>
      
      <div class="qr-item">
        <img class="qr-code" src="${C.baseUrl}?size=${C.defaultSize}&data=${encodeURIComponent(r.cleaningVideoUrl)}" alt="QR Code for Cleaning Video">
        <p><strong>Cleaning</strong></p>
      </div>
      
      <div class="qr-item">
        <img class="qr-code" src="${C.baseUrl}?size=${C.defaultSize}&data=${encodeURIComponent(r.manualUrl)}" alt="QR Code for User Manual">
        <p><strong>Manual</strong></p>
      </div>
    </div>
  </div>

  ${s.map(t=>`
  <div class="troubleshooting-section">
    <div class="section-title">${t.title}</div>
    <ol>
      ${t.steps.map(h=>`<li>${h}</li>`).join("")}
    </ol>
    
    ${t.id==="bluetooth"&&t.platformSpecific?`
    <div class="platform-specific">
      <h4>Device-Specific Instructions</h4>
      
      <h5>iPhone/iPad</h5>
      <ol>
        ${t.platformSpecific.ios.steps.map(h=>`<li>${h}</li>`).join("")}
      </ol>
      <p>For detailed instructions: <span class="url-text">${t.platformSpecific.ios.url}</span></p>
      
      <h5>Android Devices</h5>
      <ol>
        ${t.platformSpecific.android.steps.map(h=>`<li>${h}</li>`).join("")}
      </ol>
      <p>For detailed instructions: <span class="url-text">${t.platformSpecific.android.url}</span></p>
    </div>
    `:""}
  </div>
  `).join("")}
  
  <div class="footer">
    <p>This guide is provided as a resource for basic troubleshooting. For persistent issues, please contact your hearing healthcare provider.</p>
    <p>© ${new Date().getFullYear()} Audiometry Trainer. All rights reserved.</p>
  </div>
  
  <div class="no-print">
    <button class="button" onclick="window.print()">Print This Guide</button>
  </div>
</body>
</html>
  `}),Be=()=>{var F,L;const u=le(),p=de(u.breakpoints.down("md")),[r,x]=w.useState(""),[s,t]=w.useState(""),[h,g]=w.useState(!1),[d,m]=w.useState(0),[f,X]=w.useState(null),Z=i=>{x(i.target.value)},ee=i=>{t(i.target.value)},ie=()=>U(void 0,null,function*(){if(r){const i=P.find(se=>se.id===r),l=`${i==null?void 0:i.name.replace(/\s+/g,"_")}_troubleshooting_guide`,c=yield ke(r,s||void 0),ae=new Blob([c],{type:"text/html"}),R=URL.createObjectURL(ae);X(R);const ne=`${l}.html`,k=document.createElement("a");k.href=R,k.download=ne,document.body.appendChild(k),k.click(),document.body.removeChild(k),window.open(R,"_blank"),g(!0)}}),W=()=>{m(i=>i+1)},q=()=>{m(i=>i-1)},re=()=>{m(0),x(""),t("")},te=i=>P.find(l=>l.id===i),oe=i=>S.find(l=>l.id===i);return w.useEffect(()=>()=>{f&&URL.revokeObjectURL(f)},[f]),e.jsx(ce,{maxWidth:"lg",sx:{mb:8,mt:4},children:e.jsxs(pe,{elevation:3,sx:{p:{xs:2,md:4},borderRadius:2},children:[e.jsxs(o,{variant:"h4",component:"h1",gutterBottom:!0,children:[e.jsx(he,{fontSize:"large",color:"primary",sx:{mr:1,verticalAlign:"middle"}}),"Hearing Aid Troubleshooting Guide Generator"]}),e.jsx(o,{variant:"body1",paragraph:!0,sx:{mb:4},children:"Create personalized troubleshooting guides for your patients based on their hearing aid model. These guides include step-by-step instructions, QR codes to instructional videos, and can be printed for easy reference."}),e.jsx(O,{sx:{mb:4}}),e.jsxs(ue,{activeStep:d,orientation:p?"vertical":"horizontal",sx:{mb:4},children:[e.jsxs(B,{children:[e.jsx($,{children:"Select Hearing Aid"}),e.jsxs(T,{children:[e.jsx(o,{variant:"body2",sx:{mb:2},children:"Choose the specific hearing aid model your patient is using."}),e.jsxs(E,{fullWidth:!0,sx:{mb:3},children:[e.jsx(M,{id:"brand-select-label",children:"Hearing Aid Brand/Model"}),e.jsxs(Q,{labelId:"brand-select-label",id:"brand-select",value:r,onChange:Z,label:"Hearing Aid Brand/Model",children:[e.jsx(A,{value:"",disabled:!0,children:"Select a brand"}),P.map(i=>e.jsx(A,{value:i.id,children:i.name},i.id))]})]}),e.jsx(n,{variant:"contained",onClick:W,disabled:!r,endIcon:e.jsx(_,{}),children:"Next"})]})]}),e.jsxs(B,{children:[e.jsx($,{children:"Choose Issue (Optional)"}),e.jsxs(T,{children:[e.jsx(o,{variant:"body2",sx:{mb:2},children:"Select a specific issue to focus on, or leave blank to include all troubleshooting topics."}),e.jsxs(E,{fullWidth:!0,sx:{mb:3},children:[e.jsx(M,{id:"category-select-label",children:"Troubleshooting Category"}),e.jsxs(Q,{labelId:"category-select-label",id:"category-select",value:s,onChange:ee,label:"Troubleshooting Category",children:[e.jsx(A,{value:"",children:"All Categories"}),S.map(i=>e.jsx(A,{value:i.id,children:i.title},i.id))]})]}),e.jsxs(j,{sx:{display:"flex",gap:2},children:[e.jsx(n,{variant:"outlined",onClick:q,startIcon:e.jsx(N,{}),children:"Back"}),e.jsx(n,{variant:"contained",onClick:W,endIcon:e.jsx(_,{}),children:"Next"})]})]})]}),e.jsxs(B,{children:[e.jsx($,{children:"Generate Guide"}),e.jsxs(T,{children:[e.jsx(o,{variant:"body2",paragraph:!0,children:"Review your selections and generate a printable troubleshooting guide:"}),e.jsxs(j,{sx:{mb:3,p:2,bgcolor:"background.paper",borderRadius:1,border:"1px solid",borderColor:"divider"},children:[e.jsx(o,{variant:"subtitle1",children:"Selected Hearing Aid:"}),e.jsx(o,{variant:"body2",sx:{mb:2,fontWeight:"bold"},children:((F=te(r))==null?void 0:F.name)||"None selected"}),e.jsx(o,{variant:"subtitle1",children:"Selected Category:"}),e.jsx(o,{variant:"body2",sx:{fontWeight:"bold"},children:s?(L=oe(s))==null?void 0:L.title:"All Categories"})]}),e.jsxs(j,{sx:{display:"flex",gap:2},children:[e.jsx(n,{variant:"outlined",onClick:q,startIcon:e.jsx(N,{}),children:"Back"}),e.jsx(n,{variant:"contained",onClick:ie,startIcon:e.jsx(Y,{}),children:"Generate Guide"})]})]})]})]}),d===3&&e.jsxs(j,{sx:{mt:2,textAlign:"center"},children:[e.jsx(o,{variant:"h6",gutterBottom:!0,children:"Guide Generated Successfully!"}),e.jsx(o,{variant:"body2",paragraph:!0,children:"Your guide has been created and opened in a new browser tab. You can print it directly from the browser."}),e.jsxs(j,{sx:{display:"flex",justifyContent:"center",gap:2,mt:3},children:[e.jsx(n,{variant:"outlined",onClick:re,children:"Create Another Guide"}),f&&e.jsx(n,{variant:"contained",color:"primary",startIcon:e.jsx(J,{}),onClick:()=>window.open(f,"_blank"),children:"Open Guide Again"})]})]}),e.jsx(O,{sx:{my:4}}),e.jsx(o,{variant:"h5",gutterBottom:!0,children:"Common Troubleshooting Categories"}),S.map(i=>e.jsxs(G,{sx:{mb:1},children:[e.jsx(D,{expandIcon:e.jsx(z,{}),children:e.jsxs(j,{sx:{display:"flex",alignItems:"center"},children:[e.jsx(b,{sx:{minWidth:40},children:i.icon}),e.jsx(o,{variant:"subtitle1",children:i.title})]})}),e.jsxs(H,{children:[e.jsx(o,{variant:"body2",paragraph:!0,children:"Common steps to troubleshoot this issue:"}),e.jsx(I,{children:i.steps.map((l,c)=>e.jsxs(v,{sx:{py:.5},children:[e.jsx(b,{sx:{minWidth:36},children:e.jsxs(o,{variant:"body2",sx:{fontWeight:"bold"},children:[c+1,"."]})}),e.jsx(y,{primary:l})]},c))}),i.id==="bluetooth"&&i.platformSpecific&&e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"subtitle2",sx:{mt:2,fontWeight:"bold"},children:"Platform-Specific Instructions:"}),e.jsxs(G,{sx:{mt:1},children:[e.jsx(D,{expandIcon:e.jsx(z,{}),children:e.jsx(o,{children:"iPhone/iPad Instructions"})}),e.jsxs(H,{children:[e.jsx(I,{dense:!0,children:i.platformSpecific.ios.steps.map((l,c)=>e.jsxs(v,{children:[e.jsx(b,{sx:{minWidth:36},children:e.jsxs(o,{variant:"body2",children:[c+1,"."]})}),e.jsx(y,{primary:l})]},c))}),e.jsx(n,{size:"small",href:i.platformSpecific.ios.url,target:"_blank",sx:{mt:1},children:"Apple Support Article"})]})]}),e.jsxs(G,{sx:{mt:1},children:[e.jsx(D,{expandIcon:e.jsx(z,{}),children:e.jsx(o,{children:"Android Instructions"})}),e.jsxs(H,{children:[e.jsx(I,{dense:!0,children:i.platformSpecific.android.steps.map((l,c)=>e.jsxs(v,{children:[e.jsx(b,{sx:{minWidth:36},children:e.jsxs(o,{variant:"body2",children:[c+1,"."]})}),e.jsx(y,{primary:l})]},c))}),e.jsx(n,{size:"small",href:i.platformSpecific.android.url,target:"_blank",sx:{mt:1},children:"Android Support Article"})]})]})]})]})]},i.id)),e.jsxs(xe,{open:h,onClose:()=>g(!1),maxWidth:"md",fullWidth:!0,children:[e.jsx(ge,{children:"Guide Preview"}),e.jsx(me,{children:e.jsxs(j,{sx:{mb:2},children:[e.jsx(o,{variant:"body2",paragraph:!0,children:"Your troubleshooting guide has been generated. You can:"}),e.jsxs(I,{children:[e.jsxs(v,{children:[e.jsx(b,{children:e.jsx(be,{})}),e.jsx(y,{primary:"Your HTML file has been downloaded to your computer"})]}),e.jsxs(v,{children:[e.jsx(b,{children:e.jsx(fe,{})}),e.jsx(y,{primary:"The guide has been opened in a new browser tab"})]}),e.jsxs(v,{children:[e.jsx(b,{children:e.jsx(J,{})}),e.jsx(y,{primary:"Use the browser's Print option (Ctrl+P or Cmd+P) to save as PDF or print the guide"})]}),e.jsxs(v,{children:[e.jsx(b,{children:e.jsx(Y,{})}),e.jsx(y,{primary:"QR codes in the guide link to instructional videos"})]})]})]})}),e.jsxs(je,{children:[e.jsx(n,{onClick:()=>g(!1),children:"Close"}),f&&e.jsx(n,{color:"primary",onClick:()=>window.open(f,"_blank"),children:"Open Again in Browser"}),e.jsx(n,{variant:"contained",onClick:()=>{g(!1),m(3)},children:"Continue"})]})]})]})})};export{Be as default};
