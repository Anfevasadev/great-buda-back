CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(20) NOT NULL CHECK (status IN ('waiting', 'in_progress', 'finished')),
    winner_id UUID REFERENCES players(id),
    created_at TIMESTAMP DEFAULT NOW(),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    active_players INTEGER DEFAULT 0
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, 
    bingo_called BOOLEAN DEFAULT false,
    is_winner BOOLEAN DEFAULT false,
    is_disqualified BOOLEAN DEFAULT false,
    joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bingo_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) ON DELETE CASCADE,
    numbers JSONB NOT NULL
);

CREATE TABLE ballots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    number INTEGER NOT NULL CHECK (number BETWEEN 1 AND 75),
    sequence INTEGER NOT NULL,
    extracted_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO games (id, status, created_at)
VALUES ('game-uuid-1234', 'waiting', NOW());

INSERT INTO players (id, game_id, user_id, bingo_called, is_winner, is_disqualified, joined_at)
VALUES
    ('player-uuid-1', 'game-uuid-1234', 'user-uuid-1', false, false, false, NOW()),
    ('player-uuid-2', 'game-uuid-1234', 'user-uuid-2', true, false, true, NOW());

INSERT INTO bingo_cards (id, player_id, numbers)
VALUES
    ('card-uuid-1', 'player-uuid-1', '{
        "columns": {
            "B": [5, 12, 3, 9, 15],
            "I": [16, 22, 30, 18, 25],
            "N": [31, 43, "FREE", 36, 40],
            "G": [46, 53, 51, 58, 48],
            "O": [61, 68, 74, 70, 65]
        }
    }'),
    ('card-uuid-2', 'player-uuid-2', '{
        "columns": {
            "B": [2, 11, 4, 8, 14],
            "I": [17, 21, 28, 19, 26],
            "N": [32, 42, "FREE", 37, 41],
            "G": [45, 52, 50, 57, 47],
            "O": [60, 67, 73, 69, 64]
        }
    }');

INSERT INTO ballots (id, game_id, number, sequence, extracted_at)
VALUES
    ('ballot-uuid-1', 'game-uuid-1234', 5, 1, NOW()),
    ('ballot-uuid-2', 'game-uuid-1234', 18, 2, NOW()),
    ('ballot-uuid-3', 'game-uuid-1234', 36, 3, NOW());
