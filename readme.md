# Qef — Dijital QR Menü Platformu

---

## TAMAMLANAN GELİŞTİRMELER

### 1. Yükleme (Loading) Durumu ✅
`AuthForm.tsx` — buton spinner + tepede kayan turuncu loading bar. `globals.css`'e `loading-bar` keyframe eklendi.

### 2. Giriş Sayfasından Ana Sayfaya Dönüş ✅
`AuthForm.tsx` — formun üstüne sol ok ikonu ve "Ana Sayfa" linki eklendi.

### 3. Dinamik Menü URL'si ✅
`MenuEditor.tsx` — `generateSlug()` fonksiyonu (Türkçe karakter dönüşümü dahil). Yeni kullanıcılarda slug boş başlar, kafe adı yazıldıkça otomatik dolar.

### 4. UI İyileştirmeleri ✅
`MenuEditor.tsx` — "Görsel ekle" alanı tam genişlikte, dashed border, hover efektli yükleme alanına dönüştürüldü.

### 5. Hero Maskot → Telefon Mockup ✅
`app/page.tsx` — 1.4 MB mascot.webp kaldırıldı. Sıfır resim, tamamen Tailwind/React ile gerçekçi telefon çerçevesi + yüzen rozetler.

### 6. Görsel Optimizasyonu ✅
`ai-tanitim.png` (7.2 MB) → `sizes` prop eklendi. `banner.png` (7.6 MB) → `<img>` → Next.js `<Image>`.

### 7. Menü Sayfası Performansı ✅
- `revalidate` 30s → 3600s
- `menu_views` insert fire-and-forget
- `React.cache` ile cafe sorgusu deduplicate (2 DB round-trip → 1)
- `/api/revalidate-menu` route: admin kaydettiğinde anında cache temizleme
- `ThemeEditor`, `MenuEditor`, `EditProductModal` kayıt sonrası `revalidateMenu()` çağırıyor

### 8. AdSense Editorial Bölümü Kaldırıldı ✅
`app/menu/[slug]/page.tsx` — "Dijital QR Menü Nedir?" bloğu, blog linkleri ve CTA kaldırıldı.

### 9. SEO Schema ✅
- Ana sayfa: `Organization` + `WebSite` + `SoftwareApplication` (3 schema)
- 3 blog yazısı: `Article` schema + `datePublished`/`dateModified`
- OG `publishedTime`/`modifiedTime` eklendi
- Blog tarihleri semantic `<time dateTime>` tag'e taşındı

### 10. OG Image Düzeltmesi ✅
`layout.tsx` — `/og-image.png` (olmayan dosya) → `/opengraph-image` (Next.js dynamic). `opengraph-image.tsx`'teki domain `qefmenu.com` olarak güncellendi.

### 11. Yeni Blog Yazısı ✅
`/blog/qr-menu-fiyatlari-2026` — "QR menü fiyatları 2026" hedefli, karşılaştırma tablosu içeren yazı. Sitemap güncellendi.

### 12. Toplu AI Ürün Kaydı ✅
- `app/api/ai-bulk-scan/route.ts` — Gemini 2.5 Flash ile toplu görsel analizi. Max 15 görsel, tek istekte isim + İngilizce isim + açıklama üretiyor. Auth korumalı, Zod schema ile yapılandırılmış output.
- `components/BulkAIScan.tsx` — Drag & drop yükleme alanı, client-side sıkıştırma + base64 dönüşümü, AI tarama sonuçları inline düzenleme (isim, açıklama, kategori, fiyat), mevcut kategorilerden seçim + yeni kategori ekleme, toplu Supabase Storage yükleme + products tablosuna insert, `revalidateMenu` çağrısı.
- `components/AdminTabs.tsx` — "AI Kayıt" sekmesi eklendi (Menü sekmesinin yanına, Sparkles ikonu).
- `app/admin/page.tsx` — `category_order`, `cafeSlug`, `existingCategories` AdminTabs'e aktarıldı.

### 13. Sürükle-Bırak Kart Taşma Düzeltmesi ✅
`components/SortableProductCard.tsx` — Uzun ürün açıklamalarının yatayda taşması giderildi. Flex container ve wrapper'a `min-w-0` eklendi.

### 14. Vertex AI Entegrasyonu ($300 Google Cloud Kredisi) ✅
- Google Cloud "My First Project" üzerinde billing hesabı açıldı, $300 free trial kredisi aktif edildi (geçerlilik: 90 gün).
- Vertex AI API ve service account (`qef-vertex`) oluşturuldu, `Vertex AI User` rolü atandı.
- `@ai-sdk/google-vertex` paketi eklendi.
- `app/api/ai-bulk-scan/route.ts` — `@ai-sdk/google` yerine `@ai-sdk/google-vertex` kullanıyor. Service account credentials `GOOGLE_APPLICATION_CREDENTIALS_JSON` env variable üzerinden alınıyor.
- Model: `gemini-2.5-flash` (Vertex AI üzerinden, Google Cloud kredisi kullanılıyor).
- Vercel'e `GOOGLE_APPLICATION_CREDENTIALS_JSON` env variable eklendi.

---

## PROJE HARİTASI

### ALTYAPI & TEKNOLOJİ

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 16 + React 19 + TypeScript |
| Veritabanı | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email+şifre, magic link) |
| Storage | Supabase Storage (ürün görselleri) |
| Ödeme | iyzico (sandbox → production) |
| Email | Resend |
| UI | Tailwind CSS + Lucide Icons + OpenMoji |
| Drag & Drop | dnd-kit |
| QR Kod | qrcode paketi |
| Hosting | Vercel |
| Domain | qefmenu.com |
| Cron | Vercel Cron (her gün 08:00 UTC) |

---

### SAYFALAR

**Genel**
- `/` — Ana sayfa (landing)
- `/privacy` — Gizlilik politikası
- `/terms` — Kullanım koşulları
- `/dedo` — Sayaç sayfası (12 Temmuz 2026)

**Auth**
- `/login` — Giriş (noindex)
- `/register` — Kayıt (noindex)
- `/forgot-password` — Şifre sıfırlama isteği
- `/reset-password` — Yeni şifre belirleme
- `/auth/magic` — Magic link callback

**Menü**
- `/menu` — Menü listesi
- `/menu/[slug]` — Kafe menüsü (genel erişim, ISR 3600s)
- `/menu/demo` — Demo menü

**Admin**
- `/admin` — Ana admin paneli (Menü, Görünüm, QR, İstatistik, Ayarlar tabları)
- `/upgrade` — Pro plan satın alma (iyzico)

**Blog**
- `/blog` — Blog listesi
- `/blog/qr-menu-nedir`
- `/blog/ucretsiz-dijital-menu-nasil-olusturulur`
- `/blog/kagit-menuden-dijital-menuye-gecmenin-5-faydasi`
- `/blog/qr-menu-fiyatlari-2026`

**Superadmin**
- `/superadmin` — Platform yönetim paneli
- `/superadmin/login` — Superadmin girişi

**Diğer**
- `/ar` — AR görselleştirme
- `/robots.txt` — SEO
- `/sitemap.xml` — SEO (dinamik, tüm kafe menü sayfalarını içeriyor)
- `/opengraph-image` — Dinamik OG görseli (Next.js ImageResponse)

---

### API ROUTE'LARI

| Endpoint | Açıklama |
|---|---|
| `POST /api/iyzico/checkout` | iyzico ödeme formu başlat |
| `POST /api/iyzico/callback` | iyzico ödeme sonucu + makbuz emaili |
| `GET /api/cron/emails` | Trial/pro hatırlatma emailleri (Vercel Cron) |
| `GET /api/openmoji/[unicode]` | OpenMoji emoji SVG servisi |
| `GET /api/auth/callback` | Supabase auth callback |
| `POST /api/superadmin-auth` | Superadmin giriş |
| `DELETE /api/superadmin-auth` | Superadmin çıkış |
| `POST /api/revalidate-menu` | Admin kaydettiğinde ISR cache temizleme |
| `POST /api/chat` | AI menü asistanı (Gemini 2.0 Flash) |
| `POST /api/ai-bulk-scan` | Toplu AI ürün taraması (Vertex AI / Gemini 2.5 Flash) |

---

### COMPONENT'LER (49 adet)

**Admin Panel**
`AdminHeader`, `AdminTabs`, `AdminStats`, `AdminInbox`, `AccountSettings`, `OnboardingChecklist`, `TrialExpiredScreen`, `BulkPriceUpdate`, `BulkAIScan`

**Menü & Ürün**
`MenuEditor`, `MenuView`, `MenuProductList`, `ProductCard`, `ProductDetailModal`, `EditProductModal`, `SortableCategoryBlock`, `SortableProductCard`, `CategoryTabs`, `OpeningHoursEditor`

**Görünüm & Tema**
`ThemeEditor`, `ParallaxCover`, `StickyMenuHeader`, `LangToggle`, `OpenStatusBadge`, `BannerModal`, `ImageZoomModal`

**Özel Gün Teması**
`SpecialDayBanner`, `SpecialDayEffects`, `HangingOrnaments`, `WavingFlag`, `RamazanDecor`

**QR & AR**
`QRPrint`, `QRCodeModal`

**AI**
`MenuChatbot`

**Auth & Navigasyon**
`AuthForm`, `LogoutButton`, `NavigationProgress`, `CollapsibleSection`

**Superadmin**
`SuperAdminCafeCard`, `SuperAdminConfirmationList`, `SuperAdminLogout`, `SuperAdminUnverifiedCard`

**Demo**
`DemoCustomizer`, `DemoPhoneMockup`, `DemoScrollFix`, `DemoLayoutToggle`

**Diğer**
`OpenmojiIcon`, `TagSelector`, `IngredientSelector`, `AdUnit`

---

### LIB DOSYALARI

| Dosya | Açıklama |
|---|---|
| `lib/supabase/client.ts` | Tarayıcı Supabase client |
| `lib/supabase/server.ts` | Server Supabase client |
| `lib/supabase/admin.ts` | Service role admin client |
| `lib/supabase/middleware.ts` | Session yenileme proxy |
| `lib/iyzico.ts` | iyzico API native implementasyon |
| `lib/email.ts` | Resend email şablonları |
| `lib/validateImage.ts` | Görsel doğrulama (tip, boyut) |
| `lib/compressImage.ts` | Görsel sıkıştırma (canvas) |
| `lib/specialDays.ts` | Özel gün tespiti ve efekt tipleri |
| `lib/revalidateMenu.ts` | Admin kayıt sonrası ISR cache temizleme |

---

### HOOKS & TYPES

| Dosya | Açıklama |
|---|---|
| `hooks/useMenuStore.ts` | Demo menüsü için localStorage state yönetimi |
| `types/menu.ts` | Product, MenuData, OpeningHour tipleri |
| `types/theme.ts` | CafeTheme, FONTS, DEFAULT_THEME |
| `types/model-viewer.d.ts` | AR model-viewer web component tip tanımları |

---

### SUPABASE TABLOLARI

| Tablo | Açıklama |
|---|---|
| `cafes` | Kafe bilgileri, tema, slug, plan, trial/pro bitiş tarihleri |
| `products` | Ürünler (isim, fiyat, kategori, görsel, etiket, içerik, kalori, pozisyon) |
| `menu_views` | Menü ziyaret istatistikleri (cafe_id, viewed_at) |
| `payments` | iyzico ödeme kayıtları |
| `messages` | Admin paneli inbox mesajları (hoşgeldin, sistem bildirimleri) |
| `sa_login_attempts` | Superadmin brute-force koruması |

---

### ENV VARIABLE'LAR (14 adet)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPER_ADMIN_EMAIL
SUPER_ADMIN_PASSWORD
IYZICO_API_KEY
IYZICO_SECRET_KEY
IYZICO_BASE_URL
NEXT_PUBLIC_SITE_URL
RESEND_API_KEY
CRON_SECRET
GOOGLE_GENERATIVE_AI_API_KEY       ← AI menü asistanı (Gemini 2.0 Flash, AI Studio)
GOOGLE_APPLICATION_CREDENTIALS_JSON ← Vertex AI service account JSON (toplu AI tarama)
```

> **Not:** `GOOGLE_APPLICATION_CREDENTIALS_JSON` içeriği Google Cloud "My First Project" (fair-portal-458521-e9) üzerindeki `qef-vertex` service account'una ait JSON key dosyasıdır. Vertex AI üzerinden Gemini 2.5 Flash kullanılır, $300 Google Cloud free trial kredisinden düşer.

---

### EMAIL SİSTEMİ

| Tetikleyici | Email |
|---|---|
| Trial 7 gün kala | Hatırlatma |
| Trial 1 gün kala | Acil hatırlatma |
| Pro bitiş 14 gün kala | Yenileme hatırlatması |
| Ödeme başarılı | Makbuz (ödeme no, tutar, geçerlilik) |

---

### ÖZEL GÜN TEMASYİ

Menü sayfası belirli tarihlerde otomatik tema değiştirir:

| Özel Gün | Efekt |
|---|---|
| Yılbaşı / Noel | Kar yağışı, çam ağacı süsleri |
| Sevgililer Günü | Kalpler |
| Ramazan | Yıldızlar, Ramazan dekoru |
| 23 Nisan / 29 Ekim | Konfeti, Türk bayrağı |
| Cumhuriyet Bayramı | Havai fişek |
| Dünya Kahve Günü | Buhar efekti |
| Kadınlar Günü / Bahar | Sakura yaprakları |

Admin panelinden devre dışı bırakılabilir (`seasonal_themes_enabled`).

---

## PROJE AÇIKLAMASI (AI için)

Qef, Türkiye'deki kafe ve restoranlar için dijital QR menü oluşturma SaaS platformudur. `qefmenu.com` adresinde yayındadır.

**Nasıl çalışır:**
Kafe sahibi kayıt olur, admin panelinden ürünlerini ve kategorilerini ekler, görsel yükler, tema özelleştirir. Sistem otomatik bir `qefmenu.com/menu/kafe-adi` URL'i ve QR kodu üretir. Müşteriler masadaki QR'ı telefonlarıyla tarar, menüye uygulama indirmeden erişir.

**İş modeli:**
30 gün ücretsiz deneme, ardından 4.999₺/yıl (Pro plan). Ödeme iyzico ile yapılır, başarılı ödemede Supabase'deki `plan` ve `pro_ends_at` alanları güncellenir, makbuz Resend üzerinden emaile gönderilir.

**Teknik mimari:**
- Next.js 16 App Router, React Server Components + Client Components karma kullanım
- Supabase PostgreSQL: RLS (Row Level Security) ile her kullanıcı sadece kendi verisine erişir
- Supabase Auth: email+şifre ve magic link desteği
- Menü sayfaları ISR (Incremental Static Regeneration) ile cache'lenir (3600s), admin kaydettiğinde `revalidatePath` ile anında temizlenir
- AI menü asistanı: Google Gemini 2.0 Flash, Vercel AI SDK ile streaming, her kafe menüsünü system prompt olarak alır
- Özel gün temaları: `lib/specialDays.ts` tarih tespiti yapar, canvas tabanlı efektler (`SpecialDayEffects`) ve dekoratif SVG komponentler devreye girer
- Superadmin paneli: platform sahibine özel, Supabase auth + HMAC token ikili doğrulaması
- Cron job: her gün 08:00 UTC'de trial/pro bitiş tarihi yaklaşan kullanıcılara Resend üzerinden email gönderir

**Klasör yapısı:**
```
app/              → Next.js App Router sayfaları ve API route'ları
components/       → 49 React component
lib/              → Supabase client'ları, iyzico, email, görsel araçları
hooks/            → useMenuStore (demo için localStorage)
types/            → TypeScript tip tanımları
public/           → Statik dosyalar (demo görselleri, favicon)
supabase/         → schema.sql
```

**Önemli kısıtlar ve kararlar:**
- Middleware (`lib/supabase/middleware.ts`) kök `middleware.ts` olarak mount edilmemiş; `/admin` koruması sayfa içi `redirect()` ile yapılıyor
- `menu_views` insert fire-and-forget (analytics için sayfa render'ını bloklamıyor)
- `generateMetadata` ve sayfa component'i `React.cache` ile aynı Supabase sorgusunu paylaşıyor
- Blog yazıları static sayfalar (SSG), menü sayfaları ISR
- iyzico entegrasyonu native implementasyon (`lib/iyzico.ts`), resmi SDK kullanılmıyor
