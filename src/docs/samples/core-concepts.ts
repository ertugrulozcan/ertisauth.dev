// The code samples of the Core Concepts page

export const tree = {
	en: `Installation
└── Membership (tenant)
    ├── Users ──────────── have a Role, a User Type, and optional own permissions
    ├── User Types ─────── the schema of user data, with inheritance
    ├── Roles ──────────── named sets of permissions
    ├── Applications ───── machine clients, have a Role and optional own permissions
    ├── Providers ──────── Google, Apple, Facebook, Microsoft sign-in
    ├── Code Policies ──── format of device sign-in codes
    ├── Events ─────────── the log of what happened
    ├── Webhooks ───────── HTTP calls triggered by events
    └── Mail Hooks ─────── emails triggered by events`,
	tr: `Kurulum
└── Membership (kiracı)
    ├── Users ──────────── bir rolü, bir kullanıcı tipi ve isteğe bağlı kendi yetkileri vardır
    ├── User Types ─────── kullanıcı verisinin şeması, kalıtımla
    ├── Roles ──────────── isimlendirilmiş yetki kümeleri
    ├── Applications ───── makine istemcileri; bir rolü ve isteğe bağlı kendi yetkileri vardır
    ├── Providers ──────── Google, Apple, Facebook, Microsoft ile giriş
    ├── Code Policies ──── cihazla giriş kodlarının biçimi
    ├── Events ─────────── olup bitenlerin kaydı
    ├── Webhooks ───────── olayların tetiklediği HTTP çağrıları
    └── Mail Hooks ─────── olayların tetiklediği e-postalar`,
}

export const sys = `"sys": {
	"created_at": "2026-01-01T12:00:00Z",
	"created_by": "admin",
	"modified_at": "2026-01-02T08:30:00Z",
	"modified_by": "backend"
}`
