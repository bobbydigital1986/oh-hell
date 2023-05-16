/* eslint-disable no-console */
import { connection } from "../boot.js"
import CardSeeder from "./seeders/CardSeeder.js"

class Seeder {
  static async seed() {
    console.log("Seeding Cards!")
    await CardSeeder.seed()


    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder