import { openDB, deleteDB } from "idb";
const DefaultData = {
  version: 1,
  objectStores: ["followers", "following", "fans", "idols", "friends"],
};
class RelatedUsersDB {
  constructor({ version, objectStores, pk }) {
    this.version = version;
    this.objectStores = objectStores;
    this.db = null;
    this.upgrade = false;
    this.pk = pk;
    this.name = "";
  }
  async open() {
    const that = this;
    this.name = `RelatedUsers-${this.pk}`;
    this.db = await openDB(this.name, this.version, {
      upgrade(db) {
        const stores = {};
        that.upgrade = true;
        that.objectStores.forEach((storeKey) => {
          stores[storeKey] = db.createObjectStore(storeKey, {
            keyPath: "pk",
          });
          stores[storeKey].createIndex("pending_request", "pending_request", {
            unique: false,
          });
        });
      },
    });
  }
  close() {
    this.db.close();
  }
  async addOne(store_key, user) {
    await this.db.add(store_key, user);
  }
  async add(store_key, users) {
    const tx = this.db.transaction(store_key, "readwrite");
    const usersPromises = users.map((user) => tx.store.add(user));
    usersPromises.push(tx.done);
    await Promise.all(usersPromises);
  }
  async getAllFromIndex(storeName, key, value) {
    const keyRange = IDBKeyRange.only(value);
    return this.db.getAllFromIndex(storeName, key, keyRange);
  }
  async getAll(store_key) {
    return await this.db.getAll(store_key);
  }
  async getOne(store_key, pk) {
    return await this.db.get(store_key, pk);
  }
  async putOne(store_key, user) {
    await this.db.put(store_key, user);
  }
  async getFromIndex(store_key, indexed_key, value) {
    this.db.getFromIndex(store_key, indexed_key, value);
  }
  async deleteOne(store_key, pk) {
    console.log({ store_key, pk });
    await this.db.delete(store_key, pk);
  }
  async delete() {
    await deleteDB(this.name, {
      blocked: () => console.warn("BLOCKED DELETE DB " + this.name),
    });
  }
}

async function initDB(pk, version, stores) {
  const DB = new RelatedUsersDB({
    version: version,
    objectStores: stores,
    pk,
  });
  await DB.open();
  return { DB };
}

export default async function (
  pk,
  stores = DefaultData.objectStores,
  version = DefaultData.version
) {
  const { DB } = await initDB(pk, version, stores);
  return {
    setUsers(users) {
      return Promise.all(
        Object.entries(users).map(([group, value]) => DB.add(group, value))
      );
    },
    async getUsers() {
      const users = {};
      for (const group of stores) {
        users[group] = await DB.getAll(group);
      }
      return users;
    },
    deleteUser({ pk }, storesWhere = stores) {
      return Promise.all(storesWhere.map((store) => DB.deleteOne(store, pk)));
    },
    addUser(user, storesWhere = stores) {
      return Promise.all(storesWhere.map((store) => DB.addOne(store, user)));
    },
    putUser(user, storesWhere = stores) {
      return Promise.all(storesWhere.map((store) => DB.putOne(store, user)));
    },
    getUser(user_pk, store) {
      return DB.getOne(store, user_pk);
    },
    async getUserStoreNames(user) {
      console.log({ user });
      const storeNames = [];
      for (const store of stores) {
        const exists = await DB.getOne(store, user.pk);
        if (exists) storeNames.push(store);
      }
      return storeNames;
    },
    async getUserWithPendingRequests() {
      const [following, followers] = await Promise.all([
        DB.getAllFromIndex("following", "pending_request", 1),
        DB.getAllFromIndex("followers", "pending_request", 1),
      ]);
      return following.concat(followers);
    },
    isFirstDB() {
      return DB.upgrade;
    },
    delete() {
      return DB.delete();
    },
    close() {
      DB.close();
    },
  };
}
