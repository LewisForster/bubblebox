import bcrypt from 'bcrypt';



const saltRounds = 12;


export const passHash = (password) => {
    const hash = bcrypt.hash(password, saltRounds)
    return hash
}

// moved to its own file for reusability (mainly with reset password)
