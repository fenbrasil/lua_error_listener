const express = require('express')
const https = require('https')
const app = express()
const config = require('./data.json')

function sendHttpResponse(body) {

    const reqBody = JSON.stringify(body)

    console.log(reqBody)

    let req = https.request({
        host: 'discord.com',
        path: `/api/webhooks/${config.webhook.url.channel_id}/${config.webhook.url.token}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }, function(res) {

        res.setEncoding('utf-8')
        
        // console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
        console.log(`Request status code: ${res.statusCode}`)

        res.on('data', function(d) {

            process.stdout.write(d)
        })
    })

    req.on('error', function(e) {

        console.log(`There was an error with the request: ${e.message}`)

        return
    })

    req.write(reqBody)
    req.end()
}

app.use(express.json())

app.post('/', (req, res) => {

    let resBody = {
        // username: '',
        // avatar_url: '',
        embeds: []
    }

    const timestamp = new Date()

    const iterable = Object.entries(req.body)

    // resBody.username = config.webhook.custom_name_or_addon_name || iterable['addon']
    // resBody.avatar_url = config.webhook.icon_url_or_path || ''

    let embed = {
        description: 'Erro lua ocorrido no servidor:',
        color: config.embed.color,
        fields: [],
        timestamp: timestamp.toISOString(),
        footer: {
            "text": "",
            "icon_url": ""
        }
    }

    for (const [key, val] of iterable) {

        if (!config.embed.fields_names[key] || !config.embed.fields_names[key].type) continue

        let shouldEncode = key == 'error' || key == 'stack' ? true : false

        const embedVal = shouldEncode ? `\`\`\`${val}\`\`\`` : val

        // do some processing
        if (config.embed.fields_names[key].type == 'footer') {
            
            embed.footer['text'] = embedVal
            embed.footer['icon_url'] = config.webhook.icon_url_or_path || ''

            continue
        }
        if (config.embed.fields_names[key].type != 'fields') {

            embed[config.embed.fields_names[key].type] = embedVal
            
            continue
        }

        embed.fields.push({
            name: config.embed.fields_names[key].title,
            value: embedVal,
            inline: false
        })
    }

    resBody.embeds.push(embed)

    sendHttpResponse(resBody)

    res.send()
})

const server = app.listen(3000, () => { //config.port, () => {

    console.log(`Back-end on-line! Alocado com êxito na porta ${server.address().port}`)
})