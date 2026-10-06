import {processNotifications} from '@/lib/notification-server';
export const dynamic='force-dynamic';
export async function GET(request:Request){if(!process.env.CRON_SECRET||request.headers.get('authorization')!=='Bearer '+process.env.CRON_SECRET)return Response.json({error:'Unauthorized'},{status:401});try{return Response.json(await processNotifications())}catch(e){console.error('Notification check failed',e);return Response.json({error:'Notification processing failed. Check server configuration and migration.'},{status:503})}}
