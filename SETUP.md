# Framez Quick Setup Guide

Follow these steps to get Framez running on your machine.

## Step 1: Prerequisites Check

Ensure you have installed:
- ✅ Node.js (v16+): Run `node --version`
- ✅ npm: Run `npm --version`
- ✅ Git: Run `git --version`

## Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

This installs all required packages including:
- React Native & Expo
- Convex (backend)
- React Navigation
- Image Picker

## Step 3: Set Up Convex

### Option A: New Convex Project (Recommended)

1. Install Convex CLI globally:
\`\`\`bash
npm install -g convex
\`\`\`

2. Initialize Convex:
\`\`\`bash
npx convex dev
\`\`\`

3. Follow the prompts:
   - Choose "Create a new project"
   - Enter project name: "framez"
   - Select your team or create new one

4. The CLI will:
   - Create a Convex project
   - Push your schema and functions
   - Generate the `_generated` folder
   - Provide your deployment URL

5. Copy the deployment URL shown in the terminal

### Option B: Use Existing Convex Project

\`\`\`bash
npx convex dev --url YOUR_EXISTING_DEPLOYMENT_URL
\`\`\`

## Step 4: Configure Environment

1. Create `.env` file:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Edit `.env` and add your Convex URL:
\`\`\`
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
\`\`\`

## Step 5: Verify Convex Setup

Check that these folders/files were created:
- ✅ `convex/_generated/` directory
- ✅ `.convex/` directory (ignored by git)

If missing, run `npx convex dev` again.

## Step 6: Start Development Server

In a **new terminal window**, start Expo:

\`\`\`bash
npm start
\`\`\`

**Important**: Keep both terminals running:
- Terminal 1: `npx convex dev` (backend)
- Terminal 2: `npm start` (frontend)

## Step 7: Run on Device/Simulator

### iOS Simulator (Mac only)
\`\`\`bash
# Press 'i' in the Expo terminal, or:
npm run ios
\`\`\`

### Android Emulator
\`\`\`bash
# Press 'a' in the Expo terminal, or:
npm run android
\`\`\`

### Physical Device
1. Install Expo Go from App Store/Play Store
2. Scan QR code shown in terminal
3. App will load on your device

## Common Setup Issues

### Issue: "Cannot find module './_generated/server'"

**Solution**: Run `npx convex dev` first. This generates required files.

### Issue: "Convex client failed to connect"

**Solution**:
1. Check `.env` file has correct URL
2. Ensure `npx convex dev` is running
3. Restart Expo server: `npm start --clear`

### Issue: "Module not found: react-native-screens"

**Solution**:
\`\`\`bash
npx expo install react-native-screens react-native-safe-area-context
\`\`\`

### Issue: Image picker not working

**Solution**:
1. Rebuild app: `npm start --clear`
2. Grant permissions when prompted
3. Check `app.json` has image-picker plugin

## Development Workflow

1. Start Convex backend:
   \`\`\`bash
   npx convex dev
   \`\`\`

2. Start Expo in new terminal:
   \`\`\`bash
   npm start
   \`\`\`

3. Make changes to code
4. App auto-reloads
5. Backend functions update automatically

## Testing Checklist

Once running, test these features:

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Session persists after app reload

### Posts
- [ ] Create text-only post
- [ ] Create post with image
- [ ] View all posts in feed
- [ ] Posts display correctly

### Profile
- [ ] View profile information
- [ ] See user's posts
- [ ] Logout successfully

## Next Steps

After successful setup:

1. **Customize**: Update colors, branding in code
2. **Deploy**: Follow `DEPLOYMENT.md` for Appetize.io
3. **Demo**: Record demo video
4. **Submit**: Push to GitHub and submit

## Need Help?

- **Expo Docs**: https://docs.expo.dev
- **Convex Docs**: https://docs.convex.dev
- **React Navigation**: https://reactnavigation.org

---

**Happy Coding!** 🚀
