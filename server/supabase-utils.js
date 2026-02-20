/**
 * Supabase Utility Functions - Universal CRUD Operations
 * 
 * This utility provides a unified interface for all CRUD operations
 * across any Supabase table with optional file upload support.
 * 
 * Usage:
 *   - Create: await createRecord('feed', { title: 'Test', description: 'Desc' })
 *   - Read: await getRecords('feed') or await getRecord('feed', 1)
 *   - Update: await updateRecord('feed', 1, { title: 'Updated' })
 *   - Delete: await deleteRecord('feed', 1)
 *   - Upload: await uploadFile('uploads', file, 'path/to/file.jpg')
 */

// Import Supabase client (make sure supabase-js is loaded)
if (typeof supabase === 'undefined') {
  throw new Error('Supabase JS library not loaded. Include: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
}

// Get config from config.js (which reads from environment variables)
let config;
if (typeof module !== "undefined" && module.exports) {
  // Node.js environment
  config = require('./config.js');
} else {
  // Browser environment - check window.SUPABASE_CONFIG (set by config.js)
  if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
    config = window.SUPABASE_CONFIG;
  } else {
    throw new Error('SUPABASE_CONFIG not found. Make sure config.js is loaded before supabase-utils.js');
  }
}

// Initialize Supabase client
const supabaseClient = supabase.createClient(config.url, config.anonKey);

/**
 * ============================================
 * CREATE OPERATIONS
 * ============================================
 */

/**
 * Create a new record in the specified table
 * @param {string} tableName - Name of the table
 * @param {Object|Array} data - Single object or array of objects to insert
 * @param {Object} options - Additional options
 * @param {boolean} options.returnData - Whether to return inserted data (default: true)
 * @param {Array} options.select - Specific columns to return (default: '*')
 * @returns {Promise<{data: any, error: any}>}
 */
async function createRecord(tableName, data, options = {}) {
  try {
    if (!tableName) {
      throw new Error("Table name is required");
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      throw new Error("Data is required");
    }

    const insertData = Array.isArray(data) ? data : [data];
    const selectColumns = options.select || "*";
    const returnData = options.returnData !== false;

    let query = supabaseClient
      .from(tableName)
      .insert(insertData);

    if (returnData) {
      query = query.select(selectColumns);
    }

    const { data: result, error } = await query;

    if (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      return { data: null, error };
    }

    const returnValue = Array.isArray(data) ? result : (result && result[0] ? result[0] : result);
    return { data: returnValue, error: null };
  } catch (error) {
    console.error(`Exception creating record in ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * Create a record with file upload
 * @param {string} tableName - Name of the table
 * @param {Object} data - Data object (file property will be replaced with uploaded URL)
 * @param {File} file - File object to upload
 * @param {string} bucketName - Name of the storage bucket
 * @param {Object} options - Additional options
 * @param {string} options.filePath - Custom file path (default: auto-generated)
 * @param {string} options.fileProperty - Property name in data object for file URL (default: 'file')
 * @param {Object} options.uploadOptions - Options for file upload
 * @returns {Promise<{data: any, error: any}>}
 */
async function createRecordWithFile(tableName, data, file, bucketName, options = {}) {
  try {
    if (!tableName || !file || !bucketName) {
      throw new Error("Table name, file, and bucket name are required");
    }

    // Upload file first
    const uploadResult = await uploadFile(bucketName, file, options.filePath, options.uploadOptions);
    
    if (uploadResult.error) {
      return { data: null, error: uploadResult.error };
    }

    // Replace file property with uploaded URL
    const fileProperty = options.fileProperty || 'file';
    const recordData = {
      ...data,
      [fileProperty]: uploadResult.data.publicUrl
    };

    // Create record with file URL
    return await createRecord(tableName, recordData, options);
  } catch (error) {
    console.error(`Exception creating record with file in ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * ============================================
 * READ OPERATIONS
 * ============================================
 */

/**
 * Get all records from a table
 * @param {string} tableName - Name of the table
 * @param {Object} options - Query options
 * @param {Array|string} options.select - Columns to select (default: '*')
 * @param {number} options.limit - Maximum number of records to return
 * @param {number} options.offset - Number of records to skip
 * @param {string} options.orderBy - Column to order by
 * @param {boolean} options.ascending - Order direction (default: false)
 * @param {Object} options.filters - Filter conditions (e.g., { column: 'value', column2: { op: 'gt', value: 10 } })
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
async function getRecords(tableName, options = {}) {
  try {
    if (!tableName) {
      throw new Error("Table name is required");
    }

    const selectColumns = options.select || "*";
    const limit = options.limit;
    const offset = options.offset || 0;
    const orderBy = options.orderBy;
    const ascending = options.ascending !== undefined ? options.ascending : false;
    const filters = options.filters || {};
    const count = options.count || false;

    let query = supabaseClient
      .from(tableName)
      .select(selectColumns, count ? { count: 'exact' } : {});

    // Apply filters
    Object.keys(filters).forEach(column => {
      const filterValue = filters[column];
      
      if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
        // Advanced filter: { op: 'gt', value: 10 }
        const op = filterValue.op || 'eq';
        const value = filterValue.value;
        
        switch (op) {
          case 'eq': query = query.eq(column, value); break;
          case 'neq': query = query.neq(column, value); break;
          case 'gt': query = query.gt(column, value); break;
          case 'gte': query = query.gte(column, value); break;
          case 'lt': query = query.lt(column, value); break;
          case 'lte': query = query.lte(column, value); break;
          case 'like': query = query.like(column, value); break;
          case 'ilike': query = query.ilike(column, value); break;
          case 'in': query = query.in(column, Array.isArray(value) ? value : [value]); break;
          case 'is': query = query.is(column, value); break;
        }
      } else {
        // Simple equality filter
        query = query.eq(column, filterValue);
      }
    });

    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    // Apply pagination
    if (limit) {
      query = query.range(offset, offset + limit - 1);
    } else if (offset > 0) {
      query = query.range(offset, offset + 999999); // Large number for offset without limit
    }

    const { data, error, count: recordCount } = await query;

    if (error) {
      console.error(`Error fetching records from ${tableName}:`, error);
      return { data: null, error, count: 0 };
    }

    return { data: data || [], error: null, count: recordCount || data?.length || 0 };
  } catch (error) {
    console.error(`Exception fetching records from ${tableName}:`, error);
    return { data: null, error, count: 0 };
  }
}

/**
 * Get a single record by ID
 * @param {string} tableName - Name of the table
 * @param {number|string} id - Record ID
 * @param {Object} options - Query options
 * @param {Array|string} options.select - Columns to select (default: '*')
 * @param {string} options.idColumn - ID column name (default: 'id')
 * @returns {Promise<{data: any, error: any}>}
 */
async function getRecord(tableName, id, options = {}) {
  try {
    if (!tableName || id === undefined || id === null) {
      throw new Error("Table name and ID are required");
    }

    const selectColumns = options.select || "*";
    const idColumn = options.idColumn || "id";

    const { data, error } = await supabaseClient
      .from(tableName)
      .select(selectColumns)
      .eq(idColumn, id)
      .single();

    if (error) {
      console.error(`Error fetching record from ${tableName}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Exception fetching record from ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * Get count of records
 * @param {string} tableName - Name of the table
 * @param {Object} options - Filter options (same as getRecords)
 * @returns {Promise<{count: number, error: any}>}
 */
async function getRecordCount(tableName, options = {}) {
  try {
    const filters = options.filters || {};
    let query = supabaseClient
      .from(tableName)
      .select("*", { count: "exact", head: true });

    // Apply filters
    Object.keys(filters).forEach(column => {
      const filterValue = filters[column];
      if (typeof filterValue === 'object' && filterValue !== null && !Array.isArray(filterValue)) {
        const op = filterValue.op || 'eq';
        const value = filterValue.value;
        switch (op) {
          case 'eq': query = query.eq(column, value); break;
          case 'neq': query = query.neq(column, value); break;
          case 'gt': query = query.gt(column, value); break;
          case 'gte': query = query.gte(column, value); break;
          case 'lt': query = query.lt(column, value); break;
          case 'lte': query = query.lte(column, value); break;
        }
      } else {
        query = query.eq(column, filterValue);
      }
    });

    const { count, error } = await query;

    if (error) {
      console.error(`Error counting records in ${tableName}:`, error);
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  } catch (error) {
    console.error(`Exception counting records in ${tableName}:`, error);
    return { count: 0, error };
  }
}

/**
 * ============================================
 * UPDATE OPERATIONS
 * ============================================
 */

/**
 * Update a record by ID
 * @param {string} tableName - Name of the table
 * @param {number|string} id - Record ID
 * @param {Object} updates - Object with fields to update
 * @param {Object} options - Additional options
 * @param {boolean} options.returnData - Whether to return updated data (default: true)
 * @param {Array} options.select - Specific columns to return (default: '*')
 * @param {string} options.idColumn - ID column name (default: 'id')
 * @returns {Promise<{data: any, error: any}>}
 */
async function updateRecord(tableName, id, updates, options = {}) {
  try {
    if (!tableName || id === undefined || id === null) {
      throw new Error("Table name and ID are required");
    }

    if (!updates || Object.keys(updates).length === 0) {
      throw new Error("Updates object is required and cannot be empty");
    }

    const selectColumns = options.select || "*";
    const returnData = options.returnData !== false;
    const idColumn = options.idColumn || "id";

    let query = supabaseClient
      .from(tableName)
      .update(updates)
      .eq(idColumn, id);

    if (returnData) {
      query = query.select(selectColumns);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error updating record in ${tableName}:`, error);
      return { data: null, error };
    }

    const returnValue = data && data[0] ? data[0] : data;
    return { data: returnValue, error: null };
  } catch (error) {
    console.error(`Exception updating record in ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * Update a record with file upload
 * @param {string} tableName - Name of the table
 * @param {number|string} id - Record ID
 * @param {Object} updates - Object with fields to update
 * @param {File} file - File object to upload (optional)
 * @param {string} bucketName - Name of the storage bucket (required if file provided)
 * @param {Object} options - Additional options
 * @returns {Promise<{data: any, error: any}>}
 */
async function updateRecordWithFile(tableName, id, updates, file = null, bucketName = null, options = {}) {
  try {
    let finalUpdates = { ...updates };

    // If file is provided, upload it first
    if (file && bucketName) {
      const uploadResult = await uploadFile(bucketName, file, options.filePath, options.uploadOptions);
      
      if (uploadResult.error) {
        return { data: null, error: uploadResult.error };
      }

      const fileProperty = options.fileProperty || 'file';
      finalUpdates[fileProperty] = uploadResult.data.publicUrl;
    }

    // Update record
    return await updateRecord(tableName, id, finalUpdates, options);
  } catch (error) {
    console.error(`Exception updating record with file in ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * Update multiple records
 * @param {string} tableName - Name of the table
 * @param {Array} ids - Array of record IDs
 * @param {Object} updates - Object with fields to update
 * @param {Object} options - Additional options
 * @param {string} options.idColumn - ID column name (default: 'id')
 * @returns {Promise<{data: Array, error: any}>}
 */
async function updateRecords(tableName, ids, updates, options = {}) {
  try {
    if (!tableName || !ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Table name and array of IDs are required");
    }

    const idColumn = options.idColumn || "id";

    const { data, error } = await supabaseClient
      .from(tableName)
      .update(updates)
      .in(idColumn, ids)
      .select();

    if (error) {
      console.error(`Error updating records in ${tableName}:`, error);
      return { data: null, error };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error(`Exception updating records in ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * ============================================
 * DELETE OPERATIONS
 * ============================================
 */

/**
 * Delete a record by ID
 * @param {string} tableName - Name of the table
 * @param {number|string} id - Record ID
 * @param {Object} options - Additional options
 * @param {boolean} options.returnData - Whether to return deleted data (default: true)
 * @param {string} options.idColumn - ID column name (default: 'id')
 * @returns {Promise<{data: any, error: any}>}
 */
async function deleteRecord(tableName, id, options = {}) {
  try {
    if (!tableName || id === undefined || id === null) {
      throw new Error("Table name and ID are required");
    }

    const returnData = options.returnData !== false;
    const idColumn = options.idColumn || "id";

    let query = supabaseClient
      .from(tableName)
      .delete()
      .eq(idColumn, id);

    if (returnData) {
      query = query.select();
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error deleting record from ${tableName}:`, error);
      return { data: null, error };
    }

    const returnValue = data && data[0] ? data[0] : data;
    return { data: returnValue, error: null };
  } catch (error) {
    console.error(`Exception deleting record from ${tableName}:`, error);
    return { data: null, error };
  }
}

/**
 * Delete multiple records by IDs
 * @param {string} tableName - Name of the table
 * @param {Array} ids - Array of record IDs
 * @param {Object} options - Additional options
 * @param {string} options.idColumn - ID column name (default: 'id')
 * @returns {Promise<{data: Array, error: any, count: number}>}
 */
async function deleteRecords(tableName, ids, options = {}) {
  try {
    if (!tableName || !ids || !Array.isArray(ids) || ids.length === 0) {
      throw new Error("Table name and array of IDs are required");
    }

    const idColumn = options.idColumn || "id";

    const { data, error } = await supabaseClient
      .from(tableName)
      .delete()
      .in(idColumn, ids)
      .select();

    if (error) {
      console.error(`Error deleting records from ${tableName}:`, error);
      return { data: null, error, count: 0 };
    }

    return { data: data || [], error: null, count: data?.length || 0 };
  } catch (error) {
    console.error(`Exception deleting records from ${tableName}:`, error);
    return { data: null, error, count: 0 };
  }
}

/**
 * ============================================
 * FILE UPLOAD OPERATIONS
 * ============================================
 */

/**
 * Upload a file to Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {File} file - File object to upload
 * @param {string} filePath - Path/filename in storage (optional, auto-generated if not provided)
 * @param {Object} uploadOptions - Upload options
 * @param {string} uploadOptions.cacheControl - Cache control header
 * @param {boolean} uploadOptions.upsert - Whether to overwrite if exists
 * @param {string} uploadOptions.contentType - Content type (auto-detected if not provided)
 * @returns {Promise<{data: {publicUrl: string, path: string}, error: any}>}
 */
async function uploadFile(bucketName, file, filePath = null, uploadOptions = {}) {
  try {
    if (!bucketName || !file) {
      throw new Error("Bucket name and file are required");
    }

    // Generate file path if not provided
    const path = filePath || `${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;

    // Prepare upload options
    const options = {
      cacheControl: uploadOptions.cacheControl || '3600',
      upsert: uploadOptions.upsert || false,
      contentType: uploadOptions.contentType || file.type || 'application/octet-stream'
    };

    // Upload file
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(path, file, options);

    if (uploadError) {
      console.error(`Error uploading file to ${bucketName}:`, uploadError);
      return { data: null, error: uploadError };
    }

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(path);

    return {
      data: {
        publicUrl: urlData.publicUrl,
        path: uploadData.path || path
      },
      error: null
    };
  } catch (error) {
    console.error(`Exception uploading file to ${bucketName}:`, error);
    return { data: null, error };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path to the file in storage
 * @returns {Promise<{data: any, error: any}>}
 */
async function deleteFile(bucketName, filePath) {
  try {
    if (!bucketName || !filePath) {
      throw new Error("Bucket name and file path are required");
    }

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`Error deleting file from ${bucketName}:`, error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Exception deleting file from ${bucketName}:`, error);
    return { data: null, error };
  }
}

/**
 * Get public URL for a file
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path to the file in storage
 * @returns {string} Public URL
 */
function getFileUrl(bucketName, filePath) {
  if (!bucketName || !filePath) {
    throw new Error("Bucket name and file path are required");
  }

  const { data } = supabaseClient.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * ============================================
 * UPSERT OPERATIONS
 * ============================================
 */

/**
 * Upsert (insert or update) a record
 * @param {string} tableName - Name of the table
 * @param {Object} data - Data object (must include ID for update)
 * @param {Object} options - Additional options
 * @param {string} options.onConflict - Column name for conflict resolution (default: 'id')
 * @returns {Promise<{data: any, error: any}>}
 */
async function upsertRecord(tableName, data, options = {}) {
  try {
    if (!tableName || !data) {
      throw new Error("Table name and data are required");
    }

    const onConflict = options.onConflict || "id";

    const { data: result, error } = await supabaseClient
      .from(tableName)
      .upsert(data, { onConflict })
      .select();

    if (error) {
      console.error(`Error upserting record in ${tableName}:`, error);
      return { data: null, error };
    }

    const returnValue = Array.isArray(result) && result[0] ? result[0] : result;
    return { data: returnValue, error: null };
  } catch (error) {
    console.error(`Exception upserting record in ${tableName}:`, error);
    return { data: null, error };
  }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

const SupabaseUtils = {
  // Create
  createRecord,
  createRecordWithFile,
  
  // Read
  getRecords,
  getRecord,
  getRecordCount,
  
  // Update
  updateRecord,
  updateRecordWithFile,
  updateRecords,
  
  // Delete
  deleteRecord,
  deleteRecords,
  
  // File operations
  uploadFile,
  deleteFile,
  getFileUrl,
  
  // Upsert
  upsertRecord,
  
  // Client access (for advanced usage)
  client: supabaseClient
};

// Export for Node.js/CommonJS
if (typeof module !== "undefined" && module.exports) {
  module.exports = SupabaseUtils;
}

// Export for browser (make it available globally)
if (typeof window !== "undefined") {
  window.SupabaseUtils = SupabaseUtils;
}
