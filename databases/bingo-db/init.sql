CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS waiting_rooms (
    room_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);

INSERT INTO waiting_rooms (name, status)
VALUES 
    ('Sala 1', 'open'),
    ('Sala 2', 'closed');