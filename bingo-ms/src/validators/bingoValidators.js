export const isFullCardCovered = (card, drawnNumbers) => {
  return card.every(row => row.every(number => drawnNumbers.has(number) || number === 'FREE'));
};

export const isDiagonalCovered = (card, drawnNumbers) => {
  const leftToRight = card.every((row, index) => drawnNumbers.has(row[index]) || row[index] === 'FREE');
  const rightToLeft = card.every((row, index) => drawnNumbers.has(row[4 - index]) || row[4 - index] === 'FREE');
  return leftToRight || rightToLeft;
};

export const isColumnCovered = (card, drawnNumbers) => {
  for (let col = 0; col < 5; col++) {
    if (card.every(row => drawnNumbers.has(row[col]) || row[col] === 'FREE')) {
      return true;
    }
  }
  return false;
};

export const isRowCovered = (card, drawnNumbers) => {
  return card.some(row => row.every(number => drawnNumbers.has(number) || number === 'FREE'));
};

export const areCornersCovered = (card, drawnNumbers) => {
  return (drawnNumbers.has(card[0][0])) &&
         (drawnNumbers.has(card[0][4])) &&
         (drawnNumbers.has(card[4][0])) &&
         (drawnNumbers.has(card[4][4]));
};

export const validateBingo = (card, drawnNumbers) => {
  return isFullCardCovered(card, drawnNumbers) ||
         isDiagonalCovered(card, drawnNumbers) ||
         isColumnCovered(card, drawnNumbers) ||
         isRowCovered(card, drawnNumbers) ||
         areCornersCovered(card, drawnNumbers);
};