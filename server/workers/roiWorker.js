import { db } from "../startup/db.js";

export async function startRoiWorker(io){
  const intervalMinutes = Number(process.env.ROI_WORKER_INTERVAL_MINUTES || 60);
  await run();
  setInterval(run, intervalMinutes * 60 * 1000);

  async function run(){
    // find active user_plans
    const ups = await db.all('SELECT up.*, p.dailyRoi, p.durationDays, p.stake FROM user_plans up JOIN plans p ON up.planId = p.id WHERE up.active=1');
    for(const up of ups){
      try {
        const now = new Date();
        const last = up.lastCreditedAt ? new Date(up.lastCreditedAt) : new Date(up.startAt);
        // full days elapsed
        const days = Math.floor((now - last) / (24*60*60*1000));
        if(days >= 1){
          // credit for each full day since lastCreditedAt
          const planDailyRoi = up.dailyRoi || 0;
          const credit = planDailyRoi * up.stake * days; // dailyRoi is fractional like 0.2 = 20%
          if(credit > 0){
            await db.run('UPDATE users SET balance = balance + ? WHERE id=?', [credit, up.userId]);
            await db.run('INSERT INTO transactions (userId,type,amount,status) VALUES (?,?,?,?)', [up.userId, 'roi', credit, 'completed']);
          }
          // update lastCreditedAt
          const newLast = new Date(last.getTime() + days*24*60*60*1000).toISOString();
          await db.run('UPDATE user_plans SET lastCreditedAt=? WHERE id=?', [newLast, up.id]);
          // expire if past endAt
          if(new Date(up.endAt) <= now){
            await db.run('UPDATE user_plans SET active=0 WHERE id=?', up.id);
          }
        }
      } catch(e){
        console.error('ROI worker error', e);
      }
    }
  }
          }
