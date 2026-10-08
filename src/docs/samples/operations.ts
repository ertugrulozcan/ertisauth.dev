// The code samples of the Operations page

export const probes = `livenessProbe:
  httpGet: { path: /ping, port: 8080 }
readinessProbe:
  httpGet: { path: /healthcheck, port: 8080 }`

export const eventsTtl = `db.events.createIndex({ event_time: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 })`
