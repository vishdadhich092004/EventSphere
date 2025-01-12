import mongoose from "mongoose";

export const connectMongo = async (mongoUrl: string) => {
  await mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Mongo Database connected");
    })
    .catch((e) => {
      console.error("Mongo Connection Failed", e);
      process.exit(1);
    });
};
