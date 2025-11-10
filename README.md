# Framez - Mobile Social Media App

A modern mobile social media application built with React Native and Expo, featuring user authentication, post creation, image uploads, and personalized user profiles.

## Features

- **User Authentication**: Secure registration and login system  
- **Persistent Sessions**: Users remain logged in after app restart  
- **Create Posts**: Share text and images with the community  
- **Feed**: View all posts from users in chronological order  
- **User Profile**: View your own posts and profile information  
- **Image Upload**: Add images to your posts from your device  
- **Real-time Updates**: Posts update in real-time using Convex  
- **Instagram-inspired UI**: Clean, modern interface design  

## Tech Stack

- **Frontend**: React Native with Expo  
- **Backend**: Convex (real-time backend)  
- **Navigation**: React Navigation  
- **Authentication**: Convex Auth with Expo Secure Store  
- **Image Handling**: Expo Image Picker + Convex File Storage  
- **Language**: TypeScript  

## Prerequisites

Before you begin, ensure you have the following installed:  
- Node.js (v16 or higher)  
- npm or yarn  
- Expo CLI (`npm install -g expo-cli`)  
- iOS Simulator (Mac) or Android Studio (for Android emulator)  
- Convex CLI (`npm install -g convex`)  

## Setup Instructions

### 1. Clone the Repository

```
git clone <your-repo-url>
cd framez
```

### 2. Install Dependencies

```
npm install
```

### 3. Set Up Convex Backend

1. Create a Convex account at [https://convex.dev](https://convex.dev)  

2. Initialize Convex in the project:  
```
npx convex dev
```

3. Follow the prompts to:  
   - Create a new project or select an existing one  
   - This will automatically push your schema and functions  

4. After setup, you'll receive a deployment URL. Copy it.  

### 4. Configure Environment Variables

1. Create a `.env` file in the root directory:  
```
cp .env.example .env
```

2. Add your Convex deployment URL to `.env`:  
```
EXPO_PUBLIC_CONVEX_URL=https://your-deployment-url.convex.cloud
```

### 5. Run the App

Start the Expo development server:  
```
npm start
```

Then:  
- Press `i` for iOS simulator  
- Press `a` for Android emulator  
- Scan the QR code with the Expo Go app on your physical device  

## Project Structure

```
framez/
├── convex/                 # Convex backend code
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication functions
│   └── posts.ts           # Post-related functions
├── src/
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts (Auth)
│   ├── navigation/        # Navigation configuration
│   ├── screens/           # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── App.tsx                # Main app component
└── README.md
```

## Usage Guide

### Registration

1. Launch the app  
2. Tap "Sign up" on the login screen  
3. Enter your name, email, and password  
4. Tap "Sign Up"  

### Login

1. Enter your registered email and password  
2. Tap "Log In"  

### Creating Posts

1. Navigate to the "Create" tab  
2. Enter your post content  
3. (Optional) Tap "Add Image" to attach an image  
4. Tap "Share Post"  

### Viewing Feed

- The "Home" tab displays all posts from all users  
- Pull down to refresh the feed  

### Profile

- View your profile information  
- See all your posts in a grid layout  
- Tap "Logout" to sign out  

## Deployment to Appetize.io

### 1. Build the App

For Android:  
```
eas build --platform android --profile preview
```

For iOS:  
```
eas build --platform ios --profile preview
```

### 2. Upload to Appetize.io

1. Visit [https://appetize.io](https://appetize.io)  
2. Sign up or log in  
3. Upload your built APK (Android) or IPA (iOS)  
4. Configure device settings  
5. Get your public link  

### 3. Share

Share the Appetize.io link to allow others to test your app in a browser!  

## Testing

The app has been tested on:  
- Physical devices via Expo Go  

## Troubleshooting

### Convex Connection Issues

- Ensure your `.env` file has the correct Convex URL  
- Check that `npx convex dev` is running  
- Verify your internet connection  

### Image Upload Problems

- Grant camera roll permissions when prompted  
- Check that your Convex storage is properly configured  

### Build Errors

- Clear cache: `npx expo start -c`  
- Reinstall dependencies: `rm -rf node_modules && npm install`  
- Check that all peer dependencies are installed  

**Demo Video**: [Link to demo video]  
**Appetize.io Link**: [Link to deployed app]
