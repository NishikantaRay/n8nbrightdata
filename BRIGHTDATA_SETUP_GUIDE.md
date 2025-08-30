# Bright Data API Setup Guide for Smart Commute Assistant

## 🚀 Getting Started with Bright Data

### Step 1: Create a Bright Data Account
1. Go to [brightdata.com](https://brightdata.com)
2. Click "Get Started Free" or "Sign Up"
3. Complete the registration process
4. Verify your email address

### Step 2: Choose Your Plan
For the Smart Commute Assistant, you have several options:

#### **Recommended: Scraping Browser Plan**
- **Best for**: News sites, social media, government sites
- **Free Tier**: $0/month with limited requests
- **Pay-as-you-go**: Starting from $0.001 per request
- **Features**: 
  - JavaScript rendering
  - Anti-detection capabilities
  - CAPTCHA solving
  - Session management

#### **Alternative: Web Scraper IDE**
- **Best for**: Custom scraping logic
- **Free Tier**: Limited monthly requests
- **Features**:
  - Visual scraping interface
  - Pre-built templates
  - Data transformation

### Step 3: Get Your API Credentials

1. **Login to Bright Data Dashboard**
2. **Navigate to "Proxies & Scrapers"**
3. **Create a New Zone:**
   - Click "Add Zone"
   - Select "Datacenter" or "Residential" based on your needs
   - Choose "Scraping Browser" for best results
   - Name it: `smart-commute-scraper`

4. **Get Your Credentials:**
   - **Zone Name**: Copy your zone name
   - **Username**: Your Bright Data username
   - **Password**: Zone password (generate if needed)
   - **Endpoint**: Provided in the dashboard

### Step 4: Configure API Endpoints

For the Smart Commute Assistant, you'll need to set up these scraping targets:

#### **News Scraper Endpoint**
```
POST https://brightdata.com/api/collect
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_API_TOKEN",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "url": "https://timesofindia.indiatimes.com/city/bengaluru",
  "format": "json",
  "country": "IN",
  "session_id": "smart_commute_news",
  "wait_for": "networkidle",
  "extract": {
    "articles": {
      "selector": ".content .story-list .story",
      "type": "list",
      "fields": {
        "title": ".story-details h3 a",
        "url": ".story-details h3 a@href",
        "content": ".story-details .brief",
        "timestamp": ".story-details .time"
      }
    }
  }
}
```

#### **Social Media Scraper (Twitter)**
```json
{
  "url": "https://twitter.com/search?q=%23BengaluruTraffic",
  "format": "json",
  "country": "IN",
  "extract": {
    "tweets": {
      "selector": "[data-testid='tweet']",
      "type": "list",
      "fields": {
        "text": "[data-testid='tweetText']",
        "username": "[data-testid='User-Name'] span",
        "timestamp": "time",
        "retweets": "[data-testid='retweet'] span",
        "likes": "[data-testid='like'] span"
      }
    }
  }
}
```

### Step 5: Set Up n8n Credentials

1. **In n8n, go to Settings > Credentials**
2. **Create new credential type: "Bright Data API"**
3. **Add these fields:**
   - **API Token**: Your Bright Data API token
   - **Zone Username**: Your zone username  
   - **Zone Password**: Your zone password
   - **Endpoint**: Your scraping endpoint

### Step 6: Update the n8n Workflow

The workflow is already configured with placeholder endpoints. You need to:

1. **Replace the Bright Data URLs** in these nodes:
   - News Scraper - Traffic Updates
   - Social Media Scraper  
   - Official Traffic Data Scraper

2. **Update the endpoints** to your actual Bright Data collector URLs

### Step 7: Test Your Setup

#### **Test News Scraping:**
```bash
curl -X POST "https://brightdata.com/api/collect" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://timesofindia.indiatimes.com/city/bengaluru",
    "country": "IN",
    "format": "json"
  }'
```

#### **Expected Response:**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "title": "Traffic update: Heavy jam on ORR",
        "content": "Due to ongoing construction...",
        "timestamp": "2025-08-30T07:30:00Z"
      }
    ]
  }
}
```

## 🛠️ Alternative Setup: Using Bright Data Templates

If custom API setup is complex, use Bright Data's pre-built templates:

### **Available Templates:**
1. **News Website Scraper**
   - Template ID: `news_scraper_v2`
   - Supports: TOI, The Hindu, Deccan Herald

2. **Social Media Monitor**
   - Template ID: `social_monitor_v1`
   - Supports: Twitter, Facebook, Instagram

3. **Government Sites Scraper**
   - Template ID: `gov_sites_v1`
   - Supports: Traffic police sites, government portals

### **Using Templates:**
```json
{
  "template_id": "news_scraper_v2",
  "inputs": {
    "domain": "timesofindia.indiatimes.com",
    "keywords": ["bangalore traffic", "bengaluru traffic"],
    "time_range": "24h"
  }
}
```

## 💰 Cost Estimation for Smart Commute Assistant

### **Daily Usage:**
- **4 scheduled runs** (7AM, 8AM, 5PM, 6PM)
- **3 data sources** per run (news, social, official)
- **12 API calls per day**

### **Monthly Cost:**
- **Scraping Browser**: ~$0.012 per request
- **Daily cost**: 12 × $0.012 = $0.144
- **Monthly cost**: $0.144 × 30 = $4.32

### **Free Tier Alternative:**
- **Monthly limit**: 1,000 requests
- **Your usage**: ~360 requests/month
- **Cost**: $0 (within free tier)

## 🔧 Troubleshooting

### **Common Issues:**

1. **Rate Limiting**
   - Add delays between requests
   - Use session management

2. **CAPTCHA Challenges**
   - Enable CAPTCHA solving in Bright Data
   - Use residential proxies

3. **Data Not Loading**
   - Increase `wait_for` timeout
   - Use `wait_for: "networkidle"`

4. **IP Blocking**
   - Rotate IP addresses
   - Use different proxy types

### **Best Practices:**

1. **Respect Rate Limits**
   - Don't exceed 1 request per second per domain
   - Implement exponential backoff

2. **Use Caching**
   - Cache results for 15-30 minutes
   - Reduce redundant API calls

3. **Monitor Usage**
   - Set up billing alerts
   - Track API usage in dashboard

## 📞 Support

- **Bright Data Support**: support@brightdata.com
- **Documentation**: [docs.brightdata.com](https://docs.brightdata.com)
- **Community**: Bright Data Discord/Forum

## 🔄 Next Steps

1. ✅ Create Bright Data account
2. ✅ Set up API credentials  
3. ✅ Configure n8n credentials
4. ✅ Test scraping endpoints
5. ✅ Update workflow URLs
6. ✅ Run test execution
7. ✅ Monitor and optimize

Your Smart Commute Assistant will now have real-time data intelligence! 🚗✨
