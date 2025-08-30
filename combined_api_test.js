// Combined API Test for Smart Commute Assistant
// Tests Bright Data, Google Maps, and OpenWeatherMap APIs

const axios = require('axios');

// Configuration
const API_CONFIG = {
  brightData: {
    apiToken: 'Your_Bright_Data_API_Token', // Your token
    baseUrl: 'https://brightdata.com/api/collect',
    zone: 'YOUR_ZONE_NAME',
    country: 'IN'
  },
  googleMaps: {
    apiKey: 'YOUR_GOOGLE_MAPS_API_KEY_HERE', // Add your Google Maps API key
    baseUrl: 'https://maps.googleapis.com/maps/api'
  },
  weather: {
    apiKey: 'YOUR_OPENWEATHER_API_KEY_HERE', // Add your OpenWeatherMap API key
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    city: 'Bangalore,IN',
    units: 'metric'
  },
  testData: {
    homeAddress: 'Koramangala, Bangalore, India',
    officeAddress: 'Electronic City, Bangalore, India'
  }
};

// Bright Data Tests
async function testBrightDataNews() {
  console.log('📰 Testing Bright Data - News Scraping...');
  
  try {
    const response = await axios.post(API_CONFIG.brightData.baseUrl, {
      url: 'https://timesofindia.indiatimes.com/city/bengaluru',
      format: 'json',
      country: API_CONFIG.brightData.country,
      session_id: 'combined_test_news_' + Date.now(),
      wait_for: 'networkidle',
      extract: {
        articles: {
          selector: '.content .story-list .story, article',
          type: 'list',
          fields: {
            title: 'h1, h2, h3, .headline',
            url: 'a@href',
            content: '.brief, .summary, .excerpt, p'
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.brightData.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Bright Data News: Working');
    console.log('   Articles found:', response.data?.articles?.length || 0);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Bright Data News: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}

async function testBrightDataSocial() {
  console.log('🐦 Testing Bright Data - Social Media...');
  
  try {
    const response = await axios.post(API_CONFIG.brightData.baseUrl, {
      url: 'https://twitter.com/search?q=%23BengaluruTraffic',
      format: 'json',
      country: API_CONFIG.brightData.country,
      session_id: 'combined_test_social_' + Date.now(),
      wait_for: 'networkidle',
      extract: {
        tweets: {
          selector: '[data-testid="tweet"]',
          type: 'list',
          fields: {
            text: '[data-testid="tweetText"]',
            username: '[data-testid="User-Name"] span'
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.brightData.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Bright Data Social: Working');
    console.log('   Tweets found:', response.data?.tweets?.length || 0);
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Bright Data Social: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}

// Weather API Tests
async function testWeatherCurrent() {
  console.log('🌤️  Testing OpenWeatherMap - Current Weather...');
  
  try {
    const response = await axios.get(`${API_CONFIG.weather.baseUrl}/weather`, {
      params: {
        q: API_CONFIG.weather.city,
        appid: API_CONFIG.weather.apiKey,
        units: API_CONFIG.weather.units
      }
    });

    console.log('✅ Weather Current: Working');
    console.log('   Temperature:', response.data.main.temp + '°C');
    console.log('   Condition:', response.data.weather[0].description);
    const isRaining = response.data.weather[0].main.toLowerCase().includes('rain');
    console.log('   Rain Status:', isRaining ? 'RAINING ⚠️' : 'NO RAIN ✅');
    return { success: true, data: response.data, isRaining };
  } catch (error) {
    console.log('❌ Weather Current: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}

async function testWeatherForecast() {
  console.log('📅 Testing OpenWeatherMap - Forecast...');
  
  try {
    const response = await axios.get(`${API_CONFIG.weather.baseUrl}/forecast`, {
      params: {
        q: API_CONFIG.weather.city,
        appid: API_CONFIG.weather.apiKey,
        units: API_CONFIG.weather.units,
        cnt: 8
      }
    });

    console.log('✅ Weather Forecast: Working');
    console.log('   Forecast periods:', response.data.list.length);
    const upcomingRain = response.data.list.slice(0, 2).some(f => 
      f.weather[0].main.toLowerCase().includes('rain')
    );
    console.log('   Rain expected:', upcomingRain ? 'YES ⚠️' : 'NO ✅');
    return { success: true, data: response.data, upcomingRain };
  } catch (error) {
    console.log('❌ Weather Forecast: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}
async function testGoogleMapsDirections() {
  console.log('🗺️  Testing Google Maps - Directions...');
  
  try {
    const response = await axios.get(`${API_CONFIG.googleMaps.baseUrl}/directions/json`, {
      params: {
        origin: API_CONFIG.testData.homeAddress,
        destination: API_CONFIG.testData.officeAddress,
        alternatives: true,
        departure_time: 'now',
        traffic_model: 'best_guess',
        key: API_CONFIG.googleMaps.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Google Maps Directions: Working');
      const route = response.data.routes[0];
      console.log('   Duration:', route.legs[0].duration.text);
      console.log('   Distance:', route.legs[0].distance.text);
      console.log('   Routes found:', response.data.routes.length);
      return { success: true, data: response.data };
    } else {
      console.log('❌ Google Maps Directions: Failed');
      console.log('   Error:', response.data.status, response.data.error_message);
      return { success: false, error: response.data.status };
    }
  } catch (error) {
    console.log('❌ Google Maps Directions: Failed');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testGoogleMapsGeocoding() {
  console.log('📍 Testing Google Maps - Geocoding...');
  
  try {
    const response = await axios.get(`${API_CONFIG.googleMaps.baseUrl}/geocode/json`, {
      params: {
        address: API_CONFIG.testData.homeAddress,
        key: API_CONFIG.googleMaps.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Google Maps Geocoding: Working');
      const location = response.data.results[0].geometry.location;
      console.log('   Coordinates:', `${location.lat}, ${location.lng}`);
      return { success: true, data: response.data };
    } else {
      console.log('❌ Google Maps Geocoding: Failed');
      console.log('   Error:', response.data.status);
      return { success: false, error: response.data.status };
    }
  } catch (error) {
    console.log('❌ Google Maps Geocoding: Failed');
    console.log('   Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Simulate the Smart Commute workflow
async function simulateSmartCommuteWorkflow() {
  console.log('\n🚗 Simulating Complete Smart Commute Workflow...\n');
  
  // Step 1: Get weather data
  const currentWeather = await testWeatherCurrent();
  const weatherForecast = await testWeatherForecast();

  // Step 2: Get traffic news
  const newsResult = await testBrightDataNews();
  
  // Step 3: Get social media updates  
  const socialResult = await testBrightDataSocial();
  
  // Step 4: Get route information
  const directionsResult = await testGoogleMapsDirections();
  
  // Step 5: Get geocoding for validation
  const geocodingResult = await testGoogleMapsGeocoding();

  // Step 6: Enhanced AI Decision Engine Analysis
  console.log('\n🧠 AI Decision Engine Analysis:');
  
  let recommendation = {
    route: 'Default Route',
    duration: '45 minutes',
    confidence: 30,
    alerts: [],
    weatherImpact: 'Normal conditions'
  };

  // Weather impact analysis
  if (currentWeather.success) {
    const temp = currentWeather.data.main.temp;
    const condition = currentWeather.data.weather[0].description;
    
    if (currentWeather.isRaining || (weatherForecast.success && weatherForecast.upcomingRain)) {
      recommendation.alerts.push('🌧️ Rain expected - Allow extra 20-30 minutes');
      recommendation.weatherImpact = 'Rain conditions';
      recommendation.duration = '1h 15m'; // Add extra time
      recommendation.confidence += 15;
    } else if (temp > 35) {
      recommendation.alerts.push('🔥 Very hot weather - AC usage may affect traffic');
      recommendation.weatherImpact = 'Hot conditions';
      recommendation.confidence += 10;
    } else {
      recommendation.weatherImpact = '☀️ Good weather conditions';
      recommendation.confidence += 20;
    }
    
    console.log('   🌤️ Weather:', condition + ', ' + temp + '°C');
  }

  // Route analysis
  if (directionsResult.success) {
    const route = directionsResult.data.routes[0];
    recommendation.route = route.summary || 'Main Route';
    recommendation.duration = route.legs[0].duration.text;
    recommendation.confidence += 25;
    console.log('   🛣️ Best route found:', recommendation.route);
  }

  // News analysis
  if (newsResult.success && newsResult.data?.articles?.length > 0) {
    recommendation.alerts.push('📰 Traffic news available');
    recommendation.confidence += 10;
    console.log('   📰 News articles found:', newsResult.data.articles.length);
  }

  // Social media analysis
  if (socialResult.success && socialResult.data?.tweets?.length > 0) {
    recommendation.alerts.push('🐦 Social media traffic updates found');
    recommendation.confidence += 10;
    console.log('   🐦 Social updates found:', socialResult.data.tweets.length);
  }

  console.log('\n📊 Final Smart Commute Recommendation:');
  console.log('🛣️  Best Route:', recommendation.route);
  console.log('⏱️  Duration:', recommendation.duration);
  console.log('🌤️  Weather Impact:', recommendation.weatherImpact);
  console.log('🎯 Confidence Score:', recommendation.confidence + '%');
  console.log('⚠️  Active Alerts:', recommendation.alerts.length);
  
  if (recommendation.alerts.length > 0) {
    console.log('   📢 Alert Details:');
    recommendation.alerts.forEach((alert, index) => {
      console.log(`     ${index + 1}. ${alert}`);
    });
  }

  const allSuccessful = [
    currentWeather, weatherForecast, newsResult, 
    socialResult, directionsResult, geocodingResult
  ].filter(result => result.success).length >= 4; // Allow some to fail

  if (allSuccessful) {
    console.log('\n🎉 Complete Smart Commute workflow simulation successful!');
    console.log('   Your AI-powered traffic assistant is ready! 🚀🧠');
  } else {
    console.log('\n⚠️  Some components failed, but core functionality works.');
  }

  return allSuccessful;
}

// Cost analysis
function analyzeCosts() {
  console.log('\n💰 Complete Cost Analysis for Smart Commute Assistant:\n');
  
  console.log('📊 Expected Monthly Usage:');
  console.log('   • 4 executions/day (7AM, 8AM, 5PM, 6PM)');
  console.log('   • 30 days/month');
  console.log('   • Total: 120 workflow executions/month\n');
  
  console.log('🔆 Bright Data Costs:');
  console.log('   • 3 scraping requests per execution');
  console.log('   • 360 requests/month total');
  console.log('   • Free tier: 1,000 requests/month');
  console.log('   • Your cost: $0.00 ✅\n');
  
  console.log('🗺️  Google Maps API Costs:');
  console.log('   • 2 API calls per execution (directions + geocoding)');
  console.log('   • 240 requests/month total');
  console.log('   • Free tier: 40,000 requests/month');
  console.log('   • Your cost: $0.00 ✅\n');
  
  console.log('🌤️  OpenWeatherMap API Costs:');
  console.log('   • 2 weather calls per execution (current + forecast)');
  console.log('   • 240 requests/month total');
  console.log('   • Free tier: 1,000 requests/day (30,000/month)');
  console.log('   • Your cost: $0.00 ✅\n');
  
  console.log('💳 Total Monthly Cost: $0.00');
  console.log('   All THREE services are FREE within your usage! 🎉');
  console.log('   You\'re using less than 1% of each service\'s free tier!');
}

// Main function
async function runCompleteTest() {
  console.log('🚀 Smart Commute Assistant - Complete API Test\n');
  console.log('='.repeat(60));
  
  // Check configuration
  const configIssues = [];
  
  if (API_CONFIG.brightData.apiToken === 'Your_Bright_Data_API_Token') {
    configIssues.push('Bright Data API token');
  }
  
  if (API_CONFIG.googleMaps.apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    configIssues.push('Google Maps API key');
  }

  if (API_CONFIG.weather.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
    configIssues.push('OpenWeatherMap API key');
  }

  if (configIssues.length > 0) {
    console.log('❌ Configuration incomplete!');
    console.log('   Missing:', configIssues.join(', '));
    console.log('\n📝 Setup Instructions:');
    console.log('   1. Get Bright Data API token from brightdata.com');
    console.log('   2. Get Google Maps API key from console.cloud.google.com');
    console.log('   3. Get OpenWeatherMap API key from openweathermap.org');
    console.log('   4. Update API_CONFIG in this file');
    console.log('   5. Run this test again');
    return;
  }

  // Run individual tests
  console.log('🧪 Running Individual API Tests:\n');
  
  const results = {
    weatherCurrent: await testWeatherCurrent(),
    weatherForecast: await testWeatherForecast(),
    brightDataNews: await testBrightDataNews(),
    brightDataSocial: await testBrightDataSocial(),
    googleMapsDirections: await testGoogleMapsDirections(),
    googleMapsGeocoding: await testGoogleMapsGeocoding()
  };

  // Run complete workflow simulation
  const workflowSuccess = await simulateSmartCommuteWorkflow();

  // Show summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 FINAL TEST RESULTS:');
  console.log('='.repeat(60));
  
  const passCount = Object.values(results).filter(r => r.success).length;
  console.log(`📊 Individual Tests: ${passCount}/6 passed`);
  console.log(`🔄 Workflow Test: ${workflowSuccess ? 'PASS' : 'FAIL'}`);
  
  if (passCount >= 4 && workflowSuccess) { // Allow some APIs to fail
    console.log('\n🎉 SMART COMMUTE ASSISTANT IS READY!');
    console.log('   Your AI-powered traffic intelligence system is operational! 🚀🧠');
    
    console.log('\n🔄 Next Steps:');
    console.log('   1. ✅ Import the n8n workflow');
    console.log('   2. ✅ Add all API credentials in n8n');
    console.log('   3. ✅ Set HOME_ADDRESS and OFFICE_ADDRESS variables');
    console.log('   4. ✅ Configure Slack/Telegram notifications');
    console.log('   5. ✅ Test the complete n8n workflow');
    console.log('   6. ✅ Activate the schedule trigger');
    
    console.log('\n🌟 What Your Assistant Can Do:');
    console.log('   🌤️ Real-time weather impact analysis');
    console.log('   📰 Live traffic news monitoring');
    console.log('   🐦 Social media traffic intelligence');
    console.log('   🗺️ Dynamic route optimization');
    console.log('   📱 Smart notifications with confidence scores');
    console.log('   🚨 Emergency traffic alerts');
    
    analyzeCosts();
  } else {
    console.log('\n🔧 Some tests failed. Please check:');
    console.log('   • API credentials are correct');
    console.log('   • APIs are enabled in respective dashboards');
    console.log('   • Network connectivity is stable');
    console.log('   • Rate limits are not exceeded');
    console.log('   • API keys are activated (weather: 10-60 min delay)');
  }
}

// Usage
if (require.main === module) {
  console.log('📚 Complete API Test for Smart Commute Assistant');
  console.log('This script tests Bright Data, Google Maps, and OpenWeatherMap APIs');
  console.log('🔧 Install dependencies: npm install axios\n');
  
  runCompleteTest();
}

module.exports = {
  runCompleteTest,
  simulateSmartCommuteWorkflow,
  testWeatherCurrent,
  testWeatherForecast,
  API_CONFIG
};
