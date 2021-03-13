# Bookmark Knocking: Hidden Bookmarks Without a Browser Extension

Click special bookmarks in the right order to open a hidden link.

- [Try the demo](https://jstrieb.github.io/projects/hidden-bookmarks/#demo)

---

# Introduction

Imagine that you want to propose to your partner, but they sometimes use your
computer. You don't want them to see that you are bookmarking wedding rings.
What do you do?

Alternatively, imagine you live with someone abusive. You decide to get help,
so you look for resources on the Internet. There are helpful links, but you
know if you bookmark them and your abuser goes through your computer, they may
find them. You can't install a hidden bookmark extension either, because they
could just as easily notice that. What do you do? Unfortunately, this is a
[realistic scenario for many
people](https://www.nytimes.com/wirecutter/blog/domestic-abusers-can-control-your-devices-heres-how-to-fight-back/).

Almost a year ago, I created [Link Lock](https://jstrieb.github.io/link-lock)
-- a tool to enable anyone to securely password-protect URLs. But adding a
password to links isn't always enough.

Link Lock relies on strong cryptography for security, but sometimes a layer of
obscurity is a practical necessity. In other words, there are some situations
where a bookmark that asks for a password is too suspicious to be useful, even
if the password protection is secure.

Bookmark knocking is a novel technique to address this problem. It enables
users to hide bookmarks using features already built into every web browser.
There are two versions available:

- [A stable, simplified version integrated directly into Link
  Lock](https://jstrieb.github.io/link-lock/hidden/)
- [An experimental
  version](https://jstrieb.github.io/projects/hidden-bookmarks/#demo), designed
  to test the limits of the idea


# How It Works

Bookmark knocking is similar to [port
knocking](https://en.wikipedia.org/wiki/Port_knocking), for which it was named.
A user who wants access to a hidden link must know to click the right bookmarks
in the right "knock sequence." If they do this, they will be redirected to the
hidden page.

The concept relies on storing encrypted data about the hidden link in the [URL
fragment](https://en.wikipedia.org/wiki/URI_fragment) or "hash." This is the
part of the URL that comes after a `#`, and typically takes a user to some spot
in the middle of the page.

In this case, the hash contains a
[base64](https://en.wikipedia.org/wiki/Base64)-encoded
[JSON](https://en.wikipedia.org/wiki/JSON) object. The object consists of the
[AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)-encrypted
secret URL and the currently-attempted knock sequence. The knock sequence
attempt is stored as a string of characters, and is used as a passphrase to
try decrypting the secret link after each knock.

When one of the special knock sequence bookmarks is clicked, it runs JavaScript
to check if the current URL fragment is base64-encoded JSON with the required
information. If not, it redirects to the user-specified decoy bookmark link. If
so, it adds some static characters to the current passphrase attempt string and
tries to decrypt the hidden link using the newly-modified passphrase. 

If decryption succeeds, it redirects to the now-decrypted, no-longer-hidden
link. On the other hand, if this attempt fails, it redirects to the bookmark
link that it normally would, but with a URL fragment containing updated
information about the latest attempt. Then the user can perform the next knock
in the sequence, and the process repeats.

Since it is perfectly valid to have an arbitrary hash at the end of a typical
URL, the bookmark behaves normally if the knock sequence is incorrect or
incomplete. The only distinguishing feature of the decoy bookmark URLs is the
presence of a long, nonsensical fragment, which wouldn't alarm most people.

## Link Lock Version

The simplified version of bookmark knocking built into Link Lock only supports
two knocks. There is one universal second knock for any valid first knock. Then
the hidden link prompts for a password. This two-knock version provides a
practical level of privacy, without compromising on usability or security.


<!--
In port knocking, a user who attempts connections to closed ports is granted
access if they connect to the correct ports in the correct order. For bookmark
knocking, a user who clicks certain, otherwise-normal bookmarks in the right
order is redirected to a hidden link.
-->



# Who It Is For

Software security claims are only valid relative to a well-defined threat
model. In this case, the software aims to be secure against family and friends,
not agencies.

In other words, links protected with bookmark knocking (as implemented here)
will be difficult to notice for most people, let alone crack. But the
protection *can* be noticed by an astute observer, and *can* be broken by a
determined adversary. (The keyspace is extremely small. Assume any attacker
with all of the bookmarks in the knock sequence and the ability to brute force
AES-GCM-encrypted data will successfully uncover your hidden link. On the other
hand, if you hide a Link Lock URL, the hidden link will be securely
password-protected.)

Despite shortcomings, bookmark knocking is still a useful part of
defense-in-depth. For more serious security, use the version built into [Link
Lock](https://jstrieb.github.io/link-lock/).

**Don't forget to use private browsing or incognito mode when accessing hidden
links, otherwise the secret links are stored in your browser history, and the
protection is worthless!**

Example use cases:

- Hide private links from other users of a shared computer
- Prevent embarrassing bookmarks from being accidentally opened during a
  live-stream, video call, or demonstration
- Access a secret link without typing in a password (if there is concern about
  keyloggers or other [stalkerware](https://en.wikipedia.org/wiki/Stalkerware))
- Create a fun riddle or prank for the owner of a computer you gain access to 
- Discreetly save personal bookmarks to a work computer



# Known Issues

If you have ideas for how to address the following problems, or want to discuss
others, please [open an issue on
GitHub](https://github.com/jstrieb/link-lock/issues/new) or use my [contact
form](https://jstrieb.github.io/about#contact).

- Generated bookmarks are prefixed with `javascript:` and therefore cannot have
  favicons. As such, they're not perfectly identical to a regular bookmark for
  the same site.
- Websites that modify the URL fragment will screw up the bookmark knocking.
  These sites should not be used for steps in the knock sequence. Some examples
  include Gmail and Telegram.
- Only tested with desktop Firefox and Chrome. Not tested with Safari, Edge, or
  on mobile devices.
- Despite spending hours revising the instructions for the [Link Lock hidden
  bookmarks](https://jstrieb.github.io/link-lock/hidden/) page, it is still far
  from perfect. Making this idea easy to use and understand is very difficult.



# For Abuse Victims

This technology is designed to be helpful for anyone who needs more privacy
than they feel they have, but it cannot guarantee anything. You are the expert
in your own situation, and you need to judge if it is appropriate to use this
software. If you are in a dangerous situation, please seek help.

From a [New York Times
Article](https://www.nytimes.com/wirecutter/blog/domestic-abusers-can-control-your-devices-heres-how-to-fight-back/)
on technology and domestic abuse:

> If you are in immediate danger, call 911.
> 
> If your calls are being tracked, call your local services hotline, like 211
> or 311, and ask to be transferred to a local resource center.
> 
> If you or someone you know is in an abusive relationship or has been sexually
> assaulted, call the [National Sexual Assault
> Hotline](https://www.rainn.org/get-help/national-sexual-assault-hotline) at
> 800-656-HOPE or the [National Domestic Violence
> Hotline](https://www.thehotline.org/) at 800-799-SAFE (you can also [chat
> live with an advocate at
> NDVH](https://www.thehotline.org/what-is-live-chat/), or text LOVEIS to
> 22522).
