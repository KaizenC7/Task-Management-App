# Push Notifications Guide

## How It Works

The app includes intelligent push notifications for task reminders:

### Notification Schedule
1. **5-Minute Warning**: Notifies 5 minutes before scheduled task time
2. **On-Time Alert**: Notifies exactly at the scheduled task time

### Technical Implementation

```
Task Created with Time → Notification Service Checks Every Minute
→ If time matches (5-min or exact) → Send browser notification
→ Mark as notified (prevent duplicates)
→ User sees notification with action buttons
```

## Browser Requirements

- Modern browser with Notifications API support
- Chrome, Firefox, Safari, Edge all supported
- Mobile browsers with notification support

## Permission Handling

### First-Time Setup
```javascript
if (Notification.permission === 'default') {
  // Browser hasn't asked yet
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // User approved - notifications enabled
    }
  });
}
```

### User Actions
- **Allow**: Notifications enabled ✅
- **Deny**: Notifications disabled ❌
- **Change Later**: Settings → Site Permissions

## Enabling/Disabling Notifications

### Browser Permissions
- **Chrome/Edge**: Click 🔒 → Site Settings → Notifications
- **Firefox**: Preferences → Privacy → Permissions → Notifications
- **Safari**: Preferences → Websites → Notifications

## Implementation Details

### Task with Scheduled Time
```javascript
// Creating a task
{
  title: "Meeting at 5 PM",
  description: "Team sync",
  scheduled_time: "2024-01-23T17:00:00"  // ISO format
}
```

### Notification Service Logic
```javascript
// Checks every 60 seconds
setInterval(() => {
  tasks.forEach(task => {
    const timeDiff = scheduledTime - now;
    const minutesDiff = timeDiff / 60000;
    
    // 5-minute warning
    if (minutesDiff <= 5 && minutesDiff > 0) {
      sendNotification(...);
    }
    
    // On-time alert
    if (minutesDiff <= 0 && minutesDiff > -1) {
      sendNotification(...);
    }
  });
}, 60000);
```

## Notification Payload

```javascript
{
  title: "Task Reminder: Meeting at 5",
  body: "Your task is due in 5 minutes",
  icon: "📋",
  tag: "task-notification",
  requireInteraction: true,  // User must close/interact
  actions: [
    { action: "open", title: "Open App" },
    { action: "dismiss", title: "Dismiss" }
  ]
}
```

## Tips for Best Experience

✅ **Do**
- Keep browser/app open during task times
- Allow notifications when prompted
- Check notification settings if not receiving
- Schedule tasks with specific times
- Test with a task scheduled a few minutes ahead

❌ **Don't**
- Deny notifications then expect them to work
- Assume notifications work without checking settings
- Close browser entirely (close tab is OK)
- Set scheduled time in the past

## Troubleshooting

### Not Receiving Notifications?

1. **Check Permission Status**
   ```javascript
   console.log(Notification.permission);
   // Output: 'granted', 'denied', or 'default'
   ```

2. **Verify Task Has Time**
   - Edit task in UI
   - Ensure "Scheduled Time" is set

3. **Check Task Time**
   - Make sure scheduled time is in the future
   - Wait for either 5-min window or exact time

4. **Verify Browser Support**
   ```javascript
   if ('Notification' in window) {
     // Supported
   }
   ```

5. **Check System Volume**
   - Ensure system notifications are enabled
   - Check system do-not-disturb settings

### Re-enable Notifications

If you denied them:
1. Click 🔒 icon in browser address bar
2. Find "Notifications" setting
3. Change to "Allow"
4. Refresh the page

## API Service Usage

```javascript
// Initializing notification service
import NotificationService from './services/NotificationService';

// Start checking for notifications
NotificationService.start(tasks, token);

// Stop checking (on logout)
NotificationService.stop();
```

## Future Enhancements

- 📧 Email notifications
- 💬 SMS notifications
- 📱 Mobile push notifications
- 🔔 Custom notification sounds
- 📊 Notification history/log
- 🎯 Recurring task notifications

## Privacy

- Notifications are browser-local (not sent to server)
- No notification data logged
- Works offline (if service worker implemented)
- User data never exposed in notifications
