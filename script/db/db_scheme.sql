-- 1. Definizione del tipo ENUM per lo stato del ticket
CREATE TYPE ticket_state AS ENUM (
    'PENDING',
    'CALLED',
    'SERVED'
);

-- 2. Tabella SERVICE
CREATE TABLE service (
    id_service UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    avg_time INTEGER NOT NULL,
    CONSTRAINT avg_time_check CHECK (avg_time > 0)
);

-- 3. Tabella COUNTER
CREATE TABLE counter (
    id_counter UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number INTEGER NOT NULL UNIQUE,
    CONSTRAINT numer_check CHECK (number > 0)
);

-- 4. Tabella di collegamento COUNTER_SERVICE (Relazione Molti-a-Molti)
CREATE TABLE counter_service (
    id_counter UUID NOT NULL,
    id_service UUID NOT NULL,
    PRIMARY KEY (id_service, id_counter),
    CONSTRAINT counter_foreign_key FOREIGN KEY (id_counter) REFERENCES counter(id_counter),
    CONSTRAINT service_foreign_key FOREIGN KEY (id_service) REFERENCES service(id_service)
);

-- 5. Tabella TICKET
CREATE TABLE ticket (
    id_ticket UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(50) NOT NULL,
    state ticket_state NOT NULL,
    issue_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    serve_timestamp TIMESTAMP WITH TIME ZONE,
    id_service UUID NOT NULL,
    id_counter UUID,
    CONSTRAINT service_foreign_key FOREIGN KEY (id_service) REFERENCES service(id_service),
    CONSTRAINT counter_foreign_key FOREIGN KEY (id_counter) REFERENCES counter(id_counter),
    CONSTRAINT timestamp_check CHECK (serve_timestamp IS NULL OR serve_timestamp >= issue_timestamp)
);