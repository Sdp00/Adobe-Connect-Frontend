import createModal from '../../helper/helper.js';

export default async function decorate() {}

/* UPLOAD MEDIA TO SUPABASE */
async function uploadMedia(file) {
  const client = window.SupabaseUtils.client;
  const filePath = `events/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

  const { data, error } = await client.storage
    .from('uploads')
    .upload(filePath, file, { cacheControl: '3600', upsert: false, contentType: file.type });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = client.storage.from('uploads').getPublicUrl(data.path);
  return urlData.publicUrl;
}

/* TOAST */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification${type === 'error' ? ' toast-error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* CREATE ITEM MODAL — exported so header.js can call it */
export function openCreateModal() {
  const form = document.createElement('form');
  form.className = 'create-event-form';
  form.innerHTML = `
    <h2>Create New Item</h2>
    <p>Fill in the details below to create a new item.</p>
  `;

  const categorySelect = document.createElement('select');
  categorySelect.name = 'category';
  categorySelect.required = true;
  categorySelect.innerHTML = `
    <option value="">Select Category *</option>
    <option value="event">Event</option>
    <option value="training">Training</option>
    <option value="newsletter">Newsletter</option>
    <option value="others">Others</option>
  `;

  const dynamicFields = document.createElement('div');
  dynamicFields.className = 'dynamic-fields';

  form.append(categorySelect, dynamicFields);

  const footer = document.createElement('div');
  footer.className = 'modal-actions';
  footer.innerHTML = `
    <button type="button" class="btn-secondary">Cancel</button>
    <button type="submit" class="btn-primary">Submit</button>
  `;

  const modal = createModal({
    id: 'create-item',
    content: form,
    footer,
    onClose: () => {},
  });

  footer.querySelector('.btn-secondary').addEventListener('click', modal.close);
  footer.querySelector('.btn-primary').addEventListener('click', () => form.requestSubmit());

  categorySelect.addEventListener('change', () => {
    const value = categorySelect.value;
    dynamicFields.innerHTML = '';

    if (value === 'event') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>
          Media (Image/Video) <span class="req">*</span>
          <input type="file" accept="image/*,video/*" name="media" required />
          <span class="file-hint">Will be uploaded and stored as a URL</span>
        </label>
        <label>Location <span class="req">*</span><input required name="location" placeholder="Enter location" /></label>
        <div class="form-row">
          <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
          <label>Time <span class="req">*</span><input type="time" required name="time" /></label>
        </div>
        <label>Deadline <span class="req">*</span><input type="date" required name="deadline" /></label>
        <label>Description<textarea name="description" placeholder="Optional description..."></textarea></label>
      `;
    } else if (value === 'training') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Media Upload (Image/Video)<input type="file" accept="image/*,video/*" name="media" /></label>
        <label>Location<input name="location" placeholder="Enter location" /></label>
        <div class="form-row">
          <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
          <label>Time <span class="req">*</span><input type="time" required name="time" /></label>
        </div>
        <label>Description<textarea name="description" placeholder="Optional description..."></textarea></label>
      `;
    } else if (value === 'newsletter') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Image<input type="file" accept="image/*" name="image" /></label>
        <label>Description <span class="req">*</span><textarea name="description" placeholder="Enter description..."></textarea></label>
        <label>Date <span class="req">*</span><input type="date" required name="date" /></label>
        <label>Redirection URL<input type="url" name="url" placeholder="https://example.com" /></label>
      `;
    } else if (value === 'others') {
      dynamicFields.innerHTML = `
        <label>Title <span class="req">*</span><input required name="title" placeholder="Enter title" /></label>
        <label>Description <span class="req">*</span><textarea name="description" placeholder="Enter description..."></textarea></label>
        <label>Image<input type="file" accept="image/*" name="image" /></label>
      `;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitBtn = footer.querySelector('.btn-primary');

    if (data.category === 'event') {
      if (!window.SupabaseUtils) { showToast('Supabase not ready.', 'error'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Uploading media...';

      try {
        const mediaFile = form.querySelector('input[name="media"]').files[0];
        let mediaUrl = null;
        if (mediaFile) mediaUrl = await uploadMedia(mediaFile);

        submitBtn.textContent = 'Saving event...';

        const { error: dbError } = await window.SupabaseUtils.createRecord('events', {
          title: data.title,
          Media: mediaUrl,
          location: data.location,
          date: data.date,
          time: data.time,
          deadline: data.deadline,
        });

        if (dbError) {
          showToast(`Failed to save event: ${dbError.message}`, 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
          return;
        }

        window.dispatchEvent(new Event('events-updated'));
        modal.close();
        showToast('Event created successfully!');
      } catch (err) {
        showToast(err.message || 'Something went wrong.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }

    } else if (data.category === 'training' || data.category === 'newsletter') {
      modal.close();
      const label = data.category.charAt(0).toUpperCase() + data.category.slice(1);
      showToast(`${label} submitted successfully!`);

    } else if (data.category === 'others') {
      if (!window.SupabaseUtils) { showToast('Supabase not ready.', 'error'); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        let imageUrl = null;
        const imageFile = form.querySelector('input[name="image"]')?.files[0];
        if (imageFile) {
          submitBtn.textContent = 'Uploading image...';
          imageUrl = await uploadMedia(imageFile);
        }

        const { error: dbError } = await window.SupabaseUtils.createRecord('others', {
          title: data.title,
          description: data.description,
          image: imageUrl,
        });

        if (dbError) {
          showToast(`Failed to save: ${dbError.message}`, 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
          return;
        }

        modal.close();
        showToast('Updated successfully!');
      } catch (err) {
        showToast(err.message || 'Something went wrong.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  });

  modal.open();
}