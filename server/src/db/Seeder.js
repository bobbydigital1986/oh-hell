/* eslint-disable no-console */
import { connection } from "../boot.js"
import Userseeder from "./seeders/UserSeeder.js"


class Seeder {
  static async seed() {
    // console.log("Seeding Cards!")
  
    console.log("seeding users")
    await Userseeder.seed()


    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder