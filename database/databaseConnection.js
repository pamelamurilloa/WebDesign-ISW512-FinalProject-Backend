const { Client } = require("pg");

const simpleQuery = async (query) => {
    const client = new Client(
        {
            user: "postgres",
            host: "localhost",
            database: "PROJECTIIIWEBDESIGN",
            password: "12pg",
            port: 5432
        }
    )

    await client.connect()
 
    const res = await client.query(query);
        
    await client.end()

    return res
}

module.exports = {
    simpleQuery
}


