import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    Address: {
      type: String,
    },
    socialId: {
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
      GitHub: {
        type: String,
      },
    },
    bio:{
        type:String
    }
  },
  { timestamps: true }
);

// Check if the model is already compiled
export const User = mongoose.models.User || mongoose.model("User", userSchema);







// OverwriteModelError: Cannot overwrite User model once compiled.       
//     at Mongoose.model (C:\Users\hp\OneDrive\Desktop\harkirat\blog\Server\node_modules\mongoose\lib\mongoose.js:608:13)
//     at file:///C:/Users/hp/OneDrive/Desktop/harkirat/blog/Server/models/user.js:40:30
//     at ModuleJob.run (node:internal/modules/esm/module_job:262:25)      
//     at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:483:26)
//     at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

// Node.js v22.9.0
// [nodemon] app crashed - waiting for file changes before starting...     
// ChatGPT said:
// ChatGPT
// The error OverwriteModelError: Cannot overwrite 'User' model once compiled occurs when you try to define a Mongoose model with the same name multiple times in your application. Mongoose does not allow overwriting a model once it has been registered.

// Solution:
// You need to check if the model is already registered before defining it. Here's how you can fix it:

// Corrected Model Definition:
// javascript
// Copy code
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     username: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//     },
//     Address: {
//       type: String,
//     },
//     socialId: {
//       linkedin: {
//         type: String,
//       },
//       Instagram: {
//         type: String,
//       },
//       GitHub: {
//         type: String,
//       },
//     },
//   },
//   { timestamps: true }
// );

// // Check if the model is already compiled
// export const User = mongoose.models.User || mongoose.model("User", userSchema);
// Explanation:
// mongoose.models:

// It is a cache where all compiled models are stored.
// Before defining a model, we check if it already exists in mongoose.models.
// Condition:

// mongoose.models.User: Checks if the User model is already registered.
// If it exists, reuse the existing model. If not, define a new one.
// Why the Error Occurs:
// This typically happens when:

// The same file containing the model definition is imported multiple times in your application.
// Nodemon restarts the server, causing the model file to be re-executed.
// Additional Tips:
// Avoid Multiple Imports: Ensure you're not importing the file containing the model definition multiple times unnecessarily.

// Nodemon Restarts: If you're working with a hot-reloading server (like Nodemon), using the above approach ensures models are not recompiled on every restart.

// Debugging Model Cache: If you suspect multiple models are being created, you can inspect mongoose.models:

// javascript
// Copy code
// console.log(mongoose.models);
// This change should resolve your issue!







