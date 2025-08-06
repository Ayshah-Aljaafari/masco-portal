$(() => {
  const tbl = $('#inventoryTable');
  if (!tbl.length) return;

  const table = tbl.DataTable({
    paging: false,
    info: false,
    searching: false
  });

  $('#inventorySearch').on('input', function () {
    table.search(this.value).draw();
  });

  function openModal(row) {
    const isNew = !row;
    $('#modalItemName')
      .prop('readonly', !isNew)
      .val(isNew ? '' : row.find('td').eq(0).text());
    $('#modalOnHand').val(isNew ? '' : row.find('td').eq(1).text());
    $('#itemForm').data('row', row);
    $('#itemModal').modal('show');
  }

  tbl.on('click', '.btn-adjust', function () {
    openModal($(this).closest('tr'));
  });

  let rowToDelete = null;
  tbl.on('click', '.btn-delete', function () {
    rowToDelete = $(this).closest('tr');
    $('#confirmDeleteModal').modal('show');
  });

  $('#confirmDeleteBtn').on('click', function () {
    if (rowToDelete) {
      table.row(rowToDelete).remove().draw();
      rowToDelete = null;
    }
    $('#confirmDeleteModal').modal('hide');
  });

  $('#addItemBtn').on('click', () => openModal(null));

  $('#itemForm').on('submit', function (e) {
    e.preventDefault();
    const row = $(this).data('row');
    const name = $('#modalItemName').val().trim();
    const onHand = parseInt($('#modalOnHand').val(), 10) || 0;

    const actionBtns = `
      <div class="btn-group btn-group-sm" role="group">
        <button type="button" class="btn btn-outline-primary btn-adjust">Adjust</button>
        <button type="button" class="btn btn-outline-danger btn-delete">Delete</button>
      </div>
    `;

    if (row) {
      const node = row.get(0);
      table.cell(node, 1).data(onHand);
      const reserved = parseInt(table.cell(node, 2).data(), 10) || 0;
      table.cell(node, 3).data(onHand - reserved);
    } else {
      table.row.add([name, onHand, 0, onHand, actionBtns]).draw();
    }

    $('#itemModal').modal('hide');
  });
});
