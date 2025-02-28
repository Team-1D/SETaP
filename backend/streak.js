
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
    //let lastUpdate when the user last loged on;
    //if user logged in today
    //{streak.streak_count += 1}
}