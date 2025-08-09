# 🌐 StudyBuddy Web Hosting Guide

This guide explains how to properly host the StudyBuddy web application for production use with the Android app.

## 📁 Recommended Web Hosting File Structure

```
your-domain.com/
├── 📄 index.html                    # Main application entry point
├── 🎨 styles.css                    # All CSS styles and animations
├── ⚙️ script.js                     # Main JavaScript functionality
├── 📱 manifest.json                 # PWA manifest for web app features
├── 🔧 sw.js                        # Service worker for offline functionality
├── 🔒 .htaccess                    # Apache server configuration (if using Apache)
├── 📋 robots.txt                   # Search engine instructions
├── 🗂️ assets/                      # Static assets directory
│   ├── 🖼️ images/                  # Image files
│   │   ├── logo.png                # App logo (512x512 recommended)
│   │   ├── favicon.ico             # Browser favicon
│   │   ├── apple-touch-icon.png    # iOS home screen icon
│   │   └── og-image.png            # Social media preview image
│   ├── 🔤 fonts/                   # Custom fonts (optional)
│   └── 🔊 sounds/                  # Audio files (optional)
├── 🔐 ssl/                         # SSL certificates (if self-managed)
├── 📊 logs/                        # Server logs (keep private)
└── 🛠️ admin/                       # Admin panel (optional, keep secure)
```

## 🚀 Deployment Steps

### 1. **Prepare Your Files**

**Essential Files to Upload:**
```bash
# Core application files (REQUIRED)
index.html      # Main app interface
styles.css      # All styling and animations  
script.js       # Core functionality with Gemini integration
manifest.json   # PWA features
sw.js          # Offline functionality

# Configuration files (RECOMMENDED)
.htaccess      # Server configuration
robots.txt     # SEO configuration
```

**Update Configuration:**
```javascript
// In script.js, update the URL in MainActivity.java:
const STUDYBUDDY_URL = "https://your-actual-domain.com";

// In MainActivity.java, update:
private static final String STUDYBUDDY_URL = "https://your-actual-domain.com";
```

### 2. **Choose a Hosting Provider**

**Recommended Hosting Services:**

#### 🟢 **Free Options (Good for Testing)**
- **Netlify** - Best for beginners
- **Vercel** - Great for developers  
- **GitHub Pages** - Perfect for open source
- **Firebase Hosting** - Google's platform

#### 🟡 **Paid Options (Better for Production)**
- **Cloudflare Pages** - Fast global CDN
- **AWS S3 + CloudFront** - Enterprise scale
- **DigitalOcean App Platform** - Developer-friendly
- **Heroku** - Easy deployment

#### 🔵 **Traditional Web Hosting**
- **Bluehost** - Popular shared hosting
- **SiteGround** - Good performance
- **Hostinger** - Budget-friendly
- **GoDaddy** - Well-known provider

### 3. **Domain Configuration**

**Purchase a Domain:**
- Choose a memorable name (e.g., `studybuddy-app.com`)
- Consider kid-friendly domains (`.edu`, `.org` for credibility)
- Avoid complex spellings

**DNS Configuration:**
```dns
Type    Name    Value                   TTL
A       @       YOUR_SERVER_IP         300
CNAME   www     your-domain.com        300
```

### 4. **SSL Certificate Setup**

**Free SSL Options:**
- **Let's Encrypt** (Most hosting providers support this)
- **Cloudflare SSL** (Free tier available)
- **ZeroSSL** (Alternative to Let's Encrypt)

**Why SSL is Required:**
- Android WebView requires HTTPS for many features
- Voice input only works on secure connections
- Google Play Store requires secure connections
- Better SEO rankings

## 🔧 Server Configuration Files

### `.htaccess` (For Apache Servers)

```apache
# StudyBuddy .htaccess Configuration

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://generativelanguage.googleapis.com;"
</IfModule>

# Force HTTPS
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

# PWA support
<IfModule mod_mime.c>
    AddType application/manifest+json .webmanifest
    AddType application/x-web-app-manifest+json .webapp
    AddType text/cache-manifest .appcache
</IfModule>

# Handle SPA routing (if needed)
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

### `robots.txt`

```txt
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://your-domain.com/sitemap.xml

# Disallow sensitive areas
Disallow: /admin/
Disallow: /logs/
Disallow: /ssl/
Disallow: /.git/
```

## 📱 Android App Configuration

### Update MainActivity.java

```java
public class MainActivity extends AppCompatActivity {
    // Replace with your actual domain
    private static final String STUDYBUDDY_URL = "https://your-domain.com";
    
    // Update the domain check in WebViewClient
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();
        
        // Handle your domain URLs in WebView
        if (url.contains("your-domain.com")) {  // Update this
            return false; // Load in WebView
        }
        
        // Open external URLs in browser
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
        startActivity(intent);
        return true;
    }
}
```

### Update AndroidManifest.xml

```xml
<!-- Update the intent filter with your domain -->
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
        android:host="your-domain.com" />  <!-- Update this -->
</intent-filter>
```

## 🔒 Security Best Practices

### 1. **Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://generativelanguage.googleapis.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data:; 
               connect-src 'self' https://generativelanguage.googleapis.com;">
```

### 2. **Environment Variables**
Never expose API keys in client-side code. Consider using:
- Server-side proxy for API calls
- Environment-specific configuration
- Secure key management services

### 3. **Rate Limiting**
Implement rate limiting to prevent abuse:
- Limit API calls per user/IP
- Implement CAPTCHA for suspicious activity
- Monitor usage patterns

## 📊 Performance Optimization

### 1. **File Optimization**
```bash
# Minify CSS and JavaScript
npm install -g clean-css-cli uglify-js

# Minify CSS
cleancss -o styles.min.css styles.css

# Minify JavaScript
uglifyjs script.js -o script.min.js -c -m
```

### 2. **Image Optimization**
- Use WebP format for better compression
- Implement lazy loading for images
- Provide multiple sizes for responsive design

### 3. **CDN Setup**
Use a Content Delivery Network for global performance:
- Cloudflare (Free tier available)
- AWS CloudFront
- Google Cloud CDN

## 🔍 Testing Your Deployment

### 1. **Functionality Tests**
```bash
# Test basic connectivity
curl -I https://your-domain.com

# Test SSL certificate
openssl s_client -connect your-domain.com:443

# Test mobile responsiveness
# Use browser dev tools mobile simulation
```

### 2. **Performance Tests**
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse audit

### 3. **Security Tests**
- SSL Labs SSL Test
- Security Headers scanner
- OWASP ZAP security testing

## 📈 Monitoring and Analytics

### 1. **Error Monitoring**
```javascript
// Add to script.js
window.addEventListener('error', function(e) {
    // Log errors to your monitoring service
    console.error('StudyBuddy Error:', e.error);
});
```

### 2. **Analytics Setup**
Consider privacy-friendly analytics:
- Google Analytics 4 (with privacy settings)
- Plausible Analytics
- Simple Analytics

### 3. **Uptime Monitoring**
- UptimeRobot (Free tier)
- Pingdom
- StatusCake

## 🚀 Deployment Automation

### GitHub Actions (Example)
```yaml
name: Deploy StudyBuddy
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to hosting
      run: |
        # Your deployment commands here
        rsync -avz --delete ./ user@server:/path/to/web/root/
```

## 🆘 Troubleshooting

### Common Issues:

**1. "Mixed Content" Errors**
- Ensure all resources load via HTTPS
- Update any HTTP links to HTTPS

**2. "CORS" Errors**
- Configure server to allow cross-origin requests
- Add proper CORS headers

**3. Service Worker Issues**
- Clear browser cache
- Check service worker registration
- Verify HTTPS requirement

**4. Android App Can't Load Site**
- Verify domain in MainActivity.java
- Check network security config
- Test SSL certificate validity

## 📞 Support Resources

- **Web Hosting Support**: Contact your hosting provider
- **Domain Issues**: Contact your domain registrar  
- **SSL Problems**: Check with certificate provider
- **Android Issues**: Review Android developer documentation

---

## 🎯 Quick Deployment Checklist

- [ ] Upload all core files (HTML, CSS, JS, manifest, SW)
- [ ] Configure domain and DNS
- [ ] Set up SSL certificate
- [ ] Update URLs in Android app
- [ ] Test functionality on mobile devices
- [ ] Configure server security headers
- [ ] Set up monitoring and analytics
- [ ] Test offline functionality
- [ ] Verify PWA installation works
- [ ] Submit to app stores if needed

**Your StudyBuddy web app is now ready for production! 🌟**