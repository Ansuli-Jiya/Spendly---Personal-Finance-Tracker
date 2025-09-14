import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BASE_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BASE_URL}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setFile(null);
      setName('');
      setDescription('');
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BASE_URL}/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 slide-up">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white`}>Documents</h1>
          <p className={`text-sm sm:text-base text-gray-700 dark:text-[#9CA3AF]`}>Manage your documents</p>
        </div>
      </div>
      <form onSubmit={handleUpload} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-base font-bold text-black dark:text-white mb-1">Document Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field text-black dark:text-white placeholder-gray-400" required />
        </div>
        <div>
          <label className="block text-base font-bold text-black dark:text-white mb-1">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input-field text-black dark:text-white placeholder-gray-400" />
        </div>
        <div>
          <label className="block text-base font-bold text-black dark:text-white mb-1">Upload File</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="input-field" required />
        </div>
        <button type="submit" className="btn-primary">Upload</button>
      </form>
      <div className="card-glass">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Your Documents</h2>
        {loading ? <div>Loading...</div> : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4 text-gray-500">No documents uploaded.</td></tr>
              ) : documents.map(doc => (
                <tr key={doc._id}>
                  <td className="px-4 py-2 text-black dark:text-white">{doc.name}</td>
                  <td className="px-4 py-2 text-black dark:text-white">{doc.description}</td>
                  <td className="px-4 py-2"><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></td>
                  <td className="px-4 py-2"><button onClick={() => handleDelete(doc._id)} className="text-red-600 hover:text-red-900">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Documents; 