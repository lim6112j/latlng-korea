import _ from 'lodash';
import csvtojson from 'csvtojson';
// load csv file
const csvfilepath = 'latlng_korea.csv';
const jsonWithCsv = async (filepath: string) => {
  const json = await csvtojson().fromFile(filepath);
  return json;
}
// find string in a row
jsonWithCsv(csvfilepath).then((res) => {
  const query1 = `시도`;
  const query2 = `시군구`;
  const query3 = `읍면동/구`;
  const query4 = `읍/면/리/동`;
  const query5 = `리`;
  const val = process.argv[2]
  console.log(val);
  const found = _.find(res, function(o) { 
    return o[query1] == val || o[query2] == val || o[query3] == val ||  o[query4] == val ||  o[query5] == val 
  });
  console.log(val, found['위도'], found['경도']);
});
