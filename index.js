const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const args = process.argv.slice(2);
console.log(args.length)

const port = 3000;


if (args.length < 4) {
  console.error('Usage: something wrong');
  process.exit(1);
}





const accessKeyId = args[0];
const secretAccessKey = args[1];
const region = args[2]
const index = args[3]
// Set up the Kendra client with credentials
const kendra = new AWS.Kendra({
  accessKeyId,
  secretAccessKey,
  region
});




app.get('/search', (req, res) => {
    const queryText = req.query.q;
    const facetkey = req.query.facet;
    console.log(queryText)
    console.log(facetkey)
  
    const params = {
      IndexId: index,
      QueryText: queryText,
      
    };
  
    kendra.query(params, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error searching Kendra index');
        } else {
          const items = data.ResultItems.map(item => ({
            title: item.DocumentTitle.Text,
            excerpt: item.DocumentExcerpt.Text
          }));
          res.json(items);
        }
      });
    });
  
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  