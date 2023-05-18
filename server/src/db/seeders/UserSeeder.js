import { User } from "../../models/index.js"

class UserSeeder {
    static async seed() {

        const users = [
            
            {
                username: "bob",
                email: "bob@bob.com",
                password: "123"
            },
            {
                username: "abe",
                email: "abe@abe.com",
                password: "123"
            }

        ]


        await User.query().insertGraph(users)
    }
}

export default UserSeeder