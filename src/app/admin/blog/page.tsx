"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/api-client";
import { PageShell, Card, Badge, Table, Modal, FormField, Inp, Sel, Btn, Toast } from "../_components/PageShell";

interface Post { id: string; title: string; slug: string; is_published: boolean; is_featured: boolean; author: string; category: string | null; created_at: string; }

export default function AdminBlog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", author: "Admin", content: "", is_published: false, is_featured: false });
  const [editForm, setEditForm] = useState({ title: "", author: "", is_published: false, is_featured: false });
  const [toast, setToast] = useState({ msg: "", show: false });
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast({ msg, show: true }); setTimeout(() => setToast({ msg, show: false }), 2800); };

  const load = () => {
    setLoading(true);
    apiGet<{ posts: Post[]; total: number }>("/admin/blog").then((r) => {
      if (r.ok) setPosts(r.data.posts || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title.trim()) return showToast("Title is required");
    const r = await apiPost("/admin/blog", form);
    if (r.ok) {
      showToast("✓ Blog post created");
      setShowCreate(false);
      setForm({ title: "", author: "Admin", content: "", is_published: false, is_featured: false });
      load();
    } else {
      showToast("✗ Failed to create post");
    }
  };

  // Publish toggle uses PATCH (not POST)
  const togglePublish = async (id: string, current: boolean) => {
    const r = await apiPatch(`/admin/blog/${id}`, { is_published: !current });
    if (r.ok) {
      showToast(current ? "Post unpublished" : "✓ Post published");
      load();
    } else {
      showToast("✗ Failed to update post");
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const r = await apiPatch(`/admin/blog/${id}`, { is_featured: !current });
    if (r.ok) { showToast(current ? "Removed from featured" : "✓ Marked as featured"); load(); }
    else showToast("✗ Failed");
  };

  const openEdit = (p: Post) => {
    setEditPost(p);
    setEditForm({ title: p.title, author: p.author, is_published: p.is_published, is_featured: p.is_featured });
  };

  const saveEdit = async () => {
    if (!editPost) return;
    const r = await apiPatch(`/admin/blog/${editPost.id}`, editForm);
    if (r.ok) { showToast("✓ Post updated"); setEditPost(null); load(); }
    else showToast("✗ Failed to update");
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(id);
    const r = await apiDelete(`/admin/blog/${id}`);
    if (r.ok) { showToast("Post deleted"); load(); }
    else showToast("✗ Failed to delete");
    setDeleting(null);
  };

  const filtered = posts.filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageShell title="Blog Management" sub="Create and manage blog posts and content marketing"
      actions={<><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…" style={{ height: 33, border: "1px solid #e4e8ee", borderRadius: 999, padding: "0 12px", fontSize: 12.5, outline: "none", width: 180 }} /><Btn label="+ New Post" onClick={() => setShowCreate(true)} /></>}>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Total Posts</div><div style={{ fontSize: 22, fontWeight: 800 }}>{posts.length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Published</div><div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{posts.filter((p) => p.is_published).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Drafts</div><div style={{ fontSize: 22, fontWeight: 800, color: "#f59e0b" }}>{posts.filter((p) => !p.is_published).length}</div></Card>
        <Card><div style={{ fontSize: 11.5, color: "#8a96a8" }}>Featured</div><div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6" }}>{posts.filter((p) => p.is_featured).length}</div></Card>
      </div>

      <Card>
        {loading ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>Loading…</div> :
          filtered.length === 0 ? <div style={{ padding: 32, textAlign: "center", color: "#8a96a8" }}>No posts yet. Create your first blog post!</div> :
          <Table
            headers={["Title", "Author", "Status", "Featured", "Date", "Actions"]}
            rows={filtered.map((p) => [
              <div key="t"><div style={{ fontWeight: 600, fontSize: 12.5 }}>{p.title}</div><div style={{ fontSize: 11, color: "#8a96a8" }}>/blogs/{p.slug}</div></div>,
              <span key="a" style={{ fontSize: 12 }}>{p.author}</span>,
              <Badge key="s" text={p.is_published ? "Published" : "Draft"} color={p.is_published ? "green" : "yellow"} />,
              <Badge key="f" text={p.is_featured ? "Featured" : "Standard"} color={p.is_featured ? "purple" : "gray"} />,
              <span key="d" style={{ fontSize: 11, color: "#8a96a8" }}>{new Date(p.created_at).toLocaleDateString()}</span>,
              <div key="ac" style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Btn label="Edit" onClick={() => openEdit(p)} color="outline" size="sm" />
                <Btn label={p.is_published ? "Unpublish" : "Publish"} onClick={() => togglePublish(p.id, p.is_published)} color={p.is_published ? "yellow" : "green"} size="sm" />
                <Btn label={p.is_featured ? "Unfeature" : "Feature"} onClick={() => toggleFeatured(p.id, p.is_featured)} color="outline" size="sm" />
                <Btn label={deleting === p.id ? "…" : "Delete"} onClick={() => deletePost(p.id)} color="red" size="sm" />
              </div>,
            ])}
          />
        }
      </Card>

      {/* Create Modal */}
      <Modal title="New Blog Post" open={showCreate} onClose={() => setShowCreate(false)}
        footer={<><Btn label="Cancel" onClick={() => setShowCreate(false)} color="outline" /><Btn label="Create Post" onClick={create} /></>}>
        <FormField label="Title *"><Inp value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title…" /></FormField>
        <FormField label="Author"><Inp value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></FormField>
        <FormField label="Content (Markdown supported)">
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here…" style={{ width: "100%", border: "1px solid #e4e8ee", borderRadius: 9, padding: "9px 11px", fontSize: 12.5, outline: "none", background: "#f8fafc", resize: "vertical", minHeight: 140, boxSizing: "border-box" }} />
        </FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FormField label="Status">
            <Sel value={form.is_published ? "published" : "draft"} onChange={(e) => setForm({ ...form, is_published: e.target.value === "published" })}>
              <option value="draft">Save as Draft</option><option value="published">Publish Now</option>
            </Sel>
          </FormField>
          <FormField label="Featured">
            <Sel value={form.is_featured ? "yes" : "no"} onChange={(e) => setForm({ ...form, is_featured: e.target.value === "yes" })}>
              <option value="no">Standard</option><option value="yes">Featured</option>
            </Sel>
          </FormField>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal title="Edit Blog Post" open={!!editPost} onClose={() => setEditPost(null)}
        footer={<><Btn label="Cancel" onClick={() => setEditPost(null)} color="outline" /><Btn label="Save Changes" onClick={saveEdit} /></>}>
        <FormField label="Title"><Inp value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} /></FormField>
        <FormField label="Author"><Inp value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} /></FormField>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <FormField label="Status">
            <Sel value={editForm.is_published ? "published" : "draft"} onChange={(e) => setEditForm({ ...editForm, is_published: e.target.value === "published" })}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </Sel>
          </FormField>
          <FormField label="Featured">
            <Sel value={editForm.is_featured ? "yes" : "no"} onChange={(e) => setEditForm({ ...editForm, is_featured: e.target.value === "yes" })}>
              <option value="no">Standard</option><option value="yes">Featured</option>
            </Sel>
          </FormField>
        </div>
      </Modal>

      <Toast msg={toast.msg} show={toast.show} />
    </PageShell>
  );
}
