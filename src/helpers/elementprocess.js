export const wrapPeriodTimes = (th) => {
  return `
          <div class="col-md-8 mt-4">
            <label
              class="shadow col-form-label-sm col-sm-12 text-center bg-secondary bg-gradient rounded mt-1 p-2"
            >Enter ${th}. period name</label
            >
            <input
              type="text"
              class="shadow form-control form-control-sm bg-danger text-dark bg-gradient text-center"
              name="period${th}"
              maxlength="20"
            />
          </div>`;
};

export const placeWrappedTaskDepend = (wrappedDepend) => {
  return `
        <div class="row col-md-3 bg-secondary bg-gradient rounded-start mx-auto el-opc"></div>
        <form id='period-names' class="row fade-in col-md-6 justify-content-center bg-info p-5 mx-auto el-opc">
        ${wrappedDepend}
        </form>
        <div class="row col-md-3 bg-secondary bg-gradient rounded-end mx-auto el-opc"></div>`;
};

export const endMessage = (message) => {
  const $endMessageScreen = document.getElementById('end-message');
  let $endMessageScreenInstance = new bootstrap.Modal($endMessageScreen);
  let modalBody = $endMessageScreen.querySelector('.modal-body');
  modalBody.innerHTML = message;
  $endMessageScreenInstance.toggle();
};

// https://coderwall.com/p/ostduq/escape-html-with-javascript
export const escape_HTML = (string) => {
  // List of HTML entities for escaping.
  let htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  // Regex containing the keys listed immediately above.
  let htmlEscaper = /[&<>"'\/]/g;
  // Escape a string for HTML interpolation.
  return ('' + string).replace(htmlEscaper, function (match) {
    return htmlEscapes[match];
  });
};
