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
  const query = `읍면동/구`;
  const query2 = `읍/면/리/동`;
  console.log(query);
  const found = _.find(res, function(o) { return o[query2] == "모리" });
  console.log(found);
});
