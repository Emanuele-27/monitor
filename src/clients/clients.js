import { MonitorClient } from "clients/monitorClient";
import { MonitorStatClient } from "clients/monitorStatClient";
import { MonitorAccountabilityClient } from "clients/monitorAccountabilityClient";
import { acceptJson, acceptLanguage } from "util/util";

const monitorClient = new MonitorClient(process.env.REACT_APP_MONITOR_HOST, acceptJson, acceptLanguage);
const monitorStatClient = new MonitorStatClient(process.env.REACT_APP_MONITOR_STAT_HOST, acceptJson, acceptLanguage);
const monitorAccountabilityClient = new MonitorAccountabilityClient(process.env.REACT_APP_MONITOR_ACC_HOST, acceptJson, acceptLanguage);

export { monitorClient, monitorStatClient, monitorAccountabilityClient }