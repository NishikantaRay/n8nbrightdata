# Bright Data API Configuration for n8n Smart Commute Assistant

## 📝 Replace These URLs in Your n8n Workflow

### 1. News Scraper - Traffic Updates Node
**Current Placeholder:**
```
https://brightdata-endpoint.com/news-scraper
```

**Replace with your actual Bright Data Collector URL:**
```
https://brightdata.com/api/collect
```

**Body Parameters to Update:**
```json
{
  "url": "https://timesofindia.indiatimes.com/city/bengaluru/traffic",
  "format": "json",
  "country": "IN",
  "session_id": "bangalore_traffic_news",
  "wait_for": "networkidle",
  "extract": {
    "articles": {
      "selector": ".content article, .story-list .story",
      "type": "list",
      "fields": {
        "title": "h1, h2, h3, .headline",
        "url": "a@href",
        "content": ".brief, .summary, .excerpt",
        "timestamp": ".time, .date, time"
      }
    }
  },
  "sites": [
    "timesofindia.indiatimes.com/city/bengaluru",
    "deccanherald.com/bangalore",
    "thehindu.com/news/cities/bangalore",
    "bangaloremirror.indiatimes.com"
  ],
  "keywords": [
    "bangalore traffic", 
    "bengaluru traffic", 
    "road closure", 
    "accident", 
    "protest", 
    "bandh", 
    "metro", 
    "BMTC",
    "traffic jam",
    "waterlogging"
  ]
}
```

### 2. Social Media Scraper Node
**Current Placeholder:**
```
https://brightdata-endpoint.com/social-scraper
```

**Replace with:**
```
https://brightdata.com/api/collect
```

**Body Parameters:**
```json
{
  "url": "https://twitter.com/search?q=%23BengaluruTraffic%20OR%20%23BangaloreTraffic%20OR%20%23BlrTraffic",
  "format": "json",
  "country": "IN",
  "session_id": "bangalore_social_traffic",
  "wait_for": "networkidle",
  "extract": {
    "tweets": {
      "selector": "[data-testid='tweet']",
      "type": "list",
      "fields": {
        "text": "[data-testid='tweetText']",
        "username": "[data-testid='User-Name'] span:first-child",
        "handle": "[data-testid='User-Name'] span:last-child",
        "timestamp": "time@datetime",
        "replies": "[data-testid='reply'] span",
        "retweets": "[data-testid='retweet'] span",
        "likes": "[data-testid='like'] span"
      }
    }
  },
  "keywords": [
    "Outer Ring Road",
    "ORR", 
    "Electronic City",
    "Whitefield",
    "Koramangala",
    "Indiranagar", 
    "HSR Layout",
    "Silk Board",
    "KR Puram",
    "accident",
    "jam",
    "stuck",
    "waterlogging",
    "traffic"
  ]
}
```

### 3. Official Traffic Data Scraper Node
**Current Placeholder:**
```
https://brightdata-endpoint.com/traffic-monitor
```

**Replace with:**
```
https://brightdata.com/api/collect
```

**Body Parameters:**
```json
{
  "urls": [
    "https://trafficpolicebangalore.gov.in",
    "https://bangaloretrafficpolice.gov.in/content/traffic-updates",
    "https://karnataka.gov.in/transport"
  ],
  "format": "json",
  "country": "IN",
  "session_id": "bangalore_official_traffic",
  "wait_for": "networkidle",
  "extract": {
    "updates": {
      "selector": ".traffic-update, .news-item, .announcement",
      "type": "list",
      "fields": {
        "title": "h1, h2, h3, .title",
        "message": ".content, .description, p",
        "severity": ".priority, .level, .type",
        "timestamp": ".date, .time, time",
        "location": ".location, .area"
      }
    }
  }
}
```

## 🔐 Authentication Headers for All Requests

Add these headers to each HTTP Request node:

```json
{
  "Authorization": "Bearer {{$credentials.brightDataApi.token}}",
  "Content-Type": "application/json",
  "X-Brightdata-Zone": "{{$credentials.brightDataApi.zone}}",
  "X-Brightdata-Session": "smart-commute-{{$workflow.id}}"
}
```

## 🚀 Quick Setup Steps

### Step 1: Get Your Bright Data Credentials
1. Sign up at [brightdata.com](https://brightdata.com)
2. Create a new "Scraping Browser" zone
3. Note down:
   - API Token
   - Zone name
   - Username
   - Password

### Step 2: Create n8n Credential
1. In n8n: Settings → Credentials → Add Credential
2. Create "HTTP Header Auth" credential named "Bright Data API"
3. Add headers:
   ```
   Authorization: Bearer YOUR_API_TOKEN
   Content-Type: application/json
   ```

### Step 3: Update n8n Nodes
1. **News Scraper Node:**
   - URL: `https://brightdata.com/api/collect`
   - Method: POST
   - Add authentication: Bright Data API credential
   - Body: Use the news scraper JSON above

2. **Social Media Scraper Node:**
   - URL: `https://brightdata.com/api/collect`
   - Method: POST
   - Add authentication: Bright Data API credential
   - Body: Use the social media JSON above

3. **Official Traffic Scraper Node:**
   - URL: `https://brightdata.com/api/collect`
   - Method: POST
   - Add authentication: Bright Data API credential
   - Body: Use the official traffic JSON above

## 💡 Pro Tips

### For Better Results:
1. **Add Delays**: Add 2-3 second delays between requests
2. **Rotate Sessions**: Use unique session IDs for each request
3. **Handle Errors**: Enable "Continue on Fail" for all HTTP nodes
4. **Cache Results**: Consider caching data for 15-30 minutes

### Cost Optimization:
1. **Free Tier First**: Start with Bright Data's free tier
2. **Batch Requests**: Combine multiple sites in single request when possible
3. **Smart Scheduling**: Run only during peak traffic hours
4. **Data Filtering**: Only extract relevant traffic data

### Monitoring:
1. **Check Usage**: Monitor your Bright Data dashboard daily
2. **Set Alerts**: Configure billing alerts
3. **Log Requests**: Keep track of successful vs failed requests

## 🆘 Alternative: Free/Low-Cost Options

If Bright Data is too expensive, consider these alternatives:

### 1. Direct RSS Feeds
- Times of India RSS: `https://timesofindia.indiatimes.com/rssfeeds/2647163.cms`
- The Hindu RSS: `https://www.thehindu.com/news/cities/bangalore/feeder/default.rss`

### 2. Public APIs
- Twitter API v2 (Basic plan: $100/month)
- News API (500 requests/day free)

### 3. Simple Web Scraping
- Use n8n's built-in HTML extraction
- Target mobile versions of sites (faster, simpler)

## 🔄 Testing Your Setup

Use this test request in Postman or curl:

```bash
curl -X POST "https://brightdata.com/api/collect" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://timesofindia.indiatimes.com/city/bengaluru",
    "format": "json",
    "extract": {
      "headlines": {
        "selector": "h3 a",
        "type": "list"
      }
    }
  }'
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "headlines": [
      "Traffic snarls on ORR due to ongoing metro work",
      "Monsoon brings waterlogging woes to Electronic City",
      "New flyover opens at Silk Board junction"
    ]
  }
}
```

You're all set! 🎉 Your Smart Commute Assistant will now have real-time traffic intelligence powered by Bright Data.
