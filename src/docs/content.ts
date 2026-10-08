import EnHome from "./en/home"
import TrHome from "./tr/home"
import EnGettingStarted from "./en/getting-started"
import TrGettingStarted from "./tr/getting-started"
import EnConfiguration from "./en/configuration"
import TrConfiguration from "./tr/configuration"
import EnCoreConcepts from "./en/core-concepts"
import TrCoreConcepts from "./tr/core-concepts"
import EnApiConventions from "./en/api-conventions"
import TrApiConventions from "./tr/api-conventions"
import EnAuthentication from "./en/authentication"
import TrAuthentication from "./tr/authentication"
import EnAuthorization from "./en/authorization"
import TrAuthorization from "./tr/authorization"
import EnAccountRecovery from "./en/account-recovery"
import TrAccountRecovery from "./tr/account-recovery"
import EnDeviceCodeFlow from "./en/device-code-flow"
import TrDeviceCodeFlow from "./tr/device-code-flow"
import EnExternalProviders from "./en/external-providers"
import TrExternalProviders from "./tr/external-providers"
import EnSdk from "./en/sdk"
import TrSdk from "./tr/sdk"
import EnOperations from "./en/operations"
import TrOperations from "./tr/operations"
import EnMemberships from "./en/memberships"
import TrMemberships from "./tr/memberships"
import EnUsers from "./en/users"
import TrUsers from "./tr/users"
import EnUserTypes from "./en/user-types"
import TrUserTypes from "./tr/user-types"
import EnRoles from "./en/roles"
import TrRoles from "./tr/roles"
import EnApplications from "./en/applications"
import TrApplications from "./tr/applications"
import EnSessions from "./en/sessions"
import TrSessions from "./tr/sessions"
import EnEvents from "./en/events"
import TrEvents from "./tr/events"
import EnWebhooks from "./en/webhooks"
import TrWebhooks from "./tr/webhooks"
import EnMailHooks from "./en/mail-hooks"
import TrMailHooks from "./tr/mail-hooks"
import EnErrorCodes from "./en/error-codes"
import TrErrorCodes from "./tr/error-codes"
import type { ComponentType } from "react"
import type { Locale } from "@/localization/routing"
import type { DocSlug } from "./registry"

// The content of every page of the documentation, per language. A page added to ./registry.ts needs its components here.
export const contents: Record<DocSlug, Record<Locale, ComponentType>> = {
	"getting-started": { en: EnGettingStarted, tr: TrGettingStarted },
	"configuration": { en: EnConfiguration, tr: TrConfiguration },
	"core-concepts": { en: EnCoreConcepts, tr: TrCoreConcepts },
	"api-conventions": { en: EnApiConventions, tr: TrApiConventions },
	"authentication": { en: EnAuthentication, tr: TrAuthentication },
	"authorization": { en: EnAuthorization, tr: TrAuthorization },
	"account-recovery": { en: EnAccountRecovery, tr: TrAccountRecovery },
	"device-code-flow": { en: EnDeviceCodeFlow, tr: TrDeviceCodeFlow },
	"external-providers": { en: EnExternalProviders, tr: TrExternalProviders },
	"sdk": { en: EnSdk, tr: TrSdk },
	"operations": { en: EnOperations, tr: TrOperations },
	"memberships": { en: EnMemberships, tr: TrMemberships },
	"users": { en: EnUsers, tr: TrUsers },
	"user-types": { en: EnUserTypes, tr: TrUserTypes },
	"roles": { en: EnRoles, tr: TrRoles },
	"applications": { en: EnApplications, tr: TrApplications },
	"sessions": { en: EnSessions, tr: TrSessions },
	"events": { en: EnEvents, tr: TrEvents },
	"webhooks": { en: EnWebhooks, tr: TrWebhooks },
	"mail-hooks": { en: EnMailHooks, tr: TrMailHooks },
	"error-codes": { en: EnErrorCodes, tr: TrErrorCodes },
}

export const homeContents: Record<Locale, ComponentType> = {
	en: EnHome,
	tr: TrHome,
}
