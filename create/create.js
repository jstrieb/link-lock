/**
 * Created by Jacob Strieb
 * May 2020
 */



/*******************************************************************************
 * Helper Functions
 ******************************************************************************/

// Highlight the text in an input with a given id
function highlight(id) {
  let output = document.querySelector("#" + id);
  output.focus();
  output.select()
  output.setSelectionRange(0, output.value.length + 1);
  return output;
}


// Validate all inputs, and display an error if necessary
function validateInputs() {
  var inputs = document.querySelectorAll(".form .labeled-input input");
  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    input.reportValidity = input.reportValidity || (() => true);
    if (!input.reportValidity()) {
      return false;
    }
  }

  // Extra check for older browsers for URL input. Not sure if necessary, since
  // older browsers without built-in HTML5 validation may fail elsewhere.
  let url = document.querySelector("#url");
  try {
    new URL(url.value);
  } catch {
    if (!("reportValidity" in url)) {
      alert("URL invalid. Make sure to include 'http://' at the beginning.");
    }
    return false;
  }

  return true;
}



/*******************************************************************************
 * Main UI Functions
 ******************************************************************************/

// Activated when the "Advanced" dropdown is pressed
function onAdvanced() {
  let label = document.querySelector("#advanced-label");
  let advanced = document.querySelector(".advanced");
  if (advanced.style.display == "none" || advanced.style.display == "") {
    label.innerHTML = "&#x25BE; advanced";
    advanced.style.display = "flex";
  } else {
    label.innerHTML = "&#x25B8; advanced";
    advanced.style.display = "none";
  }
}


// Activated when the "Encrypt" button is pressed
function onEncrypt() {
  if (!validateInputs()) {
    return;
  }

  // Check that password is successfully confirmed
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password")
  const confirmation = confirmPassword.value;
  if (password != confirmation) {
    confirmPassword.setCustomValidity("Passwords do not match");
    confirmPassword.reportValidity();
    return;
  }

  // Initialize values for encryption
  const url = document.querySelector("#url").value;
  // TODO: Finish this

  const output = "foobar";
  document.querySelector("#output").value = output;
  highlight("output");
}


// Activated when the "Copy" button is pressed
function onCopy(id) {
  // Select and copy
  const output = highlight(id);
  document.execCommand("copy");

  // Alert the user that the text was successfully copied
  const alertArea = document.querySelector(".alert");
  alertArea.innerText = `Copied ${output.value.length} characters`;
  alertArea.style.opacity = "1";
  setTimeout(() => { alertArea.style.opacity = 0; }, 3000);

  // Deselect
  output.selectionEnd = output.selectionStart;
  output.blur();
}
