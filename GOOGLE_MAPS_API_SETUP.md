# Google Maps API Setup Guide for Smart Commute Assistant

## 🆓 **Is Google Maps API Free?**

**YES!** Google Maps API has a generous free tier:

### **Free Tier Benefits:**
- **$200 monthly credit** (automatically applied)
- **Directions API**: ~40,000 requests/month FREE
- **Places API**: ~17,000 requests/month FREE  
- **Geocoding API**: ~40,000 requests/month FREE
- **No credit card required** for basic usage

### **Your Smart Commute Usage:**
- **4 requests/day** (morning & evening commute)
- **120 requests/month** total
- **Cost**: $0.00 (well within free limits!) ✅

## 🚀 **Step-by-Step Setup Process**

### **Step 1: Create Google Cloud Account**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with your Google account
3. Accept terms and create your first project
4. Project name: `smart-commute-assistant`

### **Step 2: Enable Required APIs**
1. **Navigate to APIs & Services** → **Library**
2. **Search and Enable these APIs:**
   - ✅ **Directions API** (for route calculations)
   - ✅ **Places API** (for address validation)
   - ✅ **Geocoding API** (for address to coordinates)
   - ✅ **Maps JavaScript API** (for map displays)

### **Step 3: Create API Key**
1. **Go to APIs & Services** → **Credentials**
2. **Click "Create Credentials"** → **API Key**
3. **Copy your API key** (starts with `AIza...`)
4. **Important**: Restrict your API key for security!

### **Step 4: Restrict Your API Key (IMPORTANT!)**
1. **Click on your API key** to edit
2. **API Restrictions** → Select:
   - Directions API
   - Places API  
   - Geocoding API
   - Maps JavaScript API
3. **Application Restrictions** → Choose:
   - **HTTP referrers** (for web apps)
   - **IP addresses** (for server apps)
   - **None** (for testing only)

## 🔐 **API Key Security Best Practices**

### **For Production:**
```javascript
// ❌ DON'T do this (exposed in frontend)
const apiKey = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// ✅ DO this (use environment variables)
const apiKey = process.env.GOOGLE_MAPS_API_KEY;
```

### **Restrict by Referrer:**
- Add your domain: `yourdomain.com/*`
- For localhost testing: `localhost:*`

### **Monitor Usage:**
- Check **APIs & Services** → **Quotas**
- Set up billing alerts at $10, $50, $100

## 📍 **API Endpoints for Smart Commute**

### **1. Directions API (Main)**
```
GET https://maps.googleapis.com/maps/api/directions/json
```

**Parameters:**
- `origin`: Home address
- `destination`: Office address  
- `alternatives`: true (get multiple routes)
- `departure_time`: now (for real-time traffic)
- `traffic_model`: best_guess
- `key`: YOUR_API_KEY

**Example Request:**
```
https://maps.googleapis.com/maps/api/directions/json?origin=Koramangala,Bangalore&destination=Electronic+City,Bangalore&alternatives=true&departure_time=now&traffic_model=best_guess&key=YOUR_API_KEY
```

### **2. Geocoding API (Address Validation)**
```
GET https://maps.googleapis.com/maps/api/geocode/json
```

**Use Case:** Convert "Koramangala, Bangalore" to coordinates

### **3. Places API (Address Suggestions)**
```
GET https://maps.googleapis.com/maps/api/place/autocomplete/json
```

**Use Case:** Help users enter accurate addresses

## 🧪 **Test Your Google Maps API**

Create this test file: `google_maps_test.js`

```javascript
const axios = require('axios');

const GOOGLE_MAPS_CONFIG = {
  apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual key
  baseUrl: 'https://maps.googleapis.com/maps/api'
};

async function testDirectionsAPI() {
  console.log('🗺️  Testing Google Maps Directions API...');
  
  try {
    const response = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/directions/json`, {
      params: {
        origin: 'Koramangala, Bangalore, India',
        destination: 'Electronic City, Bangalore, India',
        alternatives: true,
        departure_time: 'now',
        traffic_model: 'best_guess',
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Directions API working!');
      console.log('Routes found:', response.data.routes.length);
      console.log('Duration:', response.data.routes[0].legs[0].duration.text);
      console.log('Distance:', response.data.routes[0].legs[0].distance.text);
      return true;
    } else {
      console.error('❌ API Error:', response.data.status, response.data.error_message);
      return false;
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    return false;
  }
}

async function testGeocodingAPI() {
  console.log('📍 Testing Geocoding API...');
  
  try {
    const response = await axios.get(`${GOOGLE_MAPS_CONFIG.baseUrl}/geocode/json`, {
      params: {
        address: 'Koramangala, Bangalore, India',
        key: GOOGLE_MAPS_CONFIG.apiKey
      }
    });

    if (response.data.status === 'OK') {
      console.log('✅ Geocoding API working!');
      const location = response.data.results[0].geometry.location;
      console.log('Coordinates:', `${location.lat}, ${location.lng}`);
      return true;
    } else {
      console.error('❌ Geocoding Error:', response.data.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Geocoding failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Testing Google Maps API Setup\n');
  
  if (GOOGLE_MAPS_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please add your Google Maps API key!');
    return;
  }

  const directionsTest = await testDirectionsAPI();
  const geocodingTest = await testGeocodingAPI();

  console.log('\n📊 Results:');
  console.log('Directions API:', directionsTest ? '✅ PASS' : '❌ FAIL');
  console.log('Geocoding API:', geocodingTest ? '✅ PASS' : '❌ FAIL');

  if (directionsTest && geocodingTest) {
    console.log('\n🎉 Google Maps API is ready for your Smart Commute Assistant!');
  }
}

runTests();
```

## 💰 **Cost Calculator**

### **Smart Commute Assistant Usage:**
- **Morning commute**: 2 API calls (7AM, 8AM)
- **Evening commute**: 2 API calls (5PM, 6PM) 
- **Daily total**: 4 calls
- **Monthly total**: 120 calls

### **Directions API Pricing:**
- **Free tier**: First 40,000 requests/month
- **Your usage**: 120 requests/month
- **Cost**: $0.00 ✅

### **If You Exceed Free Tier:**
- **$0.005 per request** after 40,000
- **Break-even**: 40,000 requests = 333 requests/day
- **Your usage**: 4 requests/day (way below limit!)

## 🔧 **Integration with n8n Workflow**

### **Update Your n8n Nodes:**

**Google Maps - Primary Routes Node:**
```json
{
  "url": "https://maps.googleapis.com/maps/api/directions/json",
  "method": "GET",
  "queryParameters": {
    "origin": "{{$vars.HOME_ADDRESS}}",
    "destination": "{{$vars.OFFICE_ADDRESS}}",
    "alternatives": "true",
    "departure_time": "now",
    "traffic_model": "best_guess",
    "key": "{{$credentials.googleMapsApi.apiKey}}"
  }
}
```

**Google Maps - Alternative Routes Node:**
```json
{
  "url": "https://maps.googleapis.com/maps/api/directions/json", 
  "method": "GET",
  "queryParameters": {
    "origin": "{{$vars.HOME_ADDRESS}}",
    "destination": "{{$vars.OFFICE_ADDRESS}}",
    "alternatives": "true",
    "avoid": "highways",
    "departure_time": "now",
    "key": "{{$credentials.googleMapsApi.apiKey}}"
  }
}
```

### **Create n8n Credential:**
1. **Settings** → **Credentials** → **Add Credential**
2. **Type**: Generic Credential
3. **Name**: Google Maps API
4. **Fields**:
   - `apiKey`: Your Google Maps API key

## 🚨 **Common Issues & Solutions**

### **"API Key Invalid" Error:**
- ✅ Check if APIs are enabled
- ✅ Verify API key restrictions
- ✅ Wait 5-10 minutes after creating key

### **"Quota Exceeded" Error:**
- ✅ Check quotas in Google Cloud Console
- ✅ Enable billing (won't charge within free tier)
- ✅ Request quota increase if needed

### **"Request Denied" Error:**
- ✅ Add proper HTTP referrer restrictions
- ✅ Check IP address restrictions
- ✅ Verify API permissions

### **No Traffic Data:**
- ✅ Use `departure_time: "now"`
- ✅ Enable `traffic_model: "best_guess"`
- ✅ Check if route supports traffic data

## 🎯 **Advanced Features**

### **Multiple Transportation Modes:**
```javascript
// Car (default)
mode: "driving"

// Public transport  
mode: "transit"

// Walking
mode: "walking"

// Cycling
mode: "bicycling"
```

### **Avoid Specific Features:**
```javascript
avoid: "tolls,highways,ferries"
```

### **Optimize for:**
```javascript
// Fastest route
traffic_model: "optimistic"

// Most realistic 
traffic_model: "best_guess"

// Worst case scenario
traffic_model: "pessimistic"
```

## 📈 **Monitoring & Optimization**

### **Track Usage:**
1. **Google Cloud Console** → **APIs & Services** → **Quotas**
2. Set up **billing alerts**
3. Monitor **API performance**

### **Optimize Requests:**
1. **Cache results** for 15-30 minutes
2. **Batch similar requests**
3. **Use webhooks** instead of polling

### **Scale Up Options:**
1. **Premium Plan**: More quotas and features
2. **Google Maps Platform**: Enterprise support
3. **Multiple API keys**: Distribute load

## ✅ **Quick Checklist**

- [ ] Google Cloud account created
- [ ] Project created (`smart-commute-assistant`)
- [ ] Directions API enabled
- [ ] Places API enabled  
- [ ] Geocoding API enabled
- [ ] API key created and copied
- [ ] API key restrictions configured
- [ ] Test script runs successfully
- [ ] n8n credentials configured
- [ ] Workflow updated with real API endpoints

## 🎉 **You're All Set!**

Your Google Maps API is now ready to power the Smart Commute Assistant with:
- ✅ **Real-time traffic data**
- ✅ **Multiple route options** 
- ✅ **Alternative paths**
- ✅ **Accurate travel times**
- ✅ **$0 monthly cost** (within free limits)

The combination of **Bright Data** (for real-time alerts) + **Google Maps API** (for route intelligence) will make your commute assistant incredibly smart! 🚗🧠✨
