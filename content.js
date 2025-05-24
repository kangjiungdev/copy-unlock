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

(() => {
  deleteElementIfExist("styleID");
  const style = document.createElement("style");
  setStorageElementID(style, "copy-unlock-style-id", "styleID");
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
  deleteElementIfExist("alert-msg-id", "alertMsg");

  const alertMsg = document.createElement("div");
  setStorageElementID(alertMsg, "alert-msg-id", "alertMsg");
  alertMsg.innerText = "복사 방지 해제됨";

  Object.assign(alertMsg.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#2c3e50",
    color: "#ecf0f1",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "99999",
    animation: "fadeInOut 2s ease forwards",
    pointerEvents: "none",
  });

  document.body.appendChild(alertMsg);

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
    alertMsg.remove();
  }, 2000);
}

/** element, id, keyName을 받아서 element.id를 id-uuid로 설정하고 크롬 스토리지에 keyName 키 값으로 uuid를 저장 */
function setStorageElementID(element, id, keyName) {
  const uuid = generateUUIDv4();
  element.id = `${id}-${uuid}`;
  chrome.storage.local.set({ [keyName]: uuid });
}

/** keyName, id 받아서 'id-{keyName에 저장된 벨류}'라는 id를 가진 element가 있으면 해당 element 삭제 */
function deleteElementIfExist(id, keyName) {
  chrome.storage.local.get(keyName, (result) => {
    const element = document.getElementById(`${id}-${result[keyName]}`);
    if (element) {
      element.remove();
    }
  });
}

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
