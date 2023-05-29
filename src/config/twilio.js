import twilio from "twilio";
import { options } from "./config.js";

const twilioId = options.twilio.twilioId;
const twilioToken = options.twilio.twilioToken;

export const twilioPhone = options.twilio.twilioPhone;

export const twilioClient = twilio(twilioId,twilioToken);
