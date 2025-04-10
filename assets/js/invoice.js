'use strict';

(function ($) {
  function calculateAmounts() {
    let subtotal = 0;

    $('#invoice-table tbody tr').each(function () {
      const row = $(this);
      const price = parseFloat(row.find('.price').val()) || 0;
      const qty = parseInt(row.find('.qty').val()) || 0;
      const amount = price * qty;
      row.find('.amount').val(amount.toFixed(2)); // Set formatted value

      subtotal += amount; // Sum up all row amounts
    });

    updateTotals(subtotal);
  }

  function updateTotals(subtotal) {
    $('#subtotal').text(`₹ ${subtotal.toFixed(2)}`);

    const taxRate = parseFloat($('#tax').val()) || 0;
    const discountRate = parseFloat($('#discount').val()) || 0;
    const amountPaid = parseFloat($('#amountPaid').val()) || 0;

    const taxAmount = (subtotal * taxRate) / 100;
    const discountAmount = (subtotal * discountRate) / 100;

    const grandTotal = subtotal + taxAmount - discountAmount;
    const balanceDue = grandTotal - amountPaid;

    $('#taxAmount').text(`₹ ${taxAmount.toFixed(2)}`);
    $('#discountAmount').text(`₹ ${discountAmount.toFixed(2)}`);
    $('#grandTotal').text(`₹ ${grandTotal.toFixed(2)}`);
    $('#balanceDue').text(`₹ ${balanceDue.toFixed(2)}`);
  }

  $('#addRow').click(function () {
    const rowCount = $('#invoice-table tbody tr').length + 1;
    const newRow = `
          <tr>
              <td>${String(rowCount).padStart(2, '0')}</td>
              <td> <input type="text" class="invoive-form-control" placeholder="Item"> </td>
              <td> <input type="number" class="invoive-form-control price" placeholder="₹0.00" step="0.01"> </td>
              <td> <input type="number" class="invoive-form-control qty" value="1" min="1"> </td>
              <td> <input type="number" class="invoive-form-control amount" value="0.00" step="0.01" readonly> </td>
              <td class="text-center">
                  <button type="button" class="remove-row"><iconify-icon icon="ic:twotone-close" class="text-danger-main text-xl"></iconify-icon></button>
              </td>
          </tr>
      `;
    $('#invoice-table tbody').append(newRow);
    calculateAmounts();
  });

  $(document).on('click', '.remove-row', function () {
    $(this).closest('tr').remove();
    updateRowNumbers();
    calculateAmounts();
  });

  function updateRowNumbers() {
    $('#invoice-table tbody tr').each(function (index) {
      $(this).find('td:first').text(String(index + 1).padStart(2, '0'));
    });
  }

  // Editable cell handling
  $(document).on('click', '.editable', function () {
    const cell = $(this);
    const input = cell.find('input');

    if (!input.length) {
      const originalText = cell.text().trim();
      const newInput = $('<input type="text" class="invoive-form-control" />').val(originalText);
      cell.html(newInput);
      newInput.focus().select();

      newInput.blur(function () {
        const newText = newInput.val().trim();
        cell.html(newText || originalText);
        calculateAmounts(); // Recalculate after editing
      });

      newInput.keypress(function (e) {
        if (e.which == 13) { // Enter key
          const newText = newInput.val().trim();
          cell.html(newText || originalText);
          calculateAmounts(); // Recalculate after editing
        }
      });
    }
  });

  // Trigger calculations when price, qty, tax, discount, or amount paid are updated
  $(document).on('input', '.price, .qty, #tax, #discount, #amountPaid', calculateAmounts);

  // Run initial calculations
  $(document).ready(function () {
    calculateAmounts();
  });

})(jQuery);
