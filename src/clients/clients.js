import { MonitorClient } from "clients/monitorClient";
import { MonitorStatClient } from "clients/monitorStatClient";
import { MonitorAccountabilityClient } from "clients/monitorAccountabilityClient";
import { configProps } from "util/config";

const acceptJson = 'application/json';
const acceptLanguage = 'it';

const monitorClient = new MonitorClient(configProps.monitorHost, acceptJson, acceptLanguage);
const monitorStatClient = new MonitorStatClient(configProps.monitorStatHost, acceptJson, acceptLanguage);
const monitorAccountabilityClient = new MonitorAccountabilityClient(configProps.monitorAccHost, acceptJson, acceptLanguage);

export { monitorClient, monitorStatClient, monitorAccountabilityClient }