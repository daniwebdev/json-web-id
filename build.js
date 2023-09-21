var showdown  = require('showdown');
var fs        = require('fs')
const converter = new showdown.Converter();
const YAML = require('yaml')
const dirOutput = __dirname + `/blog`

const template = fs.readFileSync(__dirname+`/_src/_template.html`, 'utf-8');

// clean output

for(let dir of fs.readdirSync(dirOutput)) {
    fs.unlinkSync(dirOutput + `/${dir}`)
}

let links = '';

for(let item of fs.readdirSync(__dirname+"/_src")) {

    if(item.indexOf('.yml') > -1) {

        let data = YAML.parse( fs.readFileSync(__dirname + `/_src/${item}`, 'utf-8') );
        let html  = converter.makeHtml(data.body);

        let output = template
                            .replace(/{title}/g, data.title)
                            .replace(/{description}/g, data.description)
                            .replace(/{date}/g, data.date)
                            .replace(/{author}/g, data.author ?? 'anonymous')
                            .replace(/{image}/g, data.image)
                            .replace(/{lang}/g, data.lang ?? 'en')
                            .replace(/{body}/g, html);

        fs.writeFileSync(dirOutput + `/${data.slug}.html`, output, 'utf-8');

        links += `<li><a href="/blog/${data.slug}.html">${data.title}</a></li>`;

        console.log(`Generated:./blog/${data.slug}.html}`)
    }
}

fs.writeFileSync(dirOutput + `/index.html`, `<ul>${links}</ul>`, 'utf-8');