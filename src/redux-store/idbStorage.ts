import localforage from "localforage";

/** IndexedDB storage engine for redux-persist, backed by localforage. */
export function createIdbStorage(dbName: string) {
  const db = localforage.createInstance({ name: dbName });
  return {
    getItem: db.getItem.bind(db),
    setItem: db.setItem.bind(db),
    removeItem: db.removeItem.bind(db),
  };
}
