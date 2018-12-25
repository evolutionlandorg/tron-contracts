const fs = require('fs');

var obj = {};

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./script/contract_apostle_log.txt')
});

var contractName;
var base58;
var hex;
  
lineReader.on('line', function (line) {
    line = line.trim();
    if (line.endsWith(':')) {
        contractName = line.slice(0, -1);
        // console.log(contractName);
    } else if (line.startsWith("(base58)")) {
        base58 = line.split(')')[1];
        // console.log(base58);
    } else if (line.startsWith("(hex)")) {
        hex = line.split(')')[1];
        // console.log(hex);

        obj[contractName] = {
            "base58": base58.trim(),
            "hex": hex.trim()
        }
        // console.log(obj);
    }
    // console.log(line);
}).on('close', function(){
    lineReader.close();

    // console.log(obj);
    fs.writeFile("./script/auto_generated_apostle_address.json", JSON.stringify(obj, null, 4), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
});