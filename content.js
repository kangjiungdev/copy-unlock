showCopyBypassNotice();

document.oncontextmenu = null;
document.onselectstart = null;
document.oncopy = null;
document.oncut = null;
document.onmousedown = null;
document.body.oncontextmenu = null;
document.body.onselectstart = null;
document.body.oncopy = null;
document.body.oncut = null;
document.body.onmousedown = null;

["contextmenu", "selectstart", "copy", "cut", "mousedown", "keydown"].forEach(
  (event) => {
    window.addEventListener(
      event,
      function (e) {
        e.stopImmediatePropagation();
      },
      true
    );
  }
);

document.querySelectorAll("iframe").forEach((iframe) => {
  try {
    const win = iframe.contentWindow;
    if (win) {
      win.document.oncontextmenu = null;
      win.document.onselectstart = null;
      win.document.oncopy = null;
      win.document.oncut = null;

      win.document.querySelectorAll("*").forEach((el) => {
        el.style.userSelect = "text";
        el.style.webkitUserSelect = "text";
        el.style.msUserSelect = "text";
      });

      ["contextmenu", "selectstart", "copy", "cut", "mousedown"].forEach(
        (event) => {
          win.addEventListener(
            event,
            function (e) {
              e.stopImmediatePropagation();
            },
            true
          );
        }
      );
    }
  } catch (e) {}
});

if (!window.__copyUnlockUUID) {
  window.__copyUnlockUUID = generateUUIDv4();
}
(() => {
  const uuid = window.__copyUnlockUUID;
  const uuidID = `copy-unlock-style-id-${uuid}`;
  if (document.getElementById(uuidID)) document.getElementById(uuidID).remove();
  const style = document.createElement("style");
  style.id = uuidID;
  style.innerHTML = `
* {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}`;
  document.head.appendChild(style);
})();

function showCopyBypassNotice() {
  const existing = document.getElementById("copy-bypass-toast");
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement("div");
  toast.id = "copy-bypass-toast";
  toast.innerText = "복사 방지 해제됨";

  Object.assign(toast.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#3C3C3C",
    color: "#ecf0f1",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "99999",
    animation: "fadeInOut 1.5s ease forwards",
    pointerEvents: "none",
  });

  document.body.appendChild(toast);

  if (!document.getElementById("copy-bypass-style")) {
    const animStyle = document.createElement("style");
    animStyle.id = "copy-bypass-style";
    animStyle.textContent = `
      @keyframes fadeInOut {
        0%   { opacity: 0; transform: translateY(-10px); }
        10%  { opacity: 1; transform: translateY(0); }
        90%  { opacity: 1; }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(animStyle);
  }

  setTimeout(() => {
    toast.remove();
  }, 1500);
}

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
