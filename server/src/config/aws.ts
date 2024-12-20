import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

export class AWSConfig {
  private static _instance: AWSConfig;
  constructor() {
    if (AWSConfig._instance) {
      return AWSConfig._instance;
    }
    this.init();
  }

  private init() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  public static getInstance() {
    return this._instance || (this._instance = new this());
  }

  public get s3() {
    return new AWS.S3();
  }
}
