import Game from './game.js';
import Player from './player.js';
import BingoCard from './bingoCard.js';

Game.hasMany(Player, { foreignKey: 'game_id', onDelete: 'CASCADE', hooks: true });
Player.belongsTo(Game, { foreignKey: 'game_id' });

Player.hasMany(BingoCard, { foreignKey: 'player_id', onDelete: 'CASCADE', hooks: true });
BingoCard.belongsTo(Player, { foreignKey: 'player_id' });

export { Game, Player, BingoCard };