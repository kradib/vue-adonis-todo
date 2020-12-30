'use strict'
const User = use('App/Models/User');
class UserController {

    async login({request, auth, response}){

        try {
            const { email, password } = request.post();
            const token = await auth.attempt(email, password);
            return token;   
        } catch (error) {
            response.status(error.status | 500).send(error);
        }

    }


    async register({ request, response }) {
        try {
            const { email, password } = request.post();
            const user = await User.create({
                email,
                password,
                username: email
            });
            
            return  this.login(...arguments);
            
        } catch (error) {
            response.status(error.status | 500).send(error);
        }


    }
}

module.exports = UserController
