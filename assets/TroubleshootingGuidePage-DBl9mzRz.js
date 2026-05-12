import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{E as t}from"./vendor-charts-3kNt8p5q.js";import{At as n,Cn as r,Dt as i,E as a,Fn as o,In as s,Jn as c,Kn as l,M as u,Mn as d,Mt as f,On as p,P as m,Pn as h,Rn as g,Rt as _,Vt as v,_n as y,ar as b,cr as x,ct as S,gn as C,gr as w,hn as T,in as E,jn as D,ln as O,nn as k,o as A,or as j,pn as M,pr as N,rn as P,sr as F,tn as I,tr as L,tt as R,vn as z,xn as B}from"./vendor-mui-D2ucBj-1.js";var V=e(t(),1),H=w(),U=[{id:`jabra`,name:`Jabra Enhance Pro 20`,logo:`/audiometry_trainer/assets/images/jabra-logo.png`,manualUrl:`https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/documentation`,pairingVideoUrl:`https://www.youtube.com/watch?v=8rQWLSfpIw4`,cleaningVideoUrl:`https://www.youtube.com/watch?v=_KhxAOxoRkU`,batteryUrl:`https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/faq/Battery`,troubleshootingUrl:`https://www.jabra.com/supportpages/jabra-enhance-plus/hsb001/troubleshooting`},{id:`rexton`,name:`Rexton Reach`,logo:`/audiometry_trainer/assets/images/rexton-logo.png`,manualUrl:`https://www.rexton.com/en-us/help/user-guides`,pairingVideoUrl:`https://www.youtube.com/watch?v=8KU-g_xCY3I`,cleaningVideoUrl:`https://www.youtube.com/watch?v=f0KlA_HWz6M`,batteryUrl:`https://www.rexton.com/en-us/help/how-to-videos/battery-change`,troubleshootingUrl:`https://www.rexton.com/en-us/help/troubleshooting`},{id:`philips`,name:`Philips 9050`,logo:`/audiometry_trainer/assets/images/philips-logo.png`,manualUrl:`https://www.hearingsolutions.philips.com/en-us/support-for-professionals/user-guides`,pairingVideoUrl:`https://www.youtube.com/watch?v=pxfJWR8EcTQ`,cleaningVideoUrl:`https://www.youtube.com/watch?v=zTH5PoneoIU`,batteryUrl:`https://www.hearingsolutions.philips.com/en-us/support-for-professionals/how-to-videos/changing-hearing-aid-battery`,troubleshootingUrl:`https://www.hearingsolutions.philips.com/en-us/support-for-professionals/troubleshooting-guide`}],W=[{id:`not-working`,title:`Hearing Aid Not Working`,icon:(0,H.jsx)(A,{}),steps:[`Check if the hearing aid is turned on (open and close the battery door or check power button)`,`Replace the battery/ensure rechargeable aid is charged`,`Clean the hearing aid and check for wax blockage`,`Replace wax guards if necessary`,`If still not working, contact your hearing care provider`]},{id:`bluetooth`,title:`Bluetooth Not Connecting`,icon:(0,H.jsx)(n,{}),steps:[`Make sure Bluetooth is enabled on your device`,`Ensure hearing aids are powered on and in pairing mode`,`Try restarting your phone/device`,`Try restarting your hearing aids (open/close battery door or place in charger)`,`Forget the device in Bluetooth settings and re-pair`],platformSpecific:{ios:{title:`iOS Pairing Instructions`,steps:[`Go to Settings > Accessibility > Hearing Devices`,`Make sure Bluetooth is turned on`,`Put hearing aids in pairing mode (open/close battery door or press pairing button)`,`Select your hearing aids when they appear`,`Tap 'Pair' when prompted`],url:`https://support.apple.com/en-us/HT201466`},android:{title:`Android Pairing Instructions`,steps:[`Go to Settings > Connected devices > Pair new device`,`Make sure Bluetooth is turned on`,`Put hearing aids in pairing mode (open/close battery door or press pairing button)`,`Select your hearing aids when they appear`,`Tap 'Pair' when prompted`],url:`https://support.google.com/android/answer/9075925?hl=en`}}},{id:`battery`,title:`Battery Issues`,icon:(0,H.jsx)(f,{}),steps:[`Make sure you're using the correct battery size`,`Check for corrosion on battery contacts`,`For rechargeable aids, ensure the charging contacts are clean`,`Try a fresh pack of batteries`,`If battery drains quickly, reduce streaming time or consult provider`]},{id:`feedback`,title:`Feedback/Whistling`,icon:(0,H.jsx)(A,{}),steps:[`Ensure the hearing aid is inserted properly`,`Check for ear wax buildup in your ear`,`Check for cracks in tubing (if applicable)`,`Lower the volume slightly`,`Contact your provider for possible adjustment`]},{id:`physical`,title:`Physical Comfort Issues`,icon:(0,H.jsx)(i,{}),steps:[`Make sure you're inserting the hearing aid correctly`,`Check if the dome/earmold size is appropriate`,`For irritation, clean the hearing aid and your ear`,`Allow your ear time to adjust (usually 1-2 weeks)`,`If discomfort persists, contact your provider`]}],G=(e,t=void 0)=>{let n=U.find(t=>t.id===e);if(!n)return``;let r=t?W.filter(e=>e.id===t):W;return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hearing Aid Troubleshooting Guide - ${n.name}</title>
  <style>
    @media print {
      @page {
        size: letter;
        margin: 0.5in;
      }
      body {
        font-size: 12pt;
      }
      .no-print {
        display: none;
      }
      .page-break {
        page-break-after: always;
      }
      .qr-code {
        width: 100px;
        height: 100px;
      }
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    
    h2 {
      color: #2980b9;
      margin-top: 30px;
    }
    
    h3 {
      color: #34495e;
    }
    
    .header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .logo {
      max-width: 150px;
      margin-right: 20px;
    }
    
    .troubleshooting-section {
      margin-bottom: 30px;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
    }
    
    ol, ul {
      margin-left: 20px;
      margin-bottom: 20px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    .resources {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-top: 30px;
    }
    
    .qr-section {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-top: 20px;
    }
    
    .qr-item {
      text-align: center;
      width: 150px;
    }
    
    .qr-code {
      display: block;
      margin: 0 auto 10px;
    }
    
    .button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 20px;
    }
    
    .button:hover {
      background-color: #2980b9;
    }
    
    .no-print {
      margin-top: 30px;
      text-align: center;
    }
    
    .footer {
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
      font-size: 0.9em;
      color: #7f8c8d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Hearing Aid Troubleshooting Guide</h1>
  </div>
  
  <h2>${n.name}</h2>
  
  <div class="resources">
    <h3>Quick Resources</h3>
    <ul>
      <li><strong>User Manual:</strong> <a href="${n.manualUrl}" target="_blank">View Online Manual</a></li>
      <li><strong>Support Website:</strong> <a href="${n.troubleshootingUrl}" target="_blank">Visit Support Website</a></li>
    </ul>
  </div>

  ${r.map(e=>`
  <div class="troubleshooting-section">
    <h3>${e.title}</h3>
    <ol>
      ${e.steps.map(e=>`<li>${e}</li>`).join(``)}
    </ol>
    
    ${e.id===`bluetooth`&&e.platformSpecific?`
    <div class="platform-specific">
      <h4>Device-Specific Instructions</h4>
      
      <h5>iPhone/iPad</h5>
      <ol>
        ${e.platformSpecific.ios.steps.map(e=>`<li>${e}</li>`).join(``)}
      </ol>
      <p>For detailed instructions: <a href="${e.platformSpecific.ios.url}" target="_blank">Apple Support</a></p>
      
      <h5>Android Devices</h5>
      <ol>
        ${e.platformSpecific.android.steps.map(e=>`<li>${e}</li>`).join(``)}
      </ol>
      <p>For detailed instructions: <a href="${e.platformSpecific.android.url}" target="_blank">Android Support</a></p>
    </div>
    `:``}
  </div>
  `).join(``)}
  
  <div class="qr-section">
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(n.pairingVideoUrl)}" alt="QR Code for Pairing Video">
      <p>Bluetooth Pairing Video</p>
    </div>
    
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(n.cleaningVideoUrl)}" alt="QR Code for Cleaning Video">
      <p>Cleaning Instructions Video</p>
    </div>
    
    <div class="qr-item">
      <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(n.manualUrl)}" alt="QR Code for User Manual">
      <p>User Manual</p>
    </div>
  </div>
  
  <div class="footer">
    <p>This guide is provided as a resource for basic troubleshooting. For persistent issues, please contact your hearing healthcare provider.</p>
    <p>© ${new Date().getFullYear()} Audiometry Trainer. All rights reserved.</p>
  </div>
  
  <div class="no-print">
    <button class="button" onclick="window.print()">Print This Guide</button>
  </div>
</body>
</html>
  `},K=()=>{let e=r(N().breakpoints.down(`md`)),[t,n]=(0,V.useState)(``),[i,f]=(0,V.useState)(``),[w,A]=(0,V.useState)(!1),[K,q]=(0,V.useState)(0),J=e=>{n(e.target.value)},Y=e=>{f(e.target.value)},X=()=>{if(t){let e=G(t,i||void 0),n=`${U.find(e=>e.id===t)?.name.replace(/\s+/g,`_`)}_troubleshooting_guide.html`,r=new Blob([e],{type:`text/html`}),a=URL.createObjectURL(r),o=document.createElement(`a`);o.href=a,o.download=n,document.body.appendChild(o),o.click(),document.body.removeChild(o),setTimeout(()=>{URL.revokeObjectURL(a)},1e4),A(!0)}},Z=()=>{q(e=>e+1)},Q=()=>{q(e=>e-1)};return(0,H.jsx)(g,{maxWidth:`lg`,sx:{mb:8,mt:4},children:(0,H.jsxs)(x,{elevation:3,sx:{p:{xs:2,md:4},borderRadius:2},children:[(0,H.jsxs)(L,{variant:`h4`,component:`h1`,gutterBottom:!0,children:[(0,H.jsx)(R,{fontSize:`large`,color:`primary`,sx:{mr:1,verticalAlign:`middle`}}),`Hearing Aid Troubleshooting Guide Generator`]}),(0,H.jsx)(L,{variant:`body1`,paragraph:!0,sx:{mb:4},children:`Create personalized troubleshooting guides for your patients based on their hearing aid model. These guides include step-by-step instructions, QR codes to instructional videos, and can be printed for easy reference.`}),(0,H.jsx)(D,{sx:{mb:4}}),(0,H.jsxs)(I,{activeStep:K,orientation:e?`vertical`:`horizontal`,sx:{mb:4},children:[(0,H.jsxs)(E,{children:[(0,H.jsx)(P,{children:`Select Hearing Aid`}),(0,H.jsxs)(k,{children:[(0,H.jsx)(L,{variant:`body2`,sx:{mb:2},children:`Choose the specific hearing aid model your patient is using.`}),(0,H.jsxs)(p,{fullWidth:!0,sx:{mb:3},children:[(0,H.jsx)(B,{id:`brand-select-label`,children:`Hearing Aid Brand/Model`}),(0,H.jsxs)(O,{labelId:`brand-select-label`,id:`brand-select`,value:t,onChange:J,label:`Hearing Aid Brand/Model`,children:[(0,H.jsx)(M,{value:``,disabled:!0,children:`Select a brand`}),U.map(e=>(0,H.jsx)(M,{value:e.id,children:e.name},e.id))]})]}),(0,H.jsx)(l,{variant:`contained`,onClick:Z,disabled:!t,endIcon:(0,H.jsx)(_,{}),children:`Next`})]})]}),(0,H.jsxs)(E,{children:[(0,H.jsx)(P,{children:`Choose Issue (Optional)`}),(0,H.jsxs)(k,{children:[(0,H.jsx)(L,{variant:`body2`,sx:{mb:2},children:`Select a specific issue to focus on, or leave blank to include all troubleshooting topics.`}),(0,H.jsxs)(p,{fullWidth:!0,sx:{mb:3},children:[(0,H.jsx)(B,{id:`category-select-label`,children:`Troubleshooting Category`}),(0,H.jsxs)(O,{labelId:`category-select-label`,id:`category-select`,value:i,onChange:Y,label:`Troubleshooting Category`,children:[(0,H.jsx)(M,{value:``,children:`All Categories`}),W.map(e=>(0,H.jsx)(M,{value:e.id,children:e.title},e.id))]})]}),(0,H.jsxs)(c,{sx:{display:`flex`,gap:2},children:[(0,H.jsx)(l,{variant:`outlined`,onClick:Q,startIcon:(0,H.jsx)(v,{}),children:`Back`}),(0,H.jsx)(l,{variant:`contained`,onClick:Z,endIcon:(0,H.jsx)(_,{}),children:`Next`})]})]})]}),(0,H.jsxs)(E,{children:[(0,H.jsx)(P,{children:`Generate Guide`}),(0,H.jsxs)(k,{children:[(0,H.jsx)(L,{variant:`body2`,paragraph:!0,children:`Review your selections and generate a printable troubleshooting guide:`}),(0,H.jsxs)(c,{sx:{mb:3,p:2,bgcolor:`background.paper`,borderRadius:1,border:`1px solid`,borderColor:`divider`},children:[(0,H.jsx)(L,{variant:`subtitle1`,children:`Selected Hearing Aid:`}),(0,H.jsx)(L,{variant:`body2`,sx:{mb:2,fontWeight:`bold`},children:(e=>U.find(t=>t.id===e))(t)?.name||`None selected`}),(0,H.jsx)(L,{variant:`subtitle1`,children:`Selected Category:`}),(0,H.jsx)(L,{variant:`body2`,sx:{fontWeight:`bold`},children:i?(e=>W.find(t=>t.id===e))(i)?.title:`All Categories`})]}),(0,H.jsxs)(c,{sx:{display:`flex`,gap:2},children:[(0,H.jsx)(l,{variant:`outlined`,onClick:Q,startIcon:(0,H.jsx)(v,{}),children:`Back`}),(0,H.jsx)(l,{variant:`contained`,onClick:X,startIcon:(0,H.jsx)(u,{}),children:`Generate Guide`})]})]})]})]}),K===3&&(0,H.jsxs)(c,{sx:{mt:2,textAlign:`center`},children:[(0,H.jsx)(L,{variant:`h6`,gutterBottom:!0,children:`Guide Generated Successfully!`}),(0,H.jsx)(L,{variant:`body2`,paragraph:!0,children:`Your guide has been created and downloaded. You can also open it in a new tab to print.`}),(0,H.jsxs)(c,{sx:{display:`flex`,justifyContent:`center`,gap:2,mt:3},children:[(0,H.jsx)(l,{variant:`outlined`,onClick:()=>{q(0),n(``),f(``)},children:`Create Another Guide`}),(0,H.jsx)(l,{variant:`contained`,color:`primary`,startIcon:(0,H.jsx)(m,{}),onClick:()=>{let e=G(t,i||void 0),n=new Blob([e],{type:`text/html`}),r=URL.createObjectURL(n),a=window.open(r,`_blank`);if(setTimeout(()=>URL.revokeObjectURL(r),3e4),!a){let e=document.createElement(`a`);e.href=r,e.download=`troubleshooting_guide.html`,document.body.appendChild(e),e.click(),document.body.removeChild(e)}},children:`Open Guide for Printing`})]})]}),(0,H.jsx)(D,{sx:{my:4}}),(0,H.jsx)(L,{variant:`h5`,gutterBottom:!0,children:`Common Troubleshooting Categories`}),W.map(e=>(0,H.jsxs)(F,{sx:{mb:1},children:[(0,H.jsx)(b,{expandIcon:(0,H.jsx)(S,{}),children:(0,H.jsxs)(c,{sx:{display:`flex`,alignItems:`center`},children:[(0,H.jsx)(C,{sx:{minWidth:40},children:e.icon}),(0,H.jsx)(L,{variant:`subtitle1`,children:e.title})]})}),(0,H.jsxs)(j,{children:[(0,H.jsx)(L,{variant:`body2`,paragraph:!0,children:`Common steps to troubleshoot this issue:`}),(0,H.jsx)(z,{children:e.steps.map((e,t)=>(0,H.jsxs)(y,{sx:{py:.5},children:[(0,H.jsx)(C,{sx:{minWidth:36},children:(0,H.jsxs)(L,{variant:`body2`,sx:{fontWeight:`bold`},children:[t+1,`.`]})}),(0,H.jsx)(T,{primary:e})]},t))}),e.id===`bluetooth`&&e.platformSpecific&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(L,{variant:`subtitle2`,sx:{mt:2,fontWeight:`bold`},children:`Platform-Specific Instructions:`}),(0,H.jsxs)(F,{sx:{mt:1},children:[(0,H.jsx)(b,{expandIcon:(0,H.jsx)(S,{}),children:(0,H.jsx)(L,{children:`iPhone/iPad Instructions`})}),(0,H.jsxs)(j,{children:[(0,H.jsx)(z,{dense:!0,children:e.platformSpecific.ios.steps.map((e,t)=>(0,H.jsxs)(y,{children:[(0,H.jsx)(C,{sx:{minWidth:36},children:(0,H.jsxs)(L,{variant:`body2`,children:[t+1,`.`]})}),(0,H.jsx)(T,{primary:e})]},t))}),(0,H.jsx)(l,{size:`small`,href:e.platformSpecific.ios.url,target:`_blank`,sx:{mt:1},children:`Apple Support Article`})]})]}),(0,H.jsxs)(F,{sx:{mt:1},children:[(0,H.jsx)(b,{expandIcon:(0,H.jsx)(S,{}),children:(0,H.jsx)(L,{children:`Android Instructions`})}),(0,H.jsxs)(j,{children:[(0,H.jsx)(z,{dense:!0,children:e.platformSpecific.android.steps.map((e,t)=>(0,H.jsxs)(y,{children:[(0,H.jsx)(C,{sx:{minWidth:36},children:(0,H.jsxs)(L,{variant:`body2`,children:[t+1,`.`]})}),(0,H.jsx)(T,{primary:e})]},t))}),(0,H.jsx)(l,{size:`small`,href:e.platformSpecific.android.url,target:`_blank`,sx:{mt:1},children:`Android Support Article`})]})]})]})]})]},e.id)),(0,H.jsxs)(s,{open:w,onClose:()=>A(!1),maxWidth:`md`,fullWidth:!0,children:[(0,H.jsx)(d,{children:`Guide Preview`}),(0,H.jsx)(h,{children:(0,H.jsxs)(c,{sx:{mb:2},children:[(0,H.jsx)(L,{variant:`body2`,paragraph:!0,children:`Your troubleshooting guide has been generated. You can:`}),(0,H.jsxs)(z,{children:[(0,H.jsxs)(y,{children:[(0,H.jsx)(C,{children:(0,H.jsx)(m,{})}),(0,H.jsx)(T,{primary:`Print the guide directly from the new tab`})]}),(0,H.jsxs)(y,{children:[(0,H.jsx)(C,{children:(0,H.jsx)(a,{})}),(0,H.jsx)(T,{primary:`Save the HTML file to your computer`})]}),(0,H.jsxs)(y,{children:[(0,H.jsx)(C,{children:(0,H.jsx)(u,{})}),(0,H.jsx)(T,{primary:`QR codes in the guide link to instructional videos`})]})]})]})}),(0,H.jsxs)(o,{children:[(0,H.jsx)(l,{onClick:()=>A(!1),children:`Close`}),(0,H.jsx)(l,{variant:`contained`,onClick:()=>{A(!1),q(3)},children:`Continue`})]})]})]})})};export{K as default};
//# sourceMappingURL=TroubleshootingGuidePage-DBl9mzRz.js.map