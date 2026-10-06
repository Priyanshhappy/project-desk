import {userDatabase,AuthError} from '@/lib/auth/server';

function failure(error:unknown){
 if(error instanceof AuthError)return Response.json({error:error.message},{status:error.status});
 console.error('Flow storage failed',error);
 return Response.json({error:'Flows could not be saved or loaded. Run supabase/flows.sql and try again.'},{status:503});
}
export async function GET(request:Request){
 try{const {supabase}=await userDatabase(request);const {data,error}=await supabase.from('ba_flow_diagrams').select('*').order('updated_at',{ascending:false});if(error)throw error;return Response.json({flows:data||[]});}catch(e){return failure(e)}
}
export async function POST(request:Request){
 try{
  const {supabase,user}=await userDatabase(request);
  let flow:any;try{flow=await request.json()}catch{return Response.json({error:'Invalid flow.'},{status:400})}
  if(typeof flow.title!=='string'||!flow.title.trim()||flow.title.length>200||typeof flow.project!=='string'||!flow.project)return Response.json({error:'Select a project and enter a flow name.'},{status:400});
  if(!Array.isArray(flow.nodes)||flow.nodes.length>500||!Array.isArray(flow.edges)||flow.edges.length>1500||!Array.isArray(flow.versions)||flow.versions.length>50)return Response.json({error:'Invalid flow diagram or version limit reached.'},{status:400});
  const ids=new Set(flow.nodes.map((n:any)=>n.id));
  if(ids.size!==flow.nodes.length||flow.nodes.some((n:any)=>typeof n.id!=='string'||!Number.isFinite(n.position?.x)||!Number.isFinite(n.position?.y)||typeof n.data?.title!=='string')||flow.edges.some((e:any)=>typeof e.id!=='string'||!ids.has(e.source)||!ids.has(e.target)))return Response.json({error:'Invalid nodes or connections.'},{status:400});
  const {data:project,error:projectError}=await supabase.from('ba_workspace_records').select('id').eq('id',flow.project).eq('kind','projects').maybeSingle();
  if(projectError||!project)return Response.json({error:'Choose an existing project.'},{status:400});
  const {data,error}=await supabase.from('ba_flow_diagrams').upsert({id:flow.id||crypto.randomUUID(),owner_id:user.id,project:flow.project,title:flow.title.trim(),flow_type:flow.flow_type||'User Flow',status:flow.status||'Draft',nodes:flow.nodes,edges:flow.edges,versions:flow.versions,comments:flow.comments||[],updated_at:new Date().toISOString()}).select().single();
  if(error)throw error;return Response.json({flow:data});
 }catch(e){return failure(e)}
}
export async function DELETE(request:Request){
 try{const {supabase}=await userDatabase(request);const id=new URL(request.url).searchParams.get('id');if(!id)return Response.json({error:'Choose a flow.'},{status:400});const {error}=await supabase.from('ba_flow_diagrams').delete().eq('id',id);if(error)throw error;return Response.json({ok:true});}catch(e){return failure(e)}
}
