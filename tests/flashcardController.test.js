const {createFlashcard, getFlashcards, getFlashcardById, updateFlashcard, deleteFlashcard} = require('../backend/flashcardController');
  
  const { pool } = require('../backend/database-pool');
  
  jest.mock('../backend/database-pool', () => ({
    pool: {
      query: jest.fn()
    }
  }));
  
  describe('Flashcard functions', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    //createFlashcard
    test('createFlashcard inserts a flashcard and returns it', async () => {
      const mockCard = {
        flashcard_id: 1,
        user_id: 1,
        flashcard_term: 'Term',
        flashcard_definition: 'Definition',
        flashcard_colour: 'blue'
      };
  
      pool.query.mockResolvedValueOnce({ rows: [mockCard] });
  
      const result = await createFlashcard({
        userId: 1,
        term: 'Term',
        definition: 'Definition',
        colour: 'blue'
      });
  
      expect(result).toEqual(mockCard);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO flashcards'),
        [1, 'Term', 'Definition', 'blue']
      );
    });
  
    //getFlashcard
    test('getFlashcards returns all flashcards for a user', async () => {
      const mockCards = [{ flashcard_id: 1 }, { flashcard_id: 2 }];
      pool.query.mockResolvedValueOnce({ rows: mockCards });
  
      const result = await getFlashcards(1);
      expect(result).toEqual(mockCards);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM flashcards WHERE user_id = $1'),
        [1]
      );
    });
  
    //getFlashcardById
    test('getFlashcardById returns one flashcard', async () => {
      const mockCard = { flashcard_id: 1, flashcard_term: 'X' };
      pool.query.mockResolvedValueOnce({ rows: [mockCard] });
  
      const result = await getFlashcardById(1);
      expect(result).toEqual(mockCard);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE flashcard_id = $1'),
        [1]
      );
    });
  
    //updateFlashcard
    test('updateFlashcard updates and returns the updated card', async () => {
      const mockUpdated = { flashcard_id: 1, term: 'Updated', definition: 'Updated', colour: 'red' };
      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockUpdated] });
  
      const result = await updateFlashcard(1, 'Updated', 'Updated', 'red');
      expect(result).toEqual(mockUpdated);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE flashcards SET term'),
        ['Updated', 'Updated', 'red', 1]
      );
    });
  
    test('updateFlashcard returns null if no rows updated', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0 });
  
      const result = await updateFlashcard(1, 'X', 'Y', 'Z');
      expect(result).toBeNull();
    });
  
    //deleteFlashcard
    test('deleteFlashcard deletes a flashcard and returns it', async () => {
      const mockDeleted = { flashcard_id: 1 };
      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockDeleted] });
  
      const result = await deleteFlashcard(1);
      expect(result).toEqual(mockDeleted);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM flashcards WHERE flashcard_id = $1'),
        [1]
      );
    });
  
    test('deleteFlashcard returns null if no flashcard is found', async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0 });
  
      const result = await deleteFlashcard(999);
      expect(result).toBeNull();
    });
  });