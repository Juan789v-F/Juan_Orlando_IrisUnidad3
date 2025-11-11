-- Dark Souls Wiki Database Initialization Script
-- This script is idempotent and can be run multiple times

-- Drop existing tables if they exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS bosses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bosses table
CREATE TABLE bosses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description TEXT NOT NULL,
  lore TEXT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  boss_id INTEGER NOT NULL REFERENCES bosses(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_comments_boss_id ON comments(boss_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Insert seed data for Dark Souls bosses
INSERT INTO bosses (name, short_description, lore, image_url) VALUES
(
  'Artorias el Caminante del Abismo',
  'Un caballero legendario corrompido por el Abismo',
  'Sir Artorias fue uno de los Cuatro Caballeros de Gwyn, los caballeros comandantes del Señor Gwyn. Vestía una armadura azul real y blandía su Gran Espada y Gran Escudo con vigor. Artorias tenía una voluntad de acero inquebrantable, que tanto ayudó como alimentó su indomable orgullo como caballero. Durante su vida, fue conocido por matar a los Espectros Oscuros e incluso derrotó al Abismo mismo. Sin embargo, cuando viajó a Oolacile para rescatar a la Princesa Dusk, fue abrumado por las criaturas del Abismo. Para proteger a su leal compañero Sif, le dio al lobo su Gran Escudo y fue consumido por el Abismo. Ahora vaga como un cascarón corrompido de su antiguo ser, atacando a todos los que se atreven a entrar en su dominio.',
  'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=600&h=400&fit=crop'
),
(
  'Ornstein y Smough',
  'Los guardias reales de Anor Londo',
  'El Asesino de Dragones Ornstein y el Verdugo Smough son los guardianes finales de la catedral de Anor Londo. Ornstein fue uno de los caballeros más confiables del Señor Gwyn y el líder de los Cuatro Caballeros de Gwyn. Le fue otorgada un alma especial y un anillo por el Señor de la Luz Solar. Smough, por otro lado, fue el último caballero que quedó para guardar la catedral. Era conocido por su tamaño inmenso y sus brutales ejecuciones. El dúo fue dejado para guardar la ilusión de Gwynevere y probar a aquellos que buscaban una audiencia con la Princesa de la Luz Solar. Sus estilos de lucha contrastantes - los ataques de lanza rápidos como el rayo de Ornstein y los devastadores golpes de martillo de Smough - los convierten en uno de los encuentros más desafiantes en Lordran.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop'
),
(
  'Gwyn, Señor de la Ceniza',
  'El dios caído que vinculó la Primera Llama',
  'El Señor Gwyn fue el Señor de la Luz Solar y la figura central de la Era del Fuego. Descubrió el Alma del Señor dentro de la Primera Llama y usó su poder para derrotar a los Dragones Eternos junto con sus caballeros y aliados. Gwyn gobernó sobre Anor Londo con su familia y caballeros, estableciendo la Era del Fuego y el camino de los dioses. Sin embargo, cuando la Primera Llama comenzó a desvanecerse, amenazando con sumergir al mundo en una Era de Oscuridad, Gwyn hizo el sacrificio final. Se vinculó a sí mismo a la Primera Llama para prolongar la Era del Fuego, quemando su alma como leña. Ahora, existe como un cascarón hueco de su antigua gloria, el Señor de la Ceniza, atado para siempre a defender el Horno de la Primera Llama de aquellos que desafiarían el fuego que se desvanece.',
  'https://images.unsplash.com/photo-1525923838299-2312b60f6d69?w=600&h=400&fit=crop'
),
(
  'Sif, el Gran Lobo Gris',
  'El leal compañero de Artorias',
  'Sif es un Gran Lobo Gris que guarda la tumba de su antiguo maestro, el Caballero Artorias. Esta noble bestia blande la Gran Espada de Artorias en su boca para repeler a cualquiera que se atreva a perturbar la santidad del lugar de descanso de su maestro. Hace mucho tiempo, Sif acompañó a Artorias a Oolacile para rescatar a la Princesa Dusk del Abismo. Cuando Artorias fue consumido por la oscuridad, le dio su Gran Escudo a Sif para proteger al lobo del mismo destino. Sif logró escapar y desde entonces ha permanecido leal a su maestro caído, montando guardia sobre su tumba en el Jardín de la Raíz Oscura. La lealtad inquebrantable del lobo y su trágica historia hacen de este uno de los encuentros más emocionalmente desafiantes en Dark Souls, ya que los jugadores deben enfrentar a una criatura que lucha solo para honrar y proteger la memoria de un héroe caído.',
  'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=600&h=400&fit=crop'
);

-- Verify data insertion
SELECT 'Database initialized successfully with ' || COUNT(*) || ' bosses' as status FROM bosses;
