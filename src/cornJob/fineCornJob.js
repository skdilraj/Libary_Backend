// cronJobs.js
import cron from "node-cron";
import BookIssue from "../model/bookIssue.model.js"; // adjust path
import mongoose from "mongoose";

export const startCronJobs = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();

      const overdueBooks = await BookIssue.find({
        status: "approved",
        dueDate: { $lt: now },
      });

      for (const issue of overdueBooks) {
        const lateDays = Math.ceil((now - issue.dueDate) / (1000 * 60 * 60 * 24));
        issue.fine = lateDays * 5; // 5 ruppes currency unit per day
        await issue.save();
      }

      console.log(`Cron job: Updated fines for ${overdueBooks.length} overdue books`);
    } catch (err) {
      console.error("Error running cron job:", err);
    }
  });

  console.log("Cron jobs started!");
};
