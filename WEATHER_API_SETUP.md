# OpenWeatherMap API Setup Guide for Smart Commute Assistant

## 🌤️ **Is OpenWeatherMap API Free?**

**YES!** OpenWeatherMap has an excellent free tier:

### **Free Tier Benefits:**
- **1,000 API calls/day** (30,000/month)
- **Current weather data** ✅
- **5-day weather forecast** ✅
- **Weather alerts** ✅
- **No credit card required** ✅

### **Your Smart Commute Usage:**
- **8 API calls/day** (4 current weather + 4 forecast calls)
- **240 calls/month** total
- **Usage**: Only 0.8% of free tier!
- **Cost**: $0.00 ✅

## 🚀 **Step-by-Step Setup Process**

### **Step 1: Create OpenWeatherMap Account**
1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Click **"Sign Up"** (completely free)
3. Fill in your details:
   - Email address
   - Username  
   - Password
   - Company: "Personal Project" or your company name
4. **Verify your email** address

### **Step 2: Get Your API Key**
1. **Login** to your OpenWeatherMap account
2. **Go to "API Keys"** tab in your dashboard
3. **Copy your default API key** (starts with a long string like `2a1b3c4d5e6f...`)
4. **Key activation**: Takes 10-60 minutes to activate

### **Step 3: Choose Your Plan (Free is Perfect!)**
- **Free Plan**: 1,000 calls/day, 5-day forecast
- **Your usage**: 8 calls/day (well within limits!)
- **Upgrade later**: If you need more calls or historical data

## 🔐 **API Endpoints for Smart Commute**

### **1. Current Weather API**
```
GET https://api.openweathermap.org/data/2.5/weather
```

**Required Parameters:**
- `q`: City name (e.g., "Bangalore,IN")
- `appid`: Your API key
- `units`: "metric" (for Celsius) or "imperial" (for Fahrenheit)

**Example Request:**
```
https://api.openweathermap.org/data/2.5/weather?q=Bangalore,IN&appid=YOUR_API_KEY&units=metric
```

### **2. 5-Day Weather Forecast**
```
GET https://api.openweathermap.org/data/2.5/forecast
```

**Parameters:**
- `q`: City name
- `appid`: Your API key  
- `units`: "metric"
- `cnt`: Number of timestamps (8 = next 24 hours in 3-hour intervals)

**Example Request:**
```
https://api.openweathermap.org/data/2.5/forecast?q=Bangalore,IN&appid=YOUR_API_KEY&units=metric&cnt=8
```

### **3. Weather Alerts (Optional)**
```
GET https://api.openweathermap.org/data/2.5/onecall
```

**Use Case**: Get severe weather alerts for Bangalore

## 📊 **Weather Data Structure**

### **Current Weather Response:**
```json
{
  "main": {
    "temp": 28.5,
    "feels_like": 32.1,
    "humidity": 78
  },
  "weather": [
    {
      "main": "Rain",
      "description": "light rain",
      "icon": "10d"
    }
  ],
  "wind": {
    "speed": 3.2,
    "deg": 210
  },
  "visibility": 8000,
  "name": "Bangalore"
}
```

### **Forecast Response:**
```json
{
  "list": [
    {
      "dt": 1693372800,
      "main": {
        "temp": 26.8,
        "humidity": 82
      },
      "weather": [
        {
          "main": "Rain",
          "description": "moderate rain"
        }
      ],
      "dt_txt": "2025-08-30 09:00:00"
    }
  ]
}
```

## 🧪 **Test Your Weather API Setup**

Create this test file: `weather_api_test.js`

```javascript
const axios = require('axios');

const WEATHER_CONFIG = {
  apiKey: 'YOUR_OPENWEATHER_API_KEY_HERE', // Replace with your API key
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
    console.log('   Temperature:', response.data.main.temp + '°C');
    console.log('   Condition:', response.data.weather[0].description);
    console.log('   Humidity:', response.data.main.humidity + '%');
    console.log('   Visibility:', response.data.visibility + 'm');
    
    // Check for rain
    const isRaining = response.data.weather[0].main.toLowerCase().includes('rain');
    console.log('   🌧️  Rain Status:', isRaining ? 'RAINING' : 'NO RAIN');
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Current Weather API: Failed');
    if (error.response?.status === 401) {
      console.log('   Error: Invalid API key or not activated yet');
    } else if (error.response?.status === 429) {
      console.log('   Error: Rate limit exceeded');
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
    console.log('   Forecast periods:', response.data.list.length);
    
    // Check for upcoming rain
    const upcomingRain = response.data.list.some(forecast => 
      forecast.weather[0].main.toLowerCase().includes('rain')
    );
    
    console.log('   🌧️  Upcoming Rain:', upcomingRain ? 'EXPECTED' : 'NO RAIN EXPECTED');
    
    // Show next few hours
    console.log('   📊 Next 12 hours:');
    response.data.list.slice(0, 4).forEach((forecast, index) => {
      const time = new Date(forecast.dt * 1000).toLocaleTimeString();
      console.log(`     ${time}: ${forecast.weather[0].description}, ${forecast.main.temp}°C`);
    });
    
    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ Weather Forecast API: Failed');
    console.log('   Error:', error.response?.data?.message || error.message);
    return { success: false, error: error.message };
  }
}

async function testWeatherForCommute() {
  console.log('🚗 Testing Weather Impact on Commute...');
  
  try {
    // Get current weather
    const currentWeather = await testCurrentWeather();
    const forecast = await testWeatherForecast();
    
    if (!currentWeather.success || !forecast.success) {
      console.log('❌ Cannot assess weather impact - API calls failed');
      return false;
    }
    
    console.log('✅ Weather Analysis for Commute:');
    
    // Current conditions
    const current = currentWeather.data;
    const isCurrentlyRaining = current.weather[0].main.toLowerCase().includes('rain');
    const visibility = current.visibility;
    const temp = current.main.temp;
    
    // Forecast analysis
    const upcomingRain = forecast.data.list.slice(0, 2).some(f => 
      f.weather[0].main.toLowerCase().includes('rain')
    );
    
    // Impact assessment
    let impact = '☀️ Optimal driving conditions';
    let extraTime = 0;
    
    if (isCurrentlyRaining || upcomingRain) {
      impact = '⚠️ Rain expected - Allow extra time';
      extraTime = 20; // 20 minutes extra
    } else if (visibility < 5000) {
      impact = '🌫️ Low visibility - Drive carefully';
      extraTime = 10;
    } else if (temp > 35) {
      impact = '🔥 Very hot - AC usage may affect traffic';
      extraTime = 5;
    }
    
    console.log('   Impact:', impact);
    console.log('   Extra time needed:', extraTime + ' minutes');
    console.log('   Current temp:', temp + '°C');
    console.log('   Visibility:', visibility + 'm');
    
    return { 
      success: true, 
      impact, 
      extraTime, 
      isRaining: isCurrentlyRaining || upcomingRain 
    };
    
  } catch (error) {
    console.log('❌ Weather commute analysis failed:', error.message);
    return { success: false };
  }
}

async function runWeatherTests() {
  console.log('🌤️ OpenWeatherMap API Test for Smart Commute Assistant\n');
  console.log('='.repeat(60));
  
  // Check configuration
  if (WEATHER_CONFIG.apiKey === 'YOUR_OPENWEATHER_API_KEY_HERE') {
    console.log('❌ Please update WEATHER_CONFIG with your OpenWeatherMap API key!');
    console.log('\n📝 Steps to get your API key:');
    console.log('1. Go to https://openweathermap.org/api');
    console.log('2. Sign up for free account');
    console.log('3. Go to API Keys tab');
    console.log('4. Copy your default API key');
    console.log('5. Wait 10-60 minutes for activation');
    console.log('6. Update this script and run again');
    return;
  }
  
  console.log('🧪 Running Weather API Tests:\n');
  
  const results = {
    current: await testCurrentWeather(),
    forecast: await testWeatherForecast(),
    commute: await testWeatherForCommute()
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📋 WEATHER API TEST RESULTS:');
  console.log('='.repeat(60));
  
  const passCount = Object.values(results).filter(r => r.success).length;
  console.log(`📊 Tests Passed: ${passCount}/3`);
  
  if (passCount === 3) {
    console.log('\n🎉 All weather API tests passed!');
    console.log('   Your weather integration is ready for Smart Commute Assistant!');
    
    console.log('\n💰 Usage & Cost:');
    console.log('   • Current plan: Free (1,000 calls/day)');
    console.log('   • Your usage: 8 calls/day');
    console.log('   • Monthly cost: $0.00 ✅');
    
    console.log('\n🔄 Next Steps:');
    console.log('   1. ✅ Update n8n workflow credentials');
    console.log('   2. ✅ Test weather nodes in n8n');
    console.log('   3. ✅ Verify weather data in decision engine');
    
  } else {
    console.log('\n🔧 Some tests failed. Common issues:');
    console.log('   • API key not activated yet (wait 10-60 minutes)');
    console.log('   • Invalid API key format');
    console.log('   • Network connectivity issues');
    console.log('   • Rate limit exceeded (unlikely with free tier)');
  }
}

// Usage
if (require.main === module) {
  console.log('📚 OpenWeatherMap API Test Script');
  console.log('Make sure to install axios: npm install axios\n');
  
  runWeatherTests();
}

module.exports = { 
  runWeatherTests, 
  testCurrentWeather, 
  testWeatherForecast, 
  testWeatherForCommute,
  WEATHER_CONFIG 
};
```

## 🔧 **Integration with n8n Workflow**

### **Update Your n8n Weather Nodes:**

**Weather Check Node:**
```json
{
  "url": "https://api.openweathermap.org/data/2.5/weather",
  "method": "GET",
  "queryParameters": {
    "q": "Bangalore,IN",
    "appid": "{{$credentials.openWeatherApi.apiKey}}",
    "units": "metric"
  }
}
```

**Weather Forecast Node:**
```json
{
  "url": "https://api.openweathermap.org/data/2.5/forecast",
  "method": "GET", 
  "queryParameters": {
    "q": "Bangalore,IN",
    "appid": "{{$credentials.openWeatherApi.apiKey}}",
    "units": "metric",
    "cnt": "8"
  }
}
```

### **Create n8n Credential:**
1. **Settings** → **Credentials** → **Add Credential**
2. **Type**: Generic Credential
3. **Name**: OpenWeather API
4. **Fields**:
   - `apiKey`: Your OpenWeatherMap API key

## 🌧️ **Weather Impact on Bangalore Traffic**

### **Rain Impact Analysis:**
```javascript
// In your n8n Decision Engine, use this logic:
const weatherImpact = {
  'clear sky': { delay: 0, message: '☀️ Clear conditions' },
  'few clouds': { delay: 0, message: '⛅ Partly cloudy' },
  'light rain': { delay: 15, message: '🌧️ Light rain - Allow 15 extra minutes' },
  'moderate rain': { delay: 25, message: '🌧️ Moderate rain - Allow 25 extra minutes' },
  'heavy rain': { delay: 40, message: '⛈️ Heavy rain - Consider delaying commute' },
  'thunderstorm': { delay: 60, message: '⛈️ Thunderstorm - Stay home if possible' }
};
```

### **Bangalore-Specific Weather Patterns:**
- **Monsoon Season**: June - September (frequent rain)
- **Winter**: December - February (cool, clear)
- **Summer**: March - May (hot, occasional thunderstorms)
- **Rush hour rain**: Causes 2-3x longer commutes

## 💰 **Cost Calculator**

### **Free Tier Breakdown:**
- **Daily limit**: 1,000 calls
- **Monthly limit**: ~30,000 calls
- **Your usage**: 240 calls/month
- **Utilization**: 0.8% of free tier
- **Cost**: $0.00

### **If You Need More:**
- **Startup Plan**: $40/month for 100,000 calls
- **Developer Plan**: $180/month for 1M calls
- **Your break-even**: 4,166 calls/day (way above your needs!)

## 🚨 **Common Issues & Solutions**

### **"Invalid API Key" Error:**
- ✅ Wait 10-60 minutes after signup
- ✅ Check API key format (no extra spaces)
- ✅ Verify account email is confirmed

### **"City Not Found" Error:**
- ✅ Use "Bangalore,IN" instead of just "Bangalore"
- ✅ Try coordinates: `lat=12.9716&lon=77.5946`

### **Rate Limit Exceeded:**
- ✅ You're making too many requests (unlikely with 8/day)
- ✅ Check for infinite loops in n8n workflow

### **No Weather Data:**
- ✅ API might be temporarily down
- ✅ Check OpenWeatherMap status page
- ✅ Verify internet connectivity

## 🎯 **Advanced Features**

### **Weather Alerts:**
```javascript
// Get severe weather alerts
const alertsUrl = 'https://api.openweathermap.org/data/2.5/onecall';
const params = {
  lat: 12.9716,
  lon: 77.5946,
  appid: apiKey,
  exclude: 'minutely,hourly,daily'
};
```

### **Historical Weather:**
- Available in paid plans
- Useful for traffic pattern analysis
- Compare "same day last year" for predictions

### **Weather Maps:**
- Radar maps for rain visualization
- Wind maps for dust storm alerts
- Temperature maps for heat wave warnings

## ✅ **Quick Setup Checklist**

- [ ] OpenWeatherMap account created
- [ ] Email verified
- [ ] API key copied (wait for activation)
- [ ] Test script runs successfully
- [ ] n8n credentials configured
- [ ] Weather nodes updated in workflow
- [ ] Weather impact logic added to decision engine

## 🎉 **You're All Set!**

Your Weather API integration will now provide:
- ✅ **Real-time weather conditions**
- ✅ **3-hour rain forecasts**
- ✅ **Traffic impact analysis**
- ✅ **Commute time adjustments**
- ✅ **$0 monthly cost**

Combined with Bright Data and Google Maps, your Smart Commute Assistant now has complete environmental intelligence! 🌤️🚗✨
