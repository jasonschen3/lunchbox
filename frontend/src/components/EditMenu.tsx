import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_IP } from "../constants";
import Header from "./Header";
import { useLanguage } from "../Language";
import "../styles/EditMenu.css";

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  french_description: string;
  price: number;
  available: boolean;
}

const EditMenu: React.FC = () => {
  const { language } = useLanguage();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for new item form
  const [newItem, setNewItem] = useState<Omit<MenuItem, "item_id">>({
    name: "",
    description: "",
    french_description: "",
    price: 0,
    available: true,
  });

  // State for edit form
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Check authentication
  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
    }
  }, [navigate]);

  // Fetch menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_IP}/menu/items`, {
        headers: { "access-token": token },
        // withCredentials: true, // 🔥 Required if using `credentials: true`
      });

      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError(
        language === "en"
          ? "Failed to load menu items. Please try again."
          : "Impossible de charger les éléments du menu. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setNewItem({
      ...newItem,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "price"
          ? parseFloat(value)
          : value,
    });
  };

  const handleEditItemChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (!editingItem) return;

    const { name, value, type } = e.target;

    setEditingItem({
      ...editingItem,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "price"
          ? parseFloat(value)
          : value,
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BACKEND_IP}/menu/items`, newItem, {
        headers: { "access-token": token },
      });

      // Reset form and refresh menu items
      setNewItem({
        name: "",
        description: "",
        french_description: "",
        price: 0,
        available: true,
      });

      fetchMenuItems();
    } catch (err) {
      console.error("Error adding menu item:", err);
      setError(
        language === "en"
          ? "Failed to add menu item. Please try again."
          : "Impossible d'ajouter l'élément de menu. Veuillez réessayer."
      );
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_IP}/menu/items/${editingItem.item_id}`,
        editingItem,
        { headers: { "access-token": token } }
      );

      // Close edit form and refresh menu items
      setEditingItem(null);
      fetchMenuItems();
    } catch (err) {
      console.error("Error updating menu item:", err);
      setError(
        language === "en"
          ? "Failed to update menu item. Please try again."
          : "Impossible de mettre à jour l'élément de menu. Veuillez réessayer."
      );
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (
      !confirm(
        language === "en"
          ? "Are you sure you want to delete this item?"
          : "Êtes-vous sûr de vouloir supprimer cet article ?"
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_IP}/menu/items/${itemId}`, {
        headers: { "access-token": token },
      });

      fetchMenuItems();
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError(
        language === "en"
          ? "Failed to delete menu item. Please try again."
          : "Impossible de supprimer l'élément de menu. Veuillez réessayer."
      );
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${BACKEND_IP}/menu/items/${item.item_id}/availability`,
        { available: !item.available },
        { headers: { "access-token": token } }
      );

      fetchMenuItems();
    } catch (err) {
      console.error("Error updating item availability:", err);
      setError(
        language === "en"
          ? "Failed to update item availability. Please try again."
          : "Impossible de mettre à jour la disponibilité de l'article. Veuillez réessayer."
      );
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="edit-menu-container">
        <h1>{language === "en" ? "Edit Menu" : "Modifier le Menu"}</h1>

        {loading ? (
          <p>
            {language === "en"
              ? "Loading menu items..."
              : "Chargement des éléments du menu..."}
          </p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {/* Add New Item Form */}
            <div className="form-section">
              <h2>
                {language === "en"
                  ? "Add New Item"
                  : "Ajouter un Nouvel Article"}
              </h2>
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label htmlFor="name">
                    {language === "en" ? "Name" : "Nom"}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleNewItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    {language === "en"
                      ? "Description (English)"
                      : "Description (Anglais)"}
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newItem.description}
                    onChange={handleNewItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="french_description">
                    {language === "en"
                      ? "Description (French)"
                      : "Description (Français)"}
                  </label>
                  <textarea
                    id="french_description"
                    name="french_description"
                    value={newItem.french_description}
                    onChange={handleNewItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">
                    {language === "en" ? "Price (€)" : "Prix (€)"}
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="available">
                    {language === "en" ? "Available" : "Disponible"}
                  </label>
                  <input
                    type="checkbox"
                    id="available"
                    name="available"
                    checked={newItem.available}
                    onChange={handleNewItemChange}
                  />
                </div>

                <button type="submit" className="action-button">
                  {language === "en" ? "Add Item" : "Ajouter"}
                </button>
              </form>
            </div>

            {/* Menu Items List */}
            <div className="menu-items-section">
              <h2>{language === "en" ? "Menu Items" : "Articles du Menu"}</h2>

              {menuItems.length === 0 ? (
                <p>
                  {language === "en"
                    ? "No menu items found."
                    : "Aucun élément de menu trouvé."}
                </p>
              ) : (
                <table className="menu-table">
                  <thead>
                    <tr>
                      <th>{language === "en" ? "ID" : "ID"}</th>
                      <th>{language === "en" ? "Name" : "Nom"}</th>
                      <th>
                        {language === "en" ? "Description" : "Description"}
                      </th>
                      <th>
                        {language === "en"
                          ? "French Description"
                          : "Description Française"}
                      </th>
                      <th>{language === "en" ? "Price (€)" : "Prix (€)"}</th>
                      <th>{language === "en" ? "Available" : "Disponible"}</th>
                      <th>{language === "en" ? "Actions" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuItems.map((item) => (
                      <tr
                        key={item.item_id}
                        className={item.available ? "" : "unavailable"}
                      >
                        <td>{item.item_id}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.french_description}</td>
                        <td>€{item.price}</td>
                        <td>
                          <button
                            className={`availability-toggle ${
                              item.available ? "available" : "unavailable"
                            }`}
                            onClick={() => toggleAvailability(item)}
                          >
                            {item.available
                              ? language === "en"
                                ? "Yes"
                                : "Oui"
                              : language === "en"
                              ? "No"
                              : "Non"}
                          </button>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button"
                              onClick={() => setEditingItem(item)}
                            >
                              {language === "en" ? "Edit" : "Modifier"}
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDeleteItem(item.item_id)}
                            >
                              {language === "en" ? "Delete" : "Supprimer"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{language === "en" ? "Edit Item" : "Modifier l'Article"}</h2>
              <form onSubmit={handleEditItem}>
                <div className="form-group">
                  <label htmlFor="edit-name">
                    {language === "en" ? "Name" : "Nom"}
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={editingItem.name}
                    onChange={handleEditItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-description">
                    {language === "en"
                      ? "Description (English)"
                      : "Description (Anglais)"}
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editingItem.description}
                    onChange={handleEditItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-french_description">
                    {language === "en"
                      ? "Description (French)"
                      : "Description (Français)"}
                  </label>
                  <textarea
                    id="edit-french_description"
                    name="french_description"
                    value={editingItem.french_description}
                    onChange={handleEditItemChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-price">
                    {language === "en" ? "Price (€)" : "Prix (€)"}
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={editingItem.price}
                    onChange={handleEditItemChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="edit-available">
                    {language === "en" ? "Available" : "Disponible"}
                  </label>
                  <input
                    type="checkbox"
                    id="edit-available"
                    name="available"
                    checked={editingItem.available}
                    onChange={handleEditItemChange}
                  />
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="action-button">
                    {language === "en" ? "Save Changes" : "Enregistrer"}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditingItem(null)}
                  >
                    {language === "en" ? "Cancel" : "Annuler"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <button className="back-button" onClick={goBack}>
          {language === "en"
            ? "Back to Dashboard"
            : "Retour au Tableau de Bord"}
        </button>
      </div>
    </>
  );
};

export default EditMenu;
