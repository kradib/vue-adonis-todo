'use strict'
const User = use('App/Models/User');
class UserController {

    async register({ request, response }) {
        try {
            const { email, password } = request.post();
            const user = await User.create({
                email,
                password,
                username: email
            });
            response.status(200).send({
                data: user.id,
                message: 'successfully created user'

            });

        } catch (error) {
            response.status(error.status | 500).send(error);
        }


    }
}

module.exports = UserController
