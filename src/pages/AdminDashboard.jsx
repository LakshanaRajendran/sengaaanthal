import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { poemService } from '../services/poemService';
import { authService } from '../services/authService';
import '../styles/admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getStoredAdminUser());

  // Stats
  const [stats, setStats] = useState({
    totalPoems: 0,
    publishedPoems: 0,
    draftPoems: 0,
    totalBookmarks: 0
  });

  // Poems & Filters
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    language: 'english',
    type: 'poem',
    content: '',
    published: false
  });
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Delete Confirmation State
  const [deletingPoem, setDeletingPoem] = useState(null);

  // Authentication check
  useEffect(() => {
    if (!authService.isAdminAuthenticated()) {
      navigate('/admin/login', { replace: true });
      return;
    }

    authService.getMe().then((currUser) => {
      if (!currUser || currUser.role !== 'admin') {
        authService.logout();
        navigate('/admin/login', { replace: true });
      } else {
        setUser(currUser);
      }
    });
  }, [navigate]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const data = await poemService.getAdminStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.warn('[AdminDashboard] Failed to load stats:', err.message);
    }
  }, []);

  // Load poems with current search and filters
  const loadPoems = useCallback(async () => {
    setLoading(true);
    try {
      const list = await poemService.getAllPoemsAdmin({
        search,
        language: languageFilter,
        type: typeFilter,
        status: statusFilter
      });
      setPoems(list);
    } catch (err) {
      console.error('[AdminDashboard] Failed to fetch poems:', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, languageFilter, typeFilter, statusFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPoems();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadPoems]);

  // Handle Logout
  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  // Open Modal for New Poem
  const handleOpenAddModal = () => {
    setEditingPoem(null);
    setFormData({
      title: '',
      language: 'english',
      type: 'poem',
      content: '',
      published: false
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (poem) => {
    setEditingPoem(poem);
    setFormData({
      title: poem.title,
      language: poem.language,
      type: poem.type,
      content: poem.rawContent || (Array.isArray(poem.content) ? poem.content.join('\n') : poem.content),
      published: Boolean(poem.published)
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Save Poem (Create or Update)
  const handleSavePoem = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      setFormError('Poem content cannot be empty');
      return;
    }

    setActionLoading(true);
    try {
      if (editingPoem) {
        await poemService.updatePoem(editingPoem.id, formData);
      } else {
        await poemService.createPoem(formData);
      }
      setIsModalOpen(false);
      await loadPoems();
      await loadStats();
    } catch (err) {
      setFormError(err.message || 'Failed to save poem');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (poem) => {
    try {
      if (poem.published) {
        await poemService.unpublishPoem(poem.id);
      } else {
        await poemService.publishPoem(poem.id);
      }
      await loadPoems();
      await loadStats();
    } catch (err) {
      alert(`Error updating publish state: ${err.message}`);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingPoem) return;
    setActionLoading(true);
    try {
      await poemService.deletePoem(deletingPoem.id);
      setDeletingPoem(null);
      await loadPoems();
      await loadStats();
    } catch (err) {
      alert(`Error deleting poem: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Navigation */}
      <header className="admin-navbar">
        <div className="admin-navbar-brand">
          <span>SENGAANTHAL</span>
          <span className="admin-navbar-badge">Admin</span>
        </div>

        <div className="admin-navbar-user">
          <span className="admin-user-email">{user?.email || 'admin@sengaanthal.com'}</span>
          <Link to="/" className="admin-link-button">
            View Reader
          </Link>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Stats Cards */}
        <section className="admin-stats-grid" aria-label="Overview statistics">
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Poems</div>
            <div className="admin-stat-value">{stats.totalPoems}</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Published Poems</div>
            <div className="admin-stat-value" style={{ color: '#79d799' }}>
              {stats.publishedPoems}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Draft Poems</div>
            <div className="admin-stat-value" style={{ color: '#edd17d' }}>
              {stats.draftPoems}
            </div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-label">Total Bookmarks</div>
            <div className="admin-stat-value" style={{ color: '#ff9da7' }}>
              {stats.totalBookmarks}
            </div>
          </div>
        </section>

        {/* Toolbar: Search, Filters, Add Poem */}
        <section className="admin-toolbar-card">
          <div className="admin-filter-group">
            <input
              type="text"
              className="admin-form-input admin-search-input"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search poems by title"
            />

            <select
              className="admin-form-select admin-filter-select"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              aria-label="Filter by language"
            >
              <option value="all">Language: All</option>
              <option value="tamil">Tamil</option>
              <option value="english">English</option>
            </select>

            <select
              className="admin-form-select admin-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">Type: All</option>
              <option value="poem">Poem</option>
              <option value="haiku">Haiku</option>
            </select>

            <select
              className="admin-form-select admin-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">Status: All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <button
            type="button"
            className="admin-add-btn"
            onClick={handleOpenAddModal}
          >
            + Add New Poem
          </button>
        </section>

        {/* Poem Management Table */}
        <section className="admin-table-card">
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Language</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="admin-empty-state-cell">
                      Loading poems...
                    </td>
                  </tr>
                ) : poems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-empty-state-cell">
                      No poems found.
                    </td>
                  </tr>
                ) : (
                  poems.map((poem) => (
                    <tr key={poem.id}>
                      <td className="admin-poem-title">
                        {poem.title}
                      </td>
                      <td>
                        <span className={`admin-pill ${poem.language === 'tamil' ? 'pill-tamil' : 'pill-english'}`}>
                          {poem.language === 'tamil' ? 'Tamil' : 'English'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-pill ${poem.type === 'haiku' ? 'pill-haiku' : 'pill-poem'}`}>
                          {poem.type === 'haiku' ? 'Haiku' : 'Poem'}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-pill ${poem.published ? 'pill-published' : 'pill-draft'}`}>
                          {poem.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions" style={{ justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-action admin-btn-edit"
                            onClick={() => handleOpenEditModal(poem)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className={`admin-btn admin-btn-action ${poem.published ? 'admin-btn-unpublish' : 'admin-btn-publish'}`}
                            onClick={() => handleTogglePublish(poem)}
                          >
                            {poem.published ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            type="button"
                            className="admin-btn admin-btn-action admin-btn-delete"
                            onClick={() => setDeletingPoem(poem)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Add / Edit Poem Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">
              {editingPoem ? 'Edit Poem' : 'Create New Poem'}
            </h2>

            {formError && <div className="admin-alert-error">{formError}</div>}

            <form onSubmit={handleSavePoem}>
              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="poem-title">
                  Title
                </label>
                <input
                  id="poem-title"
                  type="text"
                  className="admin-form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter poem title..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="poem-language">
                    Language
                  </label>
                  <select
                    id="poem-language"
                    className="admin-form-select"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  >
                    <option value="english">English</option>
                    <option value="tamil">Tamil</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label" htmlFor="poem-type">
                    Type
                  </label>
                  <select
                    id="poem-type"
                    className="admin-form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="poem">Poem</option>
                    <option value="haiku">Haiku</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label" htmlFor="poem-content">
                  Poem Content (Stanzas & Lines)
                </label>
                <textarea
                  id="poem-content"
                  className="admin-form-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter poem verses here... Leave an empty line between stanzas."
                  rows={8}
                  required
                />
              </div>

              <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="poem-published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#961e31' }}
                />
                <label htmlFor="poem-published" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Publish immediately (check to make visible to readers, uncheck for draft)
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{ width: 'auto', padding: '10px 24px' }}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPoem && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingPoem(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title" style={{ color: '#ff8c98' }}>
              Confirm Deletion
            </h2>
            <p style={{ color: '#d8c7b8', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              Are you sure you want to delete this poem?
            </p>
            <p style={{ fontStyle: 'italic', color: '#dfb15b', margin: '0 0 24px 0' }}>
              “{deletingPoem.title}”
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => setDeletingPoem(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-delete"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Delete Poem'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
