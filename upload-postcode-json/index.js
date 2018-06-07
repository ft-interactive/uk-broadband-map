/**
 * @file
 * CSV-to-DynamoDB importer
 */
require('dotenv').config();

const Papa = require('papaparse');
const { createReadStream } = require('fs');
const { S3 } = require('aws-sdk');
const ProgressBar = require('progress');

const bar = new ProgressBar(':bar :current/:total', { total: 1568993 });

const client = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// const OFFSET = 'B11_2HJ';

const stream = createReadStream(`${__dirname}/all-pcs-for-aendrew.csv`);

Papa.parse(stream, {
  delimiter: ',',
  header: true,
  chunk: async ({ data }, parser) => {
    parser.pause();
    try {
      await Promise.all(
        data.map(async (record) => {
          try {
            const Key = `v2/ft-interactive/uk-broadband-map/master/postcode/${
              record.postcode
            }.json`;
            await client
              .putObject({
                Body: JSON.stringify(record),
                Bucket: 'ft-ig-content-prod',
                Key,
                ACL: 'public-read',
              })
              .promise();
            console.log(`Wrote ${Key}`);
            return bar.tick();
          } catch (e) {
            console.error(e);
            return Promise.reject(e);
          }
        }),
      );
    } catch (e) {
      console.error(e);
    }
    parser.resume();
  },
});

// const items = d3.csvParse(data).map(d => ({
//   postcode: { T: d.postcode },
//   postcode_space: { T: d.postcode_space },
//   sector: { T: d.sector },
//   postcode_area: { T: d.postcode_area },
//   'SFBB_availability(pc)': { N: d['SFBB_availability(pc)'] },
//   'UFBB_availability(pc)': { B: d['UFBB_availability(pc)'] },
//   'unable_to_receive_2Mbit/s(pc)': { B: d['unable_to_receive_2Mbit/s(pc)'] },
//   'unable_to_receive_5Mbit/s(pc)': { B: d['unable_to_receive_5Mbit/s(pc)'] },
//   'unable_to_receive_10Mbit/s(pc)': { B: d['unable_to_receive_10Mbit/s(pc)'] },
//   'unable_to_receive_30Mbit/s(pc)': { B: d['unable_to_receive_30Mbit/s(pc)'] },
//   'Median_download_speed_(Mbit/s)': { N: d['Median_download_speed_(Mbit/s)'] },
//   'Average_download_speed_(Mbit/s)': { N: d['Average_download_speed_(Mbit/s)'] },
//   'Minimum_download_speed_(Mbit/s)': { N: d['Minimum_download_speed_(Mbit/s)'] },
//   'Maximum_download_speed_(Mbit/s)': { N: d['Maximum_download_speed_(Mbit/s)'] },
//   'Average_download_speed_(Mbit/s)_for_lines_under_10Mbit/s': {
//     N: d['Average_download_speed_(Mbit/s)_for_lines_under_10Mbit/s'],
//   },
//   'Average_download_speed_(Mbit/s)_for_Basic_BB_lines': {
//     N: d['Average_download_speed_(Mbit/s)_for_Basic_BB_lines'],
//   },
//   'Average_download_speed_(Mbit/s)_for_SFBB_lines': {
//     N: d['Average_download_speed_(Mbit/s)_for_SFBB_lines'],
//   },
//   'Average_download_speed_(Mbit/s)_for_UFBB_lines': {
//     B: d['Average_download_speed_(Mbit/s)_for_UFBB_lines'],
//   },
//   'Median_upload_speed_(Mbit/s)': { N: d['Median_upload_speed_(Mbit/s)'] },
//   'Average_upload_speed_(Mbit/s)': { N: d['Average_upload_speed_(Mbit/s)'] },
//   'Minimum_upload_speed_(Mbit/s)': { N: d['Minimum_upload_speed_(Mbit/s)'] },
//   'Maximum_upload_speed_(Mbit/s)': { N: d['Maximum_upload_speed_(Mbit/s)'] },
//   'Average_upload_speed_(Mbit/s)_for_lines_under_10Mbit/s': {
//     N: d['Average_upload_speed_(Mbit/s)_for_lines_under_10Mbit/s'],
//   },
//   'Average_upload_speed_(Mbit/s)_for_Basic_BB_lines': {
//     N: d['Average_upload_speed_(Mbit/s)_for_Basic_BB_lines'],
//   },
//   'Average_upload_speed_(Mbit/s)_for_SFBB_lines': {
//     N: d['Average_upload_speed_(Mbit/s)_for_SFBB_lines'],
//   },
//   'Average_upload_speed_(Mbit/s)_for_UFBB_lines': {
//     B: d['Average_upload_speed_(Mbit/s)_for_UFBB_lines'],
//   },
//   'Number_of_connections_under_2_Mbit/s': { B: d['Number_of_connections_under_2_Mbit/s'] },
//   'Number_of_connections_2-5_Mbit/s': { N: d['Number_of_connections_2-5_Mbit/s'] },
//   'Number_of_connections_5-10_Mbit/s': { N: d['Number_of_connections_5-10_Mbit/s'] },
//   'Number_of_connections_10-30_Mbit/s': { N: d['Number_of_connections_10-30_Mbit/s'] },
//   'Number_of_connections_>=_30_Mbit/s': { N: d['Number_of_connections_>=_30_Mbit/s'] },
//   'Number_of_connections_>=_300_Mbit/s': { B: d['Number_of_connections_>=_300_Mbit/s'] },
//   'Average_data_usage_(GB)': { N: d['Average_data_usage_(GB)'] },
//   'Average_data_usage_(GB)_for_lines_<under_10Mbit/s': {
//     N: d['Average_data_usage_(GB)_for_lines_<under_10Mbit/s'],
//   },
//   'Average_data_usage_(GB)_for_Basic_BB_lines': {
//     N: d['Average_data_usage_(GB)_for_Basic_BB_lines'],
//   },
//   'Average_data_usage_(GB)_for_SFBB_lines': {
//     N: d['Average_data_usage_(GB)_for_SFBB_lines'],
//   },
//   'Average_data_usage_(GB)_for_UFBB_lines': {
//     B: d['Average_data_usage_(GB)_for_UFBB_lines'],
//   },
//   'FTTP_availability_(%_premises)': { B: d['FTTP_availability_(%_premises)'] },
//   status: { T: d.status },
//   usertype: { T: d.usertype },
//   easting: { N: d.easting },
//   northing: { N: d.northing },
//   PQI: { B: d.PQI },
//   country: { T: d.country },
//   latitude: { N: d.latitude },
//   longitude: { N: d.longitude },
//   oacode2011: { T: d.oacode2011 },
//   lacode2011: { T: d.lacode2011 },
//   pop: { N: d.pop },
//   area_ha: { N: d.area_ha },
//   density_ppha: { N: d.density_ppha },
//   source_classif: { T: d.source_classif },
//   unified_classif: { T: d.unified_classif },
//   sub_region: { T: d.sub_region },
//   region: { T: d.region },
//   LSOA11CD: { T: d.LSOA11CD },
//   ctry: { T: d.ctry },
//   income: { N: d.income },
//   employ: { N: d.employ },
//   original_imd_score: { N: d.original_imd_score },
//   original_imd_quintile: { N: d.original_imd_quintile },
//   uk_imd_england_score: { N: d.uk_imd_england_score },
//   uk_imd_england_quintile: { N: d.uk_imd_england_quintile },
//   uk_imd_ni_score: { N: d.uk_imd_ni_score },
//   uk_imd_ni_quintile: { N: d.uk_imd_ni_quintile },
//   uk_imd_scotland_score: { N: d.uk_imd_scotland_score },
//   uk_imd_scotland_quintile: { N: d.uk_imd_scotland_quintile },
//   uk_imd_wales_score: { N: d.uk_imd_wales_score },
//   uk_imd_wales_quintile: { N: d.uk_imd_wales_quintile },
// }));
//
// items
//   .reduce(async (a, c) => {
//     const cur = await a;
//     return [
//       ...cur,
//       await dynamodb
//         .putItem({
//           Item: c,
//           TableName: process.env.TABLE_NAME || 'ig-uk-broadband-data-may-2018',
//         })
//         .promise(),
//     ];
//   }, Promise.resolve([]))
//   .then(console.log)
//   .catch(console.error);
