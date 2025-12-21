import axios from "axios";
import dotenv from "dotenv";
import { OutagesPerUserModel } from "../model/outagesModel";

dotenv.config();


export async function sendPushNotification(outagesPerUser: Array<OutagesPerUserModel>) {
  outagesPerUser.forEach(async (user: OutagesPerUserModel) => {
    const outages = user.outages;
    
    if (outages.length > 0) {
      console.log(`Sending notification to ${user.email} about ${outages.length} outages.`);

      let message = `<h2>Hello,</h2><p>The following outages were found for your locations:</p><ul>`;
      outages.forEach((outage, index) => {
        message += `<li><h3>Outage ${index + 1}: ${outage.municipality.charAt(0).toUpperCase() + outage.municipality.slice(1)}</h3>`;
        message += `<p><strong>Address:</strong> ${outage.address.charAt(0).toUpperCase() + outage.address.slice(1)}<br>`;
        message += `<strong>Start:</strong> ${outage.start}<br>`;
        message += `<strong>End:</strong> ${outage.end}<br>`;
        message += `<strong>Voltage Level:</strong> ${outage.voltageLevel}<br>`;
        message += `<strong>Type:</strong> ${outage.type}<br>`;
        message += `<strong>Energy Center:</strong> ${outage.energyCenter}</p></li>`;
      });
      message += `</ul><p>Please take the necessary precautions.</p><p>Best regards,<br>EVN Outage Monitor</p>`;

      const params = new URLSearchParams();
      params.append('token', process.env.PUSHOVER_TOKEN || "");
      params.append('user', process.env.PUSHOVER_USER || "");
      params.append('message', message);
      params.append('html', '1');
      params.append('title', 'EVN Outage Alert');

      try { 
        await axios.post('https://api.pushover.net/1/messages.json', params);
      } catch (error) {
        console.error(`Failed to send notification to ${user.email}:`, error);
      }
    }
  });
}
