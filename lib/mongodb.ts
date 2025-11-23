import { MongoClient, type Db, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("laplacita_ftp");
}

// Product interface
export interface Product {
  _id?: ObjectId;
  name_en: string;
  name_es: string;
  description_en: string;
  description_es: string;
  price: number;
  category_en: string;
  category_es: string;
  image_url?: string;
  is_featured: boolean;
  created_at: Date;
  updated_at: Date;
}

// Promotion interface
export interface Promotion {
  _id?: ObjectId;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  image_url?: string;
  active_from: Date;
  active_to: Date;
  created_at: Date;
  updated_at: Date;
}

// Communication interface
export interface Communication {
  _id?: ObjectId;
  title_en: string;
  title_es: string;
  message_en: string;
  message_es: string;
  type: "announcement" | "alert" | "promotion" | "news";
  is_active: boolean;
  priority: "low" | "medium" | "high";
  created_at: Date;
  updated_at: Date;
}

// Product operations
export async function getProducts(
  category?: string,
  search?: string,
  featured?: boolean
): Promise<Product[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Product>("products");

    const filter: any = {};

    if (category && category !== "all") {
      filter.$or = [
        { category_en: { $regex: category, $options: "i" } },
        { category_es: { $regex: category, $options: "i" } },
      ];
    }

    if (search) {
      filter.$or = [
        { name_en: { $regex: search, $options: "i" } },
        { name_es: { $regex: search, $options: "i" } },
      ];
    }

    if (featured !== undefined) {
      filter.is_featured = featured;
    }

    const products = await collection
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Product>("products");
    const product = await collection.findOne({ _id: new ObjectId(id) });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function createProduct(
  product: Omit<Product, "_id" | "created_at" | "updated_at">
): Promise<Product> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Product>("products");

    const newProduct: Product = {
      ...product,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await collection.insertOne(newProduct as any);
    return { ...newProduct, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Product>
): Promise<Product | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Product>("products");

    const { _id, ...updateFields } = product;
    const updateData = {
      ...updateFields,
      updated_at: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    // FIX: Directly return the result, which is the updated document or null.
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Product>("products");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

// Promotion operations
export async function getPromotions(activeOnly = false): Promise<Promotion[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Promotion>("promotions");

    let filter: any = {};
    if (activeOnly) {
      const now = new Date();
      filter = {
        active_from: { $lte: now },
        active_to: { $gte: now },
      };
    }

    const promotions = await collection
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
    return promotions;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return [];
  }
}

export async function getPromotionById(id: string): Promise<Promotion | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Promotion>("promotions");
    const promotion = await collection.findOne({ _id: new ObjectId(id) });
    return promotion;
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return null;
  }
}

export async function createPromotion(
  promotion: Omit<Promotion, "_id" | "created_at" | "updated_at">
): Promise<Promotion> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Promotion>("promotions");

    const newPromotion: Promotion = {
      ...promotion,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await collection.insertOne(newPromotion as any);
    return { ...newPromotion, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating promotion:", error);
    throw error;
  }
}

export async function updatePromotion(
  id: string,
  promotion: Partial<Promotion>
): Promise<Promotion | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Promotion>("promotions");

    const { _id, ...updateFields } = promotion;
    const updateData = {
      ...updateFields,
      updated_at: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    // FIX: Directly return the result, which is the updated document or null.
    return result;
  } catch (error) {
    console.error("Error updating promotion:", error);
    throw error;
  }
}

export async function deletePromotion(id: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Promotion>("promotions");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return false;
  }
}

// Communication operations
export async function getCommunications(
  activeOnly = false
): Promise<Communication[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Communication>("communications");

    const filter: any = {};
    if (activeOnly) {
      filter.is_active = true;
    }

    const communications = await collection
      .find(filter)
      .sort({ priority: -1, created_at: -1 })
      .toArray();
    return communications;
  } catch (error) {
    console.error("Error fetching communications:", error);
    return [];
  }
}

export async function getCommunicationById(
  id: string
): Promise<Communication | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Communication>("communications");
    const communication = await collection.findOne({ _id: new ObjectId(id) });
    return communication;
  } catch (error) {
    console.error("Error fetching communication:", error);
    return null;
  }
}

export async function createCommunication(
  communication: Omit<Communication, "_id" | "created_at" | "updated_at">
): Promise<Communication> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Communication>("communications");

    const newCommunication: Communication = {
      ...communication,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await collection.insertOne(newCommunication as any);
    return { ...newCommunication, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating communication:", error);
    throw error;
  }
}

export async function updateCommunication(
  id: string,
  communication: Partial<Communication>
): Promise<Communication | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Communication>("communications");

    const { _id, ...updateFields } = communication;
    const updateData = {
      ...updateFields,
      updated_at: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    // FIX: Directly return the result, which is the updated document or null.
    return result;
  } catch (error) {
    console.error("Error updating communication:", error);
    throw error;
  }
}

export async function deleteCommunication(id: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const collection = db.collection<Communication>("communications");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting communication:", error);
    return false;
  }
}

// Exchange Rate interface
export interface ExchangeRate {
  _id?: ObjectId;
  rates: { [key: string]: string };
  logoType: string;
  selectedCountries: string[];
  countries: { [key: string]: { currency: string; flag: string; banks: string[] } };
  created_at: Date;
}

// Exchange Rate operations
export async function getLatestExchangeRate(): Promise<ExchangeRate | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<ExchangeRate>("exchange_rates");
    // Get the most recent one using find().limit(1) which is more robust
    const rates = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(1)
      .toArray();
    return rates.length > 0 ? rates[0] : null;
  } catch (error) {
    console.error("Error fetching latest exchange rate:", error);
    return null;
  }
}

export async function getExchangeRateHistory(limit = 50): Promise<ExchangeRate[]> {
  try {
    const db = await getDatabase();
    const collection = db.collection<ExchangeRate>("exchange_rates");
    const rates = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
    return rates;
  } catch (error) {
    console.error("Error fetching exchange rate history:", error);
    return [];
  }
}

export async function createExchangeRate(
  rateData: Omit<ExchangeRate, "_id" | "created_at">
): Promise<ExchangeRate> {
  try {
    const db = await getDatabase();
    const collection = db.collection<ExchangeRate>("exchange_rates");

    const newRate: ExchangeRate = {
      ...rateData,
      created_at: new Date(),
    };

    const result = await collection.insertOne(newRate as any);
    return { ...newRate, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating exchange rate:", error);
    throw error;
  }
}
