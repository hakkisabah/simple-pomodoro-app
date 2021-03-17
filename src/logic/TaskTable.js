import 'datatables.net';
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

export default class TaskTable {
  constructor(fetchedData) {
    this._tableInit(fetchedData);
  }
  _tableInit(fetchedData) {
    this._iconWrapper(fetchedData);
    window.addEventListener('load', function () {
      $('#task_table').DataTable({
        processing: true,
        data: fetchedData,
        order: [[0, 'desc']],
        language: {
          sDecimal: ',',
          sEmptyTable: 'No data available in table.',
          sInfo: 'Showing _START_ to _END_ of _TOTAL_ entries',
          sInfoEmpty: 'No record',
          sInfoFiltered: '(filtered from _MAX_ total entries)',
          sInfoPostFix: '',
          sInfoThousands: '.',
          sLengthMenu: 'Show _MENU_ entries',
          sLoadingRecords: 'Loading ...',
          sProcessing: 'Processing ...',
          sSearch: 'Search:',
          sZeroRecords: 'No matching records found',
          oPaginate: {
            sFirst: 'First',
            sLast: 'End',
            sNext: 'Next',
            sPrevious: 'Previous',
          },
          oAria: {
            sSortAscending: ': activate to sort column ascending',
            sSortDescending: ': activate to sort column descending',
          },
          select: {
            rows: {
              _: '% d records selected',
              0: '',
              1: '1 record selected',
            },
          },
        },
        columnDefs: [{ className: 'dt-center', targets: '_all' }],
        columns: [
          { data: 'id' },
          { data: 'title' },
          { data: 'completed' },
          { data: 'action', orderable: false },
        ],
        deferRender: true,
        retrieve: true,
      });
    });
  }
  _addTaskAction(obj) {
    if (obj.completed === 'NO') {
      return '<img class="refresh-icon" src="assets/images/icons/time_refresh_clock.png"><img class="delete-icon" src="assets/images/icons/delete.png">';
    } else {
      return '<img class="delete-icon" src="assets/images/icons/delete.png">';
    }
  }
  addTask(task) {
    let table = this._getTable();
    task.action = this._addTaskAction(task);
    const { id, title, completed, action } = task;
    table.row.add({ id, title, completed, action }).draw(false);
    table.row(0).invalidate().draw();
  }
  _getTable() {
    return $('#task_table').DataTable();
  }

  _iconWrapper(fetchedData) {
    fetchedData.filter((obj) => {
      obj.action = this._addTaskAction(obj);
    });
  }
}
