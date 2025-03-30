import axios from 'axios';
import { expect } from 'chai';

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testContext } from './context.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '..', '.env') });

//console.log('API URL:', process.env.URL); 


describe('Login API Test', () => {
  it('should login successfully and return a token', async () => {
    const response = await axios.post(`${process.env.URL}/api/login`, {
      username: process.env.USER,
      password: process.env.PASSWORD
    });
    
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('token');
    testContext.token = response.data.token; // Store token in shared context
  });
});