const {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getFlashcardsByCollectionId,
    addFlashcardToCollection
  } = require('../backend/collections'); 
  const { pool } = require('../backend/database-pool');
  
  jest.mock('../backend/database-pool', () => ({
    pool: { query: jest.fn() }
  }));
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('Collection & Flashcard Functions', () => {
    describe('createCollection', () => {
      test('creates a new collection', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Math' }] });
        const res = await createCollection('Math');
        expect(pool.query).toHaveBeenCalledWith(
          'INSERT INTO collections (name) VALUES ($1) RETURNING *',
          ['Math']
        );
        expect(res).toEqual({ id: 1, name: 'Math' });
      });
  
      test('returns error on DB failure', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));
        const res = await createCollection('Math');
        expect(res).toEqual({ error: 'Database error while creating collection' });
      });
    });
  
    describe('getAllCollections', () => {
      test('fetches all collections', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
        const res = await getAllCollections();
        expect(res.length).toBe(2);
      });
  
      test('returns error on DB failure', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));
        const res = await getAllCollections();
        expect(res).toEqual({ error: 'Database error while retrieving collections' });
      });
    });
  
    describe('getCollectionById', () => {
      test('fetches specific collection by ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 3, name: 'History' }] });
        const res = await getCollectionById(3);
        expect(res).toEqual({ id: 3, name: 'History' });
      });
  
      test('returns error if not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const res = await getCollectionById(99);
        expect(res).toEqual({ error: 'Collection not found' });
      });
    });
  
    describe('updateCollection', () => {
      test('updates collection name', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Biology' }] });
        const res = await updateCollection(1, 'Biology');
        expect(res.name).toBe('Biology');
      });
  
      test('returns error if collection not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const res = await updateCollection(404, 'Physics');
        expect(res).toEqual({ error: 'Collection not found' });
      });
    });
  
    describe('deleteCollection', () => {
      test('deletes a collection', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
        const res = await deleteCollection(1);
        expect(res).toEqual({ message: 'Collection deleted successfully' });
      });
  
      test('returns error if collection not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });
        const res = await deleteCollection(999);
        expect(res).toEqual({ error: 'Collection not found' });
      });
    });
  
    describe('addFlashcardToCollection', () => {
      test('adds a flashcard', async () => {
        pool.query.mockResolvedValueOnce({
          rows: [{ id: 1, title: 'Q1', content: 'A1' }]
        });
        const res = await addFlashcardToCollection('Q1', 'A1', 1, 'blue', 'basic');
        expect(res).toEqual({ id: 1, title: 'Q1', content: 'A1' });
      });
  
      test('returns error on failure', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));
        const res = await addFlashcardToCollection('Q2', 'A2', 1, 'red', 'basic');
        expect(res).toEqual({ error: 'Database error while adding flashcard' });
      });
    });
  
    describe('getFlashcardsByCollectionId', () => {
      test('fetches flashcards in collection', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] });
        const res = await getFlashcardsByCollectionId(1);
        expect(res.length).toBe(2);
      });
  
      test('returns error on failure', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));
        const res = await getFlashcardsByCollectionId(1);
        expect(res).toEqual({ error: 'Database error while retrieving flashcards' });
      });
    });
  });