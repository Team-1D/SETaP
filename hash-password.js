const bcrypt = require('bcrypt');

const plainPassword = 'pasword12345'; // your current password

bcrypt.hash(plainPassword, 10).then(hash => {
    console.log('Hashed password:', hash);
});

