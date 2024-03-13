const bcrypt = require('bcrypt')

const createHash = async(psw) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hashSync(psw,salt);
}

const isValidPassword = (psw,encryptedPsw) => {
    const isValid = bcrypt.compareSync(psw,encryptedPsw);
    return isValid;
}

module.exports = {
    createHash,
    isValidPassword
}