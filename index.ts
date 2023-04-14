import _ from 'lodash';
import csvtojson from 'csvtojson';
import fs from 'fs';
import { Md5 } from "ts-md5";
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
if (process.argv[2] == "arg") {
  jsonWithCsv(csvfilename).then((res) => {
    const query1 = `리`;
    const query2 = `읍/면/리/동`;
    const query3 = `읍면동/구`;
    const query4 = `시군구`;
    const query5 = `시도`;
    const val = process.argv.slice(3);
    _.map(val, function(v) {
      const found = _.find(res, function(o) {
        return o[query1] == v || o[query2] == v || o[query3] == v || o[query4] == v || o[query5] == v
      });
      console.log(v, found['위도'], found['경도']);
    });
  });
} else if (process.argv[2] == "file") {
  const result: string[] = [];
  const failed: string[] = [];
  jsonWithCsv(csvfilename).then(async (res) => {
    const query1 = `리`;
    const query2 = `읍/면/리/동`;
    const query3 = `읍면동/구`;
    const query4 = `시군구`;
    const query5 = `시도`;
    jsonWithCsv(process.argv[3]).then(async (val) => {
      _.map(val, function(v: any) {
        const vm = v["위치명"].split(" ").pop();
        const found = _.find(res, function(o) {
          return o[query1] == vm || o[query2] == vm || o[query3] == vm || o[query4] == vm || o[query5] == vm
        });
        if (found) {
          v['위도'] = found['위도'];
          v['경도'] = found['경도'];
          result.push(v);
          //console.log(v, found['위도'], found['경도'])
        } else {
          failed.push(`${v['위치명']}: not found`);
          console.log("not found for ", vm);
        }

      });

      console.log(result)
      fs.writeFileSync(`./data/${process.argv[3]}_result.json`, JSON.stringify(result))
      fs.writeFileSync(`./data/${process.argv[3]}_failed.json`, JSON.stringify(failed))
    })

  });
} else if (process.argv[2] == "stcis") {
  const result: string[] = [];
  const failed: string[] = [];
  jsonWithCsv(csvfilename).then(async (res) => {
    const query1 = `리`;
    const query2 = `읍/면/리/동`;
    const query3 = `읍면동/구`;
    const query4 = `시군구`;
    const query5 = `시도`;
    jsonWithCsv(process.argv[3]).then(async (val) => {
      const subStartQ1 = `읍면동(출발)`;
      const subStartQ2 = `시군구(출발)`;
      const subStartQ3 = `시도(출발)`;
      const subEndQ1 = `읍면동(도착)`;
      const subEndQ2 = `시군구(도착)`;
      const subEndQ3 = `시도(도착)`;
      _.map(val, function(v: any) {
        const startStr = v[subStartQ1] != "-" ? v[subStartQ1]
          : v[subStartQ2] != "-" ? v[subStartQ2]
            : v[subStartQ3] != "-" ? v[subStartQ3]
              : ""
        const endStr = v[subEndQ1] != "-" ? v[subEndQ1]
          : v[subEndQ2] != "-" ? v[subEndQ2]
            : v[subEndQ3] != "-" ? v[subEndQ3]
              : "";
        const foundStart = _.find(res, function(o) {
          return o[query1] == startStr || o[query2] == startStr || o[query3] == startStr || o[query4] == startStr || o[query5] == startStr
        });

        const foundEnd = _.find(res, function(o) {
          return o[query1] == endStr || o[query2] == endStr || o[query3] == endStr || o[query4] == endStr || o[query5] == endStr
        });
        if (foundStart && foundEnd) {
          v['위도(출발)'] = foundStart['위도'];
          v['경도(출발)'] = foundStart['경도'];
          v['위도(도착)'] = foundEnd['위도'];
          v['경도(도착)'] = foundEnd['경도'];
          result.push(v);
          //console.log(v, found['위도'], found['경도'])
        } else {
          failed.push(`${JSON.stringify(v)}: not found`);
          console.log("not found for ", v);
        }

      });

      console.log(result)
      fs.writeFileSync(`./data/${process.argv[3]}_result.json`, JSON.stringify(result))
      fs.writeFileSync(`./data/${process.argv[3]}_failed.json`, JSON.stringify(failed))
    })

  });
}


