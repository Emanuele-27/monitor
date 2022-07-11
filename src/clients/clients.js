import { MonitorClient } from "clients/MonitorClient";
import { MonitorStatClient } from "clients/MonitorStatClient";
import { MonitorAccountabilityClient } from "clients/MonitorAccountabilityClient";

const acceptJson = 'application/json';
const acceptLanguage = 'it';

const monitorClient = new MonitorClient(process.env.REACT_APP_MONITOR_HOST, acceptJson, acceptLanguage);
const monitorStatClient = new MonitorStatClient(process.env.REACT_APP_MONITOR_STAT_HOST, acceptJson, acceptLanguage);
const monitorAccountabilityClient = new MonitorAccountabilityClient(process.env.REACT_APP_MONITOR_ACC_HOST, acceptJson, acceptLanguage);

export {monitorClient, monitorStatClient, monitorAccountabilityClient}