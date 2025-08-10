# Firebase Setup Guide for SmartHome App

## 1. Firebase Project Setup

### Create a new Firebase project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `dtronics-iot2` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication:
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Google" provider
3. Enable "Email/Password" provider
4. Add your authorized domains

### Enable Firestore Database:
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select a location close to your users
4. Click "Done"

## 2. Firebase Configuration

### Get your Firebase config:
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → "Web"
4. Register app with name: "SmartHome Web"
5. Copy the config object

### Update the config in your app:
Replace the placeholder values in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## 3. Firestore Security Rules

### Deploy security rules:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize project: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

The security rules are already configured in `firestore.rules` to:
- Allow users to only access their own data
- Secure homes, rooms, devices, and voltage readings
- Prevent unauthorized access

## 4. Database Structure

The Firestore database will have the following collections:

### Users Collection
```
users/{userId}
├── email: string
├── displayName: string
├── photoURL: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Homes Collection
```
homes/{homeId}
├── name: string
├── address: string
├── userId: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Rooms Collection
```
rooms/{roomId}
├── name: string
├── homeId: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Devices Collection
```
devices/{deviceId}
├── name: string
├── type: 'light' | 'fan' | 'switch'
├── isOn: boolean
├── voltage: number
├── current: number
├── power: number
├── ipAddress: string
├── roomId: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Voltage Readings Collection
```
voltage_readings/{readingId}
├── deviceId: string
├── voltage: number
├── current: number
├── power: number
└── timestamp: timestamp
```

## 5. Testing the Setup

### Test Authentication:
1. Run the app: `npx expo start`
2. Try signing in with Google
3. Try creating an account with email/password
4. Verify user profile is created in Firestore

### Test Database Operations:
1. Add a new home
2. Add rooms to the home
3. Add devices to rooms
4. Toggle device states
5. Verify real-time updates

## 6. Production Considerations

### Security:
- Review and customize Firestore security rules
- Enable proper authentication methods
- Set up proper CORS policies

### Performance:
- Add indexes for complex queries
- Implement pagination for large datasets
- Use offline persistence for better UX

### Monitoring:
- Set up Firebase Analytics
- Monitor Firestore usage and costs
- Set up alerts for unusual activity

## 7. Troubleshooting

### Common Issues:

**Authentication errors:**
- Verify Firebase config is correct
- Check if Google Sign-In is enabled
- Ensure authorized domains are set

**Firestore permission errors:**
- Deploy security rules: `firebase deploy --only firestore:rules`
- Check if user is authenticated
- Verify data structure matches rules

**Real-time updates not working:**
- Check network connectivity
- Verify Firestore is enabled
- Check security rules allow read access

### Debug Commands:
```bash
# View Firestore data
firebase firestore:get

# Deploy rules
firebase deploy --only firestore:rules

# View logs
firebase functions:log

# Test security rules
firebase firestore:rules:test
```

## 8. Next Steps

1. **Implement ESP8266 Integration**: Connect real devices to the app
2. **Add Push Notifications**: Notify users of device status changes
3. **Implement Offline Support**: Handle network disconnections
4. **Add Analytics**: Track user behavior and app usage
5. **Performance Optimization**: Add caching and pagination
6. **Testing**: Add unit and integration tests

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.google.com/community)

For app-specific issues:
- Check the app logs
- Review the security rules
- Verify the database structure
