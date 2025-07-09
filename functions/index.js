/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const logger = require("firebase-functions/logger");
// Initialize Firebase Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();

// Import scheduler trigger
const {onSchedule} = require("firebase-functions/v2/scheduler");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Scheduled function to delete boxes older than 24 hours
exports.deleteOldBoxes = onSchedule(
    {schedule: "every 24 hours"},
    async (event) => {
      const db = admin.firestore();
      const cutoff = admin.firestore.Timestamp.fromMillis(
          Date.now() - 24 * 60 * 60 * 1000,
      );
      const oldBoxesSnap = await db
          .collection("boxes")
          .where("timestamp", "<=", cutoff)
          .get();
      const batch = db.batch();
      oldBoxesSnap.forEach((docRef) => batch.delete(docRef.ref));
      await batch.commit();
      logger.info(
          `Deleted ${oldBoxesSnap.size} old boxes`,
      );
    },
);
