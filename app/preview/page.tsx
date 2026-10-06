import {Desk} from '../page';
import {sampleItems,sampleDetails,type Row} from '@/lib/model';

export default function Preview(){
  const stamp='2026-10-06T07:00:00.000Z';
  const titles=['Vooket','CTKart','Farm ERP','HRMS Platform'];
  const projects=sampleItems().map((p,i)=>({...p.data,id:i+1,kind:'projects',project:'',title:titles[i],created:stamp,updated:stamp} as Row));
  let id=10;
  const rows=[...projects,...projects.flatMap(p=>sampleDetails(p).map(r=>({...r.data,id:id++,kind:r.kind,project:String(p.id),created:'2026-10-01T07:00:00.000Z',updated:'2026-10-01T07:00:00.000Z',sample:false} as Row)))];
  rows.push({id:id++,kind:'activity',project:'1',title:'Requirement approved for Vooket',created:stamp,updated:stamp});
  rows.push({id:id++,kind:'activity',project:'2',title:'API integration task completed',created:stamp,updated:stamp});
  rows.push({id:id++,kind:'activity',project:'3',title:'Client requested approval flow changes',created:stamp,updated:stamp});
  return <Desk demoRows={rows}/>;
}
