/**
 * Created by Jacob Strieb
 * December 2020
 */



/*******************************************************************************
 * Helper Functions
 ******************************************************************************/

/***
 * Display a message in the "alert" area
 */
function error(text) {
  const alertText = document.querySelector(".alert");
  alertText.innerHTML = text;
  alertText.style.opacity = 1;
}



/*******************************************************************************
 * Main UI Functions
 ******************************************************************************/

/***
 * Create a hidden bookmark when the form is filled out.
 */
async function onHide() {
  // Fail if the b64 library or API was not loaded
  if (!("b64" in window && "apiVersions" in window)) {
    error("Important libraries not loaded!");
    return;
  }

  // Try to get page data from the input hidden URL if possible
  let urlText = document.querySelector("#encrypted-url").value;
  let hiddenUrl;
  try {
    hiddenUrl = new URL(urlText);
  } catch {
    error("Hidden URL is not valid. Make sure it includes \"https://\" too!");
    return;
  }

  // Try to get page data from the input bookmark URL if possible
  urlText = document.querySelector("#bookmark-url").value;
  let bookmarkUrl;
  try {
    bookmarkUrl = new URL(urlText);
  } catch {
    error("Bookmark URL is not valid. Make sure it includes \"https://\" too!");
    return;
  }

  // Ensure that the Link Lock URL is valid
  let hash = hiddenUrl.hash.slice(1);
  try {
    let _ = JSON.parse(b64.decode(hash));
  } catch {
    error("The hidden URL appears corrupted. It must be a password-protected Link Lock URL. <a href=\"https://jstrieb.github.io/link-lock\">Click here to add a password.</a>");
    return;

    // Uncomment this to allow hiding arbitrary pages. Not secure though, so I
    // disabled it.
    /*
    let hashData = {
      unencrypted: true,
      url: hiddenUrl.toString(),
    };

    hiddenUrl.hash = b64.encode(JSON.stringify(hashData));
    document.querySelector("#encrypted-url").value = hiddenUrl.toString();
    */
  }

  let output = document.querySelector("#output");

  // Set the output href to be the hidden URL with the old URL hash
  bookmarkUrl.hash = hiddenUrl.hash;
  output.setAttribute("href", bookmarkUrl.toString());

  // Enable clicking and dragging the output bookmark
  output.setAttribute("aria-disabled", "false");

  // Change the output bookmark title to match the user input
  output.innerText = document.querySelector("#bookmark-title").value;

  error("Bookmark created below.");

  // Scroll to the bottom so the user sees where the bookmark was created
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
}


/***
 * Called when the "change location" button is clicked. Adjusts the destination
 * of the decrypt bookmark via regular expressions.
 */
function onChangeDecrypt() {
  let newUrl;
  try {
    const newUrlInput = document.querySelector("#decrypt-bookmark-disguise");
    const _ = new URL(newUrlInput.value);
    newUrl = newUrlInput.value;
  } catch (_) {
    return;
  }

  const decryptBookmark = document.querySelector("#decrypt-bookmark");
  decryptBookmark.href = decryptBookmark.href.replace(/replace\("[^"]*"\)/, `replace("${newUrl}")`);
  console.log(decryptBookmark.href);
}


/***
 * Get a random link from Wikipedia
 */
async function randomLink() {
	let page = await fetch("https://en.wikipedia.org/w/api.php?"
			+ "format=json"
			+ "&action=query"
			+ "&generator=random"
			+ "&grnnamespace=0" /* Only show articles, not users */
			+ "&prop=info"
			+ "&inprop=url" /* Get URLs, they're not there by default */
			+ "&origin=*") /* https://mediawiki.org/wiki/API:Cross-site_requests */
		.then(r => r.json())
		.then(d => {
			let pages = d.query.pages;
			return pages[Object.keys(pages)[0]];
		});

  document.querySelector("#bookmark-url").value = await page.canonicalurl;
  document.querySelector("#bookmark-title").value = await page.title;
}


/***
 * If the page has a hash, autofill it.
 *
 * Run on page load.
 */
function main() {
  if (window.location.hash) {
    document.querySelector("#encrypted-url").value =
      `https://jstrieb.github.io/link-lock/${window.location.hash}`;

    window.location.hash = "";
  }
}
