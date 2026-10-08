// The code samples of the Configuration page, shared by every language

export const logging = `{
	"Logging": {
		"LogLevel": {
			"Default": "Information",
			"Microsoft": "Warning"
		}
	}
}`

export const example = `{
	"Database": {
		"ConnectionString": "mongodb://ertisauth:<password>@mongo-0:27017",
		"DefaultAuthDatabase": "auth"
	},
	"ApplicationInsights": {
		"ConnectionString": "InstrumentationKey=…;IngestionEndpoint=…"
	}
}`

export const environment = `Database__ConnectionString=mongodb://ertisauth:<password>@mongo-0:27017
Database__DefaultAuthDatabase=auth
ApplicationInsights__ConnectionString=InstrumentationKey=…`
