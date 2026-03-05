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

  let container = document.getElementById('global-toast-container');

  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';

    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '999999999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';

    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.textContent = message;

  toast.style.background = type === 'error' ? '#e11d48' : '#16a34a';
  toast.style.color = '#fff';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '8px';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
  toast.style.animation = 'toastSlide 0.3s ease';

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

/* SHOW FIELD ERROR */
function showFieldError(input, message) {
  if (!input) return;
  input.style.borderColor = '#e11d48';
  let err = input.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    input.after(err);
  }
  err.textContent = message;
}

/* CLEAR FIELD ERRORS */
function clearFieldErrors(form) {
  form.querySelectorAll('.field-error').forEach((e) => e.remove());
  form.querySelectorAll('input, select, textarea').forEach((el) => {
    el.style.borderColor = '';
  });
}

/* LOCAL TODAY STRING */
function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* FIELD HELPER */
function field(labelText, required, id, inputHtml, hint = '') {
  return `
    <div class="form-field">
      <label class="label-text" for="${id}" style="display:flex;align-items:center;gap:3px;flex-wrap:nowrap;">${labelText}${required ? '<span class="req" style="display:inline;line-height:1;">*</span>' : ''}</label>
      ${inputHtml}
      ${hint ? `<span class="file-hint">${hint}</span>` : ''}
    </div>
  `;
}

/* DATE GUARD */
function guardDate(input, todayStr, onValid) {
  input.addEventListener('change', () => {
    input.style.borderColor = '';
    input.parentElement.querySelector('.field-error')?.remove();

    if (input.value && input.value < todayStr) {
      input.value = todayStr;
      showFieldError(input, 'Cannot select a past date');
      return;
    }

    if (onValid) onValid(input.value);
  });
}

/* CREATE ITEM MODAL */
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
    <button type="button" class="btn-primary">Submit</button>
  `;

  const modal = createModal({
    id: 'create-item',
    content: form,
    footer,
    onClose: () => {
      clearFieldErrors(form);
      categorySelect.value = '';
      dynamicFields.innerHTML = '';
    },
  });

  footer.querySelector('.btn-secondary').addEventListener('click', modal.close);

  categorySelect.addEventListener('change', () => {
    const value = categorySelect.value;
    dynamicFields.innerHTML = '';
    clearFieldErrors(form);

    const todayStr = getTodayStr();

    if (value === 'event') {
      dynamicFields.innerHTML = `
        ${field('Title', true, 'ev-title', '<input id="ev-title" name="title" placeholder="Enter title" />')}
        ${field('Media (Image/Video)', true, 'ev-media', '<input id="ev-media" type="file" accept="image/*,video/*" name="media" />', 'Will be uploaded and stored as a URL')}
        ${field('Location', true, 'ev-location', '<input id="ev-location" name="location" placeholder="Enter location" />')}
        <div class="form-row">
          ${field('Date', true, 'ev-date', `<input id="ev-date" type="date" name="date" min="${todayStr}" />`)}
          ${field('Time', true, 'ev-time', '<input id="ev-time" type="time" name="time" />')}
        </div>
        ${field('Deadline', true, 'ev-deadline', `<input id="ev-deadline" type="date" name="deadline" min="${todayStr}" />`)}
        ${field('Description', false, 'ev-desc', '<textarea id="ev-desc" name="description" placeholder="Optional description..."></textarea>')}
      `;

      const dateInput = dynamicFields.querySelector('#ev-date');
      const timeInput = dynamicFields.querySelector('#ev-time');
      const deadlineInput = dynamicFields.querySelector('#ev-deadline');

      guardDate(dateInput, todayStr, (dateVal) => {
        deadlineInput.max = dateVal;
        if (deadlineInput.value && deadlineInput.value > dateVal) {
          deadlineInput.value = '';
          showFieldError(deadlineInput, 'Deadline reset — must be on or before event date');
        }
        if (dateVal === todayStr) {
          const now = new Date();
          timeInput.min = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        } else {
          timeInput.min = '';
        }
      });

      deadlineInput.addEventListener('change', () => {
        deadlineInput.style.borderColor = '';
        deadlineInput.parentElement.querySelector('.field-error')?.remove();
        if (!dateInput.value) {
          deadlineInput.value = '';
          showFieldError(deadlineInput, 'Please select event date first');
          return;
        }
        if (deadlineInput.value < todayStr) {
          deadlineInput.value = todayStr;
          showFieldError(deadlineInput, 'Cannot select a past date');
          return;
        }
        if (deadlineInput.value > dateInput.value) {
          deadlineInput.value = dateInput.value;
          showFieldError(deadlineInput, 'Deadline cannot be after event date');
        }
      });

      timeInput.addEventListener('change', () => {
        timeInput.style.borderColor = '';
        timeInput.parentElement.querySelector('.field-error')?.remove();
      });

    } else if (value === 'training') {
      dynamicFields.innerHTML = `
        ${field('Title', true, 'tr-title', '<input id="tr-title" name="title" placeholder="Enter title" />')}
        ${field('Media (Image/Video)', false, 'tr-media', '<input id="tr-media" type="file" accept="image/*,video/*" name="media" />')}
        ${field('Location', false, 'tr-location', '<input id="tr-location" name="location" placeholder="Enter location" />')}
        <div class="form-row">
          ${field('Date', true, 'tr-date', `<input id="tr-date" type="date" name="date" min="${todayStr}" />`)}
          ${field('Time', true, 'tr-time', '<input id="tr-time" type="time" name="time" />')}
        </div>
        ${field('Description', false, 'tr-desc', '<textarea id="tr-desc" name="description" placeholder="Optional description..."></textarea>')}
      `;

      const dateInput = dynamicFields.querySelector('#tr-date');
      const timeInput = dynamicFields.querySelector('#tr-time');

      guardDate(dateInput, todayStr, (dateVal) => {
        if (dateVal === todayStr) {
          const now = new Date();
          timeInput.min = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        } else {
          timeInput.min = '';
        }
      });

      timeInput.addEventListener('change', () => {
        timeInput.style.borderColor = '';
        timeInput.parentElement.querySelector('.field-error')?.remove();
      });

    } else if (value === 'newsletter') {
      dynamicFields.innerHTML = `
        ${field('Title', true, 'nl-title', '<input id="nl-title" name="title" placeholder="Enter title" />')}
        ${field('Image', false, 'nl-image', '<input id="nl-image" type="file" accept="image/*" name="image" />')}
        ${field('Description', true, 'nl-desc', '<textarea id="nl-desc" name="description" placeholder="Enter description..."></textarea>')}
        ${field('Date', true, 'nl-date', `<input id="nl-date" type="date" name="date" min="${todayStr}" />`)}
        ${field('Redirection URL', false, 'nl-url', '<input id="nl-url" type="url" name="url" placeholder="https://example.com" />')}
      `;

      const dateInput = dynamicFields.querySelector('#nl-date');
      guardDate(dateInput, todayStr, null);

    } else if (value === 'others') {
      dynamicFields.innerHTML = `
        ${field('Title', true, 'ot-title', '<input id="ot-title" name="title" placeholder="Enter title" />')}
        ${field('Description', true, 'ot-desc', '<textarea id="ot-desc" name="description" placeholder="Enter description..."></textarea>')}
        ${field('Image', false, 'ot-image', '<input id="ot-image" type="file" accept="image/*" name="image" />')}
        ${field('Location', true, 'ot-location', '<input id="ot-location" name="location" placeholder="Enter location" />')}
        <div class="form-row">
          ${field('Date', true, 'ot-date', `<input id="ot-date" type="date" name="date" min="${todayStr}" />`)}
          ${field('Time', true, 'ot-time', '<input id="ot-time" type="time" name="time" />')}
        </div>
        ${field('Deadline', true, 'ot-deadline', `<input id="ot-deadline" type="date" name="deadline" min="${todayStr}" />`)}
      `;

      const dateInput = dynamicFields.querySelector('#ot-date');
      const timeInput = dynamicFields.querySelector('#ot-time');
      const deadlineInput = dynamicFields.querySelector('#ot-deadline');

      guardDate(dateInput, todayStr, (dateVal) => {
        deadlineInput.max = dateVal;
        if (deadlineInput.value && deadlineInput.value > dateVal) {
          deadlineInput.value = '';
          showFieldError(deadlineInput, 'Deadline reset — must be on or before date');
        }
        if (dateVal === todayStr) {
          const now = new Date();
          timeInput.min = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        } else {
          timeInput.min = '';
        }
      });

      deadlineInput.addEventListener('change', () => {
        deadlineInput.style.borderColor = '';
        deadlineInput.parentElement.querySelector('.field-error')?.remove();
        if (!dateInput.value) {
          deadlineInput.value = '';
          showFieldError(deadlineInput, 'Please select date first');
          return;
        }
        if (deadlineInput.value < todayStr) {
          deadlineInput.value = todayStr;
          showFieldError(deadlineInput, 'Cannot select a past date');
          return;
        }
        if (deadlineInput.value > dateInput.value) {
          deadlineInput.value = dateInput.value;
          showFieldError(deadlineInput, 'Deadline cannot be after date');
        }
      });

      timeInput.addEventListener('change', () => {
        timeInput.style.borderColor = '';
        timeInput.parentElement.querySelector('.field-error')?.remove();
      });
    }

    dynamicFields.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', () => {
        el.style.borderColor = '';
        el.parentElement.querySelector('.field-error')?.remove();
      });
    });
  });

  /* SUBMIT */
  footer.querySelector('.btn-primary').addEventListener('click', async () => {
    clearFieldErrors(form);

    const category = categorySelect.value;
    if (!category) {
      categorySelect.style.borderColor = '#e11d48';
      showToast('Please select a category.', 'error');
      return;
    }

    let hasError = false;
    const todayStr = getTodayStr();

    const titleInput = form.querySelector('input[name="title"]');
    if (!titleInput?.value.trim()) {
      showFieldError(titleInput, 'Required');
      hasError = true;
    }

    if (category === 'event') {
      const media = form.querySelector('input[name="media"]')?.files[0];
      if (!media) {
        showFieldError(form.querySelector('input[name="media"]'), 'Required');
        hasError = true;
      }

      const locationInput = form.querySelector('input[name="location"]');
      if (!locationInput?.value.trim()) {
        showFieldError(locationInput, 'Required');
        hasError = true;
      }

      const dateInput = form.querySelector('input[name="date"]');
      const timeInput = form.querySelector('input[name="time"]');
      const deadlineInput = form.querySelector('input[name="deadline"]');
      const dateVal = dateInput?.value;
      const timeVal = timeInput?.value;
      const deadlineVal = deadlineInput?.value;

      if (!dateVal) {
        showFieldError(dateInput, 'Required');
        hasError = true;
      } else if (dateVal < todayStr) {
        showFieldError(dateInput, 'Date cannot be in the past');
        hasError = true;
      }

      if (!timeVal) {
        showFieldError(timeInput, 'Required');
        hasError = true;
      } else if (dateVal === todayStr) {
        const now = new Date();
        const [h, m] = timeVal.split(':').map(Number);
        const selected = new Date();
        selected.setHours(h, m, 0, 0);
        if (selected <= now) {
          showFieldError(timeInput, 'Time must be in the future for today');
          hasError = true;
        }
      }

      if (!deadlineVal) {
        showFieldError(deadlineInput, 'Required');
        hasError = true;
      } else if (deadlineVal < todayStr) {
        showFieldError(deadlineInput, 'Deadline cannot be in the past');
        hasError = true;
      } else if (dateVal && deadlineVal > dateVal) {
        showFieldError(deadlineInput, 'Deadline must be on or before event date');
        hasError = true;
      }
    }

    if (category === 'training') {
      const dateInput = form.querySelector('input[name="date"]');
      const timeInput = form.querySelector('input[name="time"]');
      const dateVal = dateInput?.value;
      const timeVal = timeInput?.value;

      if (!dateVal) {
        showFieldError(dateInput, 'Required');
        hasError = true;
      } else if (dateVal < todayStr) {
        showFieldError(dateInput, 'Date cannot be in the past');
        hasError = true;
      }

      if (!timeVal) {
        showFieldError(timeInput, 'Required');
        hasError = true;
      } else if (dateVal === todayStr) {
        const now = new Date();
        const [h, m] = timeVal.split(':').map(Number);
        const selected = new Date();
        selected.setHours(h, m, 0, 0);
        if (selected <= now) {
          showFieldError(timeInput, 'Time must be in the future for today');
          hasError = true;
        }
      }
    }

    if (category === 'newsletter') {
      const desc = form.querySelector('textarea[name="description"]');
      if (!desc?.value.trim()) {
        showFieldError(desc, 'Required');
        hasError = true;
      }
      const dateInput = form.querySelector('input[name="date"]');
      const dateVal = dateInput?.value;
      if (!dateVal) {
        showFieldError(dateInput, 'Required');
        hasError = true;
      } else if (dateVal < todayStr) {
        showFieldError(dateInput, 'Date cannot be in the past');
        hasError = true;
      }
    }

    if (category === 'others') {
      const desc = form.querySelector('textarea[name="description"]');
      if (!desc?.value.trim()) {
        showFieldError(desc, 'Required');
        hasError = true;
      }

      const locationInput = form.querySelector('input[name="location"]');
      if (!locationInput?.value.trim()) {
        showFieldError(locationInput, 'Required');
        hasError = true;
      }

      const dateInput = form.querySelector('input[name="date"]');
      const timeInput = form.querySelector('input[name="time"]');
      const deadlineInput = form.querySelector('input[name="deadline"]');
      const dateVal = dateInput?.value;
      const timeVal = timeInput?.value;
      const deadlineVal = deadlineInput?.value;

      if (!dateVal) {
        showFieldError(dateInput, 'Required');
        hasError = true;
      } else if (dateVal < todayStr) {
        showFieldError(dateInput, 'Date cannot be in the past');
        hasError = true;
      }

      if (!timeVal) {
        showFieldError(timeInput, 'Required');
        hasError = true;
      } else if (dateVal === todayStr) {
        const now = new Date();
        const [h, m] = timeVal.split(':').map(Number);
        const selected = new Date();
        selected.setHours(h, m, 0, 0);
        if (selected <= now) {
          showFieldError(timeInput, 'Time must be in the future for today');
          hasError = true;
        }
      }

      if (!deadlineVal) {
        showFieldError(deadlineInput, 'Required');
        hasError = true;
      } else if (deadlineVal < todayStr) {
        showFieldError(deadlineInput, 'Deadline cannot be in the past');
        hasError = true;
      } else if (dateVal && deadlineVal > dateVal) {
        showFieldError(deadlineInput, 'Deadline must be on or before date');
        hasError = true;
      }
    }

    if (hasError) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const submitBtn = footer.querySelector('.btn-primary');

    if (category === 'event') {
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

    } else if (category === 'training' || category === 'newsletter') {
      modal.close();
      const lbl = category.charAt(0).toUpperCase() + category.slice(1);
      showToast(`${lbl} submitted successfully!`);

    } else if (category === 'others') {
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
          location: data.location,
          date: data.date,
          time: data.time,
          deadline: data.deadline,
        });

        if (dbError) {
          showToast(`Failed to save: ${dbError.message}`, 'error');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
          return;
        }

        modal.close();
        showToast('Created successfully!');
      } catch (err) {
        showToast(err.message || 'Something went wrong.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  });

  modal.open();
}