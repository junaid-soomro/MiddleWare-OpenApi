const fs = require('fs')


module.exports = function writeChangestoSpecFile(routeBlock, jsonFile) {
    // var existingSpecFile = fs.readFileSync('compute_spec.json');
  
  
  
  
    // jsonFile['paths'][] = routeBlock
    // //Writsaaing changed in file
    // var jsonData = JSON.stringify(existingJson);
  
  
    //write .txt extension to make text file
    fs.writeFile("orchestratorOpenApi.json", JSON.stringify(jsonFile), (err) => {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    })
  
  }
  