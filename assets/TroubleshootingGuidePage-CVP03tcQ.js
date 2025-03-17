import{u as ae,b as ne,j as e,E as se,W as le,d as r,R as de,D as W,aq as ce,ar as R,as as P,at as B,G as H,b1 as F,b2 as V,p as S,m as n,X as O,B as x,au as E,bn as M,bo as Q,al as $,am as T,f as c,an as G,ao as D,L as U,e as g,g as m,aK as pe,aL as he,aM as ue,bp as xe,bf as ge,aN as me,aA as _,bq as be,br as fe,b9 as je}from"./vendor-mui-BsgQ3_Os.js";import{r as j}from"./vendor-react-5UJDq-bj.js";import{P as N,H as o,Q as v}from"./MediaAssets-BQrKIqkx.js";const A=[{id:"jabra",name:"Jabra Enhance Pro 20",logo:o.jabra.logo,manualUrl:o.jabra.manualUrl,pairingVideoUrl:o.jabra.pairingVideoUrl,cleaningVideoUrl:o.jabra.cleaningVideoUrl,batteryUrl:o.jabra.batteryUrl,troubleshootingUrl:o.jabra.troubleshootingUrl},{id:"rexton",name:"Rexton Reach",logo:o.rexton.logo,manualUrl:o.rexton.manualUrl,pairingVideoUrl:o.rexton.pairingVideoUrl,cleaningVideoUrl:o.rexton.cleaningVideoUrl,batteryUrl:o.rexton.batteryUrl,troubleshootingUrl:o.rexton.troubleshootingUrl},{id:"philips",name:"Philips 9050",logo:o.philips.logo,manualUrl:o.philips.manualUrl,pairingVideoUrl:o.philips.pairingVideoUrl,cleaningVideoUrl:o.philips.cleaningVideoUrl,batteryUrl:o.philips.batteryUrl,troubleshootingUrl:o.philips.troubleshootingUrl}],w=[{id:"not-working",title:"Hearing Aid Not Working",icon:e.jsx(_,{}),steps:["Check if the hearing aid is turned on (open and close the battery door or check power button)","Replace the battery/ensure rechargeable aid is charged","Clean the hearing aid and check for wax blockage","Replace wax guards if necessary","If still not working, contact your hearing care provider"]},{id:"bluetooth",title:"Bluetooth Pairing Issues",icon:e.jsx(be,{}),steps:["Ensure the hearing aid is charged and turned on.","Turn Bluetooth on in your device settings.","Put the hearing aid in pairing mode according to the manual.","Open the hearing aid app if applicable and follow the connection steps.","If pairing fails, restart both your device and the hearing aid."],platformSpecific:{ios:{title:"iOS Specific Steps",steps:["Go to Settings > Accessibility > Hearing Devices","Wait for your iPhone to detect your hearing aids","When your hearing aid appears, tap on it and follow the pairing request","If needed, confirm the pairing request on both devices"],url:N.ios.url},android:{title:"Android Specific Steps",steps:["Go to Settings > Connected Devices > Pair new device","Ensure your hearing aid is in pairing mode","When your hearing aid appears in the list, tap it to pair","Accept any pairing requests that appear"],url:N.android.url}}},{id:"battery",title:"Battery Issues",icon:e.jsx(fe,{}),steps:["Make sure you're using the correct battery size","Check for corrosion on battery contacts","For rechargeable aids, ensure the charging contacts are clean","Try a fresh pack of batteries","If battery drains quickly, reduce streaming time or consult provider"]},{id:"feedback",title:"Feedback/Whistling",icon:e.jsx(_,{}),steps:["Ensure the hearing aid is inserted properly","Check for ear wax buildup in your ear","Check for cracks in tubing (if applicable)","Lower the volume slightly","Contact your provider for possible adjustment"]},{id:"physical",title:"Physical Comfort Issues",icon:e.jsx(je,{}),steps:["Make sure you're inserting the hearing aid correctly","Check if the dome/earmold size is appropriate","For irritation, clean the hearing aid and your ear","Allow your ear time to adjust (usually 1-2 weeks)","If discomfort persists, contact your provider"]}],ve=async b=>{try{const a=await(await fetch(b)).blob();return new Promise((f,d)=>{const t=new FileReader;t.onloadend=()=>f(t.result),t.onerror=d,t.readAsDataURL(a)})}catch(p){return console.error("Failed to convert image to data URL:",p),b}},ye=async(b,p=void 0)=>{const a=A.find(t=>t.id===b);if(!a)return"";const f=await ve(a.logo),d=p?w.filter(t=>t.id===p):w;return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hearing Aid Troubleshooting Guide - ${a.name}</title>
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
    <img src="${f}" alt="${a.name} Logo" class="logo">
    <h1>Hearing Aid Troubleshooting Guide</h1>
  </div>
  
  <h2>${a.name}</h2>
  
  <div class="resources">
    <h3>Quick Resources - Scan QR Codes for Help</h3>
    <div class="qr-resources">
      <div class="qr-item">
        <img class="qr-code" src="${v.baseUrl}?size=${v.defaultSize}&data=${encodeURIComponent(a.pairingVideoUrl)}" alt="QR Code for Pairing Video">
        <p><strong>Pairing</strong></p>
      </div>
      
      <div class="qr-item">
        <img class="qr-code" src="${v.baseUrl}?size=${v.defaultSize}&data=${encodeURIComponent(a.cleaningVideoUrl)}" alt="QR Code for Cleaning Video">
        <p><strong>Cleaning</strong></p>
      </div>
      
      <div class="qr-item">
        <img class="qr-code" src="${v.baseUrl}?size=${v.defaultSize}&data=${encodeURIComponent(a.manualUrl)}" alt="QR Code for User Manual">
        <p><strong>Manual</strong></p>
      </div>
    </div>
  </div>

  ${d.map(t=>`
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
  `},Se=()=>{const b=ae(),p=ne(b.breakpoints.down("md")),[a,f]=j.useState(""),[d,t]=j.useState(""),[h,C]=j.useState(!1),[q,k]=j.useState(0),[u,Y]=j.useState(null),J=i=>{f(i.target.value)},K=i=>{t(i.target.value)},X=async()=>{if(a){const s=`${A.find(oe=>oe.id===a)?.name.replace(/\s+/g,"_")}_troubleshooting_guide`,l=await ye(a,d||void 0),re=new Blob([l],{type:"text/html"}),I=URL.createObjectURL(re);Y(I);const te=`${s}.html`,y=document.createElement("a");y.href=I,y.download=te,document.body.appendChild(y),y.click(),document.body.removeChild(y),window.open(I,"_blank"),C(!0)}},z=()=>{k(i=>i+1)},L=()=>{k(i=>i-1)},Z=()=>{k(0),f(""),t("")},ee=i=>A.find(s=>s.id===i),ie=i=>w.find(s=>s.id===i);return j.useEffect(()=>()=>{u&&URL.revokeObjectURL(u)},[u]),e.jsx(se,{maxWidth:"lg",sx:{mb:8,mt:4},children:e.jsxs(le,{elevation:3,sx:{p:{xs:2,md:4},borderRadius:2},children:[e.jsxs(r,{variant:"h4",component:"h1",gutterBottom:!0,children:[e.jsx(de,{fontSize:"large",color:"primary",sx:{mr:1,verticalAlign:"middle"}}),"Hearing Aid Troubleshooting Guide Generator"]}),e.jsx(r,{variant:"body1",paragraph:!0,sx:{mb:4},children:"Create personalized troubleshooting guides for your patients based on their hearing aid model. These guides include step-by-step instructions, QR codes to instructional videos, and can be printed for easy reference."}),e.jsx(W,{sx:{mb:4}}),e.jsxs(ce,{activeStep:q,orientation:p?"vertical":"horizontal",sx:{mb:4},children:[e.jsxs(R,{children:[e.jsx(P,{children:"Select Hearing Aid"}),e.jsxs(B,{children:[e.jsx(r,{variant:"body2",sx:{mb:2},children:"Choose the specific hearing aid model your patient is using."}),e.jsxs(H,{fullWidth:!0,sx:{mb:3},children:[e.jsx(F,{id:"brand-select-label",children:"Hearing Aid Brand/Model"}),e.jsxs(V,{labelId:"brand-select-label",id:"brand-select",value:a,onChange:J,label:"Hearing Aid Brand/Model",children:[e.jsx(S,{value:"",disabled:!0,children:"Select a brand"}),A.map(i=>e.jsx(S,{value:i.id,children:i.name},i.id))]})]}),e.jsx(n,{variant:"contained",onClick:z,disabled:!a,endIcon:e.jsx(O,{}),children:"Next"})]})]}),e.jsxs(R,{children:[e.jsx(P,{children:"Choose Issue (Optional)"}),e.jsxs(B,{children:[e.jsx(r,{variant:"body2",sx:{mb:2},children:"Select a specific issue to focus on, or leave blank to include all troubleshooting topics."}),e.jsxs(H,{fullWidth:!0,sx:{mb:3},children:[e.jsx(F,{id:"category-select-label",children:"Troubleshooting Category"}),e.jsxs(V,{labelId:"category-select-label",id:"category-select",value:d,onChange:K,label:"Troubleshooting Category",children:[e.jsx(S,{value:"",children:"All Categories"}),w.map(i=>e.jsx(S,{value:i.id,children:i.title},i.id))]})]}),e.jsxs(x,{sx:{display:"flex",gap:2},children:[e.jsx(n,{variant:"outlined",onClick:L,startIcon:e.jsx(E,{}),children:"Back"}),e.jsx(n,{variant:"contained",onClick:z,endIcon:e.jsx(O,{}),children:"Next"})]})]})]}),e.jsxs(R,{children:[e.jsx(P,{children:"Generate Guide"}),e.jsxs(B,{children:[e.jsx(r,{variant:"body2",paragraph:!0,children:"Review your selections and generate a printable troubleshooting guide:"}),e.jsxs(x,{sx:{mb:3,p:2,bgcolor:"background.paper",borderRadius:1,border:"1px solid",borderColor:"divider"},children:[e.jsx(r,{variant:"subtitle1",children:"Selected Hearing Aid:"}),e.jsx(r,{variant:"body2",sx:{mb:2,fontWeight:"bold"},children:ee(a)?.name||"None selected"}),e.jsx(r,{variant:"subtitle1",children:"Selected Category:"}),e.jsx(r,{variant:"body2",sx:{fontWeight:"bold"},children:d?ie(d)?.title:"All Categories"})]}),e.jsxs(x,{sx:{display:"flex",gap:2},children:[e.jsx(n,{variant:"outlined",onClick:L,startIcon:e.jsx(E,{}),children:"Back"}),e.jsx(n,{variant:"contained",onClick:X,startIcon:e.jsx(M,{}),children:"Generate Guide"})]})]})]})]}),q===3&&e.jsxs(x,{sx:{mt:2,textAlign:"center"},children:[e.jsx(r,{variant:"h6",gutterBottom:!0,children:"Guide Generated Successfully!"}),e.jsx(r,{variant:"body2",paragraph:!0,children:"Your guide has been created and opened in a new browser tab. You can print it directly from the browser."}),e.jsxs(x,{sx:{display:"flex",justifyContent:"center",gap:2,mt:3},children:[e.jsx(n,{variant:"outlined",onClick:Z,children:"Create Another Guide"}),u&&e.jsx(n,{variant:"contained",color:"primary",startIcon:e.jsx(Q,{}),onClick:()=>window.open(u,"_blank"),children:"Open Guide Again"})]})]}),e.jsx(W,{sx:{my:4}}),e.jsx(r,{variant:"h5",gutterBottom:!0,children:"Common Troubleshooting Categories"}),w.map(i=>e.jsxs($,{sx:{mb:1},children:[e.jsx(T,{expandIcon:e.jsx(G,{}),children:e.jsxs(x,{sx:{display:"flex",alignItems:"center"},children:[e.jsx(c,{sx:{minWidth:40},children:i.icon}),e.jsx(r,{variant:"subtitle1",children:i.title})]})}),e.jsxs(D,{children:[e.jsx(r,{variant:"body2",paragraph:!0,children:"Common steps to troubleshoot this issue:"}),e.jsx(U,{children:i.steps.map((s,l)=>e.jsxs(g,{sx:{py:.5},children:[e.jsx(c,{sx:{minWidth:36},children:e.jsxs(r,{variant:"body2",sx:{fontWeight:"bold"},children:[l+1,"."]})}),e.jsx(m,{primary:s})]},l))}),i.id==="bluetooth"&&i.platformSpecific&&e.jsxs(e.Fragment,{children:[e.jsx(r,{variant:"subtitle2",sx:{mt:2,fontWeight:"bold"},children:"Platform-Specific Instructions:"}),e.jsxs($,{sx:{mt:1},children:[e.jsx(T,{expandIcon:e.jsx(G,{}),children:e.jsx(r,{children:"iPhone/iPad Instructions"})}),e.jsxs(D,{children:[e.jsx(U,{dense:!0,children:i.platformSpecific.ios.steps.map((s,l)=>e.jsxs(g,{children:[e.jsx(c,{sx:{minWidth:36},children:e.jsxs(r,{variant:"body2",children:[l+1,"."]})}),e.jsx(m,{primary:s})]},l))}),e.jsx(n,{size:"small",href:i.platformSpecific.ios.url,target:"_blank",sx:{mt:1},children:"Apple Support Article"})]})]}),e.jsxs($,{sx:{mt:1},children:[e.jsx(T,{expandIcon:e.jsx(G,{}),children:e.jsx(r,{children:"Android Instructions"})}),e.jsxs(D,{children:[e.jsx(U,{dense:!0,children:i.platformSpecific.android.steps.map((s,l)=>e.jsxs(g,{children:[e.jsx(c,{sx:{minWidth:36},children:e.jsxs(r,{variant:"body2",children:[l+1,"."]})}),e.jsx(m,{primary:s})]},l))}),e.jsx(n,{size:"small",href:i.platformSpecific.android.url,target:"_blank",sx:{mt:1},children:"Android Support Article"})]})]})]})]})]},i.id)),e.jsxs(pe,{open:h,onClose:()=>C(!1),maxWidth:"md",fullWidth:!0,children:[e.jsx(he,{children:"Guide Preview"}),e.jsx(ue,{children:e.jsxs(x,{sx:{mb:2},children:[e.jsx(r,{variant:"body2",paragraph:!0,children:"Your troubleshooting guide has been generated. You can:"}),e.jsxs(U,{children:[e.jsxs(g,{children:[e.jsx(c,{children:e.jsx(xe,{})}),e.jsx(m,{primary:"Your HTML file has been downloaded to your computer"})]}),e.jsxs(g,{children:[e.jsx(c,{children:e.jsx(ge,{})}),e.jsx(m,{primary:"The guide has been opened in a new browser tab"})]}),e.jsxs(g,{children:[e.jsx(c,{children:e.jsx(Q,{})}),e.jsx(m,{primary:"Use the browser's Print option (Ctrl+P or Cmd+P) to save as PDF or print the guide"})]}),e.jsxs(g,{children:[e.jsx(c,{children:e.jsx(M,{})}),e.jsx(m,{primary:"QR codes in the guide link to instructional videos"})]})]})]})}),e.jsxs(me,{children:[e.jsx(n,{onClick:()=>C(!1),children:"Close"}),u&&e.jsx(n,{color:"primary",onClick:()=>window.open(u,"_blank"),children:"Open Again in Browser"}),e.jsx(n,{variant:"contained",onClick:()=>{C(!1),k(3)},children:"Continue"})]})]})]})})};export{Se as default};
