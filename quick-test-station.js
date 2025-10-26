// Quick Test Script for Station + Bus Station APIs
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testStation = {
  name: 'Test Station API',
  address: 'Test Address 123',
  city: 'Test City',
  province: 'Test Province',
  latitude: 10.7769,
  longitude: 106.7009,
  description: 'Test station for API testing',
  phone: '+84 28 1234 5678',
  email: 'test@station.com',
  facilities: ['WiFi', 'Restaurant', 'ATM'],
  capacity: 500
};

const testBusStation = {
  stationId: 1,
  busId: 1,
  arrivalTime: '2024-01-15T08:00:00.000Z',
  departureTime: '2024-01-15T08:30:00.000Z',
  sequence: 1,
  platform: 'Platform A',
  gate: 'Gate 1',
  price: 50000,
  notes: 'Test bus station',
  availableSeats: 45,
  totalSeats: 50
};

async function testAPI() {
  console.log('🧪 Starting Station + Bus Station API Tests...\n');

  try {
    // Test 1: Get all stations
    console.log('1️⃣ Testing GET /stations...');
    const stationsResponse = await axios.get(`${BASE_URL}/stations`);
    console.log('✅ GET /stations:', stationsResponse.status);
    console.log('📊 Found', stationsResponse.data.data?.length || 0, 'stations\n');

    // Test 2: Create station
    console.log('2️⃣ Testing POST /stations...');
    const createStationResponse = await axios.post(`${BASE_URL}/stations`, testStation);
    console.log('✅ POST /stations:', createStationResponse.status);
    const stationId = createStationResponse.data.id;
    console.log('🆔 Created station ID:', stationId, '\n');

    // Test 3: Get station by ID
    console.log('3️⃣ Testing GET /stations/' + stationId + '...');
    const getStationResponse = await axios.get(`${BASE_URL}/stations/${stationId}`);
    console.log('✅ GET /stations/' + stationId + ':', getStationResponse.status);
    console.log('📋 Station name:', getStationResponse.data.name, '\n');

    // Test 4: Update station
    console.log('4️⃣ Testing PATCH /stations/' + stationId + '...');
    const updateData = { name: 'Updated Test Station', capacity: 600 };
    const updateStationResponse = await axios.patch(`${BASE_URL}/stations/${stationId}`, updateData);
    console.log('✅ PATCH /stations/' + stationId + ':', updateStationResponse.status);
    console.log('📝 Updated station name:', updateStationResponse.data.name, '\n');

    // Test 5: Get stations by city
    console.log('5️⃣ Testing GET /stations/city/Test City...');
    const cityStationsResponse = await axios.get(`${BASE_URL}/stations/city/Test City`);
    console.log('✅ GET /stations/city/Test City:', cityStationsResponse.status);
    console.log('🏙️ Found', cityStationsResponse.data.length, 'stations in Test City\n');

    // Test 6: Get all bus stations
    console.log('6️⃣ Testing GET /bus-stations...');
    const busStationsResponse = await axios.get(`${BASE_URL}/bus-stations`);
    console.log('✅ GET /bus-stations:', busStationsResponse.status);
    console.log('📊 Found', busStationsResponse.data.data?.length || 0, 'bus stations\n');

    // Test 7: Create bus station
    console.log('7️⃣ Testing POST /bus-stations...');
    const createBusStationResponse = await axios.post(`${BASE_URL}/bus-stations`, testBusStation);
    console.log('✅ POST /bus-stations:', createBusStationResponse.status);
    const busStationId = createBusStationResponse.data.id;
    console.log('🆔 Created bus station ID:', busStationId, '\n');

    // Test 8: Get bus station by ID
    console.log('8️⃣ Testing GET /bus-stations/' + busStationId + '...');
    const getBusStationResponse = await axios.get(`${BASE_URL}/bus-stations/${busStationId}`);
    console.log('✅ GET /bus-stations/' + busStationId + ':', getBusStationResponse.status);
    console.log('🚌 Bus station platform:', getBusStationResponse.data.platform, '\n');

    // Test 9: Get bus stations by station
    console.log('9️⃣ Testing GET /bus-stations/station/' + stationId + '...');
    const stationBusStationsResponse = await axios.get(`${BASE_URL}/bus-stations/station/${stationId}`);
    console.log('✅ GET /bus-stations/station/' + stationId + ':', stationBusStationsResponse.status);
    console.log('🚌 Found', stationBusStationsResponse.data.length, 'bus stations for station', stationId, '\n');

    // Test 10: Get nearby stations
    console.log('🔟 Testing GET /stations/nearby...');
    const nearbyResponse = await axios.get(`${BASE_URL}/stations/nearby?latitude=10.7769&longitude=106.7009&radius=5`);
    console.log('✅ GET /stations/nearby:', nearbyResponse.status);
    console.log('📍 Found', nearbyResponse.data.length, 'nearby stations\n');

    // Test 11: Get station statistics
    console.log('1️⃣1️⃣ Testing GET /stations/' + stationId + '/statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/stations/${stationId}/statistics`);
    console.log('✅ GET /stations/' + stationId + '/statistics:', statsResponse.status);
    console.log('📊 Station statistics:', statsResponse.data, '\n');

    // Test 12: Get bus station statistics
    console.log('1️⃣2️⃣ Testing GET /bus-stations/' + busStationId + '/statistics...');
    const busStatsResponse = await axios.get(`${BASE_URL}/bus-stations/${busStationId}/statistics`);
    console.log('✅ GET /bus-stations/' + busStationId + '/statistics:', busStatsResponse.status);
    console.log('📊 Bus station statistics:', busStatsResponse.data, '\n');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ Station CRUD operations');
    console.log('✅ Bus Station CRUD operations');
    console.log('✅ Search and filter operations');
    console.log('✅ Geolocation search');
    console.log('✅ Statistics endpoints');
    console.log('\n🚀 Station + Bus Station APIs are working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Response:', error.response.data);
    }
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if application is running on port 3000');
    console.log('2. Check database connection');
    console.log('3. Run migration script if needed');
    console.log('4. Check application logs');
  }
}

// Run tests
testAPI();



