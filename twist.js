var fileSystem  = require('fs');
var argv        = require('optimist').argv;
var cheerio     = require('cheerio');
var html        = require('html');
var inputGenerator = require('./libs/inputGenerator.js');

if (!argv.f) return console.log('usage "node twist -f file.twist-config"');
if (!/\.twist-config/.test(argv.f)) console.log('the file specified is not a twist file');

try {
    fileSystem.readFile(argv.f,function(err,jsondata) {
        var twistness = JSON.parse(jsondata);
        if (twistable(twistness)) {
            twist(twistness);
        }
    });
} catch (e) {
    console.log('something went wrong:', e);
}

function twistable(twistness) {
    //TODO: verify the JSON object before getting to work to avoid ugly errors    
    return true;
}

function twist(twistness) {
    generateForm(twistness,function(data) {output('form.html',data)});
    generateTableSQL(null,null,console.log);
}

function generateForm(twistness,callback) {
    process.nextTick(function () {
        try {
            var $ = cheerio.load('<body></body>');
            var form = $('<form></form>');
            if (twistness.method) form.attr('method',twistness.method);
            if (twistness.action) form.attr('action',twistness.action);
            if (!twistness.fields) throw new Error('Twisting requires a field list in the twist config');
            for (var i = 0 ; i < twistness.fields.length ; i++) {
                inputGenerator.generate($,form,twistness.fields[i]);
            }
            $('body').append(form);
            console.log(html.prettyPrint($.html()));
        } catch (e) {
            console.log('problem generating form',e);
        } 
        callback(html.prettyPrint($.html()));
    });
}

function generateTableSQL(table, assoc_list, callback) {
}

function generateStoredProcedureSQL(table, assoc_list, fields, callback) {

}

function output(filename, content) {
    process.nextTick(function() {
        var directoryOutExists;
        var fileExists;
        var directory = './output/';
        var filePath = directory+filename;
        try {
            directoryOutExists = fileSystem.existsSync(directory);
            fileExists = fileSystem.existsSync(filePath);
            if (!directoryOutExists) fileSystem.mkdirSync(directory);
            if (fileExists) fileSystem.unlinkSync(filePath);
            fileSystem.writeFile(filePath,content);
        } catch (e) {
            console.log('Something went wrong outputting the file',filename,e);
            return false;
        }
    }); 
}
