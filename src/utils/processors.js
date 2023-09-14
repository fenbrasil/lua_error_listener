
function fieldBuilderIterator(arr, count, codefy) {

    let field = {}

    for (const [key, val] of arr) {

        if (Array.isArray(val)) {

            count++
            fieldBuilderIterator(val, count, false)
        }

        for (const [subKey, subVal] of val) {


        }


        const newVal = codefy == true ? "\`\`\`" : ''

        newVal += 

        field[key] = val
    }

    return field
}

function paramToEmbedField(param) {



}



module.exports = {
    fieldBuilderIterator,
    paramToEmbedField
}