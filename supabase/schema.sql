-- Kafe tablosu: her kayıtlı kullanıcının bir kafesi var
CREATE TABLE cafes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'Kafem',
  description TEXT NOT NULL DEFAULT '',
  slug        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ürün tablosu
CREATE TABLE products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id    UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  price      NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category   TEXT NOT NULL DEFAULT 'Genel',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) — her kullanıcı sadece kendi verisini görür/değiştirir
ALTER TABLE cafes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Kafe politikaları
CREATE POLICY "Kafe sahibi kendi kafesini görür"
  ON cafes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Kafe sahibi kendi kafesini yönetir"
  ON cafes FOR ALL USING (auth.uid() = user_id);

-- Ürün politikaları
CREATE POLICY "Kafe sahibi kendi ürünlerini görür"
  ON products FOR SELECT
  USING (cafe_id IN (SELECT id FROM cafes WHERE user_id = auth.uid()));

CREATE POLICY "Kafe sahibi kendi ürünlerini yönetir"
  ON products FOR ALL
  USING (cafe_id IN (SELECT id FROM cafes WHERE user_id = auth.uid()));

-- Müşteri menüsü: herkese açık okuma
CREATE POLICY "Herkes kafes bilgisini okuyabilir"
  ON cafes FOR SELECT USING (true);

CREATE POLICY "Herkes ürünleri okuyabilir"
  ON products FOR SELECT USING (true);
