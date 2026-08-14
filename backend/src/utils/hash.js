const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashedPassword(myPlaintextPassword) {
    try{
        const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
        return hash;
    } catch (error) {
        console.error('Error password hashing:', error);
    }
}

async function comparePw(myPlaintextPassword, hashedPassword) {
    try{
        const match = await bcrypt.compare(myPlaintextPassword, hashedPassword);
        return match;
    }catch (error){
        console.error('Error comparing password:', error);
    }
}

module.exports = { hashedPassword, comparePw };