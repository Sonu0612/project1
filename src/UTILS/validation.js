const validation = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["firstName", "lastName", "loginName", "password", "email"],
            properties: {
                firstName: { bsonType: "string" },
                lastName: { bsonType: "string" },
                loginName: { bsonType: "string" },
                email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
                password: { bsonType: "string", minLength: 6 ,unique:true}
            }
        }
    },
    validationLevel: "strict",
    validationAction: "error"
};

module.exports = validation;
