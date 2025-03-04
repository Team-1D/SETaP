
const {Streak}  = require("../database");


async function getStreak(){
    //let streak = await Streak.findByPK(1);
    //find the streak by userID?
    if (!streak){
        streak = await Streak.create();
    }
    return streak;
}

async function updateStreak(){
    let streak = await getStreak();
    const today = new Date();
    let lastUpdate = streak.last_updated;
    //if user logged in today
    //{streak.streak_count += 1
    //let lastUpdate = today}   
}