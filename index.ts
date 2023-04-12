import _ from 'lodash';
import csvtojson from 'csvtojson';
import fs from 'fs';
// load csv file
const csvfilename = 'latlng-all';
const fileExists = (fileName: string) => {
  let result = false;
  fs.stat(`./data/${fileName}.json`, function(err, _) {
    if (err == null) {
      console.log('File exists');
      result = true;
    } else if (err.code === 'ENOENT') {
      // file does not exist
      console.log('file not exists: ', err.code);
    } else {
      console.log('Some other error: ', err.code);
    }
  });
  return result;
}
const jsonWithCsv = async (fileName: string) => {
  if (!fileExists(fileName)) {
    const json = await csvtojson().fromFile(`./data/${fileName}.csv`);
    fs.writeFileSync(`./data/${fileName}.json`, JSON.stringify(json))
    return json;
  } else {
    const json = fs.readFileSync('./data/${fileName}.json')
    return json;
  }
}
// find string in a row
jsonWithCsv(csvfilename).then((res) => {
  const query1 = `리`;
  const query2 = `읍/면/리/동`;
  const query3 = `읍면동/구`;
  const query4 = `시군구`;
  const query5 = `시도`;
  const val = process.argv.slice(2);
  _.map(val, function(v) {
    const found = _.find(res, function(o) {
      return o[query1] == v || o[query2] == v || o[query3] == v || o[query4] == v || o[query5] == v
    });
    console.log(v, found['위도'], found['경도']);
  });
});
