const express = require("express");
const { google } = require("googleapis");
const { MongoClient } = require("mongodb");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const MONGO_URI = process.env.MONGO_URI;

const sheetsAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

sheetsAuth.setCredentials({
  refresh_token: process.env.GOOGLE_SHEETS_REFRESH_TOKEN,
});

const sheets = google.sheets({ version: "v4", auth: sheetsAuth });
const drive = google.drive({ version: "v3", auth: sheetsAuth });

/**
 * generate the attendance report by grouping entries by date.
 */
async function generateAttendanceReport(
  rangeType,
  customStart,
  customEnd,
  adminEmail
) {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db("test");

    // calculate date range based on rangeType
    let startDate, endDate;

    if (rangeType === "custom") {
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
    } else if (rangeType === "weekly") {
      startDate = moment().startOf("week").toDate();
      endDate = moment().endOf("week").toDate();
    } else if (rangeType === "monthly") {
      startDate = moment().startOf("month").toDate();
      endDate = moment().endOf("month").toDate();
    } else if (rangeType === "daily") {
      startDate = moment().startOf("day").toDate();
      endDate = moment().endOf("day").toDate();
    } else {
      throw new Error("Invalid rangeType");
    }

    console.log("Date Range:", { startDate, endDate });

    // fetch login histories within the date range
    const loginHistories = await db
      .collection("loginhistories")
      .find({
        loginTime: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray();
    console.log(
      "Login Histories Retrieved:",
      JSON.stringify(loginHistories, null, 2)
    );

    const users = await db.collection("users").find({}).toArray();
    console.log("Users Retrieved:", JSON.stringify(users, null, 2));

    const userMap = users.reduce((acc, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});
    console.log("User Map Created:", JSON.stringify(userMap, null, 2));

    const combinedData = loginHistories.map((history) => {
      const user = userMap[history.userId.toString()];
      return { ...history, userInfo: user || {} };
    });
    console.log(
      "Combined Data Before Sorting:",
      JSON.stringify(combinedData, null, 2)
    );

    const sortedData = combinedData.sort(
      (a, b) => new Date(a.loginTime) - new Date(b.loginTime)
    );

    // group data by date
    const groupedData = sortedData.reduce((acc, entry) => {
      const date = moment(entry.loginTime).format("MMMM D, YYYY");
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});

    const formattedData = [];

    // format grouped data for the Google Sheet
    for (const [date, entries] of Object.entries(groupedData)) {
      formattedData.push([`${date}`]);
      formattedData.push([
        "#",
        "Name",
        "Email",
        "Time In",
        "Time Out",
        "Duration Spent",
      ]);

      entries.forEach((entry, index) => {
        const duration = entry.logoutTime
          ? (() => {
              const totalMilliseconds =
                new Date(entry.logoutTime) - new Date(entry.loginTime);
              const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
              const minutes = Math.floor(
                (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
              );
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            })()
          : "Still Active";

        formattedData.push([
          index + 1,
          `${entry.userInfo.firstName || "Unknown"} ${
            entry.userInfo.lastName || ""
          }`.trim(),
          entry.userInfo.email || "Unknown",
          new Date(entry.loginTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          entry.logoutTime
            ? new Date(entry.logoutTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A",
          duration,
        ]);
      });

      formattedData.push([
        "************** NOTHING FOLLOWS ********************",
      ]);
      formattedData.push([]);
    }

    console.log(
      "Formatted Data for Google Sheets:",
      JSON.stringify(formattedData, null, 2)
    );

    const spreadsheetResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: `Attendance Report - ${moment().format(
            "YYYY-MM-DD HH:mm:ss"
          )}`,
        },
      },
      fields: "spreadsheetId",
    });

    const newSpreadsheetId = spreadsheetResponse.data.spreadsheetId;

    await sheets.spreadsheets.values.update({
      spreadsheetId: newSpreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: { values: formattedData },
    });

    // share the Google Sheet with email
    if (adminEmail) {
      await drive.permissions.create({
        fileId: newSpreadsheetId,
        requestBody: {
          type: "user",
          role: "writer",
          emailAddress: adminEmail,
        },
      });
      console.log(`Sheet shared with ${adminEmail}`);
    }

    return {
      message: "Report generated and shared successfully",
      sheetUrl: `https://docs.google.com/spreadsheets/d/${newSpreadsheetId}`,
    };
  } catch (error) {
    console.error("Error generating attendance report:", error);
    throw error;
  } finally {
    await client.close();
  }
}

router.post("/generate", async (req, res) => {
  const { rangeType, customStart, customEnd, adminEmail } = req.body;

  try {
    const result = await generateAttendanceReport(
      rangeType,
      customStart,
      customEnd,
      adminEmail
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate report" });
  }
});

module.exports = router;
