// FavouritesPage.jsx - Page for managing user favourites
// This page allows the user to view, filter, sort, and delete their favourite items. It fetches the user's favourites from the server on load and provides controls for managing them. It also includes a confirmation dialog for deleting all favourites at once.
import { useEffect, useMemo, useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Fallback image
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        fill="#6b7280" font-family="Arial, sans-serif" font-size="20">
        No Image
      </text>
    </svg>
  `);

function FavouritesPage() {
  const { token } = useAuth();

  const [favourites, setFavourites] = useState([]);
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingItemId, setPendingItemId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("title-asc");

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Toast
  const showToast = (text) => {
    setToastMessage(text);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 1600);
  };

  // Format date
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-GB");
  };

  // Load favourites (fixed with useCallback)
  const loadFavourites = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await api.get("/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites(response.data.favourites || []);
    } catch {
      setMessage("Failed to load favourites.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadFavourites();
  }, [loadFavourites]);

  // Remove one
  const removeFavourite = async (itemId) => {
    setMessage("");
    setPendingItemId(itemId);

    try {
      await api.delete(`/favourites/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites((prev) =>
        prev.filter((item) => item.itemId !== itemId)
      );

      showToast("Removed from favourites");
    } catch {
      setMessage("Failed to remove favourite.");
    } finally {
      setPendingItemId(null);
    }
  };

  // Delete all
  const handleDeleteAll = async () => {
    setDeletingAll(true);
    setMessage("");

    try {
      await api.delete("/favourites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavourites([]);
      setShowDeleteAllConfirm(false);
      showToast("All favourites deleted");
    } catch {
      setMessage("Failed to delete all favourites.");
    } finally {
      setDeletingAll(false);
    }
  };

  // Filter + sort
  const visibleFavourites = useMemo(() => {
    let processed = [...favourites];

    const filter = filterText.trim().toLowerCase();

    if (filter) {
      processed = processed.filter((item) => {
        return (
          (item.title || "").toLowerCase().includes(filter) ||
          (item.artist || "").toLowerCase().includes(filter) ||
          (item.mediaType || "").toLowerCase().includes(filter)
        );
      });
    }

    if (sortBy === "title-asc") {
      processed.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "title-desc") {
      processed.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else if (sortBy === "artist-asc") {
      processed.sort((a, b) => (a.artist || "").localeCompare(b.artist || ""));
    } else if (sortBy === "artist-desc") {
      processed.sort((a, b) => (b.artist || "").localeCompare(a.artist || ""));
    } else if (sortBy === "release-newest") {
      processed.sort(
        (a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0)
      );
    } else if (sortBy === "release-oldest") {
      processed.sort(
        (a, b) => new Date(a.releaseDate || 0) - new Date(b.releaseDate || 0)
      );
    }

    return processed;
  }, [favourites, filterText, sortBy]);

  return (
    <div className="container py-4 py-md-5">
      <div className="text-center mb-4 mb-md-5">
        <h1 className="display-6 fw-bold text-white mb-2">My Favourites</h1>
        <p className="text-white-50 mb-0">
          Review, filter and manage your saved items
        </p>
      </div>

      {toastMessage && <div className="action-toast">{toastMessage}</div>}

      {message && (
        <div className="alert alert-danger alert-dismissible fade show">
          {message}
          <button className="btn-close" onClick={() => setMessage("")} />
        </div>
      )}

      <div className="card p-4 mb-4 search-card">
        <div className="d-flex justify-content-between mb-3">
          <h2 className="h5 mb-0">Manage favourites</h2>

          <button
            className="btn btn-sm btn-danger rounded-pill px-3"
            onClick={() => setShowDeleteAllConfirm(true)}
            disabled={favourites.length === 0}
          >
            Delete all
          </button>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter..."
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
              <option value="artist-asc">Artist A–Z</option>
              <option value="artist-desc">Artist Z–A</option>
              <option value="release-newest">Newest</option>
              <option value="release-oldest">Oldest</option>
            </select>
          </div>

          <div className="col-md-3 d-flex align-items-center">
            <p className="text-white-50 small mb-0">
              {visibleFavourites.length} of {favourites.length}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-white-50">Loading...</p>
      ) : visibleFavourites.length === 0 ? (
        <p className="text-center text-white-50">
          {favourites.length === 0
            ? "No favourites saved yet."
            : "No matches found."}
        </p>
      ) : (
        <div className="row g-4">
          {visibleFavourites.map((item) => {
            const isPending = pendingItemId === item.itemId;

            return (
              <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={item.itemId}>
                <div className="card h-100 result-card">
                  <div className="image-wrapper">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.title}
                    />
                  </div>

                  <div className="card-body">
                    <h6 className="title">{item.title}</h6>

                    <p className="meta">
                      <strong>Artist:</strong> {item.artist}
                    </p>
                    <p className="meta">
                      <strong>Type:</strong> {item.mediaType}
                    </p>
                    <p className="meta">
                      <strong>Release:</strong>{" "}
                      {formatReleaseDate(item.releaseDate)}
                    </p>

                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill mt-auto"
                      onClick={() => removeFavourite(item.itemId)}
                      disabled={isPending}
                    >
                      {isPending ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showDeleteAllConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3 className="h5 mb-2">Delete all favourites?</h3>
            <p className="text-muted mb-3">This action can’t be undone.</p>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light rounded-pill px-3"
                onClick={() => setShowDeleteAllConfirm(false)}
                disabled={deletingAll}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger rounded-pill px-3"
                onClick={handleDeleteAll}
                disabled={deletingAll}
              >
                {deletingAll ? "Deleting..." : "Delete all"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;