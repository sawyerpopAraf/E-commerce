const{Op}=require('sequelize')

class UserService{
    constructor(db){
        this.client=db.client
        this.user=db.User
    }
    
    async login(login){
        return await this.user.findOne({
            where:{
                [Op.or]:[ 
                    {email:login},
                          {userName:login}
                ]
            }
        })
    }
    async findUserByEmail(email) {
        return await this.user.findOne({ where: { email } });
    }
    
    async findUserByUsername(username) {
        return await this.user.findOne({ where: { userName: username } });
    }

    async createUser(firstname,lastname,username,email,encryptedPassword,salt,address,tlfnumber){
        return await this.user.create({
            firstName:firstname,
            lastName:lastname,
            userName:username,
            email:email,
            encryptedPassword:encryptedPassword,
            salt:salt,
            address:address,
            tlfNumber:tlfnumber,
            memberShip:'Bronze',
            totalPurchased:0,
            role:'User'
      })
    }
   



}

module.exports=UserService