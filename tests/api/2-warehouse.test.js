import axios from 'axios';   // Importing axios using ES Module syntax
import { expect } from 'chai';  // Importing expect from chai

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testContext } from './context.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '..', '.env') });

describe('Warehouse List Test', () => {

it('should retrieve warehouses with valid token and group parameter', async () => {
    const response = await axios.get(`${process.env.URL}/api/v2/manage/warehouse/master/list`, {
      params: { group: 'default' },
      headers: { Authorization: `Bearer ${testContext.token}` }
    });
    
    expect(response.status).to.equal(200);
    expect(response.headers['content-type']).to.include('application/json');
  
    expect(response.data).to.be.an('object');
  });
}
)
