const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inline=(value:string)=>escape(value).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/__(.+?)__/g,'<strong>$1</strong>').replace(/(?<!\*)\*([^*]+)\*(?!\*)/g,'<em>$1</em>');
/** Plain clipboard/Markdown input becomes real headings, lists and paragraphs. */
export function proposalHtml(content:string){
 if(/^\s*</.test(content))return content;
 const output:string[]=[];let paragraph:string[]=[];let list:string[]=[];let listType='';let listStart=1;
 const flushParagraph=()=>{if(paragraph.length)output.push('<p>'+paragraph.map(inline).join('<br>')+'</p>');paragraph=[]};
 const flushList=()=>{if(list.length)output.push(`<${listType}${listType==='ol'?` start="${listStart}"`:''}>${list.join('')}</${listType}>`);list=[];listType=''};
 for(const line of content.replace(/\r\n?/g,'\n').split('\n')){
  if(!line.trim()){flushParagraph();flushList();continue}
  const heading=line.match(/^\s*(#{1,6})\s+(.+)$/);const bullet=line.match(/^\s*[-*•]\s+(.+)$/);const numbered=line.match(/^\s*(\d+)[.)]\s+(.+)$/);
  if(heading){flushParagraph();flushList();const level=Math.min(3,heading[1].length);output.push(`<h${level}>${inline(heading[2])}</h${level}>`)}
  else if(/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(line)){flushParagraph();flushList();output.push('<hr>')}
  else if(bullet||numbered){flushParagraph();const type=bullet?'ul':'ol';if(listType&&listType!==type)flushList();if(!list.length)listStart=numbered?Number(numbered[1]):1;listType=type;list.push('<li>'+inline(bullet?bullet[1]:numbered![2])+'</li>')}
  else{flushList();paragraph.push(line)}
 }
 flushParagraph();flushList();return output.join('');
}
/** Remove imported font/margin rules and empty clipboard blocks without losing real content. */
export function normalizeProposalHtml(content:string,compactAll=false){
 const source=proposalHtml(content);if(typeof DOMParser==='undefined')return source;
 const doc=new DOMParser().parseFromString(source,'text/html');
 doc.querySelectorAll('script,style,meta,link,iframe,object,embed,form,input,button').forEach(el=>el.remove());
 doc.body.querySelectorAll('span').forEach(el=>{const style=el.getAttribute('style')||'';if(/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)){const strong=doc.createElement('strong');strong.innerHTML=el.innerHTML;el.replaceChildren(strong)}if(/font-style\s*:\s*italic/i.test(style)){const em=doc.createElement('em');em.innerHTML=el.innerHTML;el.replaceChildren(em)}});
 doc.body.querySelectorAll('*').forEach(el=>{
  for(const attr of Array.from(el.attributes))if(['style','class','face','color','size','width','height'].includes(attr.name.toLowerCase())||/^on/i.test(attr.name))el.removeAttribute(attr.name);
  if(compactAll&&/^(P|H[1-6])$/.test(el.tagName))el.setAttribute('data-spacing','compact');
 });
 doc.body.querySelectorAll('p,h1,h2,h3,h4,h5,h6').forEach(el=>{if(!el.closest('td,th')&&!el.textContent?.replace(/[\s\u00a0\u200b]/g,'')&&!el.querySelector('img,table'))el.remove()});
 return doc.body.innerHTML;
}
