const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { findUserByEmail, createUser } = require("../db/queries/user.queries");
const {hashedPassword, comparePw }=require('../utils/hash');
const {generateToken, verifyToken }=require('../utils/jwt');
const { createApplication } = require("../db/queries/sellerApplication.queries");

async function register(req,res){
    const resultValidation = registerSchema.safeParse(req.body);
    if (!resultValidation.success){
        return res.status(400).json({error: resultValidation.error});
    }
    try{
        const checkUser=await findUserByEmail(resultValidation.data.email);
        if (checkUser){
            return res.status(409).json({ error: 'Email is already in use' });
        }
        const hashed = await hashedPassword(req.body.password);
        const newUser=await createUser(
            resultValidation.data.username,
            resultValidation.data.email,
            hashed,
            resultValidation.data.phoneNumber,
            resultValidation.data.role
        )
        if (newUser.role === 'seller'){
            await createApplication(newUser.id)
        }
        const token = generateToken({id: newUser.id, role: newUser.role})
        const {password_hash, ...shownUserInfo}= newUser;
        return res.status(201).json({user: shownUserInfo, token})
    }catch(error){
        return res.status(500).json({message:'server error'})
}}

async function login(req,res) {
    const resultLoginValidation = loginSchema.safeParse(req.body)
    if (!resultLoginValidation.success){
        return res.status(400).json({error: resultLoginValidation.error})
    }
    try{
        const foundUser=await findUserByEmail(resultLoginValidation.data.email)
        if (!foundUser){
            return res.status(401).json({message:'Invalid email or password'})
        }else{
            const hashValidity = await comparePw(resultLoginValidation.data.password, foundUser.password_hash)
            if (!hashValidity){
                return res.status(401).json({message:'Invalid email or password'})
            }else{
                const token = generateToken({id: foundUser.id, role: foundUser.role})
                const {password_hash, ...shownUserInfo}=foundUser;
                return res.status(200).json({user: shownUserInfo, token})
            }
        }
    }catch(error){
        return res.status(500).json({message:'server error'})
    }
}

module.exports={register,login};