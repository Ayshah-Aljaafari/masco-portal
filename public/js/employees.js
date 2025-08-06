(() => {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) initLogin();
    if (document.getElementById('requestForm')) initRequestForm();
    if (document.getElementById('cardsContainer')) initMyRequests();
  });

  function initLogin() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role })
        });
        const json = await res.json();
        if (res.ok && json.redirect) {
          window.location = json.redirect;
        } else {
          alert(json.error || 'Login failed');
        }
      } catch {
        alert('Server error');
      }
    });
  }

  function initRequestForm() {
    fetch('/api/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(user => {
        document.getElementById('employeeId').value = user.username;
      })
      .catch(err => console.error('Error fetching current user:', err));

    const sel = document.getElementById('equipment');
    const otherDiv = document.getElementById('otherEquipmentDiv');
    otherDiv.style.display = 'none';

    sel.addEventListener('change', () => {
      otherDiv.style.display = sel.value === 'Other' ? 'block' : 'none';
    });

    document.getElementById('requestForm').addEventListener('submit', async e => {
      e.preventDefault();
      const msg = document.getElementById('formMessage');
      msg.textContent = '';
      msg.className = '';

      let valid = true;
      ['equipment', 'quantity', 'justification'].forEach(id => {
        const field = document.getElementById(id);
        field.classList.remove('is-invalid');
        if (!field.value.trim() || (id === 'quantity' && Number(field.value) < 1)) {
          field.classList.add('is-invalid');
          valid = false;
        }
      });

      if (otherDiv.style.display === 'block') {
        const oth = document.getElementById('otherEquipment');
        oth.classList.remove('is-invalid');
        if (!oth.value.trim()) {
          oth.classList.add('is-invalid');
          valid = false;
        }
      }

      const policy = document.getElementById('policyAgree');
      policy.classList.remove('is-invalid');
      if (!policy.checked) {
        policy.classList.add('is-invalid');
        valid = false;
      }

      if (!valid) {
        msg.className = 'alert alert-danger';
        msg.textContent = 'Please fix the errors and try again.';
        return;
      }

      try {
        const payload = {
          equipment: sel.value,
          other: otherDiv.style.display === 'block' ? document.getElementById('otherEquipment').value : '',
          quantity: document.getElementById('quantity').value,
          justification: document.getElementById('justification').value
        };
        const res = await fetch('/api/requests', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          msg.className = 'alert alert-success';
          msg.textContent = `Request #${data.id} submitted!`;
          sel.value = '';
          document.getElementById('quantity').value = '';
          document.getElementById('justification').value = '';
          policy.checked = false;
          otherDiv.style.display = 'none';
        } else {
          msg.className = 'alert alert-danger';
          msg.textContent = data.error || 'Submission failed.';
        }
      } catch {
        msg.className = 'alert alert-danger';
        msg.textContent = 'Server error.';
      }
    });
  }

  async function initMyRequests() {
    let all = [];
    const cont = document.getElementById('cardsContainer');
    const si = document.getElementById('searchInput');
    const sf = document.getElementById('statusFilter');
    const cb = document.getElementById('clearFilters');

    try {
      const res = await fetch('/api/my-requests', { credentials: 'include' });
      all = await res.json();
    } catch {
      cont.innerHTML = `<div class="col-12 text-danger text-center">Failed to load.</div>`;
      return;
    }

    function render(list) {
      if (!list.length) {
        cont.innerHTML = `<div class="col-12 text-muted text-center">No requests found.</div>`;
        return;
      }
      cont.innerHTML = list.map(r => `
        <div class="col-sm-6 col-lg-4">
          <div class="card mb-4">
            <div class="card-body text-start">
              <h5 class="card-title">Request #${r.id}</h5>
              <p><strong>Equipment:</strong> ${r.equipment}${r.other ? ` (${r.other})` : ''}</p>
              <p><strong>Qty:</strong> ${r.quantity}</p>
              <p><strong>Status:</strong>
                <span class="badge ${
                  r.status === 'Approved' ? 'bg-success' :
                  r.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                }">${r.status}</span>
              </p>
              <p class="text-muted small">${new Date(r.created_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    function applyFilters() {
      const term = si.value.trim().toLowerCase();
      const st = sf.value;
      render(all.filter(r => {
        if (term && !r.equipment.toLowerCase().includes(term)) return false;
        if (st && r.status !== st) return false;
        return true;
      }));
    }

    si.addEventListener('input', applyFilters);
    sf.addEventListener('change', applyFilters);
    cb.addEventListener('click', () => { si.value = ''; sf.value = ''; applyFilters(); });

    render(all);
  }
})();
