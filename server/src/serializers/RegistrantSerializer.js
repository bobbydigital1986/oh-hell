class RegistrantSerializer {
    static async addUserName(registrant) {
        const approvedFields = ["id", "gameScore", "userId"]
        let serializedRegistrant = {}
        for (const attr of approvedFields) {
            serializedRegistrant[attr] = registrant[attr]
        }
        return serializedRegistrant
    }
}

export default RegistrantSerializer