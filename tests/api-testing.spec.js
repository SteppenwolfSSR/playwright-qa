import { test, expect } from '@playwright/test';
import axios from 'axios';
const fs = require('fs');
const path = require('path');

test.describe('API Testing with Request Library', () => {
  
  test('GET request to reqres API', async ({}) => {
    // Read the data from the CSV file
    const csvFilePath = path.join(__dirname, '../fixtures/testData.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const [header, value] = csvData.split(',');
    const apiKey = value.trim();

    const options = {
      method: 'GET',
      url: 'https://reqres.in/api/{resource}/12',
      headers: {
        [header]: apiKey
      }
    };

    try {
      const response = await axios({
        method: 'GET',
        url: 'https://reqres.in/api/{resource}/12',
        headers: {
          [header]: apiKey
        }
      });

      console.log(response.data);

      // Validate response data received
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('data');
      expect(response.data.data).toHaveProperty('id', 12);
    } catch (error) {
      throw new Error(error);
    }
  });
});