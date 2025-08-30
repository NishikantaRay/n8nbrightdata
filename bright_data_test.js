// Bright Data API Test Script for Smart Commute Assistant
// Run this in Node.js to test your Bright Data setup

const axios = require('axios');

// Configuration - Replace with your actual credentials
const BRIGHT_DATA_CONFIG = {
  apiToken: 'Your_Bright_Data_API_Token', // Get from Bright Data dashboard
  baseUrl: 'https://brightdata.com/api/collect',
  zone: 'YOUR_ZONE_NAME', // e.g., 'smart_commute_zone'
  country: 'IN'
};

// Test 1: News Scraping
async function testNewsScraping() {
  console.log('🗞️  Testing News Scraping...');
  
  try {
    const response = await axios.post(BRIGHT_DATA_CONFIG.baseUrl, {
      url: 'https://timesofindia.indiatimes.com/city/bengaluru',
      format: 'json',
      country: BRIGHT_DATA_CONFIG.country,
      session_id: 'test_news_' + Date.now(),
      wait_for: 'networkidle',
      extract: {
        articles: {
          selector: '.content .story-list .story, article',
          type: 'list',
          fields: {
            title: 'h1, h2, h3, .headline',
            url: 'a@href',
            content: '.brief, .summary, .excerpt, p',
            timestamp: '.time, .date, time'
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${BRIGHT_DATA_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ News scraping successful!');
    console.log('Articles found:', response.data?.articles?.length || 0);
    console.log('Sample article:', response.data?.articles?.[0]?.title || 'No articles');
    return true;
  } catch (error) {
    console.error('❌ News scraping failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 2: Social Media Scraping
async function testSocialScraping() {
  console.log('🐦 Testing Social Media Scraping...');
  
  try {
    const response = await axios.post(BRIGHT_DATA_CONFIG.baseUrl, {
      url: 'https://twitter.com/search?q=%23BengaluruTraffic',
      format: 'json',
      country: BRIGHT_DATA_CONFIG.country,
      session_id: 'test_social_' + Date.now(),
      wait_for: 'networkidle',
      extract: {
        tweets: {
          selector: '[data-testid="tweet"]',
          type: 'list',
          fields: {
            text: '[data-testid="tweetText"]',
            username: '[data-testid="User-Name"] span',
            timestamp: 'time@datetime'
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${BRIGHT_DATA_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Social media scraping successful!');
    console.log('Tweets found:', response.data?.tweets?.length || 0);
    console.log('Sample tweet:', response.data?.tweets?.[0]?.text?.substring(0, 100) || 'No tweets');
    return true;
  } catch (error) {
    console.error('❌ Social media scraping failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Official Traffic Data
async function testOfficialTraffic() {
  console.log('🚦 Testing Official Traffic Data...');
  
  try {
    const response = await axios.post(BRIGHT_DATA_CONFIG.baseUrl, {
      url: 'https://trafficpolicebangalore.gov.in',
      format: 'json',
      country: BRIGHT_DATA_CONFIG.country,
      session_id: 'test_official_' + Date.now(),
      wait_for: 'networkidle',
      extract: {
        updates: {
          selector: '.traffic-update, .news-item, .announcement, .content',
          type: 'list',
          fields: {
            title: 'h1, h2, h3, .title',
            message: '.content, .description, p',
            timestamp: '.date, .time, time'
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${BRIGHT_DATA_CONFIG.apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Official traffic data scraping successful!');
    console.log('Updates found:', response.data?.updates?.length || 0);
    console.log('Sample update:', response.data?.updates?.[0]?.title || 'No updates');
    return true;
  } catch (error) {
    console.error('❌ Official traffic scraping failed:', error.response?.data || error.message);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Bright Data API Tests for Smart Commute Assistant\n');
  
  // Check configuration
  if (BRIGHT_DATA_CONFIG.apiToken === 'YOUR_API_TOKEN_HERE') {
    console.error('❌ Please update BRIGHT_DATA_CONFIG with your actual API token!');
    console.log('\n📝 Steps to get your API token:');
    console.log('1. Go to https://brightdata.com');
    console.log('2. Sign up or log in');
    console.log('3. Create a new "Scraping Browser" zone');
    console.log('4. Copy your API token from the dashboard');
    console.log('5. Update this script with your credentials');
    return;
  }

  const results = {
    news: await testNewsScraping(),
    social: await testSocialScraping(),
    official: await testOfficialTraffic()
  };

  console.log('\n📊 Test Summary:');
  console.log('News Scraping:', results.news ? '✅ PASS' : '❌ FAIL');
  console.log('Social Media:', results.social ? '✅ PASS' : '❌ FAIL');
  console.log('Official Traffic:', results.official ? '✅ PASS' : '❌ FAIL');

  const passCount = Object.values(results).filter(r => r).length;
  console.log(`\n🎯 Overall: ${passCount}/3 tests passed`);

  if (passCount === 3) {
    console.log('\n🎉 All tests passed! Your Bright Data setup is ready for the Smart Commute Assistant.');
    console.log('\n🔄 Next steps:');
    console.log('1. Update the n8n workflow with your API credentials');
    console.log('2. Replace the placeholder URLs with the Bright Data endpoint');
    console.log('3. Test the complete n8n workflow');
  } else {
    console.log('\n🔧 Some tests failed. Please check:');
    console.log('1. Your API token is correct and active');
    console.log('2. Your Bright Data zone is properly configured');
    console.log('3. You have sufficient credits/quota');
    console.log('4. The target websites are accessible');
  }
}

// Usage instructions
console.log('📚 How to use this test script:');
console.log('1. Install axios: npm install axios');
console.log('2. Update BRIGHT_DATA_CONFIG with your credentials');
console.log('3. Run: node bright_data_test.js\n');

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, testNewsScraping, testSocialScraping, testOfficialTraffic };
