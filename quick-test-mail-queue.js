const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Tạo file test
const createTestFile = () => {
  const testContent = `Test file content - ${new Date().toISOString()}`;
  const testFilePath = path.join(__dirname, 'test-file.txt');
  fs.writeFileSync(testFilePath, testContent);
  return testFilePath;
};

// Test functions
const tests = {
  // Test email config
  async testEmailConfig() {
    try {
      console.log('🔍 Testing email config...');
      const response = await axios.get(`${BASE_URL}/email-test/config`);
      console.log('✅ Email config:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Email config failed:', error.message);
      return false;
    }
  },

  // Test direct email
  async testDirectEmail() {
    try {
      console.log('📧 Testing direct email...');
      const response = await axios.post(`${BASE_URL}/email-test/send`, {
        to: 'test@example.com',
        subject: 'Test Direct Email',
        message: 'This is a direct email test'
      });
      console.log('✅ Direct email sent:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Direct email failed:', error.message);
      return false;
    }
  },

  // Test queue email
  async testQueueEmail() {
    try {
      console.log('📬 Testing queue email...');
      const response = await axios.post(`${BASE_URL}/email-test/queue`, {
        to: 'test@example.com',
        subject: 'Test Queue Email',
        message: 'This is a queue email test'
      });
      console.log('✅ Queue email sent:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Queue email failed:', error.message);
      return false;
    }
  },

  // Test single file upload
  async testSingleFileUpload() {
    try {
      console.log('📁 Testing single file upload...');
      const testFilePath = createTestFile();
      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFilePath));
      
      const response = await axios.post(`${BASE_URL}/upload/single`, formData, {
        headers: formData.getHeaders()
      });
      console.log('✅ Single file upload:', response.data);
      
      // Cleanup
      fs.unlinkSync(testFilePath);
      return true;
    } catch (error) {
      console.log('❌ Single file upload failed:', error.message);
      return false;
    }
  },

  // Test async file upload
  async testAsyncFileUpload() {
    try {
      console.log('📤 Testing async file upload...');
      const testFilePath = createTestFile();
      const formData = new FormData();
      formData.append('file', fs.createReadStream(testFilePath));
      formData.append('userId', '1');
      
      const response = await axios.post(`${BASE_URL}/upload/async`, formData, {
        headers: formData.getHeaders()
      });
      console.log('✅ Async file upload:', response.data);
      
      // Cleanup
      fs.unlinkSync(testFilePath);
      return true;
    } catch (error) {
      console.log('❌ Async file upload failed:', error.message);
      return false;
    }
  },

  // Test queue stats
  async testQueueStats() {
    try {
      console.log('📊 Testing queue stats...');
      const response = await axios.get(`${BASE_URL}/upload/queue/stats`);
      console.log('✅ Queue stats:', response.data);
      return true;
    } catch (error) {
      console.log('❌ Queue stats failed:', error.message);
      return false;
    }
  },

  // Test list files
  async testListFiles() {
    try {
      console.log('📋 Testing list files...');
      const response = await axios.get(`${BASE_URL}/upload/list`);
      console.log('✅ List files:', response.data);
      return true;
    } catch (error) {
      console.log('❌ List files failed:', error.message);
      return false;
    }
  }
};

// Main test runner
async function runTests() {
  console.log('🚀 Starting Mail Queue Upload Tests...\n');
  
  const results = {};
  
  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      results[testName] = await testFn();
    } catch (error) {
      console.log(`❌ ${testName} crashed:`, error.message);
      results[testName] = false;
    }
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  for (const [testName, passed] of Object.entries(results)) {
    console.log(`${passed ? '✅' : '❌'} ${testName}`);
  }
  
  console.log(`\n🎯 Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Mail queue upload system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the logs above for details.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { tests, runTests };



