// Google Maps API Test Script for Smart Commute Assistant
// Run this to test your Google Maps API setup

const axios = require('axios');

const GOOGLE_MAPS_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual Google Maps API key
  baseUrl: 'https://maps.googleapis.com/maps/api'
};

// Test addresses for Bangalore
const TEST_ADDRESSES = {
  home: 'Koramangala, Bangalore, India',
  office: 'Electronic City, Bangalore, India',
  alternative: 'Whitefield, Bangalore, India'
};

// Test 1: Directions API with Traffic
async function testDirectionsAPI() {
  console.log('🗺️  Testing Google Maps Directions API...');
  
  try {
    const response = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/directions/json`, {
      params: {
        origin: TEST_ADDRESSES.home,
        destination: TEST_ADDRESSES.office,
        alternatives: true,
        departure_time: 'now',
        traffic_model: 'best_guess',
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Directions API working!');
      console.log('Routes found:', response.data.routes.length);
      
      const mainRoute = response.data.routes[0];
      const leg = mainRoute.legs[0];
      
      console.log('📍 Route Details:');
      console.log('  Duration:', leg.duration.text);
      console.log('  Distance:', leg.distance.text);
      
      if (leg.duration_in_traffic) {
        console.log('  Duration in traffic:', leg.duration_in_traffic.text);
        console.log('  🚦 Traffic data available!');
      } else {
        console.log('  ⚠️  No traffic data (might be off-peak)');
      }
      
      console.log('  Summary:', mainRoute.summary);
      
      if (response.data.routes.length > 1) {
        console.log('🛣️  Alternative routes available:', response.data.routes.length - 1);
      }
      
      return true;
    } else {
      console.error('❌ API Error:', response.data.status);
      if (response.data.error_message) {
        console.error('   Message:', response.data.error_message);
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Geocoding API
async function testGeocodingAPI() {
  console.log('📍 Testing Geocoding API...');
  
  try {
    const response = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/geocode/json`, {
      params: {
        address: TEST_ADDRESSES.home,
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Geocoding API working!');
      const result = response.data.results[0];
      const location = result.geometry.location;
      
      console.log('📍 Location Details:');
      console.log('  Address:', result.formatted_address);
      console.log('  Coordinates:', `${location.lat}, ${location.lng}`);
      console.log('  Place ID:', result.place_id);
      
      return true;
    } else {
      console.error('❌ Geocoding Error:', response.data.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Geocoding failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Multiple Routes with Different Options
async function testMultipleRoutes() {
  console.log('🛣️  Testing Multiple Route Options...');
  
  try {
    // Test route avoiding highways
    const avoidHighwaysResponse = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/directions/json`, {
      params: {
        origin: TEST_ADDRESSES.home,
        destination: TEST_ADDRESSES.office,
        alternatives: true,
        avoid: 'highways',
        departure_time: 'now',
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    // Test route avoiding tolls
    const avoidTollsResponse = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/directions/json`, {
      params: {
        origin: TEST_ADDRESSES.home,
        destination: TEST_ADDRESSES.office,
        alternatives: true,
        avoid: 'tolls',
        departure_time: 'now',
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (avoidHighwaysResponse.data.status === 'OK' && avoidTollsResponse.data.status === 'OK') {
      console.log('✅ Multiple route options working!');
      
      const noHighwayDuration = avoidHighwaysResponse.data.routes[0].legs[0].duration.text;
      const noTollDuration = avoidTollsResponse.data.routes[0].legs[0].duration.text;
      
      console.log('🛣️  Route Variations:');
      console.log('  Avoiding highways:', noHighwayDuration);
      console.log('  Avoiding tolls:', noTollDuration);
      
      return true;
    } else {
      console.error('❌ Multiple routes test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Multiple routes test failed:', error.message);
    return false;
  }
}

// Test 4: Places API (Address Autocomplete)
async function testPlacesAPI() {
  console.log('🏢 Testing Places API...');
  
  try {
    const response = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/place/autocomplete/json`, {
      params: {
        input: 'Koramangala',
        location: '12.9352,77.6245', // Bangalore coordinates
        radius: 50000,
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Places API working!');
      console.log('Suggestions found:', response.data.predictions.length);
      
      if (response.data.predictions.length > 0) {
        console.log('🏢 Sample suggestions:');
        response.data.predictions.slice(0, 3).forEach((prediction, index) => {
          console.log(`  ${index + 1}. ${prediction.description}`);
        });
      }
      
      return true;
    } else {
      console.error('❌ Places API Error:', response.data.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Places API failed:', error.response?.data || error.message);
    return false;
  }
}

// Check API quotas and usage
async function checkQuotas() {
  console.log('📊 Checking API Usage...');
  
  // Note: Google doesn't provide a direct API to check quotas
  // Users need to check Google Cloud Console manually
  console.log('💡 To check your quotas and usage:');
  console.log('   1. Go to console.cloud.google.com');
  console.log('   2. Navigate to APIs & Services → Quotas');
  console.log('   3. Filter by "Maps" to see your usage');
  console.log('   4. Set up billing alerts if needed');
  
  return true;
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Google Maps API Tests for Smart Commute Assistant\n');
  
  // Check configuration
  if (GOOGLE_MAPS_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please update GOOGLE_MAPS_CONFIG with your actual API key!');
    console.log('\n📝 Steps to get your API key:');
    console.log('1. Go to console.cloud.google.com');
    console.log('2. Create a new project or select existing');
    console.log('3. Enable these APIs:');
    console.log('   - Directions API');
    console.log('   - Geocoding API');
    console.log('   - Places API');
    console.log('4. Create credentials → API Key');
    console.log('5. Copy your API key and update this script');
    console.log('6. Restrict your API key for security');
    return;
  }

  const results = {
    directions: await testDirectionsAPI(),
    geocoding: await testGeocodingAPI(),
    multipleRoutes: await testMultipleRoutes(),
    places: await testPlacesAPI(),
    quotas: await checkQuotas()
  };

  console.log('\n📊 Test Summary:');
  console.log('Directions API:', results.directions ? '✅ PASS' : '❌ FAIL');
  console.log('Geocoding API:', results.geocoding ? '✅ PASS' : '❌ FAIL');
  console.log('Multiple Routes:', results.multipleRoutes ? '✅ PASS' : '❌ FAIL');
  console.log('Places API:', results.places ? '✅ PASS' : '❌ FAIL');

  const passCount = Object.values(results).filter(r => r).length - 1; // Exclude quotas check
  console.log(`\n🎯 Overall: ${passCount}/4 tests passed`);

  if (passCount === 4) {
    console.log('\n🎉 All tests passed! Your Google Maps API is ready for Smart Commute Assistant.');
    console.log('\n📈 Usage Estimation:');
    console.log('• Smart Commute runs 4 times/day = 120 requests/month');
    console.log('• Free tier: 40,000 requests/month');
    console.log('• Your usage: 0.3% of free tier');
    console.log('• Monthly cost: $0.00 ✅');
    console.log('\n🔄 Next steps:');
    console.log('1. Update n8n workflow with your Google Maps API credentials');
    console.log('2. Set up environment variables for HOME_ADDRESS and OFFICE_ADDRESS');
    console.log('3. Test the complete Smart Commute workflow');
    console.log('4. Set up billing alerts in Google Cloud Console');
  } else {
    console.log('\n🔧 Some tests failed. Common issues:');
    console.log('1. API key might need a few minutes to activate');
    console.log('2. Check if all required APIs are enabled in Google Cloud Console');
    console.log('3. Verify API key restrictions (referrers, IP addresses)');
    console.log('4. Ensure billing is enabled (required even for free tier)');
    console.log('5. Check quota limits and usage');
  }

  console.log('\n💰 Cost Information:');
  console.log('• Google Maps API: $200/month free credit');
  console.log('• Directions API: $0.005 per request after 40,000');
  console.log('• Your estimated cost: $0.00/month (within free tier)');
  console.log('• Break-even point: 40,000 requests (333 requests/day)');
}

// Usage instructions
if (require.main === module) {
  console.log('📚 Google Maps API Test Script');
  console.log('1. Install axios: npm install axios');
  console.log('2. Get your API key from console.cloud.google.com');
  console.log('3. Update GOOGLE_MAPS_CONFIG.apiKey in this file');
  console.log('4. Run: node google_maps_test.js\n');
  
  runAllTests();
}

module.exports = { 
  runAllTests, 
  testDirectionsAPI, 
  testGeocodingAPI, 
  testMultipleRoutes, 
  testPlacesAPI,
  GOOGLE_MAPS_CONFIG 
};
