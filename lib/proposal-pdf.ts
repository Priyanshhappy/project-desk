import type {Row} from './model';
import {date} from './model';
import {normalizeProposalHtml} from './proposal-content';
export {proposalHtml} from './proposal-content';
let fontFiles:Promise<{name:string;style:string;data:string}[]>|undefined;
async function fonts(){return fontFiles??=(Promise.all([['Regular','normal'],['Bold','bold'],['Italic','italic'],['BoldItalic','bolditalic']].map(async([name,style])=>{const res=await fetch('/fonts/DeskSans-'+name+'.ttf');if(!res.ok)throw Error('Proposal font unavailable');const bytes=new Uint8Array(await res.arrayBuffer());let str='';for(let i=0;i<bytes.length;i+=8192)str+=String.fromCharCode(...bytes.subarray(i,i+8192));return {name:'DeskSans-'+name+'.ttf',style,data:btoa(str)}})).catch(e=>{fontFiles=undefined;throw e}));}
async function coverBackground(){
 const canvas=document.createElement('canvas');canvas.width=1000;canvas.height=1414;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Cover could not render');
 const base=ctx.createLinearGradient(0,0,0,1414);base.addColorStop(0,'#9a49b6');base.addColorStop(.38,'#573077');base.addColorStop(.76,'#1c2245');base.addColorStop(1,'#0b1025');ctx.fillStyle=base;ctx.fillRect(0,0,1000,1414);
 const blue=ctx.createRadialGradient(1030,850,0,1030,850,900);blue.addColorStop(0,'rgba(55,115,185,.65)');blue.addColorStop(1,'rgba(55,115,185,0)');ctx.fillStyle=blue;ctx.fillRect(0,0,1000,1414);
 const logo=new Image();await new Promise<void>((resolve,reject)=>{logo.onload=()=>resolve();logo.onerror=()=>reject(Error('Company logo could not load'));logo.src='/branding/waplia-logo.svg'});
 ctx.drawImage(logo,405,255,190,210);return canvas.toDataURL('image/jpeg',.94);
}
function coverText(doc:any,text:string,x:number,y:number,width:number,size:number,bold=false,maxHeight=50){
 doc.setFont('DeskSans',bold?'bold':'normal');let lines:string[]=[];let lineH=0;
 do{doc.setFontSize(size);lines=doc.splitTextToSize(text,width);lineH=size*.3528*1.26;if(lines.length*lineH<=maxHeight||size<=10)break;size-=.5}while(true);
 doc.text(lines,x,y,{lineHeightFactor:1.26});return y+lines.length*lineH;
}
async function drawCover(doc:any,r:Partial<Row>){
 const waplia=(r.coverTemplate||'Waplia')==='Waplia';
 if(waplia)doc.addImage(await coverBackground(),'JPEG',0,0,210,297);
 else{doc.setFillColor(18,35,65);doc.rect(0,0,210,297,'F');doc.setFont('DeskSans','bold');doc.setFontSize(18);doc.setTextColor(255,255,255);doc.text('PROJECT DESK',20,65)}
 doc.setTextColor(255,255,255);
 let y=coverText(doc,r.title?.trim()||'Project Proposal',20,123,170,22,true,50);
 const recipient=r.coverRecipient?.trim()||((r.company||r.client)?.trim()?'Proposal for '+(r.company||r.client).trim():r.projectName?.trim()?'Proposal for '+r.projectName.trim():'');
 if(recipient){y+=3;y=coverText(doc,recipient,20,y,170,13.5,true,16)}
 if(r.projectName?.trim()&&!recipient.includes(r.projectName.trim())){y+=2;doc.setTextColor(224,224,242);y=coverText(doc,r.projectName.trim(),20,y,170,10,false,12)}
 if(r.subtitle?.trim()){y+=3;doc.setTextColor(97,204,235);y=coverText(doc,r.subtitle.trim(),20,y,170,9.5,false,14)}
 const clientDetails=[r.client&&r.company&&r.client!==r.company?r.client:'',r.clientEmail,r.clientPhone,r.clientAddress].filter(v=>v?.trim()).join(' · ');
 if(clientDetails){y+=3;doc.setTextColor(208,220,239);y=coverText(doc,clientDetails,20,y,170,8,false,16)}
 const prepared=[r.preparedCompany,r.preparedBy].filter(v=>v?.trim()).join(' · ');
 const details=[['INVESTMENT',r.investment],['PREPARED BY',prepared],['PROPOSAL DURATION',r.duration],['DOCUMENT DATE',r.date?date(r.date):'']].filter(([,value])=>value?.trim());
 // The information block follows the title group, instead of pinning small text at the page bottom.
 let infoY=Math.max(191,y+24);const available=280-infoY;let detailSize=9;let step=17;
 if(details.length&&details.length*step>available){step=Math.max(12,available/details.length);detailSize=8}
 for(const [label,value] of details){doc.setTextColor(103,200,230);doc.setFont('DeskSans','normal');doc.setFontSize(6.7);doc.text(label,20,infoY);doc.setTextColor(255,255,255);const end=coverText(doc,value!,20,infoY+6,170,detailSize,label==='PREPARED BY',step-4);infoY=Math.max(infoY+step,end+5)}
 if(r.coverNote?.trim()){doc.setTextColor(195,208,228);coverText(doc,r.coverNote.trim(),20,Math.min(286,infoY+1),170,6.5,false,9)}
}
export async function createProposalPdf(r:Partial<Row>){
 const [{jsPDF},{default:autoTable}]=await Promise.all([import('jspdf'),import('jspdf-autotable')]);const doc=new jsPDF();
 for(const f of await fonts()){doc.addFileToVFS(f.name,f.data);doc.addFont(f.name,'DeskSans',f.style)}doc.setFont('DeskSans','normal');await drawCover(doc,r);
 doc.addPage();let y=29;const bottom=270;const html=new DOMParser().parseFromString(normalizeProposalHtml(r.content||''),'text/html');
 const page=()=>{doc.addPage();y=29};const room=(height:number)=>{if(y+height>bottom)page()};
 function paragraph(el:Element,size=10.5,bold=false,prefix='',gap=2,indent=0){
  const words:{text:string;style:string}[]=[];
  function collect(node:Node,style:string){
   if(node.nodeType===3){const t=(node.textContent||'').replace(/₹/g,'INR ').replace(/\u00a0/g,' ').replace(/\s+/g,' ');t.split(/(\s+)/).filter(Boolean).forEach(text=>words.push({text,style}));return}
   if(node.nodeType!==1)return;const tag=(node as Element).tagName.toLowerCase();if(['ul','ol'].includes(tag))return;if(tag==='br'){words.push({text:'\n',style});return}
   let next=style;if(tag==='strong'||tag==='b')next=style.includes('italic')?'bolditalic':'bold';if(tag==='em'||tag==='i')next=style.includes('bold')?'bolditalic':'italic';node.childNodes.forEach(n=>collect(n,next));
  }
  collect(el,bold?'bold':'normal');if(!words.some(w=>w.text.trim()))return; // Empty pasted paragraphs occupy no PDF space.
  const lineH=size*.3528*1.32;room(lineH);const left=22+indent;let x=left;const continued=prefix?left+5:left;
  doc.setFontSize(size);doc.setTextColor(43,57,79);if(prefix){doc.setFont('DeskSans','normal');doc.text(prefix,left,y);x=continued}
  const newLine=()=>{y+=lineH;room(lineH);x=continued};
  for(const word of words){
   doc.setFont('DeskSans',word.style);if(word.text==='\n'){newLine();continue}if(/^\s+$/.test(word.text)&&x===continued)continue;
   const width=doc.getTextWidth(word.text);if(x+width>188&&x>continued){newLine();if(/^\s+$/.test(word.text))continue}
   if(width>188-continued){const pieces=doc.splitTextToSize(word.text,188-continued);pieces.forEach((piece:string,i:number)=>{if(i)newLine();doc.text(piece,x,y);x+=doc.getTextWidth(piece)});continue}
   room(lineH);doc.text(word.text,x,y);x+=width;
  }
  const spacing=el.getAttribute('data-spacing');y+=lineH+(spacing==='compact'?1:spacing==='spacious'?5:gap);
 }
 function walk(el:Element,indent=0){
  const tag=el.tagName.toLowerCase();
  if(tag==='hr'){if(el.getAttribute('data-page-break')==='true'){if(y>29)page()}else{room(6);doc.setDrawColor(222,229,239);doc.setLineWidth(.25);doc.line(22,y,188,y);y+=5}return}
  if(['h1','h2','h3','h4','h5','h6'].includes(tag)){if(!el.textContent?.trim())return;room(20);if(y>29)y+=3;paragraph(el,tag==='h1'?16:tag==='h2'?13.5:11.5,true,'',3,indent);return}
  if(tag==='table'){
   const all=Array.from(el.querySelectorAll('tr')).map(tr=>Array.from(tr.children).map(td=>td.textContent?.replace(/₹/g,'INR ')||''));if(!all.length)return;const hasHead=!!el.querySelector('th');
   room(12);autoTable(doc,{startY:y,head:hasHead?[all[0]]:undefined,body:hasHead?all.slice(1):all,margin:{left:22+indent,right:22,top:29,bottom:27},styles:{font:'DeskSans',fontSize:9.5,cellPadding:2.5,textColor:[43,57,79],lineColor:[226,233,243],lineWidth:.2},headStyles:{fillColor:[235,241,250],textColor:[43,57,79]},theme:'grid'});y=(doc as any).lastAutoTable.finalY+5;return;
  }
  if(tag==='ul'||tag==='ol'){
   Array.from(el.children).forEach((li,i)=>{paragraph(li,10.5,false,tag==='ul'?'•':`${i+Number(el.getAttribute('start')||1)}.`,1,indent);Array.from(li.children).filter(child=>['ul','ol'].includes(child.tagName.toLowerCase())).forEach(child=>walk(child,indent+5))});y+=2;return;
  }
  if(['div','section','article','body','blockquote'].includes(tag)){Array.from(el.children).forEach(child=>walk(child,indent));return}
  paragraph(el,10.5,false,'',2,indent);
 }
 Array.from(html.body.children).forEach(el=>walk(el));
 for(let i=2;i<=doc.getNumberOfPages();i++){
  doc.setPage(i);doc.setDrawColor(221,229,241);doc.line(22,19,188,19);doc.setFont('DeskSans','normal');doc.setTextColor(111,127,148);doc.setFontSize(8);
  const title=(r.title||'Proposal').replace(/\s+/g,' ').trim();doc.text(doc.splitTextToSize(title,166)[0],22,14);
  const footer=[r.preparedCompany||'Project Desk',r.client||r.company].filter(Boolean).join(' · ');doc.text(doc.splitTextToSize(footer,145)[0],22,283);doc.text(`${i-1} / ${doc.getNumberOfPages()-1}`,179,283);
 }
 return doc;
}
