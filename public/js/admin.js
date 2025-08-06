(() => {
  document.addEventListener('DOMContentLoaded', initDashboard);

  async function initDashboard() {
    try {
      const res = await fetch('/api/requests', { credentials: 'include' });
      const data = await res.json();
      updateKPIs(data);
      renderCharts(data);
      initPendingTable(data);
    } catch (e) {
      console.error('Dashboard load failed:', e);
    }
  }

  function updateKPIs(data) {
    document.getElementById('kpiTotal').textContent = data.length;
    document.getElementById('kpiApproved').textContent = data.filter(r => r.status === 'Approved').length;
    document.getElementById('kpiPending').textContent = data.filter(r => r.status === 'Pending').length;
    document.getElementById('kpiRejected').textContent = data.filter(r => r.status === 'Rejected').length;
  }

  function renderCharts(data) {
    const ctx1 = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx1, {
      type: 'pie',
      data: {
        labels: ['Approved', 'Pending', 'Rejected'],
        datasets: [{
          data: [
            data.filter(r => r.status === 'Approved').length,
            data.filter(r => r.status === 'Pending').length,
            data.filter(r => r.status === 'Rejected').length
          ],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
      }
    });

    const counts = data.reduce((acc, r) => {
      const d = new Date(r.created_at).toLocaleDateString();
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(counts).sort((a, b) => new Date(a) - new Date(b));
    const points = labels.map(d => counts[d]);

    const ctx2 = document.getElementById('timeChart').getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: 'Requests', data: points, fill: false }]
      }
    });
  }

  function initPendingTable(data) {
    const pending = data
      .filter(r => r.status === 'Pending')
      .map(r => ({
        id: r.id,
        employee: r.employee,
        equipment: r.equipment,
        qty: r.quantity,
        justification: r.justification,
        date: new Date(r.created_at).toLocaleDateString(),
        actions: `
          <button class="btn btn-sm btn-success approve" data-id="${r.id}">Approve</button>
          <button class="btn btn-sm btn-danger reject" data-id="${r.id}">Reject</button>
        `
      }));

    const table = $('#pendingTable').DataTable({
      data: pending,
      columns: [
        { title: 'ID',            data: 'id' },
        { title: 'Employee ID',   data: 'employee' },
        { title: 'Equipment',     data: 'equipment' },
        { title: 'Qty',           data: 'qty' },
        { title: 'Justification', data: 'justification' },
        { title: 'Date',          data: 'date' },
        { title: 'Actions',       data: 'actions' }
      ],
      paging:    false,
      searching: false,
      info:      false
    });

    $('#pendingTable tbody')
      .on('click', 'button.approve', async function () {
        const id = $(this).data('id');
        await fetch(`/api/requests/${id}/approved`, { method: 'POST', credentials: 'include' });
        location.reload();
      })
      .on('click', 'button.reject', async function () {
        const id = $(this).data('id');
        await fetch(`/api/requests/${id}/rejected`, { method: 'POST', credentials: 'include' });
        location.reload();
      });
  }
})();
