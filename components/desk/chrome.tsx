'use client';
import {useEffect,useState} from 'react';
import {LayoutDashboard,FolderKanban,ListChecks,CheckSquare,GitPullRequest,FileText,Search,Plus,Bell,Sun,Moon,ChevronRight,MessageSquare,BookOpen,Download,Flag,StickyNote,Settings,PanelLeftClose,PanelLeftOpen,Workflow,Zap} from 'lucide-react';
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuSeparator} from '@/components/ui/dropdown-menu';
import {CommandDialog,CommandInput,CommandList,CommandEmpty,CommandGroup,CommandItem} from '@/components/ui/command';
import {Row,names,code,overdue} from '@/lib/model';
import {detect,defaults} from '@/lib/notification-rules';

type NavItem={name:string;Icon:any;target?:string};
const groups:{label:string;items:NavItem[]}[]=[
  {label:'DASHBOARD',items:[{name:'Overview',target:'Dashboard',Icon:LayoutDashboard},{name:'My Work',Icon:CheckSquare}]},
  {label:'PROJECTS',items:[{name:'Projects',Icon:FolderKanban}]},
  {label:'WORKSPACE',items:[
    {name:'Requirements',Icon:ListChecks},{name:'User Stories',target:'Stories',Icon:BookOpen},{name:'Tasks',Icon:CheckSquare},
    {name:'Issues',Icon:MessageSquare},{name:'Change Requests',target:'Changes',Icon:GitPullRequest},{name:'Milestones',target:'Milestones',Icon:Flag},{name:'Notes',Icon:StickyNote},{name:'Flow Builder',target:'Flows',Icon:Workflow},{name:'Automations',Icon:Zap}
  ]},
  {label:'BUSINESS',items:[{name:'Proposals',Icon:FileText},{name:'Notifications',Icon:Bell}]}
];
const creation=[['projects','Project',FolderKanban],['requirements','Requirement',ListChecks],['stories','User story',BookOpen],['tasks','Task',CheckSquare],['issues','Issue / discussion',MessageSquare],['changes','Change request',GitPullRequest],['milestones','Milestone',Flag],['notes','Note',StickyNote],['proposals','Proposal',FileText]] as const;

export function Dock({view,onNavigate}:{view:string;onNavigate:(s:string)=>void}){
  const [collapsed,setCollapsed]=useState(false);
  const active=(name:string,target?:string)=>view===(target||name);
  return <aside className={'enterprise-sidebar '+(collapsed?'is-collapsed':'')} aria-label="Main navigation">
    <div className="enterprise-brand"><span className="brand-mark">PD</span><div><strong>Project Desk</strong><small>Business Analyst Workspace</small></div><button aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} onClick={()=>setCollapsed(v=>!v)}>{collapsed?<PanelLeftOpen size={16}/>:<PanelLeftClose size={16}/>}</button></div>
    <nav className="enterprise-nav">{groups.map(group=><div className="nav-group" key={group.label}><span className="nav-group-label">{group.label}</span>{group.items.map(({name,Icon,target})=><button key={name} className={active(name,target)?'active':''} aria-current={active(name,target)?'page':undefined} title={name} onClick={()=>onNavigate(target||name)}><Icon size={17}/><span>{name}</span></button>)}</div>)}</nav>
    <div className="sidebar-system"><button title="Settings" onClick={()=>onNavigate('Settings')}><Settings size={17}/><span>Settings & email reminders</span></button></div>
    <div className="sidebar-profile"><span className="profile-button">PN</span><div><strong>Priyanshu Negi</strong><small>Business Analyst</small></div></div>
  </aside>
}

export function Topbar({view,current,rows,onEdit,onOpenProject,onBackup,onImport}:{view:string;current:Row|null;rows:Row[];onEdit:(kind:string,row?:Row)=>void;onOpenProject:(r:Row)=>void;onBackup?:()=>void;onImport?:(file:File)=>void}){
  const [spotlight,setSpotlight]=useState(false),[query,setQuery]=useState(''),[dark,setDark]=useState(false);
  useEffect(()=>{const pref=localStorage.getItem('desk-appearance')==='dark';setDark(pref);document.documentElement.classList.toggle('dark',pref);function keys(e:KeyboardEvent){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSpotlight(v=>!v)}}window.addEventListener('keydown',keys);return ()=>window.removeEventListener('keydown',keys)},[]);
  const reminders=detect(rows,defaults).map(e=>e.record).filter((r,i,all)=>all.findIndex(x=>x.id===r.id)===i).slice(0,10);
  const results=rows.filter(r=>r.kind!=='activity'&&(!query||JSON.stringify(r).toLowerCase().includes(query.toLowerCase())));
  function choose(r:Row){setSpotlight(false);setQuery('');r.kind==='projects'?onOpenProject(r):onEdit(r.kind,r)}
  const title=current?.title||view;
  return <><header className="mac-topbar enterprise-topbar"><div className="top-identity"><div><strong>{title}</strong><div className="mac-breadcrumb"><span>Project Desk</span><ChevronRight size={11}/><span>{current?current.client:view}</span></div></div></div><div className="top-controls">
    <button className="spotlight-trigger" onClick={()=>setSpotlight(true)}><Search size={16}/><span>Search projects, tasks, requirements...</span><kbd>{typeof navigator!=='undefined'&&/Mac/.test(navigator.platform)?'⌘ K':'Ctrl K'}</kbd></button>
    <DropdownMenu><DropdownMenuTrigger asChild><button className="quick-create chrome-button" aria-label="Quick create"><Plus size={17}/><span>New</span></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="chrome-menu"><DropdownMenuLabel>Create new</DropdownMenuLabel><DropdownMenuSeparator/>{creation.map(([kind,label,Icon])=><DropdownMenuItem key={kind} onSelect={()=>onEdit(kind)}><Icon size={16}/><span>{label}</span></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
    <DropdownMenu><DropdownMenuTrigger asChild><button className="chrome-button notifications" aria-label="Notifications"><Bell size={17}/>{reminders.length>0&&<i/>}</button></DropdownMenuTrigger><DropdownMenuContent align="end" className="chrome-menu notification-menu"><DropdownMenuLabel>Needs attention</DropdownMenuLabel><DropdownMenuSeparator/>{reminders.length?reminders.map(r=><DropdownMenuItem key={r.id} onSelect={()=>r.kind==='projects'?onOpenProject(r):onEdit(r.kind,r)}><div><strong>{r.title}</strong><small>{overdue(r)?'Overdue':r.status==='Blocked'||r.blocked?'Blocked':r.kind==='changes'?'Waiting for approval':r.kind==='requirements'?'Waiting for clarification':'Needs review'}</small></div></DropdownMenuItem>):<div className="notification-empty">Nothing urgent right now.</div>}</DropdownMenuContent></DropdownMenu>
    <button className="chrome-button theme-button" aria-label={dark?'Switch to light theme':'Switch to dark theme'} onClick={()=>{setDark(!dark);document.documentElement.classList.toggle('dark',!dark);localStorage.setItem('desk-appearance',!dark?'dark':'light')}}>{dark?<Sun size={17}/>:<Moon size={17}/>}</button>
    <DropdownMenu><DropdownMenuTrigger asChild><button className="profile-button" aria-label="Your profile">PN</button></DropdownMenuTrigger><DropdownMenuContent align="end" className="chrome-menu"><DropdownMenuLabel>Priyanshu Negi</DropdownMenuLabel><div className="profile-detail">Business Analyst<br/>Project Desk workspace</div>{onImport&&<><DropdownMenuSeparator/><DropdownMenuItem onSelect={()=>{const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.onchange=()=>{if(input.files?.[0])onImport(input.files[0])};input.click()}}>Import workspace backup</DropdownMenuItem></>}{onBackup&&<><DropdownMenuSeparator/><DropdownMenuItem onSelect={onBackup}><Download size={16}/>Export workspace backup</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu>
  </div></header>
  <CommandDialog open={spotlight} onOpenChange={setSpotlight} title="Search your workspace" description="Search projects, requirements, stories, tasks, issues, changes, milestones, notes and proposals." className="spotlight" showCloseButton={false}><CommandInput value={query} onValueChange={setQuery} placeholder="Search projects, tasks, requirements..."/><CommandList><CommandEmpty>No matching records.</CommandEmpty>{Object.entries(names).map(([kind,label])=><CommandGroup key={kind} heading={label}>{results.filter(r=>r.kind===kind).slice(0,query?12:3).map(r=><CommandItem key={r.id} value={JSON.stringify(r)} onSelect={()=>choose(r)}><span className={'search-symbol '+kind}><Search size={15}/></span><div><strong>{r.title}</strong><small>{code(r)} · {r.client||r.module||r.developer||label}</small></div><ChevronRight size={14}/></CommandItem>)}</CommandGroup>)}</CommandList><div className="spotlight-footer"><span>↑ ↓ Navigate</span><span>↵ Open</span><span>esc Close</span></div></CommandDialog></>
}
