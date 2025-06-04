import { sql } from "@vercel/postgres"

// Database initialization
export async function initializeDatabase() {
  try {
    // Create products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_es VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_es TEXT,
        price DECIMAL(10,2) NOT NULL,
        category_en VARCHAR(100) NOT NULL,
        category_es VARCHAR(100) NOT NULL,
        image_url VARCHAR(500),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create promotions table
    await sql`
      CREATE TABLE IF NOT EXISTS promotions (
        id SERIAL PRIMARY KEY,
        title_en VARCHAR(255) NOT NULL,
        title_es VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_es TEXT,
        image_url VARCHAR(500),
        active_from DATE NOT NULL,
        active_to DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
  }
}

// Product operations
export async function getProducts(category?: string, search?: string, featured?: boolean) {
  try {
    let query = "SELECT * FROM products WHERE 1=1"
    const params: any[] = []
    let paramCount = 0

    if (category) {
      paramCount++
      query += ` AND (category_en = $${paramCount} OR category_es = $${paramCount})`
      params.push(category)
    }

    if (search) {
      paramCount++
      query += ` AND (name_en ILIKE $${paramCount} OR name_es ILIKE $${paramCount})`
      params.push(`%${search}%`)
    }

    if (featured !== undefined) {
      paramCount++
      query += ` AND is_featured = $${paramCount}`
      params.push(featured)
    }

    query += " ORDER BY created_at DESC"

    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function createProduct(product: any) {
  try {
    const result = await sql`
      INSERT INTO products (name_en, name_es, description_en, description_es, price, category_en, category_es, image_url, is_featured)
      VALUES (${product.name_en}, ${product.name_es}, ${product.description_en}, ${product.description_es}, ${product.price}, ${product.category_en}, ${product.category_es}, ${product.image_url}, ${product.is_featured})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: number, product: any) {
  try {
    const result = await sql`
      UPDATE products 
      SET name_en = ${product.name_en}, name_es = ${product.name_es}, 
          description_en = ${product.description_en}, description_es = ${product.description_es},
          price = ${product.price}, category_en = ${product.category_en}, category_es = ${product.category_es},
          image_url = ${product.image_url}, is_featured = ${product.is_featured}
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: number) {
  try {
    await sql`DELETE FROM products WHERE id = ${id}`
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Promotion operations
export async function getPromotions(activeOnly = false) {
  try {
    let query = "SELECT * FROM promotions"
    if (activeOnly) {
      query += " WHERE active_from <= CURRENT_DATE AND active_to >= CURRENT_DATE"
    }
    query += " ORDER BY created_at DESC"

    const result = await sql.query(query)
    return result.rows
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return []
  }
}

export async function createPromotion(promotion: any) {
  try {
    const result = await sql`
      INSERT INTO promotions (title_en, title_es, description_en, description_es, image_url, active_from, active_to)
      VALUES (${promotion.title_en}, ${promotion.title_es}, ${promotion.description_en}, ${promotion.description_es}, ${promotion.image_url}, ${promotion.active_from}, ${promotion.active_to})
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error creating promotion:", error)
    throw error
  }
}

export async function updatePromotion(id: number, promotion: any) {
  try {
    const result = await sql`
      UPDATE promotions 
      SET title_en = ${promotion.title_en}, title_es = ${promotion.title_es},
          description_en = ${promotion.description_en}, description_es = ${promotion.description_es},
          image_url = ${promotion.image_url}, active_from = ${promotion.active_from}, active_to = ${promotion.active_to}
      WHERE id = ${id}
      RETURNING *
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error updating promotion:", error)
    throw error
  }
}

export async function deletePromotion(id: number) {
  try {
    await sql`DELETE FROM promotions WHERE id = ${id}`
  } catch (error) {
    console.error("Error deleting promotion:", error)
    throw error
  }
}

// Admin user operations
export async function createAdminUser(username: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id, username
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}

export async function getAdminUser(username: string) {
  try {
    const result = await sql`
      SELECT * FROM admin_users WHERE username = ${username}
    `
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching admin user:", error)
    return null
  }
}
