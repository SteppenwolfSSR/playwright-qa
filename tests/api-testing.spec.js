import { test } from '@playwright/test';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

test('API Test with x-api-key from CSV', async ({}) => {
  // Read the data from testData.csv
  createReadStream('fixtures/testData.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const apiKey = row['x-api-key']; 

      // Define the request options
      const options = {
        method: 'GET',
        url: 'https://reqres.in/api/{resource}/12',
        headers: {
          'x-api-key': apiKey
        }
      };

      try {
        // Make the request using axios
        const response = await axios(options);
        console.log(response.data);
      } catch (error) {
        console.error('Error making the request:', error);
      }
    })
    .on('error', (error) => {
      console.error('Error reading the CSV file:', error);
    });
});