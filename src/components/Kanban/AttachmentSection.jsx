import { useRef } from 'react';
import { useAttachments } from '../../context/AttachmentContext';
import { useToast } from '../../context/ToastContext';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentSection({ taskId, taskTitle }) {
  const { addAttachment, deleteAttachment, getAttachments } = useAttachments();
  const { showToast } = useToast();
  const { logActivity } = useActivity();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const files = getAttachments(taskId);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_SIZE) {
      showToast('File too large! Max 2MB allowed.', 'error');
      e.target.value = '';
      return;
    }

    try {
      await addAttachment(taskId, file);
      logActivity(user?.name || 'Someone', `attached "${file.name}" to "${taskTitle}"`);
      showToast('File attached successfully', 'success');
    } catch (err) {
      showToast('Failed to attach file', 'error');
    }
    e.target.value = '';
  };

  const handleDelete = (fileId, fileName) => {
    deleteAttachment(taskId, fileId);
    logActivity(user?.name || 'Someone', `removed attachment "${fileName}" from "${taskTitle}"`);
    showToast('Attachment removed', 'error');
  };

  return (
    <div className="attachment-section">
      <div className="attachment-header">
        <label>Attachments ({files.length})</label>
        <button className="attach-btn" onClick={() => fileInputRef.current.click()}>
          📎 Attach File
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      {files.length === 0 ? (
        <p className="attachment-empty">No files attached. Max 2MB per file.</p>
      ) : (
        <div className="attachment-list">
          {files.map((f) => (
            <div key={f.id} className="attachment-item">
              {f.type.startsWith('image/') ? (
                <img src={f.dataUrl} alt={f.name} className="attachment-thumb" />
              ) : (
                <div className="attachment-icon">📄</div>
              )}
              <div className="attachment-info">
                <a href={f.dataUrl} download={f.name} className="attachment-name">
                  {f.name}
                </a>
                <span className="attachment-size">{formatSize(f.size)}</span>
              </div>
              <button
                className="attachment-delete"
                onClick={() => handleDelete(f.id, f.name)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AttachmentSection;