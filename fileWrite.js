const fs = require('fs')

module.exports = function writeChangestoSpecFile(routeBlock) {
  fs.writeFile("orchestratorOpenApi.json", JSON.stringify(routeBlock), (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  })

}

