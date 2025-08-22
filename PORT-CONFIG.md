# KRE8-Styler Lab Port Configuration

## 🚀 Dedicated Port: 3009

This application is configured to **ALWAYS** run on port **3009**.

### Access URLs:
- Development: http://localhost:3009
- All pages: http://localhost:3009/*

### Configuration Files:
1. **package.json** - Scripts configured with `-p 3009`
2. **.env.local** - PORT=3009 environment variable
3. **next.config.ts** - Port hardcoded in config

### Commands:
```bash
# Start development server (always on port 3009)
npm run dev

# Start production server (always on port 3009)
npm run start
```

### Why Port 3009?
- Dedicated port prevents conflicts
- Consistent URL for bookmarks and shortcuts
- Easy to remember
- No more port jumping!

---
*Port 3009 is hardcoded throughout the application to ensure consistency.*