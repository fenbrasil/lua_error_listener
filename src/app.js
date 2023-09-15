const express = require('express')
const app = express()
const config = require('./data.json')

app.use(express.json())

app.post('/', function(req, res) {

    let resBody = {
        username: '',
        avatar_url: '',
        embeds: []
    }

    const iterable = Object.entries(req.body)

    for (const [key, val] of iterable) {

        if (!config.fields_names[key] || !config.fields_names[key].embed) continue

        let shouldEncode = key == 'error' || key == 'stack' ? true : false

        const embedVal = shouldEncode ? `\`\`\`${val}\`\`\`` : val

        // do some processing
        resBody.embeds.push({
            name: config.fields_names[key].title,
            value: embedVal,
            inline: false
        })
    }

    resBody.username = config.webhook.custom_name_or_addon_name || iterable.addon
    resBody.avatar_url = config.webhook.icon_url_or_path || ''

    res.location(config.webhook.url)

    console.log(resBody)

    res.send(resBody) // send response to Discord API as a webhook

})

const server = app.listen(3000, () => { //config.port, () => {

    console.log(`Back-end on-line! Alocado com êxito na porta ${server.address().port}`)
})