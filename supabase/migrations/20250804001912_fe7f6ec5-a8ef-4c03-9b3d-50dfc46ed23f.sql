-- Lägg till gilbert@archacademy.se som admin-användare
INSERT INTO admin_users (user_id, email, is_active, created_at)
VALUES (
  '002da26c-3594-4787-84c8-4803fc65aa38',
  'gilbert@archacademy.se',
  true,
  now()
)
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  updated_at = now();