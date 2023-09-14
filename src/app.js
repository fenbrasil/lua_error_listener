const express = require('express')
const app = express()
const config = require('./data.json')
const { fieldBuilderIterator } = require('./utils/processors')

app.use(express.json())

app.post(config.webhook.url, function(req, res) {

    console.log(req.body)

    let resBody = {}
    let embed = {}

    for (const [key, val] of req.body) {

        if (!config.fields_names[key] || !config.fields_names[key].embed) continue

        let shouldEncode = key == 'error' || key == 'stack' ? true : false

        // do some processing

        embed.append(fieldBuilderIterator(val, 1, shouldEncode))
    }

    resBody.append(embed)

    res.location(config.webhook.url)

    res.send(resBody) // send response to Discord API as a webhook

})

const server = app.listen(3000, () => { //config.port, () => {

    console.log(`Back-end on-line! Alocado com êxito no endereço ${Object.toString(server.address())}`)
})

module.exports = server