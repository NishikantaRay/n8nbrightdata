// OpenWeatherMap API Test Script for Smart Commute Assistant
// Run this to test your weather API setup

const axios = require('axios');

const WEATHER_CONFIG = {
  apiKey: 'YOUR_OPENWEATHER_API_KEY_HERE', // Replace with your OpenWeatherMap API key
  baseUrl: 'https://api.openweathermap.org/data/2.5',
  city: 'Bangalore,IN',
  units: 'metric'
};

async function testCurrentWeather() {
  console.log('🌤️  Testing Current Weather API...');
  
  try {
    const response = await axios.get(`${WEATHER_CONFIG.baseUrl}/weather`, {
      params: {
        q: WEATHER_CONFIG.city,
        appid: WEATHER_CONFIG.apiKey,
        units: WEATHER_CONFIG.units
      }
    });

    console.log('✅ Current Weather API: Working');
    console.log('   🌡️  Temperature:', response.data.main.temp + '°C');
    console.log('   🌤️  Condition:', response.data.weather[0].description);
    console.log('   💧 Humidity:', response.data.main.humidity + '%');
    console.log('   👁️  Visibility:', response.data.visibility + 'm');
    console.log('   💨 Wind Speed:', response.data.wind?.speed + ' m/s');
    
    // Check for rain
    const isRaining = response.data.weather[0].main.toLowerCase().includes('rain');
    const hasThunderstorm = response.data.weather[0].main.toLowerCase().includes('thunderstorm');
    const hasFog = response.data.weather[0].description.toLowerCase().includes('fog') || 
                  response.data.weather[0].description.toLowerCase().includes('mist');
    
    console.log('   🌧️  Rain Status:', isRaining ? 'RAINING ⚠️' : 'NO RAIN ✅');
    console.log('   ⛈️  Thunderstorm:', hasThunderstorm ? 'YES ⚠️' : 'NO ✅');
    console.log('   🌫️  Fog/Mist:', hasFog ? 'YES ⚠️' : 'NO ✅');
    
    return { 
      success: true, 
      data: response.data,
      isRaining,
      hasThunderstorm,
      hasFog
    };
  } catch (error) {
    console.log('❌ Current Weather API: Failed');
    if (error.response?.status === 401) {
      console.log('   🔑 Error: Invalid API key or not activated yet');
      console.log('   💡 Solution: Wait 10-60 minutes after signup, or check your API key');
    } else if (error.response?.status === 429) {
      console.log('   ⏱️  Error: Rate limit exceeded');
      console.log('   💡 Solution: Wait a few minutes and try again');
    } else if (error.response?.status === 404) {
      console.log('   🏙️  Error: City not found');
      console.log('   💡 Solution: Try "Bangalore,IN" or use coordinates');
    } else {
      console.log('   Error:', error.response?.data?.message || error.message);
    }
    return { success: false, error: error.message };
  }
}

async function testWeatherForecast() {
  console.log('📅 Testing Weather Forecast API...');
  
  try {
    const response = await axios.get(`${WEATHER_CONFIG.baseUrl}/forecast`, {
      params: {
        q: WEATHER_CONFIG.city,
        appid: WEATHER_CONFIG.apiKey,
        units: WEATHER_CONFIG.units,
        cnt: 8 // Next 24 hours in 3-hour intervals
      }
    });

    console.log('✅ Weather Forecast API: Working');
    console.log('   📊 Forecast periods:', response.data.list.length);
    
    // Check for upcoming rain in next 6 hours (2 periods)
    const next6Hours = response.data.list.slice(0, 2);
    const upcomingRain = next6Hours.some(forecast => 
      forecast.weather[0].main.toLowerCase().includes('rain')
    );
    
    const upcomingThunderstorm = next6Hours.some(forecast => 
      forecast.weather[0].main.toLowerCase().includes('thunderstorm')
    );
    
    console.log('   🌧️  Rain in next 6h:', upcomingRain ? 'EXPECTED ⚠️' : 'NOT EXPECTED ✅');
    console.log('   ⛈️  Thunderstorm in next 6h:', upcomingThunderstorm ? 'EXPECTED ⚠️' : 'NOT EXPECTED ✅');
    
    // Show detailed forecast for commute planning
    console.log('   📈 Next 12 hours forecast:');
    response.data.list.slice(0, 4).forEach((forecast, index) => {
      const time = new Date(forecast.dt * 1000);
      const timeStr = time.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      const condition = forecast.weather[0].description;
      const temp = Math.round(forecast.main.temp);
      const rainIcon = forecast.weather[0].main.toLowerCase().includes('rain') ? '🌧️' : '';
      const thunderIcon = forecast.weather[0].main.toLowerCase().includes('thunderstorm') ? '⛈️' : '';
      
      console.log(`     ${timeStr}: ${condition} ${temp}°C ${rainIcon}${thunderIcon}`);
    });
    
    return { 
      success: true, 
      data: response.data,
      upcomingRain,
      upcomingThunderstorm
    };
  } catch (error) {
    console.log('❌ Weather Forecast API: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}

async function testWeatherForCommute() {
  console.log('🚗 Testing Weather Impact on Bangalore Commute...');
  
  try {
    // Get both current weather and forecast
    const currentWeather = await testCurrentWeather();
    const forecast = await testWeatherForecast();
    
    if (!currentWeather.success || !forecast.success) {
      console.log('❌ Cannot assess weather impact - API calls failed');
      return { success: false };
    }
    
    console.log('✅ Weather Impact Analysis for Bangalore Traffic:');
    
    // Current conditions
    const current = currentWeather.data;
    const temp = current.main.temp;
    const visibility = current.visibility;
    const windSpeed = current.wind?.speed || 0;
    
    // Combine current and forecast data
    const isCurrentlyRaining = currentWeather.isRaining;
    const hasCurrentThunderstorm = currentWeather.hasThunderstorm;
    const hasFog = currentWeather.hasFog;
    const upcomingRain = forecast.upcomingRain;
    const upcomingThunderstorm = forecast.upcomingThunderstorm;
    
    // Bangalore-specific traffic impact analysis
    let impact = '☀️ Optimal driving conditions';
    let extraTime = 0;
    let severity = 'low';
    let recommendations = [];
    
    // Rain impact (major factor in Bangalore)
    if (hasCurrentThunderstorm || upcomingThunderstorm) {
      impact = '⛈️ SEVERE: Thunderstorm conditions';
      extraTime = 60;
      severity = 'severe';
      recommendations.push('🏠 Consider working from home');
      recommendations.push('⚡ Avoid electronic city flyovers during lightning');
      recommendations.push('🚗 If driving, avoid low-lying areas');
    } else if (isCurrentlyRaining && upcomingRain) {
      impact = '🌧️ MAJOR: Continuous rain expected';
      extraTime = 45;
      severity = 'major';
      recommendations.push('🕒 Leave 45+ minutes early');
      recommendations.push('🌊 Avoid Silk Board and KR Puram (waterlogging prone)');
      recommendations.push('🛣️ Use elevated roads (metro routes) if possible');
    } else if (isCurrentlyRaining || upcomingRain) {
      impact = '🌧️ MODERATE: Rain during commute';
      extraTime = 25;
      severity = 'moderate';
      recommendations.push('🕒 Leave 25 minutes early');
      recommendations.push('🚗 Drive slowly and maintain distance');
      recommendations.push('💡 Turn on headlights');
    }
    
    // Visibility impact (fog/mist common in Bangalore)
    else if (hasFog || visibility < 3000) {
      impact = '🌫️ MODERATE: Low visibility conditions';
      extraTime = 20;
      severity = 'moderate';
      recommendations.push('🦺 Use fog lights and hazard lights');
      recommendations.push('🐌 Drive very slowly');
      recommendations.push('📱 Share live location with family');
    }
    
    // Temperature impact
    else if (temp > 38) {
      impact = '🔥 MINOR: Extreme heat affecting traffic';
      extraTime = 10;
      severity = 'minor';
      recommendations.push('❄️ Use AC - may cause traffic due to overheating vehicles');
      recommendations.push('💧 Carry water');
      recommendations.push('⏰ Avoid 12-3 PM if possible');
    } else if (temp < 15) {
      impact = '🥶 MINOR: Cold weather (rare in Bangalore!)';
      extraTime = 5;
      severity = 'minor';
      recommendations.push('🧥 Dress warmly');
      recommendations.push('🌡️ Check for unusual weather patterns');
    }
    
    // Wind impact (rare but worth checking)
    else if (windSpeed > 10) {
      impact = '💨 MINOR: Strong winds';
      extraTime = 10;
      severity = 'minor';
      recommendations.push('🌳 Watch for falling branches');
      recommendations.push('🏍️ Two-wheeler riders be extra careful');
    }
    
    // Perfect conditions
    else {
      impact = '☀️ OPTIMAL: Perfect driving conditions';
      extraTime = 0;
      severity = 'none';
      recommendations.push('🚗 Normal commute expected');
      recommendations.push('⏰ Stick to regular departure time');
    }
    
    console.log('   📊 Impact Assessment:', impact);
    console.log('   ⏱️  Extra time needed:', extraTime + ' minutes');
    console.log('   🎯 Severity Level:', severity.toUpperCase());
    console.log('   🌡️  Current temperature:', temp + '°C');
    console.log('   👁️  Visibility:', visibility + 'm');
    console.log('   💨 Wind speed:', windSpeed + ' m/s');
    
    if (recommendations.length > 0) {
      console.log('   💡 Recommendations:');
      recommendations.forEach((rec, index) => {
        console.log(`     ${index + 1}. ${rec}`);
      });
    }
    
    // Traffic hotspots to avoid in bad weather
    if (severity === 'severe' || severity === 'major') {
      console.log('   🚧 Bangalore areas to AVOID in this weather:');
      console.log('     • Silk Board Junction (severe waterlogging)');
      console.log('     • KR Puram Bridge area (flooding)');
      console.log('     • Marathahalli Bridge (water accumulation)');
      console.log('     • Electronic City flyovers (wind/lightning risk)');
      console.log('     • Airport Road (open area, wind exposure)');
    }
    
    return { 
      success: true, 
      impact, 
      extraTime, 
      severity,
      recommendations,
      isRaining: isCurrentlyRaining || upcomingRain,
      hasThunderstorm: hasCurrentThunderstorm || upcomingThunderstorm,
      temp,
      visibility,
      windSpeed
    };
    
  } catch (error) {
    console.log('❌ Weather commute analysis failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function testApiQuota() {
  console.log('📊 Testing API Quota and Performance...');
  
  try {
    const startTime = Date.now();
    
    // Make multiple quick requests to test performance
    const promises = Array(5).fill().map((_, index) => 
      axios.get(`${WEATHER_CONFIG.baseUrl}/weather`, {
        params: {
          q: WEATHER_CONFIG.city,
          appid: WEATHER_CONFIG.apiKey,
          units: WEATHER_CONFIG.units
        }
      })
    );
    
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log('✅ API Performance Test: Working');
    console.log('   ⚡ 5 requests completed in:', totalTime + 'ms');
    console.log('   📈 Average response time:', Math.round(totalTime / 5) + 'ms');
    console.log('   🎯 Success rate: 100%');
    
    console.log('\n   📊 Daily Quota Analysis:');
    console.log('   • Free tier limit: 1,000 calls/day');
    console.log('   • Smart Commute usage: 8 calls/day');
    console.log('   • Remaining quota: ~992 calls/day');
    console.log('   • Usage percentage: 0.8%');
    
    return { success: true, responseTime: totalTime / 5 };
    
  } catch (error) {
    console.log('❌ API Performance Test: Failed');
    if (error.response?.status === 429) {
      console.log('   ⚠️ Rate limit hit during performance test');
      console.log('   💡 This is normal for rapid successive calls');
    } else {
      console.log('   Error:', error.message);
    }
    return { success: false, error: error.message };
  }
}

async function runWeatherTests() {
  console.log('🌤️ OpenWeatherMap API Test for Smart Commute Assistant\n');
  console.log('='.repeat(70));
  
  // Check configuration
  if (WEATHER_CONFIG.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
    console.log('❌ Please update WEATHER_CONFIG with your OpenWeatherMap API key!');
    console.log('\n📝 Steps to get your FREE API key:');
    console.log('1. 🌐 Go to https://openweathermap.org/api');
    console.log('2. ✍️  Sign up for free account (no credit card needed)');
    console.log('3. 📧 Verify your email address');
    console.log('4. 🔑 Go to "API Keys" tab in dashboard');
    console.log('5. 📋 Copy your default API key');
    console.log('6. ⏰ Wait 10-60 minutes for key activation');
    console.log('7. 🔄 Update this script and run again');
    console.log('\n💰 Cost: Completely FREE (1,000 calls/day limit)');
    return;
  }
  
  console.log('🧪 Running Weather API Tests for Bangalore:\n');
  
  // Run all tests
  const results = {
    current: await testCurrentWeather(),
    forecast: await testWeatherForecast(),
    commute: await testWeatherForCommute(),
    quota: await testApiQuota()
  };
  
  console.log('\n' + '='.repeat(70));
  console.log('📋 WEATHER API TEST RESULTS:');
  console.log('='.repeat(70));
  
  const passCount = Object.values(results).filter(r => r.success).length;
  console.log(`📊 Tests Passed: ${passCount}/4`);
  
  if (passCount >= 3) { // Allow quota test to fail (rate limiting)
    console.log('\n🎉 Weather API integration is ready!');
    console.log('   Your Smart Commute Assistant has weather intelligence! 🌤️🚗');
    
    console.log('\n💰 Usage & Cost Summary:');
    console.log('   • Plan: OpenWeatherMap Free Tier');
    console.log('   • Daily limit: 1,000 API calls');
    console.log('   • Your usage: 8 calls/day (morning + evening)');
    console.log('   • Monthly usage: ~240 calls');
    console.log('   • Monthly cost: $0.00 ✅');
    console.log('   • Quota utilization: 0.8% (very safe!)');
    
    console.log('\n🔄 Next Steps for n8n Integration:');
    console.log('   1. ✅ Add OpenWeatherMap credential in n8n');
    console.log('   2. ✅ Update Weather Check node with your API key');
    console.log('   3. ✅ Update Weather Forecast node with your API key');
    console.log('   4. ✅ Test both nodes in n8n workflow');
    console.log('   5. ✅ Verify weather data reaches Decision Engine');
    console.log('   6. ✅ Test complete workflow execution');
    
    console.log('\n🌧️ Weather Features Available:');
    console.log('   • ☀️ Current conditions (temp, humidity, visibility)');
    console.log('   • 📅 3-hour forecasts (next 24 hours)');
    console.log('   • 🌧️ Rain detection and prediction');
    console.log('   • ⛈️ Thunderstorm and severe weather alerts');
    console.log('   • 🌫️ Fog and visibility warnings');
    console.log('   • 🚗 Bangalore-specific traffic impact analysis');
    
  } else {
    console.log('\n🔧 Some tests failed. Common issues:');
    console.log('   • ⏰ API key not activated yet (wait 10-60 minutes after signup)');
    console.log('   • 🔑 Invalid API key format (check for typos/spaces)');
    console.log('   • 🌐 Network connectivity issues');
    console.log('   • ⏱️ Rate limit exceeded (wait a few minutes)');
    console.log('   • 🏙️ City name format issues (try "Bangalore,IN")');
    
    console.log('\n🔍 Debugging Steps:');
    console.log('   1. Check your API key at https://openweathermap.org/api');
    console.log('   2. Verify email confirmation');
    console.log('   3. Try manual API call in browser:');
    console.log(`      https://api.openweathermap.org/data/2.5/weather?q=Bangalore,IN&appid=${WEATHER_CONFIG.apiKey}&units=metric`);
    console.log('   4. Check OpenWeatherMap status page for outages');
  }
  
  console.log('\n📈 Bangalore Weather Impact on Traffic:');
  console.log('   🌧️ Light rain: +15-25 minutes (common)');
  console.log('   ⛈️ Heavy rain: +45-60 minutes (frequent in monsoon)');
  console.log('   🌫️ Fog: +20 minutes (winter mornings)');
  console.log('   ☀️ Clear weather: Normal commute times');
  console.log('   🌊 Waterlogging hotspots: Silk Board, KR Puram, Marathahalli');
}

// Usage
if (require.main === module) {
  console.log('📚 OpenWeatherMap API Test Script for Smart Commute');
  console.log('🔧 Make sure to install axios: npm install axios');
  console.log('🌤️ Get your free API key: https://openweathermap.org/api\n');
  
  runWeatherTests();
}

module.exports = { 
  runWeatherTests, 
  testCurrentWeather, 
  testWeatherForecast, 
  testWeatherForCommute,
  testApiQuota,
  WEATHER_CONFIG 
};
