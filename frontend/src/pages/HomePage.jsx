// HomePage.jsx - Main page for searching iTunes and managing results
// This page allows the user to search the iTunes API, view results, and add/remove items from their favourites. It also supports pagination, sorting, and error handling for a smooth user experience.
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Number of results to fetch each time.
const RESULTS_BATCH_SIZE = 20;

// Simple inline fallback artwork.
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

function HomePage() {
  const { token } = useAuth();

  // Restore search inputs and any previously loaded results for this session.
  const [term, setTerm] = useState(
    () => sessionStorage.getItem("searchTerm") || ""
  );
  const [media, setMedia] = useState(
    () => sessionStorage.getItem("searchMedia") || "all"
  );
  const [results, setResults] = useState(() => {
    try {
      const saved = sessionStorage.getItem("searchResults");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // General UI state.
  const [favouriteIds, setFavouriteIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pendingFavouriteId, setPendingFavouriteId] = useState(null);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [hasSearched, setHasSearched] = useState(
    () => sessionStorage.getItem("hasSearched") === "true"
  );
  const [sortBy, setSortBy] = useState("relevance");

  // Track paging state returned from the backend.
  const [offset, setOffset] = useState(() => {
    const saved = sessionStorage.getItem("searchOffset");
    return saved ? Number(saved) : 0;
  });
  const [hasMore, setHasMore] = useState(
    () => sessionStorage.getItem("hasMore") === "true"
  );

  // Persist search state.
  useEffect(() => {
    sessionStorage.setItem("searchTerm", term);
    sessionStorage.setItem("searchMedia", media);
    sessionStorage.setItem("searchResults", JSON.stringify(results));
    sessionStorage.setItem("hasSearched", String(hasSearched));
    sessionStorage.setItem("searchOffset", String(offset));
    sessionStorage.setItem("hasMore", String(hasMore));
  }, [term, media, results, hasSearched, offset, hasMore]);

  // Load favourites for the current user.
  useEffect(() => {
    const loadFavourites = async () => {
      if (!token) return;

      setError("");

      try {
        const res = await api.get("/favourites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const ids = (res.data.data || res.data.favourites || []).map(
          (f) => f.itemId
        );
        setFavouriteIds(ids);
      } catch {
        setError("Failed to load favourites.");
      }
    };

    loadFavourites();
  }, [token]);

  // Show a short toast after add/remove actions.
  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 1600);
  };

  // Format API dates into a readable format.
  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString("en-GB");
  };

  // Run a fresh search and replace all current results.
  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await api.get("/search", {
        params: {
          term: trimmedTerm,
          media,
          limit: RESULTS_BATCH_SIZE,
          offset: 0,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res.data.data || {};
      const newResults = payload.results || [];
      const returnedOffset =
        typeof payload.nextOffset === "number"
          ? payload.nextOffset
          : newResults.length;

      setResults(newResults);
      setOffset(returnedOffset);
      setHasMore(Boolean(payload.hasMore));
    } catch {
      setError("Search failed. Please try again.");
      setResults([]);
      setOffset(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the next batch and append it to the existing results.
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || !term.trim()) return;

    setLoadingMore(true);
    setError("");

    try {
      const res = await api.get("/search", {
        params: {
          term: term.trim(),
          media,
          limit: RESULTS_BATCH_SIZE,
          offset,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      const payload = res.data.data || {};
      const nextResults = payload.results || [];

      setResults((prev) => [...prev, ...nextResults]);
      setOffset(
        typeof payload.nextOffset === "number"
          ? payload.nextOffset
          : offset + nextResults.length
      );
      setHasMore(Boolean(payload.hasMore));
    } catch {
      setError("Failed to load more results.");
    } finally {
      setLoadingMore(false);
    }
  };

  // Reset the page state.
  const handleClear = () => {
    setTerm("");
    setMedia("all");
    setResults([]);
    setError("");
    setToastMessage("");
    setHasSearched(false);
    setSortBy("relevance");
    setOffset(0);
    setHasMore(false);

    sessionStorage.removeItem("searchTerm");
    sessionStorage.removeItem("searchMedia");
    sessionStorage.removeItem("searchResults");
    sessionStorage.removeItem("hasSearched");
    sessionStorage.removeItem("searchOffset");
    sessionStorage.removeItem("hasMore");
  };

  // Add an item to favourites.
  const addFavourite = async (item) => {
    setError("");
    setPendingFavouriteId(item.itemId);

    try {
      await api.post("/favourites", item, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavouriteIds((prev) =>
        prev.includes(item.itemId) ? prev : [...prev, item.itemId]
      );

      showToast("Added to favourites");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add favourite.");
    } finally {
      setPendingFavouriteId(null);
    }
  };

  // Remove an item from favourites.
  const removeFavourite = async (item) => {
    setError("");
    setPendingFavouriteId(item.itemId);

    try {
      await api.delete(`/favourites/${item.itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavouriteIds((prev) => prev.filter((id) => id !== item.itemId));

      showToast("Removed from favourites");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove favourite.");
    } finally {
      setPendingFavouriteId(null);
    }
  };

  // Sort already-fetched results on the client.
  const sortedResults = useMemo(() => {
    const processed = [...results];

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
  }, [results, sortBy]);

  return (
    <div className="container py-4 py-md-5">
      <div className="text-center mb-4 mb-md-5">
        <h1 className="display-6 fw-bold text-white mb-2">iTunes Search</h1>
        <p className="text-white-50 mb-0">
          Search media and save your favourites
        </p>
      </div>

      {toastMessage && (
        <div className="action-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show shadow-sm"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
            aria-label="Close"
          />
        </div>
      )}

      <div className="card p-4 mb-4 search-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Search</h2>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-pill px-3"
            onClick={handleClear}
          >
            Reset
          </button>
        </div>

        <form onSubmit={handleSearch}>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search..."
                aria-label="Search term"
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                aria-label="Media type"
              >
                <option value="all">All</option>
                <option value="music">Music</option>
                <option value="movie">Movie</option>
                <option value="podcast">Podcast</option>
                <option value="audiobook">Audiobook</option>
              </select>
            </div>

            <div className="col-md-3">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading || !term.trim()}
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          <p className="text-white-50 small mt-2 mb-0">
            Search by title, artist, album, movie, podcast or audiobook.
          </p>
        </form>
      </div>

      {results.length > 0 && (
        <div className="results-toolbar mb-3">
          <p className="text-white-50 small mb-0">
            Showing {sortedResults.length} results
          </p>

          <select
            className="form-select form-select-sm sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort results"
          >
            <option value="relevance">Relevance</option>
            <option value="title-asc">Title A–Z</option>
            <option value="title-desc">Title Z–A</option>
            <option value="artist-asc">Artist A–Z</option>
            <option value="artist-desc">Artist Z–A</option>
            <option value="release-newest">Newest</option>
            <option value="release-oldest">Oldest</option>
          </select>
        </div>
      )}

      {loading && (
        <div className="text-center text-white-50 py-5">
          <div className="spinner-border mb-3" role="status" aria-hidden="true" />
          <p className="mb-0">Searching iTunes...</p>
        </div>
      )}

      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-5">
          <p className="text-white-50 mb-0">
            No results found for &ldquo;{term}&rdquo;.
          </p>
        </div>
      )}

      <div className="row g-4">
        {sortedResults.map((item) => {
          const isFav = favouriteIds.includes(item.itemId);
          const isPending = pendingFavouriteId === item.itemId;

          return (
            <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={item.itemId}>
              <div className="card h-100 result-card">
                <div className="image-wrapper">
                  <img
                    src={item.image || FALLBACK_IMAGE}
                    alt={item.title || "Media artwork"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <div className="card-body">
                  <h6 className="title">{item.title || "Untitled"}</h6>

                  <p className="meta mb-1">
                    <strong>Artist:</strong> {item.artist || "Unknown"}
                  </p>
                  <p className="meta mb-1">
                    <strong>Type:</strong> {item.mediaType || "Unknown"}
                  </p>
                  <p className="meta mb-2">
                    <strong>Release:</strong> {formatReleaseDate(item.releaseDate)}
                  </p>

                  <button
                    type="button"
                    className={`fav-icon ${isFav ? "active" : ""}`}
                    onClick={() =>
                      isFav ? removeFavourite(item) : addFavourite(item)
                    }
                    disabled={isPending}
                    aria-label={
                      isFav ? "Remove from favourites" : "Add to favourites"
                    }
                    title={
                      isFav ? "Remove from favourites" : "Add to favourites"
                    }
                  >
                    {isPending ? "…" : isFav ? "✓" : "+"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-light rounded-pill px-4"
            onClick={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;