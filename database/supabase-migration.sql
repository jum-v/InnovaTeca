-- Adicionar UUID extension se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Alterar a coluna id para ter valor default UUID
ALTER TABLE technologies
  ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Verificar se a constraint existe e criar se necessário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'technologies_pkey'
  ) THEN
    ALTER TABLE technologies ADD PRIMARY KEY (id);
  END IF;
END $$;
