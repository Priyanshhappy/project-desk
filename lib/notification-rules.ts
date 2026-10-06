import type {Row} from './model';
export const defaults={email_enabled:false,recipient_email:'',daily_digest_enabled:true,due_soon_days:2,pending_days:3,timezone:'Asia/Kolkata',task_due:true,task_overdue:true,project_overdue:true,milestone_due:true,milestone_overdue:true,blocked:true,pending:true,critical:true};
export type Preferences=typeof defaults;
export const finished=(r:Row)=>['Completed','Resolved','Closed','Rejected','Cancelled'].includes(r.status);
export function localDay(now:Date,timezone='Asia/Kolkata'){return new Intl.DateTimeFormat('en-CA',{timeZone:timezone,year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function deadline(r:Row){return r.kind==='projects'?r.revised||r.delivery:r.kind==='milestones'?r.plannedEnd:r.kind==='notes'?r.followup:r.due}
export function detect(rows:Row[],prefs:Preferences=defaults,now=new Date()){
 const day=localDay(now,prefs.timezone);const events:{key:string;type:string;record:Row;reason:string}[]=[];
 for(const r of rows){if(finished(r)||r.sample||r.kind==='activity')continue;const due=deadline(r);const days=due?Math.round((Date.parse(due)-Date.parse(day))/86400000):Infinity;
 const add=(type:string,reason:string,version:string)=>{if((prefs as any)[type]!==false)events.push({key:`${r.kind}:${r.id}:${type}:${version}`,type,record:r,reason})};
 if(['tasks','milestones','projects'].includes(r.kind)&&due){const prefix=r.kind==='tasks'?'task':r.kind==='milestones'?'milestone':'project';if(days<0)add(prefix+'_overdue',`${-days} day(s) overdue`,due);else if(prefix!=='project'&&days<=prefs.due_soon_days)add(prefix+'_due',days===0?'Due today':`Due in ${days} day(s)`,due)}
 const age=Math.floor((now.getTime()-Date.parse(r.updated||r.created))/86400000);
 if(r.kind==='tasks'&&(r.blocked||r.status==='Blocked')&&age>=prefs.pending_days)add('blocked','Blocked and awaiting follow-up',r.updated);
 if(['changes','requirements'].includes(r.kind)&&r.approval==='Pending'&&age>=prefs.pending_days)add('pending','Approval pending beyond reminder threshold',r.updated);
 if(r.kind==='issues'&&(r.priority==='Critical'||r.severity==='Critical'))add('critical','Critical unresolved issue',r.updated);
 }return events;
}
