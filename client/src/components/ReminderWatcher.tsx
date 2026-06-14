import { useEffect } from "react";
import api from "../api/axios";

type Task = {
  id: number;
  title: string;
  reminderAt?: string;
  reminded?: boolean;
};

export default function ReminderWatcher() {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = async () => {
      try {
        const response = await api.get(
          "/tasks/pending-reminders"
        );

        const tasks: Task[] =
          response.data;

        const now =
          new Date().getTime();

        for (const task of tasks) {
          if (!task.reminderAt)
            continue;

          const reminderTime =
            new Date(
              task.reminderAt
            ).getTime();

          if (
            reminderTime <= now
          ) {
            if (
              Notification.permission ===
              "granted"
            ) {
              new Notification(
                "🔔 Task Reminder",
                {
                  body: task.title,
                }
              );
            } else {
              alert(
                `🔔 Reminder: ${task.title}`
              );
            }

            await api.patch(
              `/tasks/${task.id}/reminded`
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    console.log("Checking reminders...");

    checkReminders();

    const interval =
      setInterval(
        checkReminders,
        60000
      );

    return () =>
      clearInterval(
        interval
      );
  }, []);

  return null;
}
