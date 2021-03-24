import clock from "clock";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { display } from "display";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { battery } from "power";
import { today } from "user-activity"

const clockLabel = document.getElementById("clockLabel");
const heartLabel = document.getElementById("heartLabel");
const dateLabel = document.getElementById("dateLabel");
const battLabel = document.getElementById("battLabel");
const stepsLabel = document.getElementById("stepsLabel");
const heartIcon = document.getElementById("heartIcon");
const stepsIcon = document.getElementById("stepsIcon");

// Update the clock every minute
clock.granularity = "minutes";

// ## CLOCK ##
clock.ontick = (evt) => {
  let todayDate = evt.date;
  let hours = todayDate.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(todayDate.getMinutes());
  clockLabel.text = `${hours}:${mins}`;
  
  // ## DATE ##
  const weekDays = ['Søn','Man','Tir','Ons','Tor','Fre','Lør'];
  let date = util.zeroPad(todayDate.getDate());
  let month = util.zeroPad((todayDate.getMonth())+1);
  let dayName = util.zeroPad(weekDays[todayDate.getDay()]);

  dateLabel.text = `${dayName}. ${date}/${month}`;
  
  // ## HEART RATE ##
  const hibox = heartIcon.getBBox();
  heartLabel.y = hibox.y+hibox.height;
  heartLabel.x = hibox.x+hibox.width+3;
  if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const hrm = new HeartRateSensor();
    
    hrm.addEventListener("reading", () => {
      heartLabel.text = `${hrm.heartRate}`;
    });
    display.addEventListener("change", () => {
      // Automatically stop the sensor when the screen is off to conserve battery
      if (display.on) {
        hrm.start();
      }
      else {
        hrm.stop();
      }
    });
    hrm.start();
  }
  
  // ## STEPS ##
  const sibox = stepsIcon.getBBox();
  stepsLabel.y = sibox.y+sibox.height;
  stepsLabel.x = sibox.x+sibox.width+3;
  stepsLabel.text = `${today.adjusted.steps}`;
  
  // ## BATTERY ##
  battLabel.text = `${battery.chargeLevel} %`;
  
}