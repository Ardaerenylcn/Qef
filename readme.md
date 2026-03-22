# Qef (QR Menu) Projesi - Claude Geliştirme İstekleri

Aşağıdaki özelliklerin ve düzeltmelerin projeye eklenmesini rica ediyorum. Lütfen sırasıyla inceleyip uygulayalım:

## 1. Yükleme (Loading) Durumu Eklenmesi ✅
- İşlem sırasında sayfa donmuş gibi hissettirmemesi için, giriş yaparken (Login) ve kayıt olurken (Register) butonlara veya sayfaya bir "Loading bar" veya dönen bir "Spinner" animasyonu eklenmesi.
- **Uygulama:** `AuthForm.tsx` — buton spinner'ı zaten vardı; üstüne sayfanın tepesinde kayan turuncu loading bar eklendi. `globals.css`'e `loading-bar` keyframe animasyonu eklendi.

## 2. Giriş Sayfasından Ana Sayfaya Dönüş Butonu ✅
- `https://qef-sepia.vercel.app/login` (veya register) sayfasına gidildiğinde tekrar ilk/ana sayfaya geri dönecek bir buton bulunmuyor.
- İlgili sayfalara geri dönüşü sağlayacak bir "Ana Sayfa" veya "Geri" butonu eklenmesi.
- **Uygulama:** `AuthForm.tsx` — formun üstüne sol ok ikonu ve "Ana Sayfa" yazısıyla `/` sayfasına yönlendiren link eklendi.

## 3. Dinamik Menü URL'si Oluşturma ✅
- Menü URL'si kısmının başlangıçta (default olarak) boş gelmesi.
- Kullanıcı "Kafe Adı" alanını doldurduğunda/girdiğinde, girilen kafe adına göre otomatik olarak bir Menü URL'si (örneğin; `kafe-adi` şeklinde formatlanarak) oluşturulması.
- Oluşturulan bu URL'nin arayüzde kullanıcıya gösterilmesi ve "Müşterileriniz bu link üzerinden menüye erişebilecek" tarzında bir açıklama metniyle durumun netçe anlatılması.
- **Uygulama:** `MenuEditor.tsx` — `generateSlug()` fonksiyonu eklendi (Türkçe karakter dönüşümü dahil). Yeni kullanıcılarda slug alanı boş başlar, kafe adı yazıldıkça otomatik dolar. Manuel düzenlenirse auto-mod kapanır. Link önizlemesi ve açıklama metni eklendi.

## 4. Kullanıcı Arayüzü (UI) ve Görünürlük İyileştirmeleri ✅
- Şu anki "Görsel ekle" butonu kullanıcılar tarafından rahatça görülemiyor.
- Bu butonun daha büyük, belirgin ve kullanıcı dostu bir tasarımla yenilenmesi.
- Arayüzde benzer şekilde gözden kaçan, zor fark edilen diğer elementlerin ve butonların da tespit edilerek daha görünür ve modern bir tasarıma kavuşturulması (genel tasarım iyileştirmesi).
- **Uygulama:** `MenuEditor.tsx` — "Görsel ekle" alanı küçük link yerine tam genişlikte, kesik kenarlı (dashed border), ikon + metin + format bilgisi içeren büyük bir yükleme alanına dönüştürüldü. Hover'da turuncu renk geçişi ile etkileşim hissi güçlendirildi.
