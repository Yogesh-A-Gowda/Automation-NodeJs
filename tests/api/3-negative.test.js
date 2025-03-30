import axios from 'axios';   // Importing axios using ES Module syntax
import { expect } from 'chai';  // Importing expect from chai

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testContext } from './context.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '..', '.env') });

describe('Negative Tests', () => {

it('should return 401 Unauthorized with invalid token', async () => {
    try {
      await axios.get(`${process.env.URL}/api/v2/manage/warehouse/master/list`, {
        params: { group: 'default' },
        headers: { Authorization: 'Bearer invalid_token' }
      });
    } catch (error) {
      expect(error.response.status).to.equal(401);
    }
  });

  it('should handle missing/invalid query parameters gracefully', async () => {
    // Case 1: Valid group parameter (default)
    const response1 = await axios.get(`${process.env.URL}/api/v2/manage/warehouse/master/list`, {
      params: { group: 'default' },
      headers: { Authorization: `Bearer ${testContext.token}` }
    });
    expect(response1.status).to.equal(200);
    expect(response1.data.docs).to.be.an('array').that.is.not.empty;
    response1.data.docs.forEach(doc => {
      expect(doc.group).to.equal('default');
    });
  
    // Case 2: Unrecognized/invalid parameter (assuming that API should ignore it, as its usually one of the functionalities added to recent APIs)
    const response2 = await axios.get(`${process.env.URL}/api/v2/manage/warehouse/master/list`, {
      params: { foo: 'bar' }, // Completely invalid parameter
      headers: { Authorization: `Bearer ${testContext.token}` }
    });
    expect(response2.status).to.equal(200);
    expect(response2.data.docs).to.be.an('array').that.is.not.empty;
    expect(response2.data.docs).to.deep.equal(response1.data.docs); // if invalid queryparams are ignored, then the resulted json should match with the default json response. This code compares both responses
    
  });

  it('should return empty list for non-existent group', async () => {
    const response = await axios.get(`${process.env.URL}/api/v2/manage/warehouse/master/list`, {
      params: { group: 'nonexistent' },
      headers: { Authorization: `Bearer ${testContext.token}` }
    });
  
    // Verify response structure and content
    expect(response.status).to.equal(200);

    expect(response.headers['content-type']).to.include('application/json');
    expect(response.data).to.be.an('object');

    expect(response.data.docs).to.be.an('array').that.is.empty; // Key assertion
    expect(response.data.totalDocs).to.equal(0); //double verification of count
  });
});
