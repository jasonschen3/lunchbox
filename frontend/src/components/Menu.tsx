import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_IP } from "../constants";
import { useLanguage } from "../Language";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Menu.css";

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  french_description: string;
  price: number;
  available: boolean;
}

interface CategoryMap {
  [key: string]: MenuItem[];
}

const Menu: React.FC = () => {
  const { language } = useLanguage();
  const [menuItemsByCategory, setMenuItemsByCategory] = useState<CategoryMap>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define categories and their display order
  const categories = {
    cold_cuts: language === "en" ? "Cold Cuts" : "Charcuterie",
    chicken: language === "en" ? "Chicken" : "Poulet",
    fish: language === "en" ? "Fish" : "Poisson",
    cheese: language === "en" ? "Cheese" : "Fromage",
    vegetarian: language === "en" ? "Vegetarian" : "Végétarien",
    hot_sandwiches: language === "en" ? "Hot Sandwiches" : "Sandwichs Chauds",
    hot_chicken: language === "en" ? "Hot Chicken" : "Poulet Chaud",
    hot_fish: language === "en" ? "Hot Fish" : "Poisson Chaud",
    hot_cheese: language === "en" ? "Hot Cheese" : "Fromage Chaud",
    burgers: language === "en" ? "Burgers" : "Burgers",
  };

  // Order in which categories should appear
  const categoryOrder = [
    "cold_cuts",
    "chicken",
    "fish",
    "cheese",
    "vegetarian",
    "hot_sandwiches",
    "hot_chicken",
    "hot_fish",
    "hot_cheese",
    "burgers",
  ];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // Get available menu items only
        const response = await axios.get(`${BACKEND_IP}/menu/items/available`);

        // Categorize items based on our predefined categories
        const categorizedItems: CategoryMap = {};
        categoryOrder.forEach((cat) => {
          categorizedItems[cat] = [];
        });

        response.data.forEach((item: MenuItem) => {
          const category = getCategoryForItem(item.name);
          if (categorizedItems[category]) {
            categorizedItems[category].push(item);
          } else {
            // Fallback for uncategorized items (shouldn't happen with our logic)
            if (!categorizedItems["other"]) categorizedItems["other"] = [];
            categorizedItems["other"].push(item);
          }
        });

        setMenuItemsByCategory(categorizedItems);
        setError(null);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(
          language === "en"
            ? "Failed to load menu. Please try again later."
            : "Échec du chargement du menu. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [language]);

  // Helper function to categorize items based on name
  const getCategoryForItem = (name: string): string => {
    const nameLower = name.toLowerCase();

    // Cold cuts - items with specific names
    if (
      [
        "le tradition",
        "le parisien",
        "le lyonnais",
        "le terroir",
        "l'italien",
        "la rosette",
        "le toscan",
      ].includes(nameLower)
    ) {
      return "cold_cuts";
    }

    // Chicken - items with poulet, fermier (not chaud)
    if (
      (nameLower.includes("poulet") || nameLower.includes("fermier")) &&
      !nameLower.includes("chaud")
    ) {
      return "chicken";
    }

    // Fish - items with thon, saumon, méditerranéen (not chaud)
    if (
      (nameLower.includes("thon") ||
        nameLower.includes("saumon") ||
        nameLower.includes("méditerranéen") ||
        nameLower.includes("scandinave") ||
        nameLower.includes("printanier")) &&
      !nameLower.includes("chaud")
    ) {
      return "fish";
    }

    // Cheese - items with chèvre, brie, 3 fromages (not chaud)
    if (
      (nameLower.includes("chèvre") ||
        nameLower.includes("brie") ||
        nameLower.includes("fromages")) &&
      !nameLower.includes("chaud")
    ) {
      return "cheese";
    }

    // Vegetarian - items with végétarien
    if (nameLower.includes("végétarien")) {
      return "vegetarian";
    }

    // Hot Sandwiches - specific items
    if (nameLower.includes("croque") || nameLower === "le savoyard") {
      return "hot_sandwiches";
    }

    // Hot Chicken - chicken items that are hot
    if (
      (nameLower.includes("poulet") ||
        nameLower.includes("fermier") ||
        nameLower.includes("chicken")) &&
      nameLower.includes("chaud")
    ) {
      return "hot_chicken";
    }

    // Hot Fish - fish items that are hot
    if (
      (nameLower.includes("thon") || nameLower.includes("saumon")) &&
      nameLower.includes("chaud")
    ) {
      return "hot_fish";
    }

    // Hot Cheese - cheese items that are hot
    if (
      (nameLower.includes("chèvre") ||
        nameLower.includes("brie") ||
        nameLower === "le provençal") &&
      nameLower.includes("chaud")
    ) {
      return "hot_cheese";
    }

    // Burgers - items with burger
    if (nameLower.includes("burger")) {
      return "burgers";
    }

    // Default
    return "other";
  };

  return (
    <>
      <Header />
      <div className="menu-container">
        <h1>{language === "en" ? "Our Menu" : "Notre Menu"}</h1>

        {loading && (
          <div className="loading-container">
            <p>
              {language === "en" ? "Loading menu..." : "Chargement du menu..."}
            </p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="menu-categories">
            {categoryOrder.map((categoryKey) => {
              const items = menuItemsByCategory[categoryKey];
              // Only display categories that have items
              if (!items || items.length === 0) return null;

              return (
                <div
                  key={categoryKey}
                  className="menu-category"
                  id={categoryKey}
                >
                  <h2 className="category-title">{categories[categoryKey]}</h2>
                  <div className="menu-items">
                    {items.map((item) => (
                      <div key={item.item_id} className="menu-item">
                        <div className="menu-item-header">
                          <h3 className="item-name">{item.name}</h3>
                          <span className="item-price">€{item.price}</span>
                        </div>
                        <p className="item-description">
                          {language === "en"
                            ? item.description
                            : item.french_description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Menu;
