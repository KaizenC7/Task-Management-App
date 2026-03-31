

const API_BASE_URL = 'http://localhost:5000/api';

class NotificationService {
  constructor() {
    this.checkInterval = null;
    this.notifiedTasks = new Set();
    this.tasks = [];
  }

  async start(tasks, token) {
    this.tasks = tasks || [];
    this.token = token;

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Check every 30 seconds for scheduled tasks
    this.checkInterval = setInterval(() => {
      this.checkAndNotify();
    }, 10000);

    // Initial check
    this.checkAndNotify();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.notifiedTasks.clear();
    this.tasks = [];
  }

  updateTasks(tasks) {
    this.tasks = tasks || [];
  }

  checkAndNotify() {
    const now = new Date();

    this.tasks.forEach(task => {
      if (task.scheduled_time && !task.completed) {
        const scheduledTime = new Date(task.scheduled_time);
        const timeDiff = scheduledTime - now;
        const minutesDiff = timeDiff / (1000 * 60);

        // Send notification when task is within 1 minute of scheduled time
        const notificationKey = `${task.id}-due`;
        if (minutesDiff <= 1 && minutesDiff > -5 && !this.notifiedTasks.has(notificationKey)) {
          this.sendNotification(
            `⏰ Task Due: ${task.title}`,
            `Your task "${task.title}" is due now!`
          );
          this.notifiedTasks.add(notificationKey);
        }

        // Send notification 5 minutes before
        const notificationKey5min = `${task.id}-5min`;
        if (minutesDiff > 4 && minutesDiff <= 6 && !this.notifiedTasks.has(notificationKey5min)) {
          this.sendNotification(
            `⏰ Reminder: ${task.title}`,
            `Your task "${task.title}" is due in 5 minutes`
          );
          this.notifiedTasks.add(notificationKey5min);
        }
      }
    });
  }

  sendNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '📋',
        tag: 'task-notification',
        requireInteraction: true,
        badge: '📋'
      });
    }
  }
}

export default new NotificationService();
