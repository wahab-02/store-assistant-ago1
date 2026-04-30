// Catalog Manager API service
const CATALOG_API_BASE = import.meta.env.MODE === 'development' 
  ? "/api/catalog" // Proxied through Vite in dev
  : "http://catalog-manager.yellowsmoke-ff36206d.uksouth.azurecontainerapps.io/v1"; // Direct in production

const CATALOG_PARTNER_URN = "urn:partner:OVwjjT3vylY";

// Category mapping from HEB category URNs to app-friendly names
// Matches shopper-2026 category_mappings table exactly
const CATEGORY_MAPPINGS = {
  'urn:productcategory:S1dMxY711Nu': 'Baby & Kids',
  'urn:productcategory:Yj45DKHf4gL': 'Bakery',
  'urn:productcategory:OXhoDrcHP7Y': 'Beverages',
  'urn:productcategory:GEFRjCPHW5d': 'Dairy & Chilled',
  'urn:productcategory:nHAce93k3hP': 'Pantry Staples',
  'urn:productcategory:twmc5kjWJXK': 'Pantry Staples',
  'urn:productcategory:KXsI7G2ky9j': 'Frozen',
  'urn:productcategory:tU60kvGTvak': 'Produce',
  'urn:productcategory:wYXRhBXKJFu': 'Health & Beauty',
  'urn:productcategory:HbEcULKdSvg': 'Home & Seasonal',
  'urn:productcategory:5J53D18TYf6': 'Meat & Fish',
  'urn:productcategory:ZMEo6DOA98z': 'Pantry Staples',
  'urn:productcategory:JjEsvy3SmQW': 'Pet Care',
};

/**
 * Extract top-level category URN from parent_hierarchy
 * Recursively searches for the URN where value is null (top-level)
 */
function extractTopLevelCategoryUrn(parentHierarchy) {
  if (!parentHierarchy || typeof parentHierarchy !== 'object') {
    return null;
  }

  // Recursively search through the hierarchy
  for (const [urn, children] of Object.entries(parentHierarchy)) {
    if (children === null) {
      // Found the top-level category (where value is null)
      return urn;
    }
    
    if (children && typeof children === 'object') {
      // Recursively check nested children
      const topLevelUrn = extractTopLevelCategoryUrn(children);
      if (topLevelUrn) {
        return topLevelUrn;
      }
    }
  }

  return null;
}

/**
 * Map category URN to friendly name
 */
function mapCategoryName(categoryUrn) {
  if (!categoryUrn) {
    console.log("⚠️ No category URN provided, using fallback");
    return "Pantry Staples";
  }
  
  // Direct match from HEB category mappings
  if (CATEGORY_MAPPINGS[categoryUrn]) {
    console.log(`✅ Matched category URN: ${categoryUrn} → ${CATEGORY_MAPPINGS[categoryUrn]}`);
    return CATEGORY_MAPPINGS[categoryUrn];
  }
  
  // Fallback if URN not found
  console.log(`⚠️ Unknown category URN: ${categoryUrn}, using fallback`);
  return "Pantry Staples";
}

/**
 * Fetch product by GTIN (barcode) from catalog manager
 */
export async function fetchProductByGtin(gtin) {
  try {
    console.log("🔍 Fetching product for GTIN:", gtin);
    
    const url = `${CATALOG_API_BASE}/partners/${CATALOG_PARTNER_URN}/products?gtin=${gtin}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "common-secret-api-key",
      },
    });

    if (!response.ok) {
      console.error("❌ Catalog API error:", response.status, response.statusText);
      throw new Error(`Catalog API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Catalog API response:", data);

    // Check if products were found
    if (!data.data || data.data.length === 0) {
      console.log("❌ No product found for GTIN:", gtin);
      return null;
    }

    const productData = data.data[0];
    
    // Extract and map category
    const topLevelCategoryUrn = extractTopLevelCategoryUrn(productData.parent_hierarchy);
    console.log("🏷️ Product:", productData.name);
    console.log("🏷️ Top-level category URN:", topLevelCategoryUrn);
    console.log("🏷️ Full parent_hierarchy:", JSON.stringify(productData.parent_hierarchy, null, 2));
    
    const mappedCategory = mapCategoryName(topLevelCategoryUrn);
    
    // Extract relevant product information
    const product = {
      gtin: gtin,
      name: productData.name || "Unknown Product",
      image: productData.external_links?.carouselImageUrl1 || null,
      category: mappedCategory,
      price: productData.stores?.[0]?.price || null,
      rrp: productData.stores?.[0]?.price || null, // Use store price as RRP
      brand: productData.brand || null,
      description: productData.description || null,
      nutrition: productData.attrs?.nutritionLabels?.[0] || null,
      categoryUrn: topLevelCategoryUrn, // Keep URN for debugging
    };

    console.log("✅ Product mapped:", product);
    return product;
    
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    throw error;
  }
}

/**
 * Clean barcode input (remove whitespace, check digits, etc.)
 */
export function cleanBarcode(barcode) {
  if (!barcode) return "";
  return barcode.trim();
}
