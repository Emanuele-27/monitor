import { MonitorClient } from "clients/monitor-client";
import { MonitorStatClient } from "clients/monitor-stat-client";
import { MonitorAccountabilityClient } from "clients/monitor-accountability-client";
import { configProps } from "util/config";

const acceptJson = 'application/json';
const acceptLanguage = 'it';

const monitorClient = new MonitorClient(configProps.monitorHost, acceptJson, acceptLanguage);
const monitorStatClient = new MonitorStatClient(configProps.monitorStatHost, acceptJson, acceptLanguage);
const monitorAccountabilityClient = new MonitorAccountabilityClient(configProps.monitorAccHost, acceptJson, acceptLanguage);

export { monitorClient, monitorStatClient, monitorAccountabilityClient }